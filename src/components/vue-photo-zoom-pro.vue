<template>
  <div class="photo-zoom-pro">
    <div
      class="container"
      @mouseenter="!disabled && !enterEvent && mouseEnter($event)"
      @mousemove="!disabled && !moveEvent && mouseMove($event)"
      @mouseleave="!disabled && !leaveEvent && mouseLeave($event)"
    >
      <photo-mask
        v-if="mask"
        v-show="!hideZoomer"
        :mask-color="maskColor"
        :p-width="imgInfo.width"
        :p-height="imgInfo.height"
        :width="width"
        :height="zoomerHeight"
        :left="zoomerRect.left"
        :top="zoomerRect.top"
      ></photo-mask>
      <img class="origin-img" ref="img" @load="imgLoaded($event)" />
      <div
        v-if="selector"
        v-show="!hideZoomer && imgLoadedFlag"
        :class="['img-zoomer', { circle: type === 'circle' }]"
        :style="[
          zoomerStyle,
          zoomerSize,
          zoomerPosition,
          !outZoomer && zoomerBgUrl,
          !outZoomer && zoomerBgSize,
          !outZoomer && zoomerBgPosition
        ]"
      >
        <slot name="zoomer"></slot>
      </div>
      <div
        v-if="outZoomer"
        v-show="!hideOutZoomer"
        :class="['img-out-show', { 'base-line': baseline }]"
        :style="[
          outZoomerStyle,
          outZoomerSize,
          outZoomerPosition,
          zoomerBgUrl,
          zoomerBgSize,
          zoomerBgPosition
        ]"
      >
        <div v-if="pointer" class="img-zoomer-point"></div>
        <slot name="outzoomer"></slot>
      </div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import photoMask from './photo-mask'
import {getBoundingClientRect} from '../util'
export default {
  name: 'vue-photo-zoom-pro',
  components: {
    photoMask
  },
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
    zoomerStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    outZoomerStyle: {
      type: Object,
      default() {
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
    }
  },
  data() {
    return {
      zoomerRect: {
        top: 0, // 当前缩放器的位置
        left: 0,
        absoluteLeft: 0, // 缩放器初始位置相对于屏幕的位置
        absoluteTop: 0
      },
      zoomerBgRect: {
        top: 0, // 背景位置
        left: 0
      },
      zoomerPoint: {
        leftBound: 0, //缩放器的边界
        topBound: 0,
        rightBound: 0,
        bottomBound: 0
      },
      vZoomerPoint: {
        //虚拟缩放器（相对于背景上的缩放器）
        leftBound: 0, //虚拟缩放器鼠标边界
        topBound: 0,
        rightBound: 0,
        bottomBound: 0
      },
      hideZoomer: true, // 是否隐藏缩放器
      hideOutZoomer: true, // 是否隐藏外部缩放器
      imgLoadedFlag: false, // 图片加载完毕标识
      outZoomerInitTop: 0, // 外部缩放器的初始位置
      outZoomerTop: 0, // 外部缩放器的位置
      imgInfo: {}, // 图片信息
      $img: null // 图片dom
    }
  },
  watch: {
    /**
     * 缩放比例变化时，手动触发move事件来更改大小
     * 主要解决放大器在内部时的比例变化时的响应
     */
    scale() {
      this.initVZoomerPoint()
      !this.outZoomer && this.mouseMove()
    },
    /**
     * 外部事件变化时的响应
     */
    enterEvent: 'mouseEnter',
    moveEvent: 'mouseMove',
    leaveEvent: 'mouseLeave',
    /**
     * 图片地址变化时重置
     */
    url: 'handlerUrlChange',
    /**
     * 缩放器宽度/高度变化时重置缩放器属性
     */
    width: 'initZoomerPoint',
    height: 'initZoomerPoint',
    vZoomerHalfWidth: 'initVZoomerPoint',
    vZoomerHalfHeight: 'initVZoomerPoint'
  },
  computed: {
    /**
     * 缩放器宽高
     * 有高度用高度没高度用宽度
     */
    zoomerHeight() {
      return this.height > 0 ? this.height : this.width
    },
    /**
     * 缩放器宽/高半径
     */
    zoomerHalfWidth() {
      return this.width / 2
    },
    zoomerHalfHeight() {
      return this.zoomerHeight / 2
    },
    /**
     * 虚拟缩放器宽/高半径
     */
    vZoomerHalfWidth() {
      const zoomerHalfWidth = this.zoomerHalfWidth
      return this.outZoomer ? zoomerHalfWidth * this.scale : zoomerHalfWidth
    },
    vZoomerHalfHeight() {
      const zoomerHalfHeight = this.zoomerHalfHeight
      return this.outZoomer ? zoomerHalfHeight * this.scale : zoomerHalfHeight
    },
    /**
     * 缩放器位置
     */
    zoomerPosition() {
      const { top, left } = this.zoomerRect
      return {
        top: `${top}px`,
        left: `${left}px`
      }
    },
    /**
     * 缩放器大小
     */
    zoomerSize() {
      const { width, zoomerHeight: height } = this
      return {
        width: `${width}px`,
        height: `${height}px`
      }
    },
    /**
     * 外部缩放器大小
     */
    outZoomerSize() {
      const { scale, width, zoomerHeight: height } = this
      return {
        width: `${width * scale}px`,
        height: `${height * scale}px`
      }
    },
    /**
     * 外部缩放器位置
     */
    outZoomerPosition() {
      return {
        top: `${this.outZoomerTop}px`
      }
    },
    /**
     * 高清图地址地址
     */
    zoomerBgUrl() {
      return {
        backgroundImage: `url(${this.highUrl || this.url})`
      }
    },
    /**
     * 高清图大小
     */
    zoomerBgSize() {
      const {
        scale,
        imgInfo: { height, width }
      } = this
      return {
        backgroundSize: `${width * scale}px ${height * scale}px`
      }
    },
    /**
     * 高清图位置
     */
    zoomerBgPosition() {
      const { left, top } = this.zoomerBgRect
      return {
        backgroundPosition: `${left}px ${top}px`
      }
    }
  },
  created() {
    this.url && this.handlerUrlChange()
    this.beforeReactivateMoveFns = []
  },
  mounted() {
    this.$img = this.$refs['img']
    this.addResizeListener(this.$img, rect => {
      this.imgInfo = rect
      this.handlerImgResize()
    })
  },
  methods: {
    /**
     * 为某个dom添加监听dom位置或者大小变化的
     */
    addResizeListener(dom, cb) {
      if (!this.disabledReactive) {
        this.beforeReactivateMoveFns.push(() => {
          const rect = getBoundingClientRect(dom)
          if (this.validImgResize(rect)) {
            cb && cb(rect)
          }
        })
      }
    },
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
      const $img = this.$img
      if (!this.imgLoadedFlag) {
        this.imgLoadedFlag = true
        $img.src = this.url
        setTimeout(() => {
          this.imgInfo = getBoundingClientRect($img)
          this.handlerImgResize()
          this.$emit('created', $img, this.imgInfo)
        })
      }
    },
    /**
     * 检测img大小或者位置是否改变
     */
    validImgResize(imgInfo) {
      return JSON.stringify(this.imgInfo) !== JSON.stringify(imgInfo)
    },
    /**
     * 图片大小或者位置改变后的事件
     */
    handlerImgResize() {
      this.initZoomerProperty()
      this.resetOutZoomPosition()
    },
    /**
     * 鼠标移入事件
     */
    mouseEnter(e) {
      if (this.imgLoadedFlag) {
        this.hideZoomer = false
      }
      this.$emit('mouseenter', e)
    },
    /**
     * 鼠标移动事件, 触摸
     */
    mouseMove(e) {
      if (this.hideZoomer) return
      e = e || this.pointerInfo
      if (this.imgLoadedFlag && e) {
        // 缓存event信息
        this.pointerInfo = e
        // 执行move响应前的方法
        this.beforeReactivateMoveFns.forEach(fn => fn.call(this))
        const { pageX, pageY, clientY } = e
        const scrollTop = pageY - clientY
        const {
          scale,
          zoomerRect,
          zoomerBgRect,
          zoomerPoint,
          vZoomerPoint,
          outZoomer,
          zoomerHalfWidth,
          zoomerHalfHeight,
          vZoomerHalfWidth,
          vZoomerHalfHeight
        } = this
        const { absoluteLeft, absoluteTop } = zoomerRect
        const { leftBound, topBound, rightBound, bottomBound } = zoomerPoint
        const {
          leftBound: vZoomerLeftBound,
          topBound: vZoomerTopBound,
          rightBound: vZoomerRightBound,
          bottomBound: vZoomerBottomBound
        } = vZoomerPoint
        let outZoomerInitTop = this.outZoomerInitTop
        //鼠标相对于容器的位置
        const x = pageX - absoluteLeft
        const y = pageY - absoluteTop
        // 记录/修改外部缩放器的位置
        // 缩放器当前左上角的位置
        const zoomerLeft = x > leftBound ? Math.min(x, rightBound) : leftBound
        const zoomerTop = y > topBound ? Math.min(y, bottomBound) : topBound
        // 当前鼠标相对于背景的位置
        const vZoomerX =
          x * scale > vZoomerLeftBound
            ? Math.min(x * scale, vZoomerRightBound)
            : vZoomerLeftBound
        const vZoomerY =
          y * scale > vZoomerTopBound
            ? Math.min(y * scale, vZoomerBottomBound)
            : vZoomerTopBound
        // 更新UI位置
        zoomerRect.left = zoomerLeft - zoomerHalfWidth // 缩放器偏移到中心
        zoomerRect.top = zoomerTop - zoomerHalfHeight
        zoomerBgRect.left = -vZoomerX + vZoomerHalfWidth // 背景位置偏移到左上角
        zoomerBgRect.top = -vZoomerY + vZoomerHalfHeight
        if (outZoomer) {
          if (!outZoomerInitTop) {
            outZoomerInitTop = this.outZoomerInitTop =
              scrollTop + this.imgInfo.top
          }
          this.hideOutZoomer && (this.hideOutZoomer = false)
          this.outZoomerTop =
            scrollTop > outZoomerInitTop ? scrollTop - outZoomerInitTop : 0
        }
      }
      this.$emit('mousemove', e)
    },
    /**
     * 鼠标移出事件
     */
    mouseLeave(e) {
      this.hideZoomer = true
      if (this.outZoomer) {
        this.hideOutZoomer = true
      }
      this.$emit('mouseleave', e)
    },
    /**
     * 初始化选择器的属性
     */
    initZoomerProperty() {
      const zoomerRect = this.zoomerRect
      const { left, top } = this.imgInfo
      const { documentElement, body } = document
      const scrollTop =
        documentElement.scrollTop || window.pageYOffset || body.scrollTop
      const scrollLeft =
        documentElement.scrollLeft || window.pageXOffset || body.scrollLeft
      zoomerRect.absoluteLeft = left + scrollLeft // 缩放器初始位置相对于屏幕左上角的位置
      zoomerRect.absoluteTop = top + scrollTop
      this.initZoomerPoint()
      this.initVZoomerPoint()
    },
    initZoomerPoint() {
      const zoomerHalfWidth = this.zoomerHalfWidth
      const zoomerHalfHeight = this.zoomerHalfHeight
      const { width, height } = this.imgInfo
      const zoomerPoint = this.zoomerPoint
      zoomerPoint.leftBound = zoomerHalfWidth //鼠标相对于容器的边界
      zoomerPoint.topBound = zoomerHalfHeight
      zoomerPoint.rightBound = width - zoomerHalfWidth
      zoomerPoint.bottomBound = height - zoomerHalfHeight
      this.mouseMove()
    },
    /**
     * 初始化选择器背景属性
     */
    initVZoomerPoint() {
      const vZoomerPoint = this.vZoomerPoint
      const vZoomerHalfWidth = this.vZoomerHalfWidth
      const vZoomerHalfHeight = this.vZoomerHalfHeight
      const { width, height } = this.imgInfo
      const scale = this.scale
      vZoomerPoint.leftBound = vZoomerHalfWidth //虚拟缩放器鼠标相对于容器的边界
      vZoomerPoint.topBound = vZoomerHalfHeight
      vZoomerPoint.rightBound = width * scale - vZoomerHalfWidth
      vZoomerPoint.bottomBound = height * scale - vZoomerHalfHeight
      this.mouseMove()
    },
    /**
     * 重置
     */
    reset() {
      this.initZoomerProperty()
    },
    /**
     * 重置外部放大区域属性
     */
    resetOutZoomPosition() {
      this.outZoomerInitTop = 0
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

.img-zoomer {
  position: absolute;
  box-sizing: border-box;
  cursor: crosshair;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-repeat: no-repeat;
}

.img-zoomer.circle {
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

.img-zoomer-point {
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
