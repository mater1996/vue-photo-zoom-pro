<template>
  <div class="pic-img">
    <div
      class="img-container"
      @mousemove="!moveEvent && mouseMove($event)"
      @mouseleave="!leaveEvent && mouseLeave($event)"
    >
      <img
        ref="img"
        @load="imgLoaded"
        :src="url"
        style="width:100%"
      ></img>
      <div
        v-if="!hideZoom && imgLoadedFlag &&!hideSelector"
        :class="['img-selector',{'circle':type === 'circle'}]"
        :style="[imgSelectorStyle,imgSelectorSize,imgSelectorPosition,!outShow && imgSelectorBgSize ,!outShow && imgBgPosition]"
      >
        <slot></slot>
      </div>
      <div
        v-if="outShow"
        v-show="!hideOutShow"
        class="img-out-show"
        :style="[imgOutShowSize,imgOutShowPosition,imgSelectorBgSize,imgBgPosition]"
      >
        <div class="img-selector-point"></div>
      </div>
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
    selectorStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    scale: {
      type: Number,
      default: 3
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
    outShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selector: {
        width: this.width,
        halfWidth: !this.outShow ? this.width / 2 : 0,
        top: 0,
        left: 0,
        bgTop: 0,
        bgLeft: 0,
        rightBound: 0,
        bottomBound: 0,
        absoluteLeft: 0,
        absoluteTop: 0
      },
      imgInfo: {},
      $img: null,
      screenWidth: document.body.clientWidth,
      outShowInitTop: 0,
      outShowTop: 0,
      hideOutShow: true,
      imgLoadedFlag: false,
      hideSelector: false,
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
      this.imgLoadedFlag = false;
    },
    width() {
      let selectorWidth = (this.selector.width = this.width);
      this.selector.halfWidth = selectorWidth / 2;
      this.initSelectorProperty();
    },
    screenWidth(val) {
      if (!this.timer) {
        this.screenWidth = val;
        this.timer = setTimeout(() => {
          this.imgLoaded();
          clearTimeout(this.timer);
          this.timer = null;
        }, 400);
      }
    }
  },
  computed: {
    imgSelectorPosition() {
      let { top, left } = this.selector;
      return {
        top: `${top}px`,
        left: `${left}px`
      };
    },
    imgSelectorSize() {
      let width = this.selector.width;
      return {
        width: `${width}px`,
        height: `${width}px`
      };
    },
    imgSelectorStyle() {
      return this.selectorStyle;
    },
    imgOutShowSize() {
      let {
        scale,
        selector: { width }
      } = this;
      return {
        width: `${width * scale}px`,
        height: `${width * scale}px`
      };
    },
    imgOutShowPosition() {
      return {
        top: `${this.outShowTop}px`,
        right: `${-10}px`
      };
    },
    imgSelectorBgSize() {
      let {
        scale,
        url,
        highUrl,
        imgInfo: { height, width }
      } = this;
      return {
        backgroundImage: `url(${highUrl || url})`,
        backgroundSize: `${width * scale}px ${height * scale}px`
      };
    },
    imgBgPosition() {
      let { bgLeft, bgTop } = this.selector;
      return {
        backgroundPosition: `${bgLeft}px ${bgTop}px`
      };
    }
  },
  mounted() {
    this.$img = this.$refs["img"];
  },
  methods: {
    imgLoaded() {
      let imgInfo = this.$img.getBoundingClientRect();
      if (JSON.stringify(this.imgInfo) != JSON.stringify(imgInfo)) {
        this.imgInfo = imgInfo;
        this.initSelectorProperty();
        this.resetOutShowInitPosition();
      }
      if (!this.imgLoadedFlag) {
        this.imgLoadedFlag = true;
        this.$emit("created", imgInfo);
      }
    },
    mouseMove(e) {
      if (!this.hideZoom && this.imgLoadedFlag) {
        this.imgLoaded();
        const { pageX, pageY, clientY } = e;
        const { scale, selector } = this;
        let { outShowInitTop } = this;
        const scrollTop = pageY - clientY;
        const {
          halfWidth,
          absoluteLeft,
          absoluteTop,
          rightBound,
          bottomBound
        } = selector;
        const x = pageX - absoluteLeft; // 选择器的x坐标 相对于图片
        const y = pageY - absoluteTop; // 选择器的y坐标
        if (this.outShow) {
          if (!outShowInitTop) {
            outShowInitTop = this.outShowInitTop = scrollTop + this.imgInfo.top;
          }
          this.hideOutShow = false;
          this.outShowTop =
            scrollTop > outShowInitTop ? scrollTop - outShowInitTop : 0;
        }
        this.hideSelector = false;
        selector.top = y > 0 ? (y < bottomBound ? y : bottomBound) : 0;
        selector.left = x > 0 ? (x < rightBound ? x : rightBound) : 0;
        selector.bgLeft = halfWidth - (halfWidth + x) * scale; // 选择器图片的坐标位置
        selector.bgTop = halfWidth - (halfWidth + y) * scale;
      }
    },
    initSelectorProperty() {
      const selector = this.selector;
      const { width, height, left, top } = this.imgInfo;
      const { scrollLeft, scrollTop } = document.documentElement;
      const { width: selectorWidth, halfWidth: selectorHalfWidth } = selector;
      selector.rightBound = width - selectorWidth;
      selector.bottomBound = height - selectorWidth;
      selector.absoluteLeft = left + selectorHalfWidth + scrollLeft;
      selector.absoluteTop = top + selectorHalfWidth + scrollTop;
    },
    mouseLeave() {
      this.hideSelector = true;
      if (this.outShow) {
        this.hideOutShow = true;
      }
    },
    reset() {
      Object.assign(this.selector, {
        top: 0,
        left: 0,
        bgLeft: 0,
        bgTop: 0
      });
      this.resetOutShowInitPosition();
    },
    resetOutShowInitPosition() {
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
}

.img-selector.circle {
  border-radius: 50%;
}

.img-out-show {
  position: absolute;
  background-repeat: no-repeat;
  transform: translate(100%, 0);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.img-selector-point {
  position: absolute;
  width: 5px;
  height: 5px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: black;
}

.img-out-show::after {
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

.img-out-show::before {
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

