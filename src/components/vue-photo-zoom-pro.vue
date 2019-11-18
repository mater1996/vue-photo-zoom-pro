<template>
  <div class="pic-img">
    <div
      class="img-container"
      @mousemove="!moveEvent && mouseMove($event)"
      @mouseleave="!leaveEvent && mouseLeave($event)"
    >
      <img
        class="origin-img"
        ref="img"
        @load="imgLoaded($event)"
        :src="imgLoadedFlag && url"
      />
      <div
        v-show="!hideZoom && imgLoadedFlag && !hideSelector"
        :class="['img-selector', { circle: type === 'circle' }]"
        :style="[
          zoomStyle,
          imgZoomSize,
          imgZoomPosition,
          !outZoom && imgBg,
          !outZoom && imgBgSize,
          !outZoom && imgBgPosition
        ]"
      >
        <slot name="header"></slot>
      </div>
      <div
        v-if="outZoom"
        v-show="!hideOutZoom"
        :class="['img-out-show', { 'base-line': baseline }]"
        :style="[
          outZoomStyle,
          imgOutZoomSize,
          imgOutZoomPosition,
          imgBg,
          imgBgSize,
          imgBgPosition
        ]"
      >
        <div v-if="pointer" class="img-selector-point"></div>
        <slot name="outzoom"></slot>
      </div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'vue-photo-zoom-pro',
  props: {
    url: String,
    highUrl: String,
    width: {
      type: Number,
      default: 168
    },
    height: {
      type: Number,
      default: -1
    },
    type: {
      type: String,
      default: 'square',
      validator: function(value) {
        return ['circle', 'square'].indexOf(value) !== -1
      }
    },
    zoomStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    outZoomStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    scale: {
      type: Number,
      default: 2
    },
    moveEvent: {
      type: [Object, MouseEvent, TouchEvent, Touch],
      default: null
    },
    leaveEvent: {
      type: [Object, MouseEvent, TouchEvent, Touch],
      default: null
    },
    hideZoom: {
      type: Boolean,
      default: false
    },
    outZoom: {
      type: Boolean,
      default: false
    },
    pointer: {
      type: Boolean,
      default: false
    },
    baseline: {
      type: Boolean,
      default: false
    },
    disabledReactive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selector: {
        top: 0,
        left: 0,
        leftBound: 0,
        topBound: 0,
        rightBound: 0,
        bottomBound: 0,
        absoluteLeft: 0,
        absoluteTop: 0
      },
      selectorBg: {
        top: 0,
        left: 0,
        leftBound: 0,
        topBound: 0,
        rightBound: 0,
        bottomBound: 0
      },
      imgInfo: {},
      $img: null,
      outShowInitTop: 0,
      outShowTop: 0,
      hideOutZoom: true,
      hideSelector: true,
      imgLoadedFlag: false
    }
  },
  watch: {
    scale() {
      this.mouseMove()
    },
    moveEvent(e) {
      this.mouseMove(e)
    },
    leaveEvent(e) {
      this.mouseLeave(e)
    },
    url() {
      this.handlerUrlChange()
    },
    width(n) {
      this.initSelectorProperty()
    },
    height(n) {
      this.initSelectorProperty()
    },
    selectorMouseOffsetWidth(n) {
      this.initSelectorBgBound()
    },
    selectorMouseOffsetHeight(n) {
      this.initSelectorBgBound()
    }
  },
  computed: {
    selectorHeight() {
      return this.height > 0 ? this.height : this.width
    },
    selectorHalfWidth() {
      return this.width / 2
    },
    selectorHalfHeight() {
      return this.selectorHeight / 2
    },
    bgOffsetWidth() {
      return !this.outZoom ? this.selectorHalfWidth * (1 - this.scale) : 0
    },
    bgOffsetHeight() {
      return !this.outZoom ? this.selectorHalfHeight * (1 - this.scale) : 0
    },
    selectorMouseOffsetWidth() {
      return this.bgOffsetWidth * -(1 / this.scale) // 内部放大会有内部的偏移 所以需要在背景边界上增加偏移量
    },
    selectorMouseOffsetHeight() {
      return this.bgOffsetHeight * -(1 / this.scale)
    },
    imgZoomPosition() {
      const { top, left } = this.selector
      return {
        top: `${top}px`,
        left: `${left}px`
      }
    },
    imgZoomSize() {
      const { width, selectorHeight: height } = this
      return {
        width: `${width}px`,
        height: `${height}px`
      }
    },
    imgOutZoomSize() {
      const { scale, width, selectorHeight: height } = this
      return {
        width: `${width * scale}px`,
        height: `${height * scale}px`
      }
    },
    imgOutZoomPosition() {
      return {
        top: `${this.outShowTop}px`
      }
    },
    imgBg() {
      return {
        backgroundImage: `url(${this.highUrl || this.url})`
      }
    },
    imgBgSize() {
      const {
        scale,
        imgInfo: { height, width }
      } = this
      return {
        backgroundSize: `${width * scale}px ${height * scale}px`
      }
    },
    imgBgPosition() {
      const { left, top } = this.selectorBg
      return {
        backgroundPosition: `${left}px ${top}px`
      }
    }
  },
  created() {
    this.url && this.handlerUrlChange()
  },
  mounted() {
    this.$img = this.$refs['img']
  },
  methods: {
    /**
     * 图片url改变
     */
    handlerUrlChange() {
      this.imgLoadedFlag = false
      this.loadImg(this.url).then(this.imgLoaded, console.error)
    },
    /**
     * 加载图片
     * @param {String} 图片地址
     * @return {Promise}
     */
    loadImg(url) {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.addEventListener('load', resolve)
        img.addEventListener('error', reject)
        img.src = url
      })
    },
    /**
     * 图片记载完毕事件
     */
    imgLoaded() {
      const imgInfo = this.$img.getBoundingClientRect()
      if (JSON.stringify(this.imgInfo) != JSON.stringify(imgInfo)) {
        this.imgInfo = imgInfo
        this.initSelectorProperty()
        this.resetOutZoomPosition()
      }
      if (!this.imgLoadedFlag) {
        this.imgLoadedFlag = true
        this.$emit('created', this.$img, imgInfo)
      }
    },
    /**
     * 鼠标移动事件
     */
    mouseMove(e) {
      e = e || this.pointerInfo
      if (!this.hideZoom && this.imgLoadedFlag && e) {
        !this.disabledReactive && this.imgLoaded()
        const { pageX, pageY, clientY } = e
        const {
          scale,
          selector,
          selectorBg,
          outZoom,
          bgOffsetWidth,
          bgOffsetHeight,
          outShowAutoScroll
        } = this
        const scrollTop = pageY - clientY
        const {
          absoluteLeft,
          absoluteTop,
          leftBound,
          topBound,
          rightBound,
          bottomBound
        } = selector
        const {
          leftBound: bgLeftBound,
          topBound: bgTopBound,
          rightBound: bgRightBound,
          bottomBound: bgBottomBound
        } = selectorBg
        const x = pageX - absoluteLeft // 相对于左上角选择器中心的偏移位置
        const y = pageY - absoluteTop
        let outShowInitTop = this.outShowInitTop
        if (outZoom) {
          if (!outShowInitTop) {
            outShowInitTop = this.outShowInitTop = scrollTop + this.imgInfo.top
          }
          this.hideOutZoom && (this.hideOutZoom = false)
          this.outShowTop =
            scrollTop > outShowInitTop ? scrollTop - outShowInitTop : 0
        }
        this.pointerInfo = e
        this.hideSelector && (this.hideSelector = false)
        selector.left = x > leftBound ? Math.min(x, rightBound) : leftBound
        selector.top = y > topBound ? Math.min(y, bottomBound) : topBound
        const bgX = x > bgLeftBound ? Math.min(x, bgRightBound) : bgLeftBound
        const bgY = y > bgTopBound ? Math.min(y, bgBottomBound) : bgTopBound
        selectorBg.left = -bgX * scale + bgOffsetWidth
        selectorBg.top = -bgY * scale + bgOffsetHeight
      }
      this.$emit('mousemove', e)
    },
    /**
     * 初始化选择器的属性
     */
    initSelectorProperty() {
      const selector = this.selector
      const selectorWidth = this.width
      const selectorHeight = this.selectorHeight
      const selectorHalfWidth = this.selectorHalfWidth
      const selectorHalfHeight = this.selectorHalfHeight
      const { width, height, left, top } = this.imgInfo
      const scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop
      const scrollLeft =
        document.documentElement.scrollLeft ||
        window.pageXOffset ||
        document.body.scrollLeft
      selector.topBound = selector.leftBound = 0 //相对于图片左上角选择器中心的鼠标边界位置
      selector.rightBound = width - selectorWidth
      selector.bottomBound = height - selectorHeight
      selector.absoluteLeft = left + selectorHalfWidth + scrollLeft //相对于图片左上角选择器中心的绝对位置
      selector.absoluteTop = top + selectorHalfHeight + scrollTop
      this.initSelectorBgBound()
    },
    /**
     * 初始化选择器背景属性
     */
    initSelectorBgBound() {
      const selectorMouseOffsetWidth = this.selectorMouseOffsetWidth
      const selectorMouseOffsetHeight = this.selectorMouseOffsetHeight
      const selectorBg = this.selectorBg
      const selector = this.selector
      selectorBg.leftBound = -selectorMouseOffsetWidth //相对于图片左上角选择器中心的背景鼠标边界位置
      selectorBg.topBound = -selectorMouseOffsetHeight
      selectorBg.rightBound = selector.rightBound + selectorMouseOffsetWidth
      selectorBg.bottomBound = selector.bottomBound + selectorMouseOffsetHeight
    },
    /**
     * 鼠标移出事件
     */
    mouseLeave(e) {
      this.hideSelector = true
      if (this.outZoom) {
        this.hideOutZoom = true
      }
      this.$emit('mouseleave', e)
    },
    /**
     * 重置
     */
    reset() {
      Object.assign(this.selector, {
        top: 0,
        left: 0
      })
      Object.assign(this.selectorBg, {
        left: 0,
        top: 0
      })
      this.resetOutZoomPosition()
    },
    /**
     * 重置外部放大区域属性
     */
    resetOutZoomPosition() {
      this.outShowInitTop = 0
    }
  }
}
</script>

<style scoped>
.img-container {
  position: relative;
}

.img-container .origin-img {
  width: 100%;
  display: block;
}

.img-selector {
  position: absolute;
  cursor: crosshair;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
}

.img-selector.circle {
  border-radius: 50%;
}

.img-out-show {
  position: absolute;
  right: -8px;
  background-repeat: no-repeat;
  transform: translate(100%, 0);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.img-selector-point {
  position: absolute;
  width: 4px;
  height: 4px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: black;
}

.img-out-show.base-line::after,
.img-out-show.base-line::before {
  position: absolute;
  box-sizing: border-box;
  content: '';
  border: 1px dashed rgba(0, 0, 0, 0.36);
}

.img-out-show.base-line::after {
  width: 1px;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.img-out-show.base-line::before {
  height: 1px;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
