<template></template>

<script setup lang="ts">
import { watch } from "vue";
import { ElMessage, ElNotification } from "element-plus";

const props = defineProps<{
  status: string | null;
  timestamp: number | null;
  displayType?: "message" | "notification";
}>();

const capitalize = (s: string): string => {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

watch(
  () => props.timestamp,
  (newTimestamp) => {
    if (!newTimestamp || !props.status) {
      return;
    }

    let message = "";
    let level: "success" | "warning" | "error" | "info" = "info";

    switch (props.status) {
      case "added":
        message = "圖片已載入";
        level = "success";
        break;
      case "updated":
        message = "相同圖片已存在";
        level = "warning";
        break;
      case "error":
        message = "載入圖片失敗";
        level = "error";
        break;
      default:
        console.warn(`Unknown notification status: ${props.status}`);
    }

    const finalDisplayType = props.displayType || "message";

    if (finalDisplayType === "message") {
      ElMessage({
        message,
        type: level,
        duration: 2000,
      });
    } else {
      ElNotification({
        title: capitalize(level),
        message,
        type: level,
        duration: 4500,
      });
    }
  }
);
</script>
