# Full

<ClientOnly>
  <demo-full></demo-full>
</ClientOnly>

```vue
<template>
  <vue-photo-zoom-pro
    url="/image.jpg"
    highUrl="/image-high.jpg"
    :width="selectWidth"
    :height="selectHeight"
    @update="handleUpdate"
  ></vue-photo-zoom-pro>
</template>

<script>
import VuePhotoZoomPro from 'vue-photo-zoom-pro'
export default {
  components: {
    VuePhotoZoomPro,
  },
  data() {
    return {
      selectWidth: 0,
      selectHeight: 0,
    }
  },
  methods: {
    handleUpdate(e) {
      this.selectWidth = e.width
      this.selectHeight = e.height
    },
  },
}
</script>
```
