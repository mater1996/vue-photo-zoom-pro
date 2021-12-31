new Vue({
  el: '#demo',
  components: {
    vuePhotoZoomPro: VuePhotoZoomPro.default,
    canvasPreview: VuePhotoZoomPro['CanvasPreview'],
    canvasZoomer: VuePhotoZoomPro['CanvasZoomer']
  },
  data: function() {
    return {
      rotate: 0
    }
  },
  mounted() {

  },
  methods: {
    handleRotate() {
      this.rotate += 90
    }
  }
})
