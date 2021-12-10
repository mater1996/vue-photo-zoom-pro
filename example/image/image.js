new Vue({
  el: '#demo',
  data: function() {
    return {
      scale: 2,
      rotate: 0
    }
  },
  components: {
    vuePhotoZoomPro: VuePhotoZoomPro,
    canvasPreview: VuePhotoZoomProPluginCanvas.CanvasPreview,
    canvasZoomer: VuePhotoZoomProPluginCanvas.CanvasZoomer
  },
  methods: {
    handleRotate: function() {
      this.rotate += 90
    }
  },
})
