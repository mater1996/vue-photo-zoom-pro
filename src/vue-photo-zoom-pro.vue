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
        v-show="!hideSelector"
        :mask-color="maskColor"
        :p-width="zoomRegionRect.width"
        :p-height="zoomRegionRect.height"
        v-bind="selectorProps"
      />
      <Selector
        v-if="selector"
        v-show="!hideSelector"
        v-bind="selectorProps"
        :type="type"
      >
        <Zoomer
          v-if="!outZoomer"
          class="inner-zoomer"
          v-bind="zoomerProps"
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
        :style="outZoomerPosition"
      >
        <slot name="outzoomer" />
      </Zoomer>
      <div
        ref="zoomRegion"
        class="zoom-region"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
import PhotoMask from './components/photo-mask.vue'
import Zoomer from './components/zoomer.vue'
import Selector from './components/selector.vue'
import { getBoundingClientRect, getBoundValue, getScrollInfo, addResizeListener } from './util'

export default {
  name: 'VuePhotoZoomPro',
  components: {
    PhotoMask,
    Selector,
    Zoomer
  },
  props:
    {
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
      scale: {
        type: Number,
        default: 2
      },
      zoomRegion: {
        type: Object,
        default: () => ({})
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
        default: false
      },
      maskColor: {
        type: String,
        default: ''
      }
    },
  data () {
    return {
      hideSelector: true,
      hideOutZoomer: true,
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
    vSelectorHalfWidth () {
      return this.outZoomer ? this.selectorHalfWidth * this.scale : this.selectorHalfWidth
    },
    vSelectorHalfHeight () {
      return this.outZoomer ? this.selectorHalfHeight * this.scale : this.selectorHalfHeight
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
      return {
        leftBound: this.selectorHalfWidth,
        topBound: this.selectorHalfHeight,
        rightBound: zoomRegionRect.width - this.selectorHalfWidth,
        bottomBound: zoomRegionRect.height - this.selectorHalfHeight
      }
    },
    vPointBound () {
      const { vSelectorHalfWidth, vSelectorHalfHeight, zoomRegionRect, scale } = this
      return {
        leftBound: vSelectorHalfWidth,
        topBound: vSelectorHalfHeight,
        rightBound: zoomRegionRect.width * scale - vSelectorHalfWidth,
        bottomBound: zoomRegionRect.height * scale - vSelectorHalfHeight
      }
    },
    point () {
      const { mouse, pointBound } = this
      const { leftBound, topBound, rightBound, bottomBound } = pointBound
      return {
        left: getBoundValue(mouse.x, leftBound, rightBound),
        top: getBoundValue(mouse.y, topBound, bottomBound)
      }
    },
    vPoint () {
      const { mouse, scale, vPointBound } = this
      const { leftBound, topBound, rightBound, bottomBound } = vPointBound
      return {
        left: getBoundValue(mouse.x * scale, leftBound, rightBound),
        top: getBoundValue(mouse.y * scale, topBound, bottomBound)
      }
    },
    selectorProps () {
      const { point } = this
      return {
        width: this.selectorWidth,
        height: this.selectorHeight,
        left: point.left - this.selectorHalfWidth,
        top: point.top - this.selectorHalfHeight
      }
    },
    zoomerProps () {
      const { vPoint, scale, zoomRegionRect } = this
      return {
        scale,
        zoomRegionRect,
        url: this.highUrl,
        width: this.outZoomer ? this.selectorWidth * scale : this.selectorWidth,
        height: this.outZoomer ? this.selectorHeight * scale : this.selectorHeight,
        left: vPoint.left - this.vSelectorHalfWidth,
        top: vPoint.top - this.vSelectorHalfHeight
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
    }
  },
  mounted () {
    this.$zoomRegion = this.$refs.zoomRegion
    if (!this.disabledReactive) {
      this.resizer = addResizeListener(this.$zoomRegion, this.handleZoomRegionResize)
    }
    this.update()
    this.$emit('created')
  },
  methods: {
    getDefaultSlot () {
      return this.$slots.default[0]
    },
    handleZoomRegionResize (rect) {
      this.zoomRegionRect = {
        ...rect,
        ...this.zoomRegion
      }
    },
    mouseEnter (e) {
      this.resizer && this.resizer.valid()
      this.hideSelector = false
      if (this.outZoomer) this.hideOutZoomer = false
      this.$emit('mouseenter', e)
    },
    mouseMove (e) {
      if (this.hideSelector) return
      e = this.pointerInfo = e || this.pointerInfo
      if (e) {
        this.resizer && this.resizer.valid()
        this.hideSelector = false
        const { pageX, pageY } = e
        const { zoomRegionAbsolute } = this
        this.mouse.x = pageX - zoomRegionAbsolute.left
        this.mouse.y = pageY - zoomRegionAbsolute.top
        if (this.outZoomer) {
          this.hideOutZoomer = false
          this.outZoomerTop = Math.max(pageY - e.clientY, 0)
        }
      }
      this.$emit('mousemove', e)
    },
    mouseLeave (e) {
      this.hideSelector = true
      if (this.outZoomer) this.hideOutZoomer = true
      this.$emit('mouseleave', e)
    },
    update () {
      this.handleZoomRegionResize(getBoundingClientRect(this.$zoomRegion))
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

.out-zoomer {
  position: absolute;
  right: -8px;
  background-repeat: no-repeat;
  transform: translate(100%, 0);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.zoom-region {
  display: inline-block;
  font-size: 0;
}
</style>
