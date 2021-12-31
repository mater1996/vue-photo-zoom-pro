<!--
 * @author: Mater
 * @Email: bxh8640@gmail.com
 * @Date: 2021-08-10 10:23:09
 * @Description:
-->
<template>
  <div
    class="zoomer"
    :style="zoomerStyle"
  >
    <div
      class="position"
      :style="positionStyle"
    >
      <div
        v-if="$slots.default"
        class="custom-zoomer"
        :style="zoomedStyle"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VuePhotoZoomProZoomer',
  props: {
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    },
    scale: {
      type: Number,
      default: 2
    },
    zoomRegion: {
      type: Object,
      default: () => ({ width: 0, height: 0 })
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    }
  },
  computed: {
    zoomerStyle () {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    },
    positionStyle () {
      return {
        transform: `translate3d(${-this.left}px, ${-this.top}px, 0)`
      }
    },
    zoomedStyle () {
      const { zoomRegion } = this
      return {
        transform: `scale(${this.scale}) translateZ(0)`,
        width: `${zoomRegion.width}px`,
        height: `${zoomRegion.height}px`
      }
    }
  }
}
</script>

<style scoped>
.zoomer {
  overflow: hidden;
}

.zoomer .custom-zoomer {
  transform-origin: left top;
}
</style>
