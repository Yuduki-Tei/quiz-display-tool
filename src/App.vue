<template>
  <div id="app">
    <ZoomerManager />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ZoomerManager from "./features/Zoomer/ZoomerManager.vue";

export default defineComponent({
  name: "App",
  components: {
    ZoomerManager,
  },
});
</script>

<style>
body {
  background: #181818;
  color: #fff;
}
</style>
