import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import type { NotifierOptions } from "@/@types/types";

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
    message: "有部分圖片尚未框選區域。是否要為這些圖片隨機選取一塊區域後匯出？",
    level: "warning",
    mode: "confirm",
    title: "確認",
  },
  "mode-mismatch": {
    message: "導入的資料與當前模式不符。無法載入資料。",
    level: "error",
    mode: "notification",
  },
};

export function useNotifier() {
  function notify(
    type: string,
    options: NotifierOptions & { mode: "confirm" }
  ): Promise<boolean>;
  function notify(type: "export-confirm"): Promise<boolean>;
  function notify(
    type: string,
    options?: NotifierOptions
  ): Promise<boolean | void>;

  /**
   * Display notification or confirmation dialog
   * @param type Notification type (defined in messageMap)
   * @param options Optional configuration
   * @returns If it's a confirmation dialog, returns Promise<boolean> representing user's choice; otherwise returns undefined
   */
  async function notify(
    type: string,
    options: NotifierOptions = {}
  ): Promise<boolean | void> {
    const baseConfig = messageMap[type] || {
      message: type,
      level: "info",
      mode: "message",
    };

    const config = { ...baseConfig, ...options };
    const mode = config.mode;

    if (mode === "confirm") {
      try {
        await ElMessageBox.confirm(config.message, config.title || "確認", {
          type: config.level,
        });
        return true;
      } catch {
        return false;
      }
    }

    if (mode === "notification") {
      ElNotification({
        title: config.title || capitalize(config.level),
        message: config.message,
        type: config.level,
        duration: config.duration || 4500,
        ...config,
      });
      return;
    }

    ElMessage({
      message: config.message,
      type: config.level,
      duration: config.duration || 2000,
      ...config,
    });
  }

  return {
    notify,
  };
}
