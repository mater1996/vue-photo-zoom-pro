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
    return {}
  },
  mounted: function() {
    var canvas = document.createElement('canvas')
    var canvas1 = document.querySelector('#canvas1')
    var canvas2 = document.querySelector('#canvas2')
    var ctx1 = canvas1.getContext('2d')
    var ctx2 = canvas2.getContext('2d')

    function Star(id, x, y) {
      this.id = id
      this.x = x
      this.y = y
      this.r = Math.floor(Math.random() * 2) + 1
      var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2
      this.color = 'rgba(255,255,255,' + alpha + ')'
    }

    Star.prototype.draw = function() {
      ctx.fillStyle = this.color
      ctx.shadowBlur = this.r * 2
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
      ctx.closePath()
      ctx.fill()
    }

    Star.prototype.move = function() {
      this.y -= 0.15 + params.backgroundSpeed / 100
      if (this.y <= -10) this.y = HEIGHT + 10
      this.draw()
    }

    function Dot(id, x, y, r) {
      this.id = id
      this.x = x
      this.y = y
      this.r = Math.floor(Math.random() * 5) + 1
      this.maxLinks = 2
      this.speed = 0.5
      this.a = 0.5
      this.aReduction = 0.005
      this.color = 'rgba(255,255,255,' + this.a + ')'
      this.linkColor = 'rgba(255,255,255,' + this.a / 4 + ')'

      this.dir = Math.floor(Math.random() * 140) + 200
    }

    Dot.prototype.draw = function() {
      ctx.fillStyle = this.color
      ctx.shadowBlur = this.r * 2
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
      ctx.closePath()
      ctx.fill()
    }

    Dot.prototype.link = function() {
      if (this.id == 0) return
      var previousDot1 = getPreviousDot(this.id, 1)
      var previousDot2 = getPreviousDot(this.id, 2)
      var previousDot3 = getPreviousDot(this.id, 3)
      if (!previousDot1) return
      ctx.strokeStyle = this.linkColor
      ctx.moveTo(previousDot1.x, previousDot1.y)
      ctx.beginPath()
      ctx.lineTo(this.x, this.y)
      if (previousDot2 != false) ctx.lineTo(previousDot2.x, previousDot2.y)
      if (previousDot3 != false) ctx.lineTo(previousDot3.x, previousDot3.y)
      ctx.stroke()
      ctx.closePath()
    }

    function getPreviousDot(id, stepback) {
      if (id == 0 || id - stepback < 0) return false
      if (typeof dots[id - stepback] != 'undefined') return dots[id - stepback]
      else return false //getPreviousDot(id - stepback);
    }

    Dot.prototype.move = function() {
      this.a -= this.aReduction
      if (this.a <= 0) {
        this.die()
        return
      }
      this.color = 'rgba(255,255,255,' + this.a + ')'
      this.linkColor = 'rgba(255,255,255,' + this.a / 4 + ')'
      this.x =
        this.x +
        Math.cos(degToRad(this.dir)) * (this.speed + params.dotsSpeed / 100)
      this.y =
        this.y +
        Math.sin(degToRad(this.dir)) * (this.speed + params.dotsSpeed / 100)

      this.draw()
      this.link()
    }

    Dot.prototype.die = function() {
      dots[this.id] = null
      delete dots[this.id]
    }

    var ctx = canvas.getContext('2d'),
      WIDTH,
      HEIGHT,
      stars = [],
      initStarsPopulation = 80,
      dots = [],
      params = {
        maxDistFromCursor: 50,
        dotsSpeed: 0,
        backgroundSpeed: 0
      }

    setCanvasSize()
    init()

    function setCanvasSize() {
      ;(WIDTH = document.documentElement.clientWidth),
        (HEIGHT = document.documentElement.clientHeight)
      canvas.setAttribute('width', WIDTH)
      canvas.setAttribute('height', HEIGHT)
      canvas1.setAttribute('width', WIDTH)
      canvas1.setAttribute('height', HEIGHT)
      canvas2.setAttribute('width', WIDTH)
      canvas2.setAttribute('height', HEIGHT)
    }

    function init() {
      ctx.strokeStyle = 'white'
      ctx.shadowColor = 'white'
      for (var i = 0; i < initStarsPopulation; i++) {
        stars[i] = new Star(
          i,
          Math.floor(Math.random() * WIDTH),
          Math.floor(Math.random() * HEIGHT)
        )
      }
      ctx.shadowBlur = 0
      animate()
    }

    function animate() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      ctx1.clearRect(0, 0, WIDTH, HEIGHT)
      ctx2.clearRect(0, 0, WIDTH, HEIGHT)

      for (var i in stars) {
        stars[i].move()
      }
      for (var i in dots) {
        dots[i].move()
      }
      ctx1.drawImage(canvas, 0, 0)
      ctx2.drawImage(canvas, 0, 0)
      requestAnimationFrame(animate)
    }

    function degToRad(deg) {
      return deg * (Math.PI / 180)
    }
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
    changeToMultipleWidth: function() {
      this.height = this.height === -1 ? 99 : -1
    }
  }
})
