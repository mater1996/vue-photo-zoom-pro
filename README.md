# vue-photo-zoom-pro

> Vue picture magnifying glass

![example](https://raw.githubusercontent.com/Mater1996/vue-photo-zoom-pro/master/example.png)

English | [简体中文](./README-ZH_CN.md)

## DEMO

[demo](https://mater1996.github.io/vue-photo-zoom-pro/example/)

## Install

```js
npm install vue-photo-zoom-pro

# or
yarn add vue-photo-zoom-pro
```

main.js

```js
import VuePhotoZoomPro from 'vue-photo-zoom-pro'
import 'vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css'

export default {
  components: {
    VuePhotoZoomPro
  }
}
```

or cdn

```html
<script src="https://cdn.jsdelivr.net/npm/vue-photo-zoom-pro/dist/vue-photo-zoom-pro.global.js"></script>
<link
  rel="stylesheet"
  type="text/css"
  href="https://cdn.jsdelivr.net/npm/vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css"
/>
```

```js
export default {
  components: {
    VuePhotoZoomPro: window.VuePhotoZoomPro
  }
}
```

## Usage example

### Image

```html
<vue-photo-zoom-pro :url="imgSrc" :high-url="imgHighSrc"> </vue-photo-zoom-pro>
```

### Custom Image

```html
<vue-photo-zoom-pro :high-url="imgSrc">
  <img :src="imgSrc" />
</vue-photo-zoom-pro>
```

> Tips: If your image is not loaded at the beginning and set `disabled-reactive`, you must manually listen for the event when the image is loaded before displaying it

```html
<vue-photo-zoom-pro v-if="loaded" :high-url="imgSrc">
  <img :src="imgSrc" />
</vue-photo-zoom-pro>
```

```js
export deafult{
  data(){
    return {
      loaded: false,
      imgSrc: ''
    }
  },
  created(){
    const img = new Image()
    img.src = imgSrc
    img.addEventListener('load', ()=>{
      this.loaded = true
    })
  }
}
```

### Customize preview area

You can use any element to represent the preview area

```html
<vue-photo-zoom-pro :high-url="imgSrc">
  <div style="width:100px; height: 200px"></div>
</vue-photo-zoom-pro>
```

### Customize zoomer

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
const ctx = c.getContext('2d')
offscreenCanvas.width = 100
offscreenCanvas.height = 100

ctx.font = '30px Arial'
ctx.fillText('Hello World', 10, 50)

ctx1.drawImage(offscreenCanvas, 0, 0)
ctx2.drawImage(offscreenCanvas, 0, 0)
```

### Plugins

#### ImgPlugin

Preview and zoom image using img

```js
import { ImgZoomer, ImgPreview } from 'vue-photo-zoom-pro/img'

export default {
  components: {
    ImgPreview,
    ImgZoomer
  }
}
```

or cdn

```html
<script src="https://cdn.jsdelivr.net/npm/vue-photo-zoom-pro/dist/img.global.js"></script>
```

```js
export default {
  components: {
    ImgPreview: VuePhotoZoomProPluginImg.ImgPreview,
    ImgZoomer: VuePhotoZoomProPluginImg.ImgZoomer
  }
}
```

```html
<template>
  <vue-photo-zoom-pro>
    <img-preview :url="imgSrc"></img-preview>
    <template>
      <img-zoomer :url="imgHighSrc"></img-zoomer>
    </template>
  </vue-photo-zoom-pro>
  <!-- 
    same as <vue-photo-zoom-pro :url="imgSrc" :high-url="imgHighSrc">
  -->
</template>
```

#### CanvasPlugin

Preview and zoom image using canvas

```js
import { CanvasZoomer, CanvasPreview } from 'vue-photo-zoom-pro/canvas'

export default {
  components: {
    CanvasPreview,
    CanvasZoomer
  }
}
```

or cdn

```html
<script src="https://cdn.jsdelivr.net/npm/vue-photo-zoom-pro/dist/canvas.global.js"></script>
```

```js
export default {
  components: {
    CanvasPreview: VuePhotoZoomProPluginCanvas.CanvasPreview,
    CanvasZoomer: VuePhotoZoomProPluginCanvas.CanvasZoomer
  }
}
```

```html
<template>
  <vue-photo-zoom-pro>
    <canvas-preview :url="imgSrc" width="960" height="480"></canvas-preview>
    <template>
      <canvas-zoomer :url="imgHighSrc" width="960" height="480"></canvas-zoomer>
    </template>
  </vue-photo-zoom-pro>
</template>
```

##### canvasPreview props

| Prop Name | Type   | Default    | Note           |
| --------- | ------ | ---------- | -------------- |
| url       | String | ''         | img url        |
| width     | Number | Img width  | canvas width   |
| height    | Number | Img height | canvas height  |
| rotate    | Number | 0          | Rotation Angle |

##### canvasZoom props

| Prop Name | Type   | Default    | Note           |
| --------- | ------ | ---------- | -------------- |
| url       | String | ''         | High img url   |
| width     | Number | Img width  | Canvas width   |
| height    | Number | Img height | Canvas height  |
| rotate    | Number | 0          | Rotation Angle |

### Settings

#### props

| Prop Name         | Type           | Default | Note                                                |
| ----------------- | -------------- | ------- | --------------------------------------------------- |
| high-url          | String         |         | Clearer picture url                                 |
| scale             | Number         | 2       | magnification                                       |
| disabled          | Boolean        | false   | disabled move                                       |
| width             | Number         | 166     | The width of the magnified area                     |
| height            | Number         | -1      | The height of the magnified area                    |
| type              | String         | square  | magnifying glass type (circle,square)               |
| selector          | Boolean        | true    | show or remove selector                             |
| mask              | Boolean        | false   | show mask                                           |
| mask-color        | Color          | {}      | mask color                                          |
| enter-event       | Object/UIEvent | null    | custom enter event                                  |
| move-event        | Object/UIEvent | null    | custom move event                                   |
| leave-event       | Object/UIEvent | null    | custom leave event                                  |
| disabled-reactive | Boolean        | false   | Disable listening for internal element info changes |

#### Slot

| Slot Name | Note                      |
| --------- | ------------------------- |
| default   | default slot              |
| selector  | selector slot             |
| zoomer    | inner and out zoomer slot |

#### Event

| Event Name | Note              | value |
| ---------- | ----------------- | ----- |
| created    | created event     |       |
| mouseenter | mouse enter event |       |
| mousemove  | mouse move event  |       |
| mouseleave | mouse leave event |       |

#### Methods

| Method Name | Note   | value |
| ----------- | ------ | ----- |
| update      | update |       |

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
