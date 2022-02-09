<template>
  <vue-photo-zoom-pro type="circle" :high-url="url">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img class="image" src="/swiper-image-1.jpg" />
        </div>
        <div class="swiper-slide">
          <img class="image" src="/swiper-image-2.jpg" />
        </div>
        <div class="swiper-slide">
          <img class="image" src="/swiper-image-3.jpg" />
        </div>
      </div>
    </div>
  </vue-photo-zoom-pro>
</template>

<script>
import VuePhotoZoomPro from '../../../src/vue-photo-zoom-pro.vue'

const images = [
  '/swiper-image-1.jpg',
  '/swiper-image-2.jpg',
  '/swiper-image-3.jpg',
]

export default {
  components: {
    vuePhotoZoomPro: VuePhotoZoomPro,
  },
  data() {
    return {
      url: images[0],
    }
  },
  mounted() {
    var that = this
    var swiper = new window.Swiper('.swiper-container', {
      autoplay: true,
      on: {
        slideChangeTransitionEnd: function () {
          that.url = images[swiper.activeIndex]
        },
      },
    })
  },
}
</script>

<style scoped>
.vue-photo-zoom-pro {
  width: 100%;
}

.vue-photo-zoom-pro >>> .selector {
  z-index: 2 !important;
}
</style>
