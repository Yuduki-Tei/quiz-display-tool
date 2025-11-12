<template>
  <el-tooltip
    v-if="title"
    :content="title"
    :show-after="tooltipDelay"
    :placement="tooltipPlacement"
  >
    <el-button
      v-bind="buttonProps"
      :class="[icon && !slots.default ? 'icon-only-btn' : '', $attrs.class]"
      plain
    >
      <Icon v-if="icon" :name="icon" :size="String(iconSize)" />
      <slot v-if="!icon" />
    </el-button>
  </el-tooltip>
  <el-button
    v-else
    v-bind="buttonProps"
    :class="[icon && !slots.default ? 'icon-only-btn' : '', $attrs.class]"
    plain
  >
    <Icon v-if="icon" :name="icon" :size="String(iconSize)" />
    <slot v-if="!icon" />
  </el-button>
</template>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from "vue";
import Icon from "@/components/Icon.vue";

const props = withDefaults(
  defineProps<{
    icon?: string | null;
    iconSize?: string | number;
    type?: string;
    size?: string;
    circle?: boolean;
    plain?: boolean;
    title?: string;
    tooltipDelay?: number;
    tooltipPlacement?:
      | "top"
      | "top-start"
      | "top-end"
      | "bottom"
      | "bottom-start"
      | "bottom-end"
      | "left"
      | "left-start"
      | "left-end"
      | "right"
      | "right-start"
      | "right-end";
  }>(),
  {
    icon: null,
    iconSize: "20",
    type: "default",
    size: "default",
    circle: false,
    title: undefined,
    tooltipDelay: 300,
    tooltipPlacement: "bottom",
  }
);

const $attrs = useAttrs();
const slots = useSlots();

const buttonProps = computed(() => {
  const attrs = { ...$attrs };
  // Remove title from attrs to prevent native tooltip
  delete attrs.title;

  if (!attrs.role) {
    attrs.role = "button";
  }

  return {
    type: props.type,
    size: props.size,
    circle: props.circle,
    plain: props.plain,
    ...attrs,
  };
});
</script>

<style scoped>
.icon-only-btn {
  padding: 0 8px;
  display: flex;
}
</style>
