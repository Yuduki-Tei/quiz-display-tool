/**
 * @module useManagerBase
 * @description Provides shared logic for Manager components
 * Handles common functionality like file input, navigation, sidebar, and data selection
 */

import { ref, computed, toRef } from "vue";

/**
 * Base data item interface
 */
export interface BaseDataItem {
  id: string;
  name: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Required interface for data stores (ImageStore, TextStore)
 */
export interface DataStoreInterface<T extends BaseDataItem = BaseDataItem> {
  canGoPrev: boolean;
  canGoNext: boolean;
  currentData: T | null;
  addData: (data: T) => string;
  setCurrentById: (id: string) => void;
  goToPrev: () => void;
  goToNext: () => void;
}

/**
 * Required interface for extra/feature stores (ZoomerStore, PanelStore, LetterStore)
 */
export interface ExtraStoreInterface {
  isZooming?: boolean;
  isAutoRevealing?: boolean;
  isPaused?: boolean;
}

export interface ManagerBaseConfig<
  T extends BaseDataItem = BaseDataItem,
  DS extends DataStoreInterface<T> = DataStoreInterface<T>,
  ES extends ExtraStoreInterface = ExtraStoreInterface
> {
  /**
   * Data store instance (e.g., useImageStore(), useTextStore())
   */
  dataStore: DS;

  /**
   * Extra/feature-specific store instance (e.g., useZoomerStore(), usePanelStore())
   */
  extraStore: ES;

  /**
   * Type of data being managed
   */
  dataType: "image" | "text";

  /**
   * File input accept attribute value
   */
  fileAccept: "image/*" | ".txt";

  /**
   * Function to handle file loading
   * Should return the loaded data or throw an error
   */
  loadFile: (file: File) => Promise<T | T[]>;

  /**
   * Optional callback when a new file is successfully added
   * Receives the data ID and status
   */
  onFileAdded?: (id: string, status: string) => void;
}

/**
 * Creates shared manager functionality
 */
export function useManagerBase<T extends BaseDataItem = BaseDataItem>(
  config: ManagerBaseConfig<T>
) {
  const { dataStore, extraStore, dataType, fileAccept, loadFile, onFileAdded } =
    config;

  // Reactive state
  const isSidebarVisible = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);

  // Store refs - using toRef to make them reactive
  const canGoPrev = toRef(dataStore, "canGoPrev");
  const canGoNext = toRef(dataStore, "canGoNext");
  const currentData = toRef(dataStore, "currentData");

  // Optional properties from extra store - provide default values
  const isZooming = computed(() => extraStore.isZooming ?? false);
  const isAutoRevealing = computed(() => extraStore.isAutoRevealing ?? false);
  const isPaused = computed(() => extraStore.isPaused ?? false);

  // Computed properties
  const currentId = computed(() => currentData.value?.id || null);

  /**
   * Triggers the hidden file input
   */
  const triggerFileInput = () => {
    fileInput.value?.click();
  };

  /**
   * Handles file input change event
   */
  const onFileChange = async (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files || !files[0]) return;
    const file = files[0];

    try {
      const data = await loadFile(file);

      // Handle single data item
      if (!Array.isArray(data)) {
        const status = dataStore.addData(data);
        if (status === "added" && data.id && onFileAdded) {
          onFileAdded(data.id, status);
        }
        return status;
      }

      // Handle multiple data items (e.g., text file with multiple lines)
      let lastStatus = "error";
      data.forEach((item) => {
        const status = dataStore.addData(item);
        if (status === "added" && item.id && onFileAdded) {
          onFileAdded(item.id, status);
        }
        lastStatus = status;
      });
      return lastStatus;
    } catch (err) {
      console.error("Failed to load file:", err);
      throw err;
    } finally {
      // Reset file input
      if (fileInput.value) {
        fileInput.value.value = "";
      }
    }
  };

  /**
   * Handles data selection from sidebar
   */
  const handleDataSelect = (id: string) => {
    dataStore.setCurrentById(id);
    isSidebarVisible.value = false;
  };

  /**
   * Navigate to previous data item
   */
  const goToPrev = () => {
    dataStore.goToPrev();
  };

  /**
   * Navigate to next data item
   */
  const goToNext = () => {
    dataStore.goToNext();
  };

  return {
    // Reactive state
    isSidebarVisible,
    fileInput,

    // Computed
    currentId,
    canGoPrev,
    canGoNext,
    currentData,

    // Store state (if needed by parent)
    isZooming: isZooming || ref(false),
    isAutoRevealing: isAutoRevealing || ref(false),
    isPaused: isPaused || ref(false),

    // Methods
    triggerFileInput,
    onFileChange,
    handleDataSelect,
    goToPrev,
    goToNext,

    // Config passed through
    dataType,
    fileAccept,
    dataStore,
    extraStore,
  };
}
