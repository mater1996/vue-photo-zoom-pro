<template>
  <div class="vue-photo-zoom-pro">
    <div
      ref="zoomRegion"
      class="zoom-region"
      @mouseenter="!disabled && !enterEvent && handleMouseEnter($event)"
      @mousemove="!disabled && !moveEvent && handleMouseMove($event)"
      @mouseleave="!disabled && !leaveEvent && handleMouseLeave($event)"
    >
      <PhotoMask
        v-if="mask"
        v-show="mouseEnter"
        :mask-color="maskColor"
        :selector="selectorProps"
        :zoom-region="zoomRegionRect"
      />
      <Selector
        v-if="selector"
        v-show="mouseEnter"
        v-bind="selectorProps"
        :type="type"
      >
        <Zoomer
          v-if="!outZoomer"
          class="inner-zoomer"
          v-bind="zoomerProps"
        >
          <ImgZoomer
            v-if="highUrl || url"
            :url="highUrl || url"
          />
          <slot name="zoomer" />
        </Zoomer>
        <slot name="selector" />
      </Selector>
      <Zoomer
        v-if="outZoomer"
        v-show="mouseEnter"
        class="out-zoomer"
        v-bind="zoomerProps"
        :style="outZoomerPosition"
      >
        <ImgZoomer
          v-if="highUrl || url"
          :url="highUrl || url"
        />
        <slot name="zoomer" />
      </Zoomer>
      <ImgPreview
        v-if="url"
        :url="url"
      />
      <slot />
    </div>
  </div>
</template>
<script>
import PhotoMask from './components/photo-mask.vue'
import Zoomer from './components/zoomer.vue'
import Selector from './components/selector.vue'
import { ImgPreview, ImgZoomer } from './plugins/img/index.js'
import { CanvasPreview, CanvasZoomer } from './plugins/canvas/index.js'
import {
  getBoundingClientRect,
  getBoundValue,
  getScrollInfo,
  generateBound
} from './util/index.js'

export { ImgPreview, ImgZoomer }

export { CanvasPreview, CanvasZoomer }

export default {
  name: 'VuePhotoZoomPro',
  components: {
    PhotoMask,
    Selector,
    Zoomer,
    ImgPreview,
    ImgZoomer
  },
  props: {
    width: {
      type: Number,
      default: 168
    },
    height: {
      type: Number,
      default: -1
    },
    url: {
      type: String,
      default: ''
    },
    highUrl: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'square',
      validator: function (value) {
        return ['circle', 'square'].indexOf(value) !== -1
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
      type: [Boolean, Object],
      default: true
    },
    outZoomer: {
      type: [Boolean, Object],
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
      default: false
    },
    maskColor: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      mouseEnter: false,
      outZoomerTop: 0,
      mouse: {
        x: 0,
        y: 0
      },
      zoomRegionRect: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }
    }
  },
  computed: {
    selectorOptions () {
      return typeof this.selector === 'object'
        ? this.selector
        : { release: false }
    },
    outZoomerOptions () {
      return typeof this.outZoomer === 'object'
        ? this.outZoomer
        : { sticky: false }
    },
    selectorWidth () {
      return this.width
    },
    selectorHeight () {
      return this.height > -1 ? this.height : this.width
    },
    selectorHalfWidth () {
      return this.selectorWidth / 2
    },
    selectorHalfHeight () {
      return this.selectorHeight / 2
    },
    zoomerWidth () {
      return this.outZoomer
        ? this.selectorWidth * this.scale
        : this.selectorWidth
    },
    zoomerHeight () {
      return this.outZoomer
        ? this.selectorHeight * this.scale
        : this.selectorHeight
    },
    zoomerHalfWidth () {
      return this.zoomerWidth / 2
    },
    zoomerHalfHeight () {
      return this.zoomerHeight / 2
    },
    zoomRegionAbsolute () {
      const { zoomRegionRect } = this
      const { scrollTop, scrollLeft } = getScrollInfo()
      return {
        left: zoomRegionRect.left + scrollLeft,
        top: zoomRegionRect.top + scrollTop
      }
    },
    pointBound () {
      const { zoomRegionRect } = this
      return generateBound(
        zoomRegionRect.width,
        zoomRegionRect.height,
        this.selectorHalfWidth,
        this.selectorHalfHeight
      )
    },
    vPointBound () {
      const { zoomRegionRect, scale } = this
      return generateBound(
        zoomRegionRect.width * scale,
        zoomRegionRect.height * scale,
        this.zoomerHalfWidth,
        this.zoomerHalfHeight
      )
    },
    point () {
      const { mouse, selectorOptions } = this
      return !selectorOptions.release
        ? getBoundValue(mouse, this.pointBound)
        : mouse
    },
    vPoint () {
      const { mouse, scale, selectorOptions } = this
      const scaleMouse = { x: mouse.x * scale, y: mouse.y * scale }
      return !selectorOptions.release
        ? getBoundValue(scaleMouse, this.vPointBound)
        : scaleMouse
    },
    selectorProps () {
      const { point } = this
      return {
        width: this.selectorWidth,
        height: this.selectorHeight,
        left: point.x - this.selectorHalfWidth,
        top: point.y - this.selectorHalfHeight
      }
    },
    zoomerProps () {
      const { vPoint } = this
      return {
        scale: this.scale,
        zoomRegion: this.zoomRegionRect,
        width: this.zoomerWidth,
        height: this.zoomerHeight,
        left: vPoint.x - this.zoomerHalfWidth,
        top: vPoint.y - this.zoomerHalfHeight
      }
    },
    outZoomerPosition () {
      return {
        top: `${this.outZoomerTop}px`
      }
    }
  },
  watch: {
    scale () {
      this.handleMouseMove(this.pointerInfo)
    },
    enterEvent (v) {
      !this.disabled && this.handleMouseEnter(v)
    },
    moveEvent (v) {
      !this.disabled && this.handleMouseMove(v)
    },
    leaveEvent (v) {
      !this.disabled && this.handleMouseLeave(v)
    }
  },
  mounted () {
    this.$zoomRegion = this.$refs.zoomRegion
    this.update()
    this.$emit('created')
  },
  methods: {
    handleMouseEnter (e) {
      !this.disabledReactive && this.update()
      this.mouseEnter = true
      this.$emit('mouseenter', e)
    },
    handleMouseMove (e) {
      !this.disabledReactive && this.update()
      e = this.pointerInfo = e || this.pointerInfo
      const { pageX, pageY } = e
      const { mouse, zoomRegionAbsolute } = this
      mouse.x = pageX - zoomRegionAbsolute.left
      mouse.y = pageY - zoomRegionAbsolute.top
      if (this.outZoomer && this.outZoomerOptions.sticky) {
        this.outZoomerTop = Math.max(pageY - e.clientY, 0)
      }
      this.$emit('mousemove', e)
    },
    handleMouseLeave (e) {
      this.mouseEnter = false
      this.$emit('mouseleave', e)
    },
    update () {
      Object.assign(
        this.zoomRegionRect,
        getBoundingClientRect(this.$zoomRegion)
      )
    }
  }
}
</script>

<style scoped>
.vue-photo-zoom-pro {
  font-size: 0;
}

.vue-photo-zoom-pro .zoom-region {
  position: relative;
  display: inline-block;
}

.vue-photo-zoom-pro .out-zoomer {
  position: absolute;
  right: -8px;
  background-repeat: no-repeat;
  transform: translate(100%, 0);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
</style>
