import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import ElmSearchList from './dist/index';
import './dist/style.css';

import demo from './demo/Index.vue';

Vue.use(ElementUI);
Vue.use(ElmSearchList);
const app = new Vue({
  render: (h) => h(demo)
});

app.$mount('#app');
