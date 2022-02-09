<template>
  <vue-photo-zoom-pro>
    <canvas-preview url="/image.jpg" :width="720" :height="360" :rotate="rotate"></canvas-preview>
    <template slot="zoomer">
      <canvas-zoomer
        url="/image-high.jpg"
        :width="720"
        :height="360"
        :rotate="rotate"
      ></canvas-zoomer>
    </template>
    <div class="rotate-icon" @click="handleRotate">🔄</div>
  </vue-photo-zoom-pro>
</template>

<script>
import VuePhotoZoomPro, {
  CanvasPreview,
  CanvasZoomer,
} from '../../../src/vue-photo-zoom-pro.vue'

export default {
  components: {
    VuePhotoZoomPro,
    CanvasPreview: CanvasPreview,
    CanvasZoomer: CanvasZoomer,
  },
  data: function () {
    return {
      rotate: 0,
    }
  },
  methods: {
    handleRotate() {
      this.rotate += 90
    },
  },
}
</script>

<style scoped>
.rotate-icon {
  display: inline-block;
  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 999;
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 16px;
  cursor: pointer;
}
</style>
