# 插件

## ImgPlugin

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

## CanvasPlugin

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