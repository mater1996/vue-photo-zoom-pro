# Mini map

<ClientOnly>
  <demo-mini-map></demo-mini-map>
</ClientOnly>

```vue
<template>
  <vue-photo-zoom-pro
    ref="vuePhotoZoomPro"
    style="width: 100%"
    :url="$withBase('/image.jpg')"
    :highUrl="$withBase('/image-high.jpg')"
    :width="selectWidth"
    :height="selectHeight"
    :disabledEvent="true"
    @update="handleUpdate"
  >
    <div
      class="mini-map"
      ref="mini-map"
      :style="miniMapStyle"
      @mouseenter="handleMouseEnter"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <img :src="$withBase('/image.jpg')" @load="update" />
    </div>
  </vue-photo-zoom-pro>
</template>

<script>
import VuePhotoZoomPro from '../../../src/vue-photo-zoom-pro.vue'

const getScrollInfo = () => {
  const { documentElement, body } = document
  const scrollTop =
    documentElement.scrollTop || window.pageYOffset || body.scrollTop
  const scrollLeft =
    documentElement.scrollLeft || window.pageXOffset || body.scrollLeft
  return {
    scrollTop,
    scrollLeft,
  }
}

export default {
  components: {
    VuePhotoZoomPro,
  },
  data() {
    return {
      selectWidth: 0,
      selectHeight: 0,
      miniMapScale: 4,
    }
  },
  computed: {
    miniMapStyle() {
      return {
        width: this.selectWidth / this.miniMapScale + 'px',
        height: this.selectHeight / this.miniMapScale + 'px',
      }
    },
  },
  mounted() {
    this.$vuePhotoZoomPro = this.$refs['vuePhotoZoomPro']
  },
  methods: {
    handleUpdate(e) {
      this.selectWidth = e.width
      this.selectHeight = e.height
    },
    handleMouseEnter() {
      this.$vuePhotoZoomPro.mouseEnter()
    },
    handleMouseMove(e) {
      const { left: mapLeft, top: mapTop } =
        this.$refs['mini-map'].getBoundingClientRect()
      const { scrollLeft, scrollTop } = getScrollInfo()
      const { pageX, pageY } = e
      const { miniMapScale } = this
      this.$vuePhotoZoomPro.mouseMove(
        (pageX - mapLeft - scrollLeft) * miniMapScale,
        (pageY - mapTop - scrollTop) * miniMapScale
      )
    },
    handleMouseLeave() {
      this.$vuePhotoZoomPro.mouseLeave()
    },
    update() {
      this.$vuePhotoZoomPro.update()
    },
  },
}
</script>

<style scoped>
.mini-map {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
}
</style>
```

