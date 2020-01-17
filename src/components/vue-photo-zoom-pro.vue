<template>
  <div class="photo-zoom-pro">
    <div
      class="container"
      @mouseenter="!disabled && !enterEvent && mouseEnter($event)"
      @mousemove="!disabled && !moveEvent && mouseMove($event)"
      @mouseleave="!disabled && !leaveEvent && mouseLeave($event)"
    >
      <img class="origin-img" ref="img" @load="imgLoaded($event)" />
      <div
        v-if="zoomer"
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
      <div v-if="mask" class="mask-container">
        <canvas id="mask"></canvas>
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
export default {
  name: "vue-photo-zoom-pro",
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
      default: "square",
      validator: function(value) {
        return ["circle", "square"].indexOf(value) !== -1;
      }
    },
    zoomerStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    outZoomerStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    scale: {
      type: Number,
      default: 3
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
    zoomer: {
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
    mask: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      zoomerRect: {
        top: 0, // 当前缩放器左上角距离container左上角的top/left
        left: 0,
        leftBound: 0, //缩放器的边界
        topBound: 0,
        rightBound: 0,
        bottomBound: 0,
        absoluteLeft: 0, // 缩放器初始位置相对于屏幕的位置
        absoluteTop: 0
      },
      zoomerBgRect: {
        top: 0, // 背景位置
        left: 0,
        leftBound: 0, //背景边界
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
    };
  },
  watch: {
    /**
     * 缩放比例变化时，手动触发move事件来更改大小
     * 主要解决放大器在内部时的比例变化时的响应
     */
    scale() {
      !this.outZoomer && this.mouseMove();
    },
    /**
     * 外部事件变化时的响应
     */
    moveEvent(e) {
      this.mouseMove(e);
    },
    leaveEvent(e) {
      this.mouseLeave(e);
    },
    /**
     * 图片地址变化时重置
     */
    url() {
      this.handlerUrlChange();
    },
    /**
     * 缩放器宽度/高度变化时重置缩放器属性
     */
    width(n) {
      this.initZoomerProperty();
    },
    height(n) {
      this.initZoomerProperty();
    },
    /**
     * 缩放器背景偏移量变化时重置背景边界
     */
    zoomerBgOffsetX(n) {
      this.initZoomerBgBound();
    },
    zoomerBgOffsetY(n) {
      this.initZoomerBgBound();
    }
  },
  computed: {
    /**
     * 缩放器宽高
     * 有高度用高度没高度用宽度
     */
    zoomerHeight() {
      return this.height > 0 ? this.height : this.width;
    },
    /**
     * 缩放器宽半径
     */
    zoomerHalfWidth() {
      return this.width / 2;
    },
    /**
     * 缩放器高半径
     */
    zoomerHalfHeight() {
      return this.zoomerHeight / 2;
    },
    /**
     * 背景边界偏移量
     * 主要是在内部放大的时候与缩放的大小有关
     */
    zoomerBgOffsetX() {
      return !this.outZoomer ? this.zoomerHalfWidth * (this.scale - 1) : 0;
    },
    /**
     * 背景边界偏移量
     */
    zoomerBgOffsetY() {
      return !this.outZoomer ? this.zoomerHalfHeight * (this.scale - 1) : 0;
    },
    /**
     * 缩放器位置
     */
    zoomerPosition() {
      const { top, left } = this.zoomerRect;
      return {
        top: `${top}px`,
        left: `${left}px`
      };
    },
    /**
     * 缩放器大小
     */
    zoomerSize() {
      const { width, zoomerHeight: height } = this;
      return {
        width: `${width}px`,
        height: `${height}px`
      };
    },
    /**
     * 外部缩放器大小
     */
    outZoomerSize() {
      const { scale, width, zoomerHeight: height } = this;
      return {
        width: `${width * scale}px`,
        height: `${height * scale}px`
      };
    },
    /**
     * 外部缩放器位置
     */
    outZoomerPosition() {
      return {
        top: `${this.outZoomerTop}px`
      };
    },
    /**
     * 高清图地址地址
     */
    zoomerBgUrl() {
      return {
        backgroundImage: `url(${this.highUrl || this.url})`
      };
    },
    /**
     * 高清图大小
     */
    zoomerBgSize() {
      const {
        scale,
        imgInfo: { height, width }
      } = this;
      return {
        backgroundSize: `${width * scale}px ${height * scale}px`
      };
    },
    /**
     * 高清图位置
     */
    zoomerBgPosition() {
      const { left, top } = this.zoomerBgRect;
      return {
        backgroundPosition: `${left}px ${top}px`
      };
    }
  },
  created() {
    this.url && this.handlerUrlChange();
  },
  mounted() {
    this.$img = this.$refs["img"];
  },
  methods: {
    /**
     * 图片url改变
     */
    handlerUrlChange() {
      this.imgLoadedFlag = false;
      this.loadImg(this.url).then(this.imgLoaded, console.error);
    },
    /**
     * 加载图片
     * @param {String} 图片地址
     * @return {Promise}
     */
    loadImg(url) {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.addEventListener("load", resolve);
        img.addEventListener("error", reject);
        img.src = url;
      });
    },
    /**
     * 图片记载完毕事件
     */
    imgLoaded() {
      const imgInfo = this.$img.getBoundingClientRect();
      if (JSON.stringify(this.imgInfo) != JSON.stringify(imgInfo)) {
        this.imgInfo = imgInfo;
        this.initZoomerProperty();
        this.resetOutZoomPosition();
      }
      if (!this.imgLoadedFlag) {
        this.imgLoadedFlag = true;
        this.$img.src = this.url;
        this.$emit("created", this.$img, imgInfo);
      }
    },
    /**
     * 鼠标移入事件
     */
    mouseEnter(e) {
      if (this.imgLoadedFlag) {
        this.hideZoomer = false;
      }
      this.$emit("mouseenter", e);
    },
    /**
     * 鼠标移动事件, 触摸
     */
    mouseMove(e) {
      if (!this.zoomer || this.hideZoomer) return;
      e = e || this.pointerInfo;
      if (this.imgLoadedFlag && e) {
        !this.disabledReactive && this.imgLoaded();
        const { pageX, pageY, clientY } = e;
        const {
          scale,
          zoomerRect,
          zoomerBgRect,
          outZoomer,
          zoomerBgOffsetX,
          zoomerBgOffsetY,
          zoomerHalfWidth,
          zoomerHalfHeight,
          outShowAutoScroll
        } = this;
        const scrollTop = pageY - clientY;
        const {
          absoluteLeft,
          absoluteTop,
          leftBound,
          topBound,
          rightBound,
          bottomBound
        } = zoomerRect;
        const {
          leftBound: bgLeftBound,
          topBound: bgTopBound,
          rightBound: bgRightBound,
          bottomBound: bgBottomBound
        } = zoomerBgRect;
        // pageX-absoluteLeft = 鼠标相对于容器的位置 - zoomerHalfWidth = 偏移到缩放器中心点
        const x = pageX - absoluteLeft - zoomerHalfWidth;
        const y = pageY - absoluteTop - zoomerHalfHeight;
        // 记录外部缩放器的位置
        let outZoomerInitTop = this.outZoomerInitTop;
        if (outZoomer) {
          if (!outZoomerInitTop) {
            outZoomerInitTop = this.outZoomerInitTop =
              scrollTop + this.imgInfo.top;
          }
          this.hideOutZoomer && (this.hideOutZoomer = false);
          this.outZoomerTop =
            scrollTop > outZoomerInitTop ? scrollTop - outZoomerInitTop : 0;
        }
        this.pointerInfo = e;
        zoomerRect.left = x > leftBound ? Math.min(x, rightBound) : leftBound;
        zoomerRect.top = y > topBound ? Math.min(y, bottomBound) : topBound;
        const bgX =
          x * scale > bgLeftBound
            ? Math.min(x * scale, bgRightBound)
            : bgLeftBound;
        const bgY =
          y * scale > bgTopBound
            ? Math.min(y * scale, bgBottomBound)
            : bgTopBound;
        zoomerBgRect.left = -bgX - zoomerBgOffsetX;
        zoomerBgRect.top = -bgY - zoomerBgOffsetY;
      }
      this.$emit("mousemove", e);
    },
    /**
     * 鼠标移出事件
     */
    mouseLeave(e) {
      this.hideZoomer = true;
      if (this.outZoomer) {
        this.hideOutZoomer = true;
      }
      this.$emit("mouseleave", e);
    },
    /**
     * 初始化选择器的属性
     */
    initZoomerProperty() {
      const zoomerRect = this.zoomerRect;
      const zoomerWidth = this.width;
      const zoomerHeight = this.zoomerHeight;
      const zoomerHalfWidth = this.zoomerHalfWidth;
      const zoomerHalfHeight = this.zoomerHalfHeight;
      const { width, height, left, top } = this.imgInfo;
      const scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      const scrollLeft =
        document.documentElement.scrollLeft ||
        window.pageXOffset ||
        document.body.scrollLeft;
      zoomerRect.topBound = zoomerRect.leftBound = 0; //相对于图片左上角选择器中心的鼠标边界位置
      zoomerRect.rightBound = width - zoomerWidth;
      zoomerRect.bottomBound = height - zoomerHeight;
      zoomerRect.absoluteLeft = left + scrollLeft; // 缩放器初始位置相对于屏幕左上角的位置
      zoomerRect.absoluteTop = top + scrollTop;
      this.initZoomerBgBound();
    },
    /**
     * 初始化选择器背景属性
     */
    initZoomerBgBound() {
      const zoomerBgOffsetX = this.zoomerBgOffsetX;
      const zoomerBgOffsetY = this.zoomerBgOffsetY;
      const zoomerBgRect = this.zoomerBgRect;
      const zoomerRect = this.zoomerRect;
      zoomerBgRect.leftBound = -zoomerBgOffsetX; //背景图移动的边界
      zoomerBgRect.topBound = -zoomerBgOffsetY;
      zoomerBgRect.rightBound =
        zoomerRect.rightBound * this.scale + zoomerBgOffsetX;
      zoomerBgRect.bottomBound =
        zoomerRect.bottomBound * this.scale + zoomerBgOffsetY;
    },
    /**
     * 重置
     */
    reset() {
      Object.assign(this.zoomerRect, {
        top: 0,
        left: 0
      });
      Object.assign(this.zoomerBgRect, {
        left: 0,
        top: 0
      });
      this.resetOutZoomPosition();
    },
    /**
     * 重置外部放大区域属性
     */
    resetOutZoomPosition() {
      this.outZoomerInitTop = 0;
    }
  }
};
</script>

<style scoped>
.container {
  position: relative;
}

.container .origin-img {
  width: 100%;
  display: block;
}

.img-zoomer {
  position: absolute;
  cursor: crosshair;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
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
  content: "";
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
