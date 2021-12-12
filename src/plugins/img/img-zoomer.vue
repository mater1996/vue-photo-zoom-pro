<template>
  <img
    class="img-zoomer"
    style="display: block; width: 100%; height: 100%"
    :src="url"
    v-bind="$attrs"
    v-on="$listeners"
  >
</template>

<script>
export default {
  name: 'ImgZoomer',
  props: {
    url: {
      type: String,
      default: ''
    }
  }
}
</script>
