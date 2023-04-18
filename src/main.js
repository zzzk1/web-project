import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from "@/router";
import './assets/gloable.css'

Vue.config.productionTip = false
Vue.use(ElementUI, { size: "mini" });

import store from './store/store'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
