<template></template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { NotificationData } from "@/@types/types";

export default defineComponent({
  name: "Notifier",
  props: {
    noti: {
      type: Object as () => NotificationData,
      required: true,
    },
  },
  setup(props) {
    const capitalize = (s: string): string => {
      if (!s) return "";
      return s.charAt(0).toUpperCase() + s.slice(1);
    };

    watch(
      () => props.noti.timestamp,
      (newTimestamp) => {
        if (!props.noti.message || !newTimestamp) {
          return;
        }

        if (props.noti.displayType === "message") {
          ElMessage({
            message: props.noti.message,
            type: props.noti.level,
            duration: 2000,
          });
        } else {
          ElNotification({
            title: capitalize(props.noti.level),
            message: props.noti.message,
            type: props.noti.level,
            duration: 4500,
          });
        }
      }
    );
  },
});
</script>
