<template>
  <canvas
    ref="canvas"
    class="canvas-area"
  />
</template>

<script>
import { loadImg, rotateCanvas } from '../../util'

export default {
  name: 'CanvasRegion',
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
      rotateCanvas(
        this.$canvas,
        this.$img,
        this.width || this.$img.width,
        this.height || this.$img.height,
        step
      )
    }
  }
}
</script>
