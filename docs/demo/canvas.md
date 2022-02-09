# Canvas

```vue
<template>
  <vue-photo-zoom-pro>
    <canvas-preview
      url="/image.jpg"
      :width="720"
      :height="360"
      :rotate="rotate"
    ></canvas-preview>
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
} from 'vue-photo-zoom-pro'

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
```

<ClientOnly>
  <demo-canvas></demo-canvas>
</ClientOnly>
