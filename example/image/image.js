new Vue({
  el: '#demo',
  components: {
    vuePhotoZoomPro: VuePhotoZoomPro.default
  },
  data: function() {
    return {
      props: {
        scale: 2,
        width: 168,
        height: -1,
        url: './image.jpg',
        highUrl: './image-high.jpg',
        type: 'square',
        selector: true,
        outZoomer: false,
        disabled: false,
        disabledReactive: false,
        mask: false,
        maskColor: 'rgba(0,0,0,0.4)'
      }
    }
  },
  mounted: function() {
    var props = this.props
    var gui = new window.dat.GUI()
    gui.add(props, 'scale', 1, 10)
    gui.add(props, 'width', -1, 1000)
    gui.add(props, 'height', -1, 562)
    gui.add(props, 'url')
    gui.add(props, 'highUrl')
    gui.add(props, 'type').options(['circle', 'square'])
    gui.add(props, 'selector')
    gui.add(props, 'outZoomer')
    gui.add(props, 'disabled')
    gui.add(props, 'disabledReactive')
    gui.add(props, 'mask')
    gui.addColor(props, 'maskColor')
  }
})
