<!--
 * @author: Mater
 * @Email: bxh8640@gmail.com
 * @Date: 2021-08-11 11:44:54
 * @Description:
-->
<template>
  <div
    class="zoomer"
    :style="zoomerStyle"
  >
    <div
      class="position"
      :style="positionStyle"
    >
      <img
        :src="url"
        :style="imgStyle"
      >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VuePhotoZoomProZoomer',
  props: {
    url: {
      type: String,
      default: ''
    },
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    },
    scale: {
      type: Number,
      default: 2
    },
    scaleWidth: {
      type: Number,
      default: 0
    },
    scaleHeight: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    ;
  }
}
</script>

<style lang="scss" scoped>
.zoomer {
  overflow: hidden;
  img {
    display: block;
    transform-origin: left top;
  }
}
</style>
