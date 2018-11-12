import vuePhotoZoomPro from './components/vue-photo-zoom-pro';

const photoZoomPro = {
  install(Vue, options) {
    Vue.component(vuePhotoZoomPro.name, vuePhotoZoomPro);
  }
};

if (typeof window !== 'undefined' && window.Vue) { 
  window.Vue.use(photoZoomPro) 
}

export default photoZoomPro;
