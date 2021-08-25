/*
 * @author: Mater
 * @Email: bxh8640@gmail.com
 * @Date: 2021-08-25 16:33:15
 * @Description:
 */

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
