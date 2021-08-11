<template>
  <div class="photo-zoom-pro">
    <div
      class="container"
      @mouseenter="!disabled && mouseEnter($event)"
      @mousemove="!disabled && mouseMove($event)"
      @mouseleave="!disabled && mouseLeave($event)"
    >
      <PhotoMask
        v-if="mask"
        v-show="!hideZoomer"
        :mask-color="maskColor"
        :p-width="imgInfo.width"
        :p-height="imgInfo.height"
        v-bind="selectorRect"
      />
      <img
        ref="img"
        class="origin-img"
        @load="imgLoaded($event)"
      >
      <Selector
        v-if="selector"
        v-show="!hideZoomer && imgLoadedFlag"
        v-bind="selectorRect"
        :type="type"
      >
        <Zoomer
          v-if="!outZoomer"
          class="inner-zoomer"
          v-bind="zoomerProps"
          :style="zoomerStyle"
        >
          <slot name="zoomer" />
        </Zoomer>
        <slot name="selector" />
      </Selector>
      <Zoomer
        v-if="outZoomer"
        v-show="!hideOutZoomer"
        class="out-zoomer"
        v-bind="zoomerProps"
        :style="[outZoomerRect, outZoomerStyle]"
      >
        <slot name="outzoomer" />
      </Zoomer>
      <slot />
    </div>
  </div>
</template>
<script>
import PhotoMask from './components/photo-mask.vue'
import Zoomer from './components/zoomer.vue'
import Selector from './components/selector.vue'
import { getBoundingClientRect, getBoundValue, getScrollInfo, loadImg, addResizeListener } from './util'

export default {
  name: 'VuePhotoZoomPro',
  components: {
    PhotoMask,
    Selector,
    Zoomer
  },
  props:
    {
      url: {
        type: String,
        default: ''
      },
      highUrl: {
        type: String,
        default: ''
      },
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
        validator: function (value) {
          return ['circle', 'square'].indexOf(value) !== -1
        }
      },
      zoomerStyle: {
        type: Object,
        default () {
          return {}
        }
      },
      outZoomerStyle: {
        type: Object,
        default () {
          return {}
        }
      },
      scale: {
        type: Number,
        default: 2
      },
      enterEvent: {
        type: [Object, UIEvent],
        default: null
      },
      moveEvent: {
        type: [Object, UIEvent],
        default: null
      },
      leaveEvent: {
        type: [Object, UIEvent],
        default: null
      },
      selector: {
        type: Boolean,
        default: true
      },
      outZoomer: {
        type: Boolean,
        default: false
      },
      disabledReactive: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      mask: {
        type: Boolean,
        default: true
      },
      maskColor: {
        type: String,
        default: ''
      }
    },
  data () {
    return {
      mouse: {
        x: 0,
        y: 0
      },
      hideZoomer: true,
      hideOutZoomer: true,
      imgLoadedFlag: false,
      outZoomerInitTop: 0,
      outZoomerTop: 0,
      imgInfo: {},
      $img: null
    }
  },
  computed: {
    selectorWidth () {
      return this.width
    },
    selectorHeight () {
      return this.height > 0 ? this.height : this.width
    },
    selectorHalfWidth () {
      return this.selectorWidth / 2
    },
    selectorHalfHeight () {
      return this.selectorHeight / 2
    },
    vSelectorHalfWidth () {
      const selectorHalfWidth = this.selectorHalfWidth
      return this.outZoomer ? selectorHalfWidth * this.scale : selectorHalfWidth
    },
    vSelectorHalfHeight () {
      const selectorHalfHeight = this.selectorHalfHeight
      return this.outZoomer ? selectorHalfHeight * this.scale : selectorHalfHeight
    },
    pointBound () {
      const selectorHalfWidth = this.selectorHalfWidth
      const selectorHalfHeight = this.selectorHalfHeight
      const { width, height } = this.imgInfo
      return {
        leftBound: selectorHalfWidth,
        topBound: selectorHalfHeight,
        rightBound: width - selectorHalfWidth,
        bottomBound: height - selectorHalfHeight
      }
    },
    vPointBound () {
      const vSelectorHalfWidth = this.vSelectorHalfWidth
      const vSelectorHalfHeight = this.vSelectorHalfHeight
      const { width, height } = this.imgInfo
      const scale = this.scale
      return {
        leftBound: vSelectorHalfWidth,
        topBound: vSelectorHalfHeight,
        rightBound: width * scale - vSelectorHalfWidth,
        bottomBound: height * scale - vSelectorHalfHeight
      }
    },
    selectorRect () {
      const { left: pointLeft, top: pointTop } = this.point
      const selectorHalfWidth = this.selectorHalfWidth
      const selectorHalfHeight = this.selectorHalfHeight
      return {
        width: this.selectorWidth,
        height: this.selectorHeight,
        left: pointLeft - selectorHalfWidth,
        top: pointTop - selectorHalfHeight
      }
    },
    outZoomerRect () {
      return {
        width: `${this.selectorRect.width * this.scale}px`,
        height: `${this.selectorRect.height * this.scale}px`,
        top: `${this.outZoomerTop}px`
      }
    },
    point () {
      const { mouse } = this
      const { leftBound, topBound, rightBound, bottomBound } = this.pointBound
      return {
        left: getBoundValue(mouse.x, leftBound, rightBound),
        top: getBoundValue(mouse.y, topBound, bottomBound)
      }
    },
    vPoint () {
      const { mouse, scale } = this
      const { leftBound, topBound, rightBound, bottomBound } = this.vPointBound
      return {
        left: getBoundValue(mouse.x * scale, leftBound, rightBound),
        top: getBoundValue(mouse.y * scale, topBound, bottomBound)
      }
    },
    zoomerProps () {
      const { scale, imgInfo, vPoint } = this
      return {
        url: this.highUrl || this.url,
        width: imgInfo.width * scale,
        height: imgInfo.height * scale,
        left: -vPoint.left + this.vSelectorHalfWidth,
        top: -vPoint.top + this.vSelectorHalfHeight
      }
    }
  },
  watch: {
    scale () {
      this.mouseMove(this.pointerInfo)
    },
    enterEvent (v) {
      !this.disabled && this.mouseEnter(v)
    },
    moveEvent (v) {
      !this.disabled && this.mouseMove(v)
    },
    leaveEvent (v) {
      !this.disabled && this.mouseLeave(v)
    },
    url: 'handlerUrlChange'
  },
  created () {
    this.url && this.handlerUrlChange(this.url)
  },
  mounted () {
    this.$img = this.$refs.img
    if (!this.disabledReactive) {
      this.resizer = addResizeListener(this.$img, this.handleImgResize)
    }
  },
  methods: {
    handlerUrlChange (url) {
      this.imgLoadedFlag = false
      loadImg(url).then(this.imgLoaded, console.error)
    },
    imgLoaded () {
      const $img = this.$img
      if (!this.imgLoadedFlag) {
        this.imgLoadedFlag = true
        $img.src = this.url
        setTimeout(() => {
          this.handleImgResize(getBoundingClientRect($img))
          this.$emit('created', $img, this.imgInfo)
        })
      }
    },
    handleImgResize (rect) {
      const { scrollTop, scrollLeft } = getScrollInfo()
      this.imgInfo = {
        ...rect,
        absoluteLeft: rect.left + scrollLeft,
        absoluteTop: rect.top + scrollTop
      }
    },
    mouseEnter (e) {
      if (this.imgLoadedFlag) this.hideZoomer = false
      this.$emit('mouseenter', e)
    },
    mouseMove (e) {
      if (this.hideZoomer) return
      e = e || this.pointerInfo
      if (this.imgLoadedFlag && e) {
        this.pointerInfo = e
        this.resizer && this.resizer.valid()
        const { pageX, pageY } = e
        const { absoluteLeft, absoluteTop } = this.imgInfo
        this.mouse.x = pageX - absoluteLeft
        this.mouse.y = pageY - absoluteTop
        if (this.outZoomer) {
          const scrollTop = pageY - e.clientY
          if (!this.outZoomerInitTop) {
            this.outZoomerInitTop = scrollTop + this.imgInfo.top
          }
          this.hideOutZoomer && (this.hideOutZoomer = false)
          this.outZoomerTop = Math.max(scrollTop - this.outZoomerInitTop, 0)
        }
      }
      this.$emit('mousemove', e)
    },
    mouseLeave (e) {
      this.hideZoomer = true
      if (this.outZoomer) this.hideOutZoomer = true
      this.$emit('mouseleave', e)
    }
  }
}
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
}

.container .origin-img {
  width: 100%;
  height: 100%;
  display: block;
}

.out-zoomer {
  position: absolute;
  right: -8px;
  background-repeat: no-repeat;
  transform: translate(100%, 0);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
</style>
