<template>
  <div id="app">
    <ImageProvider v-slot="{ imageState }">
      <ImageZoomerManager :imageState="imageState" />
    </ImageProvider>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ImageProvider from './components/ImageProvider.vue';
import ImageZoomerManager from './components/ImageZoomer/ImageZoomerManager.vue';

export default defineComponent({
  name: 'App',
  components: {
    ImageProvider,
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
