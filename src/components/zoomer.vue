<!--
 * @author: Mater
 * @Email: bxh8640@gmail.com
 * @Date: 2021-08-10 10:23:09
 * @Description:
-->
<template>
  <div
    class="zoomer"
    :style="innerZoomerStyle"
  >
    <slot />
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
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    }
  },
  computed: {
    innerZoomerStyle () {
      return {
        backgroundImage: `url('${this.url}')`,
        backgroundPosition: `${this.left}px ${this.top}px`,
        backgroundSize: `${this.width}px ${this.height}px`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inner-zoomer {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
}
</style>
