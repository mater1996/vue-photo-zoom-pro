<template>
  <vue-photo-zoom-pro v-bind="props"></vue-photo-zoom-pro>
</template>

<script>
import VuePhotoZoomPro from '../../../src/vue-photo-zoom-pro.vue'

export default {
  components: {
    vuePhotoZoomPro: VuePhotoZoomPro,
  },
  data() {
    return {
      props: {
        scale: 2,
        width: 168,
        height: -1,
        url: '',
        highUrl: '',
        type: 'square',
        selector: true,
        releaseSelector: false,
        outZoomer: false,
        outZoomerSticky: false,
        disabledEvent: false,
        disabledReactive: false,
        mask: false,
        maskColor: 'rgba(0,0,0,0.4)',
      },
    }
  },
  mounted() {
    var props = this.props
    props.url = this.$withBase('/image.jpg')
    props.highUrl = this.$withBase('/image-high.jpg')
    var gui = (this.gui = new window.dat.GUI())
    gui.add(props, 'scale', 1, 10)
    gui.add(props, 'width', -1, 1000)
    gui.add(props, 'height', -1, 562)
    gui.add(props, 'url')
    gui.add(props, 'highUrl')
    gui.add(props, 'type').options(['circle', 'square'])
    gui.add(props, 'selector')
    gui.add(props, 'releaseSelector').onChange(function (value) {
      if (props.selector) {
        if (typeof props.selector === 'object') {
          props.selector['release'] = value
        } else {
          props.selector = { release: value }
        }
      }
    })
    gui.add(props, 'outZoomer')
    gui.add(props, 'outZoomerSticky').onChange(function (value) {
      if (props.outZoomer) {
        if (typeof props.outZoomer === 'object') {
          props.outZoomer['sticky'] = value
        } else {
          props.outZoomer = { sticky: value }
        }
      }
    })
    gui.add(props, 'disabledEvent')
    gui.add(props, 'disabledReactive')
    gui.add(props, 'mask')
    gui.addColor(props, 'maskColor')
  },
  beforeDestroy() {
    this.gui.destroy()
  },
}
</script>

<style>
.dg.ac {
  top: 58px;
}

.dg.a {
  float: left;
}
</style>
