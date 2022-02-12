<template>
  <vue-photo-zoom-pro
    :url="$withBase('/image.jpg')"
    :highUrl="$withBase('/image-high.jpg')"
    :width="selectWidth"
    :height="selectHeight"
    @update="handleUpdate"
  ></vue-photo-zoom-pro>
</template>

<script>
import VuePhotoZoomPro from '../../../src/vue-photo-zoom-pro.vue'
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

<style scoped>
</style>
