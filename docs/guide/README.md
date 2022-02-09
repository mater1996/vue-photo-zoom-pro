---
sidebar: auto
sidebarDepth: 2
---

# Guide

## Install

### npm

```js
npm install vue-photo-zoom-pro

# or
yarn add vue-photo-zoom-pro
```

```js
import VuePhotoZoomPro from 'vue-photo-zoom-pro'
import 'vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css'

export default {
  components: {
    VuePhotoZoomPro,
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

## Usage

### Image

```html
<vue-photo-zoom-pro :url="imgUrl" :high-url="imgHighUrl"> </vue-photo-zoom-pro>
```

### Customize Image

```html
<vue-photo-zoom-pro :high-url="imgHighUrl">
  <img :src="imgUrl" style="height:200px" />
</vue-photo-zoom-pro>
```

> Tips: If your image is not loaded at the beginning and set `disabled-reactive`, you must manually listen for the event when the image is loaded before displaying it.

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

### Customize preview area

You can use any element to represent the preview area.

```html
<vue-photo-zoom-pro :high-url="imgHighUrl">
  <div style="width:100px; height: 200px"></div>
</vue-photo-zoom-pro>
```

### Customize zoom area

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