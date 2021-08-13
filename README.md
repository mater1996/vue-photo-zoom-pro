# vue-photo-zoom-pro

> Vue picture magnifying glass

![example](https://raw.githubusercontent.com/Mater1996/vue-photo-zoom-pro/master/example.png)

## DEMO

[demo](https://codepen.io/xbup/project/full/AjnEgE)

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

\*.vue

```html
<vue-photo-zoom-pro>
  <img
    src="https://bpic.588ku.com/illus_water_img/18/07/30/f3c7060bc28216271dc8c4630b288331.jpg"
  />
</vue-photo-zoom-pro>
```

or

```html
<vue-photo-zoom-pro
  high-url="https://bpic.588ku.com/illus_water_img/18/07/30/f3c7060bc28216271dc8c4630b288331.jpg"
>
  <div style="width:100px; height: 200px"></div>
</vue-photo-zoom-pro>
```

or 
```html
<vue-photo-zoom-pro
  high-url="https://bpic.588ku.com/illus_water_img/18/07/30/f3c7060bc28216271dc8c4630b288331.jpg"
>
  <canvas width="100" height="200" style="width:100px; height: 200px"></canvas>
</vue-photo-zoom-pro>
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
| mask              | Boolean        | true    | show mask                                             |
| mask-color        | Color          | {}      | mask c                                                |
| enter-event       | Object/UIEvent | null    | custom enter event                                    |
| move-event        | Object/UIEvent | null    | custom move event                                     |
| leave-event       | Object/UIEvent | null    | custom leave event                                    |
| disabled-reactive | Boolean        | false   |                                                       |

#### Slot

| Slot Name | Note              |
| --------- | ----------------- |
| default   | default slot      |
| zoomer    | inner zoomer slot |
| outzoomer | out zoomer slot   |

#### Event

| Event Name | Note              | value |
| ---------- | ----------------- | ----- |
| created    | created event     | img   |
| mouseenter | mouse enter event |       |
| mousemove  | mouse move event  |       |
| mouseleave | mouse leave event |       |

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:5000
npm run dev & npm run serve

# build for production with minification
npm run build
```

## Feature

- rollup build
- 支持无图放大
- canvas zoomer
- 支持旋转

## CHANGELOG

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2018-present, Mater1996
