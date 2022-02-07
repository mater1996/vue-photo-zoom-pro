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
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
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
      const { selector } = this
      return {
        width: `${this.width}px`,
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
      const { selector } = this
      return {
        width: `${this.width - selector.left - selector.width}px`,
        height: `${selector.height}px`
      }
    },
    bottomStyle () {
      const { selector } = this
      return {
        width: `${this.width}px`,
        height: `${this.height - selector.top - selector.height}px`
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

<style scoped>
.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.block {
  width: 30%;
  height: 50px;
  background: inherit;
}

.block.left {
  float: left;
}

.block.right {
  float: right;
}

.block.bottom {
  clear: both;
}
</style>
