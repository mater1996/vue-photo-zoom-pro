---
sidebar: auto
sidebarDepth: 2
---

# 指南

## 安装

### npm

```js
npm install vue-photo-zoom-pro

# or
yarn add vue-photo-zoom-pro
```

```js
import vuePhotoZoomPro from 'vue-photo-zoom-pro'
import 'vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css'

export default {
  components: {
    vuePhotoZoomPro,
  },
}
```

### cdn

```html
<script src="https://cdn.jsdelivr.net/npm/vue-photo-zoom-pro/dist/vue-photo-zoom-pro.global.js"></script>
<link
  rel="stylesheet"
  type="text/css"
  href="https://cdn.jsdelivr.net/npm/vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css"
/>
```

```js
new Vue({
  el: '#app',
  components: {
    vuePhotoZoomPro: VuePhotoZoomPro.default
  }
}
```

## 使用

### 图片

```html
<vue-photo-zoom-pro :url="imgUrl" :high-url="imgHighUrl"></vue-photo-zoom-pro>
```

### 自定义图片

```html
<vue-photo-zoom-pro :high-url="imgHighUrl">
  <img :src="imgUrl" style="height:200px" />
</vue-photo-zoom-pro>
```

> Tips: 如果图片在开始没有加载完毕并且设置`disabled-reactive`为 true 的话，组件拿到的默认高度是 0，这时候需要在创建组件前加载图片或者给图片默认的高度。

```html
<vue-photo-zoom-pro v-if="loaded" :high-url="imgHighUrl" disabled-reactive>
  <img :src="imgUrl" style="height:200px" />
</vue-photo-zoom-pro>
```

```js
export deafult{
  data(){
    return {
      loaded: false,
      imgUrl: ''
    }
  },
  created(){
    const img = new Image()
    img.src = imgUrl
    img.addEventListener('load', ()=>{
      this.loaded = true
    })
  }
}
```

### 自定义预览区域

使用其它元素来作为放大区域。

```html
<vue-photo-zoom-pro :high-url="imgHighUrl">
  <div style="width:100px; height: 200px"></div>
</vue-photo-zoom-pro>
```

### 自定义缩放区域

```html
<vue-photo-zoom-pro>
  <template slot="zoomer">
    <!-- Is the same as the canvas-1 -->
    <canvas id="canvas-2" width="100" height="100"></canvas>
  </template>
  <canvas id="canvas-1" width="100" height="100"></canvas>
</vue-photo-zoom-pro>
```

```js
const canvas1 = document.querySelector('#canvas-1')
const canvas2 = document.querySelector('#canvas-2')
const ctx1 = canvas1.getContext('2d')
const ctx2 = canvas2.getContext('2d')

const offscreenCanvas = document.createElement('canvas')
const ctx = offscreenCanvas.getContext('2d')
offscreenCanvas.width = 100
offscreenCanvas.height = 100

ctx.font = '30px Arial'
ctx.fillText('Hello World', 10, 50)

ctx1.drawImage(offscreenCanvas, 0, 0)
ctx2.drawImage(offscreenCanvas, 0, 0)
```
