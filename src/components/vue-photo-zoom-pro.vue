<template>
  <div v-if="url" class="pic-img">
    <div class="img-container" @mousemove="!moveEvent && mouseMove($event)"
         @mouseleave="!leaveEvent &&  mouseLeave($event)">
      <img ref="img" @load="imgLoaded" :src="url" style="width:100%"/>
      <div v-if="!hideZoom && imgLoadedFlag" :class="['img-selector',{'circle':type === 'circle'}]"
           :style="[imgSelectorSize,imgSelectorPosition,!outShow && imgSelectorBg ,!outShow && imgBgPosition]"></div>
      <div v-if="outShow" v-show="!hideOutShow" class="img-out-show"
           :style="[imgOutShowSize,imgSelectorBg,imgBgPosition]"></div>
    </div>
  </div>

</template>
<script>
  export default {
    name: 'vue-photo-zoom-pro',
    data() {
      return {
        selector: {
          width: 166,
          halfWidth: 83,
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
        hideOutShow: true,
        imgLoadedFlag: false
      };
    },
    props: {
      url: String,
      highUrl: String,
      type: {
        type: String,
        default: 'square',
        validator: function (value) {
          return ['circle', 'square'].indexOf(value) !== -1;
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
    watch: {
      moveEvent(e) {
        this.mouseMove(e);
      },
      leaveEvent(e) {
        this.mouseLeave(e);
      },
      url() {
        this.imgLoadedFlag = false;
      }
    },
    computed: {
      imgSelectorPosition() {
        let {top, left} = this.selector;
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
      imgOutShowSize() {
        let {
          scale,
          selector: {width}
        } = this;
        return {
          width: `${width * scale}px`,
          height: `${width * scale}px`
        };
      },
      imgSelectorBg() {
        let {
          scale,
          url,
          highUrl,
          imgInfo: {height, width}
        } = this;
        return {
          backgroundImage: `url(${highUrl || url})`,
          backgroundSize: `${width * scale}px ${height * scale}px`
        };
      },
      imgBgPosition() {
        let {bgLeft, bgTop} = this.selector;
        return {
          backgroundPosition: `${bgLeft}px ${bgTop}px`
        };
      }
    },
    methods: {
      imgLoaded() {
        this.imgLoadedFlag = true;
        let {width, height, left, top} = (this.imgInfo = this.$refs[
          'img'
          ].getBoundingClientRect());
        let selector = this.selector;
        let {width: selectorWidth, halfWidth: selectorHalfWidth} = selector;
        Object.assign(selector, {
          absoluteLeft: left + selectorHalfWidth,
          absoluteTop:
            top + selectorHalfWidth + document.documentElement.scrollTop,
          rightBound: width - selectorWidth,
          bottomBound: height - selectorWidth
        });
      },
      reset() {
        Object.assign(this.selector, {
          top: 0,
          left: 0,
          bgLeft: 0,
          bgTop: 0
        });
      },
      mouseMove(e) {
        if (!this.hideZoom && this.imgLoadedFlag) {
          let {pageX, pageY} = e;
          let {scale, selector} = this;
          let {
            halfWidth,
            absoluteLeft,
            absoluteTop,
            rightBound,
            bottomBound
          } = selector;
          let x = pageX - absoluteLeft;
          let y = pageY - absoluteTop;
          if (this.outShow) {
            halfWidth = 0;
            this.hideOutShow = false;
          }
          Object.assign(selector, {
            top: y > 0 ? (y < bottomBound ? y : bottomBound) : 0,
            left: x > 0 ? (x < rightBound ? x : rightBound) : 0,
            bgLeft: halfWidth - (halfWidth + x) * scale,
            bgTop: halfWidth - (halfWidth + y) * scale
          });
        }
      },
      mouseLeave() {
        if (this.outShow) {
          this.hideOutShow = true;
        }
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
    background-color: rgba(0, 0, 0, 0.6);
    background-repeat: no-repeat;
    cursor: crosshair;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .img-selector.circle {
    border-radius: 50%;
  }

  .img-out-show {
    position: absolute;
    top: 0;
    right: 0;
    background-repeat: no-repeat;
    transform: translate(100%, 0);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
</style>
