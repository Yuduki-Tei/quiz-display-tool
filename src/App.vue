<template>
  <div id="app">
    <ImageZoomerManager />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ImageZoomerManager from './features/ImageZoomer/ImageZoomerManager.vue';

export default defineComponent({
  name: 'App',
  components: {
    ImageZoomerManager
  }
});
</script>

<style>
body {
  background: #181818;
  color: #fff;
}
</style>
