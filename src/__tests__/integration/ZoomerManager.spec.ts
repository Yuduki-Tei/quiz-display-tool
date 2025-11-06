import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ZoomerManager from '@/features/Zoomer/ZoomerManager.vue';
import { useImageStore } from '@/stores/dataStore';
import { useZoomerStore } from '@/features/Zoomer/stores/zoomerStore';
import type { ImageData } from '@/@types/types';

// Helper to get typed component instance
const getVm = (wrapper: ReturnType<typeof mount>) => wrapper.vm as any;

// Mock i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Zoomer component
vi.mock('@/features/Zoomer/views/Zoomer.vue', () => ({
  default: {
    name: 'Zoomer',
    template: '<div class="zoomer-mock">Zoomer Component</div>',
    props: ['id', 'displayMode'],
    methods: {
      startZoomOut: vi.fn(),
      pauseZoomOut: vi.fn(),
      resumeZoomOut: vi.fn(),
      showFullImage: vi.fn(),
    },
  },
}));

// Mock composables
vi.mock('@/composables/useImageLoader', () => ({
  loadImageFile: vi.fn(),
}));

vi.mock('@/composables/useNotifier', () => ({
  useNotifier: () => ({
    notify: vi.fn(),
  }),
}));

describe('ZoomerManager Integration Tests', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe('Initial Rendering', () => {
    it('Should successfully render the component', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.manager-layout').exists()).toBe(true);
    });

    it('Should display main UI sections', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(wrapper.find('.manager-top-bar').exists()).toBe(true);
      expect(wrapper.find('.display-area').exists()).toBe(true);
      expect(wrapper.find('.floating-play-button').exists()).toBe(true); // Zoomer always displays
    });

    it('Should display duration control', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      const durationControl = wrapper.find('.duration-control');
      expect(durationControl.exists()).toBe(true);
    });
  });

  describe('Data Navigation Functionality', () => {
    it('Should disable navigation buttons when there is no data', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      const imageStore = useImageStore();
      expect(imageStore.canGoPrev).toBe(false);
      expect(imageStore.canGoNext).toBe(false);
    });

    it('Should enable navigation buttons when there are multiple data items', async () => {
      const imageStore = useImageStore();
      const zoomerStore = useZoomerStore();

      const mockData1: ImageData = {
        id: 'img-1',
        name: 'Test 1',
        image: null,
        canvas: null,
        thumbnailSrc: null,
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };

      const mockData2: ImageData = {
        id: 'img-2',
        name: 'Test 2',
        image: null,
        canvas: null,
        thumbnailSrc: null,
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };

      imageStore.addData(mockData1);
      imageStore.addData(mockData2);

      zoomerStore.setContext('img-1', {
        duration: 30000,
        selection: { x: 0, y: 0, w: 100, h: 100 },
      });

      zoomerStore.setContext('img-2', {
        duration: 30000,
        selection: { x: 0, y: 0, w: 100, h: 100 },
      });

      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      // After adding two items, currentIndex is at 1 (the second item)
      expect(imageStore.canGoPrev).toBe(true);
      expect(imageStore.canGoNext).toBe(false);

      imageStore.goToPrev();
      await getVm(wrapper).$nextTick();

      expect(imageStore.canGoPrev).toBe(false);
      expect(imageStore.canGoNext).toBe(true);
    });
  });

  describe('Display Mode', () => {
    it('Should correctly initialize displayMode', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).displayMode).toBe('full');
    });

    it('Should have three display modes', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).displayModes).toHaveLength(3);
      expect(getVm(wrapper).displayModes[0].value).toBe('full');
      expect(getVm(wrapper).displayModes[1].value).toBe('selection');
      expect(getVm(wrapper).displayModes[2].value).toBe('none');
    });

    it('cycleDisplayMode should cycle through modes', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).displayMode).toBe('full');

      getVm(wrapper).cycleDisplayMode();
      expect(getVm(wrapper).displayMode).toBe('selection');

      getVm(wrapper).cycleDisplayMode();
      expect(getVm(wrapper).displayMode).toBe('none');

      getVm(wrapper).cycleDisplayMode();
      expect(getVm(wrapper).displayMode).toBe('full');
    });
  });

  describe('Duration Configuration', () => {
    it('Should correctly initialize duration', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).duration).toBe(30000);
    });
  });

  describe('Sidebar Functionality', () => {
    it('Should initially hide the sidebar', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).isSidebarVisible).toBe(false);
    });
  });

  describe('Store Synchronization', () => {
    it('Should sync currentId when currentData exists', async () => {
      const imageStore = useImageStore();
      const mockData: ImageData = {
        id: 'img-1',
        name: 'Test',
        image: null,
        canvas: null,
        thumbnailSrc: null,
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };

      imageStore.addData(mockData);

      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).currentId).toBe('img-1');
    });

    it('Should have currentId as null when there is no data', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).currentId).toBe(null);
    });

    it('Should correctly calculate hasSelection', async () => {
      const imageStore = useImageStore();
      const zoomerStore = useZoomerStore();

      const mockData: ImageData = {
        id: 'img-1',
        name: 'Test',
        image: null,
        canvas: null,
        thumbnailSrc: null,
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };

      imageStore.addData(mockData);

      zoomerStore.setContext('img-1', {
        duration: 30000,
        selection: { x: 10, y: 20, w: 100, h: 150 },
      });

      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).hasSelection).toBe(true);
    });

    it('hasSelection should return false when there is no selection area', async () => {
      const imageStore = useImageStore();
      const zoomerStore = useZoomerStore();

      const mockData: ImageData = {
        id: 'img-1',
        name: 'Test',
        image: null,
        canvas: null,
        thumbnailSrc: null,
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };

      imageStore.addData(mockData);

      zoomerStore.setContext('img-1', {
        duration: 30000,
        selection: { x: 0, y: 0, w: 0, h: 0 },
      });

      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).hasSelection).toBe(false);
    });
  });

  describe('File Upload', () => {
    it('Should have a hidden file input element', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      const fileInput = wrapper.find('input[type="file"]');
      expect(fileInput.exists()).toBe(true);
      expect(fileInput.attributes('accept')).toBe('image/*');
      expect(fileInput.attributes('style')).toContain('display: none');
    });
  });

  describe('Computed Properties', () => {
    it('durationSec should correctly convert milliseconds to seconds', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      getVm(wrapper).duration = 30000;
      expect(getVm(wrapper).durationSec).toBe(30);

      getVm(wrapper).duration = 45000;
      expect(getVm(wrapper).durationSec).toBe(45);
    });

    it('currentDisplayMode should return correct icon based on displayMode', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      getVm(wrapper).displayMode = 'full';
      expect(getVm(wrapper).currentDisplayMode.icon).toBe('PhImage');

      getVm(wrapper).displayMode = 'selection';
      expect(getVm(wrapper).currentDisplayMode.icon).toBe('PhCrop');

      getVm(wrapper).displayMode = 'none';
      expect(getVm(wrapper).currentDisplayMode.icon).toBe('PhEyeSlash');
    });

    it('currentDisplayMode should return correct tooltip based on displayMode', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      getVm(wrapper).displayMode = 'full';
      expect(getVm(wrapper).currentDisplayMode.tooltip).toBe('zoomer.switchToShowSelectedArea');

      getVm(wrapper).displayMode = 'selection';
      expect(getVm(wrapper).currentDisplayMode.tooltip).toBe('zoomer.switchToHideImage');

      getVm(wrapper).displayMode = 'none';
      expect(getVm(wrapper).currentDisplayMode.tooltip).toBe('zoomer.switchToShowFullImage');
    });
  });

  describe('Floating Play Button', () => {
    it('Zoomer should always display the floating play button', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(wrapper.find('.floating-play-button').exists()).toBe(true);
    });
  });
});
