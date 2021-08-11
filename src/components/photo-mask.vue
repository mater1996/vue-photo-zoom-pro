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
    pWidth: {
      type: Number,
      default: 0
    },
    pHeight: {
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
    },
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    },
    maskColor: {
      type: String,
      default: ''
    }
  },
  computed: {
    topStyle () {
      return {
        width: `${this.pWidth}px`,
        height: `${this.top}px`
      }
    },
    leftStyle () {
      return {
        width: `${this.left}px`,
        height: `${this.height}px`
      }
    },
    rightStyle () {
      return {
        width: `${this.pWidth - this.left - this.width}px`,
        height: `${this.height}px`
      }
    },
    bottomStyle () {
      return {
        width: `${this.pWidth}px`,
        height: `${this.pHeight - this.top - this.height}px`
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
