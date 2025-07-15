<template>
  <div class="phosphor-icon" :style="iconStyle">
    <component :is="iconComponent" :weight="weight" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import * as PhosphorIcons from "@phosphor-icons/vue";

const props = withDefaults(
  defineProps<{
    size?: string | null;
    name: string;
    weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  }>(),
  {
    size: "20",
    name: "Plus",
    weight: "regular",
  }
);

const iconStyle = computed(() => ({
  fontSize: props.size ? `${props.size}px` : "20px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
}));

const iconComponent = computed(() => {
  return PhosphorIcons[props.name];
});
</script>

<style scoped>
.phosphor-icon {
  line-height: 1;
  display: inline-flex;
  vertical-align: middle;
}
</style>
