/*
 * @author: Mater
 * @Email: bxh8640@gmail.com
 * @Date: 2021-08-10 10:17:35
 * @Description:
 */
var app = new Vue({
  el: '#demo',
  components: {
    vuePhotoZoomPro: VuePhotoZoomPro
  },
  data: function() {
    return {
      url: '',
      index: 0,
      scale: 2,
      type: 'square',
      showType: false,
      changeImgPosition: false,
      width: 168,
      taobao: false,
      filter: false,
      height: -1,
      imgList: [
        'https://bpic.588ku.com/illus_water_img/18/07/30/f3c7060bc28216271dc8c4630b288331.jpg!/watermark/url/L3dhdGVyL3dhdGVyX2JhY2tfNDAwXzIwMC5wbmc=/repeat/true',
        'https://bpic.588ku.com/illus_water_img/18/08/21/64d2b3b02352b00dd668b705fd8af276.jpg!/watermark/url/L3dhdGVyL3dhdGVyX2JhY2tfNDAwXzIwMC5wbmc=/repeat/true',
        'https://bpic.588ku.com/illus_water_img/18/08/18/472f21d353b64c95b9994be6ed3b7274.jpg!/watermark/url/L3dhdGVyL3dhdGVyX2JhY2tfNDAwXzIwMC5wbmc=/repeat/true'
      ]
    }
  },
  created: function() {
    this.url = this.imgList[this.index]
  },
  mounted() {
    var that = this
    // document.querySelector('.photo-zoom-pro').addEventListener(
    //   'wheel',
    //   function(e) {
    //     e.preventDefault()
    //     e = e || window.event
    //     that.scale += e.deltaY > 0 ? 0.1 : -0.1
    //   },
    //   {
    //     passive: false
    //   }
    // )
  },
  methods: {
    addSelectorWidth: function() {
      this.width += 20
    },
    subSelectorWidth: function() {
      this.width -= 20
    },
    addScale: function() {
      this.scale += 0.5
    },
    subScale: function() {
      this.scale -= 0.5
    },
    changeType: function() {
      this.type = this.type === 'circle' ? 'square' : 'circle'
    },
    changeImg: function() {
      this.index = this.index > this.imgList.length - 2 ? -1 : this.index
      this.url = this.imgList[++this.index]
    },
    changeShowType: function() {
      this.showType = !this.showType
    },
    changeToTaobao: function() {
      this.taobao = !this.taobao
      this.showType = true
    },
    changeToMultipleWidth: function() {
      this.height = this.height === -1 ? 99 : -1
    }
  }
})
