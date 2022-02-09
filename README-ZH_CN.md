# vue-photo-zoom-pro

> Vue 图片放大镜

![example](https://raw.githubusercontent.com/Mater1996/vue-photo-zoom-pro/master/example.png)

## 安装

```js
npm install vue-photo-zoom-pro

# or
yarn add vue-photo-zoom-pro
```

## 使用

```vue
<template>
  <vue-photo-zoom-pro :url="imgUrl" :high-url="imgHighUrl"></vue-photo-zoom-pro>
</template>

<script>
import vuePhotoZoomPro from 'vue-photo-zoom-pro'
import 'vue-photo-zoom-pro/dist/style/vue-photo-zoom-pro.css'

export default {
  components: {
    vuePhotoZoomPro,
  },
}
</script>
```

## 文档

查看文档 [https://mater1996.github.io/vue-photo-zoom-pro/docs/guide/](https://mater1996.github.io/vue-photo-zoom-pro/docs/guide/).

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2018-present, mater1996
