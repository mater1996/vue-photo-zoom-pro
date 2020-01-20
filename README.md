# vue-photo-zoom-pro

> Vue(2.x) 图片放大器(Photoloupe)

![example](https://raw.githubusercontent.com/Mater1996/vue-photo-zoom-pro/master/example.png)

## DEMO

[demo](https://codepen.io/xbup/project/full/AjnEgE)

## Usage example

```js

npm install vue-photo-zoom-pro

```

main.js

```js
import VuePhotoZoomPro from "vue-photo-zoom-pro";

Vue.use(VuePhotoZoomPro);
```

\*.vue

```html
<vue-photo-zoom-pro
  url="https://bpic.588ku.com/illus_water_img/18/07/30/f3c7060bc28216271dc8c4630b288331.jpg!/watermark/url/L3dhdGVyL3dhdGVyX2JhY2tfNDAwXzIwMC5wbmc=/repeat/true"
></vue-photo-zoom-pro>
```

### Settings

#### props

| Prop Name       | Type              | Default | Note                                                                                                                                             |
| ----------- | ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| url         | String            |         | 图片地址(photo url)                                                                                                                              |
| high-url    | String            |         | 更清晰的图片,若不提供会采用 url(more detailed photo url)                                                                                         |
| scale       | Number            | 2       | 放大倍数(scale number)                                                                                                                                  |
| disabled| Boolean | false    | 禁用 |
| width       | Number            | 166     | 内部放大区域宽度(width of internal amplification region)                                                                                                            |
| height      | Number            | -1     | 内部放大区域高度，如果不设置或者小于0会和宽度保持同步(height of internal amplification region)                                                                                                            |
| type        | String            | square  | 放大镜类型(circle,square)(magnifying glass type (circle,square))                                                                                 |
| zoomer-style  | Object            | {}      | 内部放大区域样式(style of internal amplification region)                                                                                                            |
| out-zoomer-style  | Object            | {}  | 外部放大区域样式(style of external amplification region)                                                                                                            |
| selector   | Boolean           | true   | 是否显示选择器(show or remove selector)                                                                                            |
| out-zoomer    | Boolean           | false    | 切换内外部放大镜(amplification region will be displayed on the outside)                                                                                 |
| pointer     | Boolean           | false   | 外部区域的中心点 (the center of an external area)                                                                                                |
| baseline    | Boolean           | false   | 外部区域的基线 (the baseline of the external area)                                                                                               |
| enter-event | Object/UIEvent | null    | 当需要在外部监听鼠标移入事件时，请通过该字段传入事件(When you need to listen for enter events outside the component)                               |
| move-event  | Object/UIEvent | null    | 当需要在外部监听移动事件时,请通过该字段传入事件（必须包含 pageX,pageY,clientY），这将禁用内部移动监听(when you need to listen for moving events outside the component) |
| leave-event | Object/UIEvent | null    | 当需要在外部监听离开事件时，请通过该字段传入事件(When you need to listen for leaving events outside the component)                               |
| disabled-reactive| Boolean | false    | 禁用响应式，不会轮询图像的位置,在确定不改变布局的情况下使用可以提升性能 |

#### Slot

| Slot Name | Note                                                               |
| ---- | ------------------------------------------------------------------ |
| default | 默认区域(default) |
| zoomer | 内部放大区域 |
| outzoomer| 外部放大区域 |

#### Method

| Method Name | Note                                |
| ------ | ----------------------------------- |
| reset  | 重置放大镜位置(reset zoom position) |

#### Event

| Event Name  | Note                               | event                                       |
| ------- | ---------------------------------- | ------------------------------------------- |
| created | 图片放大镜创建(photo-zoom created) | 图像属性(img rect{top,left,width,height}),图像元素(img element) |
| mouseenter | 鼠标移入事件 |  |
| mousemove | 鼠标移动事件 |  |
| mouseleave | 鼠标移出事件 |  |

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2018-present, Mater1996
