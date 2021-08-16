# vue-photo-zoom-pro

> Vue picture magnifying glass

![example](https://raw.githubusercontent.com/Mater1996/vue-photo-zoom-pro/master/example.png)

English | [简体中文](./README-zh_CN.md)

## DEMO

[demo](https://mater1996.github.io/vue-photo-zoom-pro/example/)

## Usage example

```js

npm install vue-photo-zoom-pro

```

main.js

```js
import vuePhotoZoomPro from 'vue-photo-zoom-pro'

export default {
  components: {
    vuePhotoZoomPro
  }
}
```

or cdn

```html
<script src="https://cdn.jsdelivr.net/npm/vue-photo-zoom-pro/dist/vue-photo-zoom-pro.global.js"></script>
```

\*.vue

### Image

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

### Customize the enlarged area

You can use any element to represent the enlarged area

```html
<vue-photo-zoom-pro :high-url="imgSrc">
  <div style="width:100px; height: 200px"></div>
</vue-photo-zoom-pro>
```

### Customize magnified elements

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

### Settings

#### props

| Prop Name         | Type           | Default | Note                                                  |
| ----------------- | -------------- | ------- | ----------------------------------------------------- |
| high-url          | String         |         | Clearer picture url                                   |
| scale             | Number         | 2       | magnification                                         |
| disabled          | Boolean        | false   | disabled move                                         |
| width             | Number         | 166     | The width of the magnified area                       |
| height            | Number         | -1      | The height of the magnified area                      |
| type              | String         | square  | magnifying glass type (circle,square)                 |
| selector          | Boolean        | true    | show or remove selector                               |
| out-zoomer        | Boolean        | false   | amplification region will be displayed on the outside |
| mask              | Boolean        | false   | show mask                                             |
| mask-color        | Color          | {}      | mask c                                                |
| enter-event       | Object/UIEvent | null    | custom enter event                                    |
| move-event        | Object/UIEvent | null    | custom move event                                     |
| leave-event       | Object/UIEvent | null    | custom leave event                                    |
| disabled-reactive | Boolean        | false   | Disable listening for internal element info changes   |

#### Slot

| Slot Name | Note              |
| --------- | ----------------- |
| default   | default slot      |
| selector  | selector slot     |
| zoomer    | inner zoomer slot |
| outzoomer | out zoomer slot   |

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
