<template>
  <canvas
    ref="canvas"
    class="canvas-zoomer"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import { loadImg, rotateCanvas } from '../../util/index.js'

export default {
  name: 'CanvasZoomer',
  props: {
    url: {
      type: String,
      default: ''
    },
    rotate: {
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
    step () {
      return parseInt((this.rotate % 360) / 90, 10)
    }
  },
  watch: {
    step (newValue) {
      this.handleRotate(newValue)
    },
    url: {
      handler (url) {
        loadImg(url, (err, img) => {
          if (err) return console.error(err)
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
