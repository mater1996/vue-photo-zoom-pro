<template>
  <div class="mask" :style="maskStyle">
    <div class="block top" :style="topStyle"></div>
    <div class="block left" :style="leftStyle"></div>
    <div class="block right" :style="rightStyle"></div>
    <div class="block bottom" :style="bottomStyle"></div>
  </div>
</template>

<script>
export default {
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
      default: 'rgba(255,255,255,0.6)'
    }
  },
  computed: {
    topStyle() {
      return {
        width: this.pWidth + 'px',
        height: this.top + 'px'
      }
    },
    leftStyle() {
      return {
        width: this.left + 'px',
        height: this.height + 'px'
      }
    },
    rightStyle() {
      return {
        width: this.pWidth - this.left - this.width + 'px',
        height: this.height + 'px'
      }
    },
    bottomStyle() {
      return {
        width: this.pWidth + 'px',
        height: this.pHeight - this.top - this.height + 'px'
      }
    },
    maskStyle(){
      return {
        color: this.maskColor
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
}

.block {
  width: 30%;
  height: 50px;
  background: currentColor;
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
