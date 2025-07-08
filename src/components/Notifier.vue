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
}>();

const capitalize = (s: string): string => {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const messageMap: Record<
  string,
  {
    message: string;
    level: "success" | "warning" | "error" | "info";
    mode?: "confirm" | "message" | "notification";
    title?: string;
  }
> = {
  added: { message: "圖片已載入", level: "success" },
  updated: { message: "相同圖片已存在", level: "warning" },
  error: { message: "載入圖片失敗", level: "error" },
  exported: { message: "匯出成功", level: "success" },
  imported: { message: "匯入成功", level: "success" },
  cancel: { message: "已取消操作", level: "info" },
  "export-confirm": {
    message: "有部分圖片尚未框選區域。是否要為這些圖片隨機選取一塊區域？",
    level: "warning",
    mode: "confirm",
    title: "確認",
  },
};

watch(
  () => props.timestamp,
  async (newTimestamp) => {
    if (!newTimestamp || !props.status) {
      return;
    }
    const config = messageMap[props.status] || {
      message: props.status,
      level: "info",
    };
    if (config.mode === "confirm") {
      try {
        await ElMessageBox.confirm(config.message, config.title || "確認", {
          type: config.level,
        });
        emit("confirm", true);
      } catch {
        emit("confirm", false);
      }
      return;
    }
    if (config.mode === "notification") {
      ElNotification({
        title: capitalize(config.level),
        message: config.message,
        type: config.level,
        duration: 4500,
      });
    } else {
      ElMessage({
        message: config.message,
        type: config.level,
        duration: 2000,
      });
    }
  }
);
</script>
