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
        :style="zoomedStyle"
      >
        <slot />
      </div>
      <img
        v-else-if="url"
        class="zommer-img"
        :src="url"
        :style="zoomedStyle"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'VuePhotoZoomProZoomer',
  props: {
    url: {
      type: String,
      default: ''
    },
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
    scaleWidth: {
      type: Number,
      default: 0
    },
    scaleHeight: {
      type: Number,
      default: 0
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
        transform: `translate(${-this.left}px, ${-this.top}px)`
      }
    },
    zoomedStyle () {
      return {
        transform: `scale(${this.scale})`,
        width: `${this.scaleWidth}px`,
        height: `${this.scaleHeight}px`,
        transformOrigin: 'left top'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.zoomer {
  overflow: hidden;
  pointer-events: none;
  .zommer-img {
    display: block;
  }
}
</style>
