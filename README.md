## 属性

**total**
列表数据总数，用于分页

**formData**
用于 `el-form` 的 `model`，需要使用 `.sync` 的方式，如：`:form-data.sync="formData"`

**tableData**
用于 `el-table` 的 `data`

**formOptions**

- hide
- items
- itemKey
- hideFormButtons
- attrs

**tableOptions**

- attrs
- listeners
- showSelectionColumn
- selectionColumnAttrs
- hideIndexColumn
- indexColumnAttrs
- columns
- columnPropKey

**paginationOptions**

- hide
- attrs
- listeners
- sizeKey
- currentKey

## 事件

**onBeforeSubmit**

**onBeforeReset**

**load**

## 插槽

下列所有插槽，如果在 `template` 中使用则自动生效，不使用则不生效。

### 固定插槽

插槽名固定不变

**functional**

功能区

**table-top**

表格上边

**table-append**

对应 `el-table` 的 `append` 插槽

### 动态插槽

固定格式，但是插槽名根据数据而变

**form-[item[itemKey]]**

自定义查询表单的项

**column-header-[column[columnPropKey]]**

自定义列头，对应 `el-table-column` 的 `header` 插槽

**column-[column[columnPropKey]]**

自定义列，对应 `el-table-column` 的 `default` 插槽

## 示例

```vue
<template>
  <div class="user-manage">
    <elm-search-list class="list" :form-data.sync="formData" :table-data="tableData" :form-options="formOptions" :table-options="tableOptions" :pagination-options="paginationOptions" @load="onLoad">
      <template #form-time="{ item }">
        <el-input v-model="formData.test" placeholder="" size="small" clearable></el-input>
      </template>

      <template #form-slot="{ item }">
        <el-input v-model="formData.slotTest" placeholder="这是一个表单插槽" size="small" clearable></el-input>
      </template>

      <template #functional>
        <el-button type="primary" size="default" icon="el-icon-upload">导入</el-button>
      </template>

      <template #table-top>
        <div style="text-align: right; margin-bottom: 10px; font-size: 12px">
          <el-button type="text" icon="el-icon-delete" size="small">删除</el-button>
          - 又一个插槽
        </div>
      </template>

      <template #column-handle="{ row, column, index }">
        列插槽 - {{ index }}
        <el-button type="text">编辑</el-button>
      </template>

      <template #column-header-handle="{ column, index }">
        <el-button type="text">表头插槽--index: {{ index }}</el-button>
      </template>

      <template #table-append>table append 插槽</template>
    </elm-search-list>
  </div>
</template>

<script>
export default {
  name: 'UserManage',

  data() {
    return {
      formData: {},
      formOptions: {
        attrs: {
          rules: {}
        },
        itemKey: 'name',
        items: [
          {
            id: 1,
            type: 'input',
            name: 'name',
            label: '名称',
            attrs: {
              placeholder: '请输入名称...'
            },
            listeners: {
              change(val) {
                console.log(`🚀 => change => val`, val);
              },
              input(val) {
                console.log(`🚀 => input => val`, val);
              }
            }
          },
          {
            id: 5,
            name: 'slot',
            label: '表单插槽'
          },
          {
            id: 2,
            type: 'select',
            name: 'area',
            label: '地区',
            optionKey: 'id',
            optionList: [
              {
                id: 1,
                label: '常州地区',
                value: 'this'
              },
              {
                id: 2,
                label: '大连地区',
                value: '大连',
                disabled: true
              },
              {
                id: 5,
                label: '惠州地区',
                value: '惠州'
              },
              {
                id: 4,
                label: '昆山地区',
                value: '昆山'
              }
            ],
            attrs: {
              placeholder: '请选择地区',
              multiple: true
            },
            listeners: {
              change(val) {
                console.log(`🚀 => change => val`, val);
              }
            }
          }
        ]
      },
      tableOptions: {
        columnPropKey: 'key',
        showSelectionColumn: true,
        columns: [
          { key: 'name', label: '名称' },
          { key: 'cartNumber', label: '牌照号码' },
          { key: 'year', label: '注册年份' },
          { key: 'person', label: '负责人' },
          { key: 'handle', label: '操作', align: 'center' }
        ],
        attrs: {
          border: true
        },
        listeners: {
          'row-click'(row, column, event) {
            console.log({ row, column, event });
          },
          'selection-change'(selection) {
            console.log(selection);
          }
        }
      },
      paginationOptions: {
        sizeKey: 'row',
        currentKey: 'page',
        attrs: {
          total: 50
        },
        listeners: {
          'size-change'(val) {
            console.log(`🚀 => data => val`, val);
          }
        }
      },
      tableData: [
        { name: '1啊士大夫看见', cartNumber: '23983921lllllllll', year: '2019', person: '老王' },
        { name: '2啊士大夫看见', cartNumber: '23983921lllllllll', year: '2019', person: '老王' },
        { name: '3啊士大夫看见', cartNumber: '23983921lllllllll', year: '2019', person: '老王' },
        { name: '4啊士大夫看见', cartNumber: '23983921lllllllll', year: '2019', person: '老王' },
        { name: '5啊士大夫看见', cartNumber: '23983921lllllllll', year: '2019', person: '老王' },
        { name: '6啊士大夫看见', cartNumber: '23983921lllllllll', year: '2019', person: '老王' },
        { name: '7啊士大夫看见', cartNumber: '23983921lllllllll', year: '2019', person: '老王' },
        { name: '8啊士大夫看见', cartNumber: '23983921lllllllll', year: '2019', person: '老王' },
        { name: '9啊士大夫看见', cartNumber: '23983921lllllllll', year: '2019', person: '老王' },
        { name: '10啊士大夫看见', cartNumber: '23983921lllllllll', year: '2019', person: '老王' }
      ]
    };
  },

  methods: {
    onLoad(done) {
      setTimeout(() => {
        done();
      }, 1000);
    }
  }
};
</script>
```
