<template></template>

<script setup lang="ts">
import { watch } from "vue";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";

const emit = defineEmits<{
  (e: "confirm", result: boolean): void;
}>();

const props = defineProps<{
  status?: string | null;
  timestamp?: number | null;
  displayType?: "message" | "notification";
  mode?: "message" | "confirm";
  confirmOptions?: {
    message: string;
    title?: string;
    type?: "warning" | "info" | "success" | "error";
  };
}>();

const capitalize = (s: string): string => {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

watch(
  () => props.timestamp,
  async (newTimestamp) => {
    if (props.mode === "confirm" && props.confirmOptions && newTimestamp) {
      try {
        await ElMessageBox.confirm(
          props.confirmOptions.message,
          props.confirmOptions.title || "確認",
          { type: props.confirmOptions.type || "warning" }
        );
        emit("confirm", true);
      } catch {
        emit("confirm", false);
      }
      return;
    }
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
      case "exported":
        message = "匯出成功";
        level = "success";
        break;
      case "imported":
        message = "匯入成功";
        level = "success";
        break;
      case "cancel":
        message = "已取消操作";
        level = "info";
        break;
      case "export-confirm":
        message = "有部分圖片尚未框選區域。是否要為這些圖片隨機選取一塊區域？";
        level = "warning";
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
