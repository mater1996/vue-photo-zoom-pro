<template>
  <div id="app">
    <div
      v-if="changeImgPosition"
      style="width:100px;display:inline-block"
    ></div>
    <div style="width:60%;display:inline-block">
      <vue-photo-zoom-pro
        :width="width"
        :height="height"
        :url="url"
        :type="type"
        :scale="scale"
        :out-zoom="showType"
        :zoom-style="{
          'background-color': taobao ? 'transparent' : 'rgba(0,0,0,0.6)'
        }"
      >
        <template v-if="taobao" slot="header">
          <div class="ks-imagezoom-wrap"></div>
        </template>
      </vue-photo-zoom-pro>
    </div>
    <div style="width:38%;display:inline-block;vertical-align:top;">
      <p>当前放大倍数：{{ scale }}</p>
      <p>当前放大镜宽度：{{ width }}</p>
      <button style="margin-top:8px" @click="addSelectorWidth">
        增加放大器宽度(add width)
      </button>
      <button style="margin-top:8px" @click="subSelectorWidth">
        减小放大器宽度(cut width)
      </button>
      <button
        style="margin-top:8px"
        @click="changeImgPosition = !changeImgPosition"
      >
        改变图片位置(change position)
      </button>
      <button style="margin-top:8px" @click="addScale">
        增加放大倍数(add scale)
      </button>
      <button style="margin-top:8px" @click="subScale">
        减小放大倍数(cut scale)
      </button>
      <button style="margin-top:8px" @click="changeImg">
        更换图片(change img url)
      </button>
      <button style="margin-top:8px" @click="changeType">
        更换放大镜类型(change type)
      </button>
      <button style="margin-top:8px" @click="changeShowType">
        更换放大方式(change type of scale)
      </button>
      <button style="margin-top:8px" @click="changeToTaobao">
        类淘宝放大镜
      </button>
      <button style="margin-top:8px" @click="changeToMultipleWidth">
        高宽不同
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      url: "",
      index: 0,
      scale: 2,
      type: "square",
      showType: false,
      changeImgPosition: false,
      width: 168,
      imgList: [
        "https://bpic.588ku.com/illus_water_img/18/07/30/f3c7060bc28216271dc8c4630b288331.jpg!/watermark/url/L3dhdGVyL3dhdGVyX2JhY2tfNDAwXzIwMC5wbmc=/repeat/true",
        "https://bpic.588ku.com/illus_water_img/18/08/21/64d2b3b02352b00dd668b705fd8af276.jpg!/watermark/url/L3dhdGVyL3dhdGVyX2JhY2tfNDAwXzIwMC5wbmc=/repeat/true",
        "https://bpic.588ku.com/illus_water_img/18/08/18/472f21d353b64c95b9994be6ed3b7274.jpg!/watermark/url/L3dhdGVyL3dhdGVyX2JhY2tfNDAwXzIwMC5wbmc=/repeat/true"
      ],
      taobao: false,
      height: -1
    };
  },
  created() {
    this.url = this.imgList[this.index];
  },
  methods: {
    addSelectorWidth() {
      this.width += 20;
    },
    subSelectorWidth() {
      this.width -= 20;
    },
    addScale() {
      this.scale += 0.5;
    },
    subScale() {
      this.scale -= 0.5;
    },
    changeType() {
      this.type = this.type === "circle" ? "square" : "circle";
    },
    changeImg() {
      this.index = this.index > this.imgList.length - 2 ? -1 : this.index;
      this.url = this.imgList[++this.index];
    },
    changeShowType() {
      this.showType = !this.showType;
    },
    changeToTaobao() {
      this.taobao = !this.taobao;
      this.showType = true;
    },
    changeToMultipleWidth() {
      this.height = this.height === -1 ? 99 : -1;
    }
  }
};
</script>

<style>
.ks-imagezoom-wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(//gtms01.alicdn.com/tps/i4/T12pdtXaldXXXXXXXX-2-2.png) repeat
    scroll 0 0 transparent;
  cursor: move;
  z-index: 1;
  font-size: 0;
}
</style>
