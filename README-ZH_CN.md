# vue-photo-zoom-pro

> Vue 图片放大器

![example](https://raw.githubusercontent.com/Mater1996/vue-photo-zoom-pro/master/example.png)

## 在线示例

[demo](https://mater1996.github.io/vue-photo-zoom-pro/example/)

## 安装

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

或者使用 cdn

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

## 设置

### 属性

| Prop Name         | Type                           | Default         | Note                                              |
| ----------------- | ------------------------------ | --------------- | ------------------------------------------------- |
| url               | String                         | ''              | 图片                                              |
| high-url          | String                         | ''              | 更加清晰的图片                                    |
| scale             | Number                         | 2               | magnification                                     |
| disabled          | Boolean                        | false           | 禁用鼠标事件 move                                 |
| width             | Number                         | 166             | 放大器的宽度                                      |
| height            | Number                         | -1              | 放大器的高度                                      |
| type              | String                         | square          | 放大器的类型 (circle,square)                      |
| selector          | Boolean / { release: Boolean } | true            | 是否显示放大器, release: 选择器是否限制在预览区域内 |
| out-zoomer        | Boolean / { sticky: Boolean }  | false           | 缩放区域会展示在外面                              |
| mask              | Boolean                        | false           | 是否显示遮罩 mask                                 |
| mask-color        | Color                          | rgba(0,0,0,0.4) | 遮罩颜色                                          |
| enter-event       | Object/UIEvent                 | null            | 自定义的鼠标进入事件(例如移动端的进入事件)        |
| move-event        | Object/UIEvent                 | null            | 自定义的鼠标移动事件                              |
| leave-event       | Object/UIEvent                 | null            | 自定义的鼠标移出事件                              |
| disabled-reactive | Boolean                        | false           | 禁用监听子元素宽高变化                            |

### Slot

| Slot Name | Note     |
| --------- | -------- |
| default   | 默认     |
| selector  | 选择器   |
| zoomer    | 放大区域 |

### 事件

| Event Name | Note         | value |
| ---------- | ------------ | ----- |
| created    | 创建成功事件 |       |
| mouseenter | 鼠标移入     |       |
| mousemove  | 鼠标移动     |       |
| mouseleave | 鼠标移出     |       |

### 方法

| Method Name | Note | value |
| ----------- | ---- | ----- |
| update      | 更新 |       |

## 插件

`vue-photo-zoom-pro` 使用插件来支持特殊的功能。

### ImgPlugin

使用 img 预览图片以及缩放图片。

```js
import { ImgZoomer, ImgPreview } from 'vue-photo-zoom-pro'

export default {
  components: {
    ImgPreview,
    ImgZoomer,
  },
}
```

或者使用 cdn

```js
new Vue({
  el: '#app',
  components: {
    ImgPreview: VuePhotoZoomPro.ImgPreview,
    ImgZoomer: VuePhotoZoomPro.ImgZoomer,
  },
})
```

```html
<template>
  <vue-photo-zoom-pro>
    <img-preview :url="imgUrl"></img-preview>
    <template slot="zoomer">
      <img-zoomer :url="imgHighUrl"></img-zoomer>
    </template>
  </vue-photo-zoom-pro>
  <!-- 
    和 <vue-photo-zoom-pro :url="imgUrl" :high-url="imgHighUrl"> 的效果相同
  -->
</template>
```

### CanvasPlugin

使用 canvas 预览和缩放图片, 支持旋转图片。

```js
import { CanvasZoomer, CanvasPreview } from 'vue-photo-zoom-pro'

export default {
  components: {
    CanvasPreview,
    CanvasZoomer,
  },
}
```

或者使用 cdn

```js
new Vue({
  el: '#app',
  components: {
    CanvasPreview: VuePhotoZoomPro.CanvasPreview,
    CanvasZoomer: VuePhotoZoomPro.CanvasZoomer,
  },
})
```

```html
<template>
  <vue-photo-zoom-pro>
    <canvas-preview :url="imgUrl" width="960" height="480"></canvas-preview>
    <template slot="zoomer">
      <canvas-zoomer :url="imgHighUrl" width="960" height="480"></canvas-zoomer>
    </template>
  </vue-photo-zoom-pro>
</template>
```

#### canvasPreview props

| Prop Name | Type   | Default | Note      |
| --------- | ------ | ------- | --------- |
| url       | String | ''      | 图片      |
| width     | Number | 图片宽  | canvas 宽 |
| height    | Number | 图片高  | canvas 高 |
| rotate    | Number | 0       | 旋转角度  |

#### canvasZoomer props

| Prop Name | Type   | Default | Note           |
| --------- | ------ | ------- | -------------- |
| url       | String | ''      | 更加清晰的图片 |
| width     | Number | 图片宽  | canvas 宽      |
| height    | Number | 图片高  | canvas 高      |
| rotate    | Number | 0       | 旋转角度       |

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:5000
npm run dev & npm run serve

# build for production with minification
npm run build
```

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2018-present, mater1996
