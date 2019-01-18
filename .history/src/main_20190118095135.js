import Vue from 'vue'
import App from './App.vue'

// import vuePhotoZoomPro from '../dist/vue-photo-zoom-pro'

import vuePhotoZoomPro from './index' // development

Vue.use(vuePhotoZoomPro)

new Vue({
  el: '#app',
  render: h => h(App)
})
