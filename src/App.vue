<template>
  <div id="app">
    <ImageZoomer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ImageZoomer from './components/ImageZoomer.vue';

export default defineComponent({
  name: 'App',
  components: {
    ImageZoomer
  }
});
</script>

<style>
body {
  background: #181818;
  color: #fff;
}
</style>
