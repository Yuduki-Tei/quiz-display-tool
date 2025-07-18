import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import type { NotifierOptions } from "@/@types/types";
import { useI18n } from "vue-i18n";

const capitalize = (s: string): string => {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function useNotifier() {
  const { t } = useI18n();

  function notify(
    type: string,
    options: NotifierOptions & { mode: "confirm" }
  ): Promise<boolean>;
  function notify(
    type: string,
    options?: NotifierOptions
  ): Promise<boolean | void>;

  /**
   * Display notification or confirmation dialog
   * @param type Notification type (defined in i18n notification namespace)
   * @param options Optional configuration
   * @returns If it's a confirmation dialog, returns Promise<boolean> representing user's choice; otherwise returns undefined
   */
  async function notify(
    type: string,
    options: NotifierOptions = {}
  ): Promise<boolean | void> {
    const message = t(`notification.${type}`);
    const title = options.title || t("buttons.confirm");

    let level: "success" | "warning" | "error" | "info" = "info";
    switch (type) {
      case "added":
      case "exported":
      case "imported":
        level = "success";
        break;
      case "updated":
      case "export-confirm":
        level = "warning";
        break;
      case "error":
      case "mode-mismatch":
        level = "error";
        break;
      default:
        level = "info";
    }

    const mode =
      type === "export-confirm" ? "confirm" : options.mode || "message";

    if (mode === "confirm") {
      try {
        await ElMessageBox.confirm(message, title, {
          type: level,
          confirmButtonText: t("buttons.confirm"),
          cancelButtonText: t("buttons.cancel"),
        });
        return true;
      } catch {
        return false;
      }
    }

    if (mode === "notification") {
      ElNotification({
        title: options.title || capitalize(level),
        message,
        type: level,
        duration: options.duration || 4500,
        ...options,
      });
      return;
    }

    ElMessage({
      message,
      type: level,
      duration: options.duration || 2000,
      ...options,
    });
  }

  return {
    notify,
  };
}
