import Vue from "vue";
import App from "./App.vue";

import vuePhotoZoomPro from "./index";

Vue.use(vuePhotoZoomPro);

new Vue({
  el: "#app",
  render: h => h(App)
});
