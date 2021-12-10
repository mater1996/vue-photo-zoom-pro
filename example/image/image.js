/*
 * @author: Mater
 * @Email: bxh8640@gmail.com
 * @Date: 2021-08-25 16:04:13
 * @Description:
 */

console.log(VuePhotoZoomProPluginCanvas)
new Vue({
  el: '#demo',
  data: function() {
    return {
      step: 0,
      scale: 2
    }
  },
  components: {
    vuePhotoZoomPro: VuePhotoZoomPro,
    canvasPreview: VuePhotoZoomProPluginCanvas.CanvasPreview,
    canvasZoomer: VuePhotoZoomProPluginCanvas.CanvasZoomer
  },
  methods: {
    handleRotate: function() {
      this.step = this.step + 1 > 3 ? 0 : this.step + 1
    }
  },
})
