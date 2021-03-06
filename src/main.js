import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import toast from 'components/common/toast'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()
// 安装totast插件
Vue.use(toast)

//使用图片的懒加载
Vue.use(VueLazyLoad, {
  loading: require('assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
