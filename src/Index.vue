<template>
  <div class="elm-search-list">
    <el-form v-if="_f && !_f.hide" v-bind="$f.attrs" ref="form" class="elm-search-list__form" :model="$form" :inline="true" :size="getAttr($f.attrs, 'size', 'small')">
      <el-form-item v-for="item in $f.items" :key="item[$itemKey]" :label="item.label">
        <template v-if="$scopedSlots['form-' + item[$itemKey]]">
          <slot v-bind="{ item }" :name="'form-' + item[$itemKey]"></slot>
        </template>

        <template v-else>
          <el-input v-if="item.type === 'input'" v-model="$form[item[$itemKey]]" v-bind="item.attrs" v-on="item.listeners"> </el-input>

          <el-select v-if="item.type === 'select'" v-model="$form[item[$itemKey]]" v-bind="item.attrs" v-on="item.listeners">
            <el-option v-for="option in item.optionList" :key="option[item.optionKey || 'label']" :label="option.label" :value="option.value === 'this' ? option : option.value" :disabled="option.disabled"></el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item v-if="!$f.hideFormButtons">
        <el-button type="primary" :loading="loading" @click="search">查询</el-button>
        <el-button :loading="loading" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <div v-if="$scopedSlots.functional" class="elm-search-list__functional">
      <slot name="functional"></slot>
    </div>

    <div class="elm-search-list__table">
      <slot name="table-top"></slot>

      <el-table v-bind="$t.attrs" v-on="$t.listeners" :data="tableData" v-loading="loading">
        <el-table-column v-if="$t.showSelectionColumn" v-bind="$t.selectionColumnAttrs" type="selection" :align="getAttr($t.selectionColumnAttrs, 'align', 'center')"></el-table-column>

        <el-table-column
          v-if="!$t.hideIndexColumn"
          v-bind="$t.indexColumnAttrs"
          type="index"
          :align="getAttr($t.indexColumnAttrs, 'align', 'center')"
          :width="getAttr($t.indexColumnAttrs, 'width', '70px')"
          :label="getAttr($t.indexColumnAttrs, 'label', '序号')"
          :index="getAttr($t.indexColumnAttrs, 'index', indexColumnMethod)"
        ></el-table-column>

        <el-table-column v-for="col in $t.columns" v-bind="col" :key="col[$columnPropKey]">
          <template v-if="$scopedSlots['column-header-' + col[$columnPropKey]]" #header="scope">
            <slot :name="'column-header-' + col[$columnPropKey]" :column="scope.column" :index="scope.$index"></slot>
          </template>

          <template slot-scope="scope">
            <slot v-if="$scopedSlots['column-' + col[$columnPropKey]]" :name="'column-' + col[$columnPropKey]" :column="scope.column" :row="scope.row" :index="scope.$index"></slot>

            <template v-else>{{ scope.row[col[$columnPropKey]] }}</template>
          </template>
        </el-table-column>

        <template v-if="$scopedSlots['table-append']" #append>
          <slot name="table-append"></slot>
        </template>
      </el-table>
    </div>

    <el-pagination
      v-if="!$p.hide"
      v-bind="$p.attrs"
      v-on="$p.listeners"
      class="elm-search-list__pagination"
      :current-page.sync="$form[$pCurrentKey]"
      :page-size.sync="$form[$pSizeKey]"
      :layout="getAttr($p.attrs, 'layout', 'sizes, prev, pager, next, total')"
      :total="total || 0"
      @current-change="onLoad"
      @size-change="onLoad"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'elm-search-list',
  props: {
    immediate: {
      type: Boolean,
      default: true
    },
    total: Number,
    formData: Object,
    tableData: Array,
    formOptions: Object,
    tableOptions: Object,
    paginationOptions: Object
  },

  data() {
    return {
      loading: false
    };
  },

  computed: {
    $f() {
      return this.formOptions || {};
    },
    $t() {
      return this.tableOptions || {};
    },
    $p() {
      return this.paginationOptions || {};
    },
    $form: {
      get() {
        return this.formData || {};
      },
      set(val) {
        this.$emit('update:formData', val);
      }
    },
    $pCurrentKey() {
      return this.getAttr(this.$p, 'currentKey', 'current');
    },
    $pSizeKey() {
      return this.getAttr(this.$p, 'sizeKey', 'size');
    },
    $columnPropKey() {
      return this.getAttr(this.$t, 'columnPropKey', 'prop');
    },
    $itemKey() {
      return this.getAttr(this.$f, 'itemKey', 'prop');
    }
  },

  created() {
    if (this.immediate) this.onLoad();
  },

  methods: {
    // 查询表单提交
    search() {
      this.$emit('onBeforeSubmit');
      this.$set(this.$form, this.$pCurrentKey, 1);
      this.onLoad();
    },

    // 查询表单重置
    reset() {
      this.$emit('onBeforeReset');
      this.initFromData();
      this.onLoad();
    },

    async onLoad() {
      if (!(await this.formValidate())) return;

      this.loading = true;
      if (!this.$p?.hide) {
        if (!this.$form[this.$pCurrentKey]) {
          this.$set(this.$form, this.$pCurrentKey, 1);
        }
        if (!this.$form[this.$pSizeKey]) {
          this.$set(this.$form, this.$pSizeKey, 10);
        }
      }

      this.$emit('load', () => {
        this.loading = false;
      });
    },

    async formValidate() {
      if (!this.$f.isVerify) return true;

      return new Promise((resolve) => {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },

    initFromData() {
      this.$form = {
        [this.$pCurrentKey]: 1,
        [this.$pSizeKey]: 10
      };
    },

    //表格序号递增
    indexColumnMethod(index) {
      const i = index + 1;
      const current = this.$form[this.$pCurrentKey];
      const size = this.$form[this.$pSizeKey];
      return current && size ? (current - 1) * size + i : i;
    },

    getAttr(opts, key, defaultVal) {
      return opts?.[key] || defaultVal;
    }
  }
};
</script>

<style lang="scss">
.elm-search-list {
  --elm-border-color: #f2f2f2;
  --elm-padding: 20px;
  --elm-bg-color: #fff;

  background: var(--elm-bg-color);
  padding-top: 10px;

  &__form {
    padding: 0 var(--elm-padding) 10px;
    border-bottom: 1px dashed var(--elm-border-color);

    ::v-deep .el-form-item {
      margin-top: 10px !important;
      margin-bottom: 10px !important;
    }
  }

  &__functional {
    padding: 20px var(--elm-padding);
  }

  &__table {
    padding: var(--elm-padding);
    border-top: 5px solid var(--elm-border-color);
  }

  &__pagination {
    padding: var(--elm-padding);
    padding-bottom: calc(var(--elm-padding) * 2);
  }
}
</style>
