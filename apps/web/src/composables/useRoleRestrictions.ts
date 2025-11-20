import { computed } from "vue";
import { useConnectionService } from "@/services/ConnectionService";

/**
 * Composable for role-based UI restrictions
 * Provides reactive properties to control UI access based on user role
 */
export function useRoleRestrictions() {
  const connectionService = useConnectionService();

  /**
   * Whether the current user can control the UI
   * Returns true if:
   * - User is the host in a room, OR
   * - User is not connected to any room (offline/single-player mode)
   */
  const canControl = computed(() => {
    return connectionService.isHost() || !connectionService.isConnected();
  });

  return {
    canControl,
  };
}
