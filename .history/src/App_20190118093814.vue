<template>
  <div id="app">
    <div
      v-if="changeImgPosition"
      style="width:100px"
    ></div>
    <div style="width:60%">
      <vue-photo-zoom-pro
        :width="width"
        :url="url"
        :type="type"
        :scale="scale"
        :out-show="showType"
      ></vue-photo-zoom-pro>
    </div>
    <p>当前放大倍数：{{scale}}</p>
    <button @click="addSelectorWidth">增加放大器宽度</button>
    <button @click="subSelectorWidth">减小放大器宽度</button>
    <button @click="changeImgPosition = !changeImgPosition">改变图片位置</button>
    <button @click="addScale">增加放大倍数</button>
    <button @click="subScale">减小放大倍数</button>
    <button @click="changeImg">更换图片</button>
    <button @click="changeType">更换放大镜类型</button>
    <button @click="changeShowType">更换放大方式</button>
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
      type: "circle",
      showType: false,
      changeImgPosition: false,
      width: 168,
      imgList: [
        "https://bpic.588ku.com/illus_water_img/18/07/30/f3c7060bc28216271dc8c4630b288331.jpg!/watermark/url/L3dhdGVyL3dhdGVyX2JhY2tfNDAwXzIwMC5wbmc=/repeat/true",
        "https://bpic.588ku.com/illus_water_img/18/08/21/64d2b3b02352b00dd668b705fd8af276.jpg!/watermark/url/L3dhdGVyL3dhdGVyX2JhY2tfNDAwXzIwMC5wbmc=/repeat/true",
        "https://bpic.588ku.com/illus_water_img/18/08/18/472f21d353b64c95b9994be6ed3b7274.jpg!/watermark/url/L3dhdGVyL3dhdGVyX2JhY2tfNDAwXzIwMC5wbmc=/repeat/true"
      ]
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
    }
  }
};
</script>

<style>
</style>
