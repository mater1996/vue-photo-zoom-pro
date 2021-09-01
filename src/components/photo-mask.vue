<template>
  <div
    class="mask"
    :style="maskStyle"
  >
    <div
      class="block top"
      :style="topStyle"
    />
    <div
      class="block left"
      :style="leftStyle"
    />
    <div
      class="block right"
      :style="rightStyle"
    />
    <div
      class="block bottom"
      :style="bottomStyle"
    />
  </div>
</template>

<script>
export default {
  name: 'VuePhotoZoomProMask',
  props: {
    zoomRegion: {
      type: Object,
      default: () => ({ width: 0, height: 0 })
    },
    selector: {
      type: Object,
      default: () => ({ left: 0, top: 0, width: 0, height: 0 })
    },
    maskColor: {
      type: String,
      default: ''
    }
  },
  computed: {
    topStyle () {
      const { selector, zoomRegion } = this
      return {
        width: `${zoomRegion.width}px`,
        height: `${selector.top}px`
      }
    },
    leftStyle () {
      const { selector } = this
      return {
        width: `${selector.left}px`,
        height: `${selector.height}px`
      }
    },
    rightStyle () {
      const { selector, zoomRegion } = this
      return {
        width: `${zoomRegion.width - selector.left - selector.width}px`,
        height: `${selector.height}px`
      }
    },
    bottomStyle () {
      const { selector, zoomRegion } = this
      return {
        width: `${zoomRegion.width}px`,
        height: `${zoomRegion.height - selector.top - selector.height}px`
      }
    },
    maskStyle () {
      return {
        backgroundColor: this.maskColor
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 0;
  background-color: rgba(0,0,0,0.4);
  z-index: 1;
}

.block {
  width: 30%;
  height: 50px;
  background: inherit;
  &.left {
    float: left;
  }
  &.right {
    float: right;
  }
  &.bottom {
    clear: both;
  }
}
</style>
