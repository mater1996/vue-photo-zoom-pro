new Vue({
  el: '#demo',
  components: {
    vuePhotoZoomPro: VuePhotoZoomPro.default
  },
  data: function() {
    return {
      scale: 2,
      step: 0
    }
  },
  mounted() {
    var canvas1 = (this.canvas1 = document.querySelector('#canvas1'))
    var canvas2 = (this.canvas2 = document.querySelector('#canvas2'))
    this.ctx1 = canvas1.getContext('2d')
    this.ctx2 = canvas2.getContext('2d')

    this.loadImage('./image.jpg', function(image1) {
      this.loadImage('./image-high.jpg', function(image2) {
        this.image1 = image1
        this.image2 = image2
        var width = (this.width = image1.width / 2)
        var height = (this.height = image1.height / 2)
        canvas1.width = width
        canvas1.height = height
        canvas2.width = width * 4
        canvas2.height = height * 4
        this.ctx2.scale(4, 4)
        canvas1.style.width = this.width + 'px'
        canvas1.style.height = this.height + 'px'
        canvas2.style.width = this.width + 'px'
        canvas2.style.height = this.height + 'px'
        this.ctx1.drawImage(image1, 0, 0, this.width, this.height)
        this.ctx2.drawImage(image2, 0, 0, this.width, this.height)
      })
    })
  },
  methods: {
    rotate() {
      this.step = this.step + 1 > 3 ? 0 : this.step + 1
      this.doRotate(
        this.canvas1,
        this.ctx1,
        this.image1,
        this.width,
        this.height,
        this.step
      )
      this.doRotate(
        this.canvas2,
        this.ctx2,
        this.image2,
        this.width * 4,
        this.height * 4,
        this.step
      )
    },
    doRotate(canvas, ctx, img, width, height, step) {
      var degree = (step * 90 * Math.PI) / 180
      switch (step) {
        case 0:
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          canvas.style.width = this.width + 'px'
          canvas.style.height = this.height + 'px'
          break
        case 1:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, 0, -height, width, height)
          canvas.style.width = this.height + 'px'
          canvas.style.height = this.width + 'px'
          break
        case 2:
          canvas.width = width
          canvas.height = height
          ctx.rotate(degree)
          ctx.drawImage(img, 0, 0, -width, -height)
          canvas.style.width = this.width + 'px'
          canvas.style.height = this.height + 'px'
          break
        case 3:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, -width, 0, width, height)
          canvas.style.width = this.height + 'px'
          canvas.style.height = this.width + 'px'
          break
      }
    },
    loadImage(src, callback) {
      const that = this
      const image = document.createElement('img')
      image.addEventListener('load', function() {
        callback.call(that, image)
      })
      image.src = src
    }
  }
})
