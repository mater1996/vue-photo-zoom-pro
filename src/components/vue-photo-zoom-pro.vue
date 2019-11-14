<template>
  <div class="pic-img">
    <div
      class="img-container"
      @mousemove="!moveEvent && mouseMove($event)"
      @mouseleave="!leaveEvent && mouseLeave($event)"
    >
      <img
        ref="img"
        @load="imgLoaded($event)"
        :src="imgLoadedFlag && url"
        style="width:100%;display:block"
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
  name: "vue-photo-zoom-pro",
  props: {
    url: String,
    highUrl: String,
    width: {
      type: Number,
      default: 168
    },
    type: {
      type: String,
      default: "square",
      validator: function(value) {
        return ["circle", "square"].indexOf(value) !== -1;
      }
    },
    zoomStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    outZoomStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    scale: {
      type: Number,
      default: 2
    },
    moveEvent: {
      type: [Object, MouseEvent],
      default: null
    },
    leaveEvent: {
      type: [Object, MouseEvent],
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
        width: this.width,
        top: 0,
        left: 0,
        bgTop: 0,
        bgLeft: 0,
        leftBound: 0,
        topBound: 0,
        rightBound: 0,
        bottomBound: 0,
        absoluteLeft: 0,
        absoluteTop: 0
      },
      bgBound: {
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
      imgLoadedFlag: false,
      highImgLoadedFlag: false,
      hideSelector: true,
      timer: null
    };
  },
  watch: {
    moveEvent(e) {
      this.mouseMove(e);
    },
    leaveEvent(e) {
      this.mouseLeave(e);
    },
    url() {
      this.handlerUrlChange();
    },
    width(n) {
      this.initSelectorProperty(n);
    },
    selectorMouseOffsetWidth(n) {
      this.initSelectorBgBound();
    }
  },
  computed: {
    bgOffsetWidth() {
      return !this.outZoom ? (this.width / 2) * (1 - this.scale) : 0;
    },
    selectorMouseOffsetWidth() {
      return !this.outZoom ? this.width / 2 / this.scale : 0;
    },
    imgZoomPosition() {
      const { top, left } = this.selector;
      return {
        top: `${top}px`,
        left: `${left}px`
      };
    },
    imgZoomSize() {
      const width = this.selector.width;
      return {
        width: `${width}px`,
        height: `${width}px`
      };
    },
    imgOutZoomSize() {
      const {
        scale,
        selector: { width }
      } = this;
      return {
        width: `${width * scale}px`,
        height: `${width * scale}px`
      };
    },
    imgOutZoomPosition() {
      return {
        top: `${this.outShowTop}px`
      };
    },
    imgBg() {
      return {
        backgroundImage: `url(${this.highUrl || this.url})`
      };
    },
    imgBgSize() {
      const {
        scale,
        imgInfo: { height, width }
      } = this;
      return {
        backgroundSize: `${width * scale}px ${height * scale}px`
      };
    },
    imgBgPosition() {
      const { bgLeft, bgTop } = this.selector;
      return {
        backgroundPosition: `${bgLeft}px ${bgTop}px`
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
    handlerUrlChange() {
      this.imgLoadedFlag = false;
      this.loadImg(this.url).then(this.imgLoaded, err => console.error(err));
    },
    loadImg(url) {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.addEventListener("load", resolve);
        img.addEventListener("error", reject);
        img.src = url;
      });
    },
    imgLoaded() {
      let imgInfo = this.$img.getBoundingClientRect();
      if (JSON.stringify(this.imgInfo) != JSON.stringify(imgInfo)) {
        this.imgInfo = imgInfo;
        this.initSelectorProperty(this.width);
        this.resetOutZoomPosition();
      }
      if (!this.imgLoadedFlag) {
        this.imgLoadedFlag = true;
        this.$emit("created", this.$img, imgInfo);
      }
    },
    mouseMove(e) {
      if (!this.hideZoom && this.imgLoadedFlag) {
        !this.disabledReactive && this.imgLoaded();
        const { pageX, pageY, clientY } = e;
        const {
          scale,
          selector,
          outZoom,
          bgOffsetWidth,
          outShowAutoScroll,
          bgBound
        } = this;
        let { outShowInitTop } = this;
        const scrollTop = pageY - clientY;
        const {
          absoluteLeft,
          absoluteTop,
          leftBound,
          topBound,
          rightBound,
          bottomBound,
          width
        } = selector;
        const {
          leftBound: bgLeftBound,
          topBound: bgTopBound,
          rightBound: bgRightBound,
          bottomBound: bgBottomBound
        } = bgBound;
        const x = pageX - absoluteLeft;
        const y = pageY - absoluteTop;
        if (outZoom) {
          if (!outShowInitTop) {
            outShowInitTop = this.outShowInitTop = scrollTop + this.imgInfo.top;
          }
          this.hideOutZoom && (this.hideOutZoom = false);
          this.outShowTop =
            scrollTop > outShowInitTop ? scrollTop - outShowInitTop : 0;
        }
        this.hideSelector && (this.hideSelector = false);
        selector.left = x > leftBound ? Math.min(x, rightBound) : leftBound;
        selector.top = y > topBound ? Math.min(y, bottomBound) : topBound;
        const bgX = x > bgLeftBound ? Math.min(x, bgRightBound) : bgLeftBound;
        const bgY = y > bgTopBound ? Math.min(y, bgBottomBound) : bgTopBound;
        selector.bgLeft = -bgX * scale + bgOffsetWidth;
        selector.bgTop = -bgY * scale + bgOffsetWidth;
      }
      this.$emit("mousemove", e);
    },
    initSelectorProperty(selectorWidth) {
      const selectorHalfWidth = selectorWidth / 2;
      const selector = this.selector;
      const { width, height, left, top } = this.imgInfo;
      const scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      const scrollLeft =
        document.documentElement.scrollLeft ||
        window.pageXOffset ||
        document.body.scrollLeft;
      selector.width = selectorWidth;
      selector.topBound = selector.leftBound = 0;
      selector.topBound = 0;
      selector.rightBound = width - selectorWidth;
      selector.bottomBound = height - selectorWidth;
      selector.absoluteLeft = left + selectorHalfWidth + scrollLeft;
      selector.absoluteTop = top + selectorHalfWidth + scrollTop;
      this.initSelectorBgBound();
    },
    initSelectorBgBound() {
      const selectorMouseOffsetWidth = this.selectorMouseOffsetWidth;
      const bgBound = this.bgBound;
      const selector = this.selector;
      bgBound.topBound = bgBound.leftBound = -selectorMouseOffsetWidth;
      bgBound.rightBound = selector.rightBound + selectorMouseOffsetWidth;
      bgBound.bottomBound = selector.bottomBound + selectorMouseOffsetWidth;
    },
    mouseLeave(e) {
      this.hideSelector = true;
      if (this.outZoom) {
        this.hideOutZoom = true;
      }
      this.$emit("mouseleave", e);
    },
    reset() {
      Object.assign(this.selector, {
        top: 0,
        left: 0,
        bgLeft: 0,
        bgTop: 0
      });
      this.resetOutZoomPosition();
    },
    resetOutZoomPosition() {
      this.outShowInitTop = 0;
    }
  }
};
</script>

<style scoped>
.img-container {
  position: relative;
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

.img-out-show.base-line::after {
  position: absolute;
  box-sizing: border-box;
  content: "";
  width: 1px;
  border: 1px dashed rgba(0, 0, 0, 0.36);
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.img-out-show.base-line::before {
  position: absolute;
  box-sizing: border-box;
  content: "";
  height: 1px;
  border: 1px dashed rgba(0, 0, 0, 0.36);
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
