# Custom

<ClientOnly>
  <demo-custom></demo-custom>
</ClientOnly>

```vue
<template>
  <vue-photo-zoom-pro type="circle" :scale="scale">
    <div class="star-sky">
      <div class="landscape"></div>
      <div class="filter"></div>
      <canvas id="canvas1"></canvas>
    </div>
    <template slot="zoomer">
      <div class="star-sky">
        <div class="landscape"></div>
        <div class="filter"></div>
        <canvas id="canvas2"></canvas>
      </div>
    </template>
  </vue-photo-zoom-pro>
</template>

<script>
import VuePhotoZoomPro from 'vue-photo-zoom-pro'
export default {
  components: {
    VuePhotoZoomPro,
  },
}
</script>
```