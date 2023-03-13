<template>
  <img
    class="img-preview"
    style="display: block;width: 100%"
    :src="url"
    v-bind="$attrs"
  >
</template>

<script>
export default {
  name: 'ImgPreview',
  props: {
    url: {
      type: String,
      default: ''
    }
  }
}
</script>
