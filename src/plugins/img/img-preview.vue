<template>
  <img
    class="img-region"
    style="display: block;width: 100%"
    :src="url"
    v-bind="$attrs"
    v-on="$listeners"
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
