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
