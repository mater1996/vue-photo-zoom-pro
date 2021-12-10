<template>
  <img
    class="img-region"
    style="display: block;"
    :src="url"
  >
</template>

<script>
export default {
  name: 'ImgRegion',
  props: {
    url: {
      type: String,
      default: ''
    }
  }
}
</script>
