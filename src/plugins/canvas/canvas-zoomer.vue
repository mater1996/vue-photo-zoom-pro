<template>
  <canvas
    ref="canvas"
    class="canvas-zoomer"
  />
</template>

<script>
import { loadImg, rotateCanvas } from '../../util'

export default {
  name: 'CanvasZoomer',
  props: {
    url: {
      type: String,
      default: ''
    },
    step: {
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
    scale: {
      type: Number,
      default: 2
    }
  },
  watch: {
    step (newValue) {
      this.handleRotate(newValue)
    },
    url: {
      handler (url) {
        loadImg(url).then((img) => {
          this.$img = img
          this.handleRotate(this.step)
        })
      },
      immediate: true
    }
  },
  mounted () {
    this.$canvas = this.$refs.canvas
  },
  methods: {
    handleRotate (step) {
      rotateCanvas(this.$canvas, this.$img, this.width, this.height, step)
    }
  }
}
</script>
