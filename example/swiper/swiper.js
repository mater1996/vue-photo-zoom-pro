const images = [
  'swiper-image-1.jpg',
  'swiper-image-2.jpg',
  'swiper-image-3.jpg'
]

new Vue({
  el: '#demo',
  components: {
    vuePhotoZoomPro: VuePhotoZoomPro
  },
  data: function() {
    return {
      scale: 2,
      url: images[0]
    }
  },
  mounted: function() {
    var that = this
    var swiper = new Swiper('.swiper-container', {
      autoplay: true,
      on: {
        slideChangeTransitionEnd: function() {
          that.url = images[swiper.activeIndex]
        }
      }
    })
  }
})
