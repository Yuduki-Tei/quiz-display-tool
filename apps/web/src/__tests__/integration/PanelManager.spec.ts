import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import PanelManager from '@/features/Panel/PanelManager.vue';
import { useImageStore } from '@/stores/dataStore';
import { usePanelStore } from '@/features/Panel/stores/panelStore';
import type { ImageData } from '@shared-types/types';

// Helper to get typed component instance
const getVm = (wrapper: ReturnType<typeof mount>) => wrapper.vm as any;

// Mock i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Panel component
vi.mock('@/features/Panel/views/Panel.vue', () => ({
  default: {
    name: 'Panel',
    template: '<div class="panel-mock">Panel Component</div>',
    methods: {
      startAutoReveal: vi.fn(),
      pauseAutoReveal: vi.fn(),
      resumeAutoReveal: vi.fn(),
      revealAllPanels: vi.fn(),
      coverAllPanels: vi.fn(),
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

vi.mock('@/features/Panel/composables/revealPatterns', () => ({
  getMainRevealModes: () => [
    { value: 'random', icon: 'PhShuffleSimple', label: 'random' },
    { value: 'linear', icon: 'PhArrowRight', label: 'linear' },
    { value: 'spiral', icon: 'PhSpiral', label: 'spiral' },
  ],
  getLinearSubModes: () => [
    { value: 'horizontal', icon: 'PhArrowRight', label: 'horizontal' },
    { value: 'vertical', icon: 'PhArrowDown', label: 'vertical' },
  ],
  getSpiralSubModes: () => [
    { value: 'clockwise-center', icon: 'PhClockwise', label: 'clockwise-center' },
    { value: 'counterclockwise-center', icon: 'PhCounterClockwise', label: 'counterclockwise-center' },
  ],
}));

describe('PanelManager integration test', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe('Initial rendering', () => {
    it('should successfully render the component', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.manager-layout').exists()).toBe(true);
    });

    it('should display main UI sections', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(wrapper.find('.manager-top-bar').exists()).toBe(true);
      expect(wrapper.find('.display-area').exists()).toBe(true);
      expect(wrapper.find('.floating-play-button').exists()).toBe(false); // default is manual mode
    });

    it('should display grid selector', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      const gridSelector = wrapper.find('.grid-selector');
      expect(gridSelector.exists()).toBe(true);
    });
  });

  describe('Data navigation functionality', () => {
    it('should disable navigation buttons when there is no data', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      const imageStore = useImageStore();
      expect(imageStore.canGoPrev).toBe(false);
      expect(imageStore.canGoNext).toBe(false);
    });

    it('should enable navigation buttons when there is multiple data', async () => {
      const imageStore = useImageStore();
      const panelStore = usePanelStore();

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

      panelStore.setContext('img-1', {
        amount: { x: 5, y: 5 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
        duration: 1000,
      });

      panelStore.setContext('img-2', {
        amount: { x: 5, y: 5 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
        duration: 1000,
      });

      const wrapper = mount(PanelManager, {
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

  describe('Grid settings', () => {
    it('should correctly initialize gridX and gridY', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).gridX).toBe(5);
      expect(getVm(wrapper).gridY).toBe(5);
    });

    it('should correctly initialize manual mode', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).isManual).toBe(true);
    });

    it('should correctly initialize duration', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).duration).toBe(1000);
    });
  });

  describe('Sidebar functionality', () => {
    it('should hide sidebar initially', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      const managerLayout = wrapper.findComponent({ name: 'ManagerLayout' });
      expect(managerLayout.vm.isSidebarVisible).toBe(false);
    });
  });

  describe('Store synchronization', () => {
    it('should synchronize currentId when there is currentData', async () => {
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

      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).currentId).toBe('img-1');
    });

    it('should have currentId as null when there is no data', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).currentId).toBe(null);
    });

    it('should correctly calculate canShowAll', async () => {
      const imageStore = useImageStore();
      const panelStore = usePanelStore();

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

      panelStore.setContext('img-1', {
        amount: { x: 3, y: 3 },
        revealed: [[0, 0], [0, 1]],
        isManual: true,
        autoRevealMode: 'random',
        duration: 1000,
      });

      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).canShowAll).toBe(true);
    });

    it('should correctly calculate canHideAll', async () => {
      const imageStore = useImageStore();
      const panelStore = usePanelStore();

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

      panelStore.setContext('img-1', {
        amount: { x: 3, y: 3 },
        revealed: [[0, 0], [1, 1]],
        isManual: true,
        autoRevealMode: 'random',
        duration: 1000,
      });

      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).canHideAll).toBe(true);
    });

    it('should correctly calculate isSomeRevealed', async () => {
      const imageStore = useImageStore();
      const panelStore = usePanelStore();

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

      panelStore.setContext('img-1', {
        amount: { x: 3, y: 3 },
        revealed: [[0, 0], [1, 1]],
        isManual: true,
        autoRevealMode: 'random',
        duration: 1000,
      });

      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).isSomeRevealed).toBe(true);
    });
  });

  describe('File upload', () => {
    it('should have hidden file input element', () => {
      const wrapper = mount(PanelManager, {
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

  describe('computed properties', () => {
    it('durationSec should correctly convert milliseconds to seconds', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      getVm(wrapper).duration = 1000;
      expect(getVm(wrapper).durationSec).toBe(1);

      getVm(wrapper).duration = 2500;
      expect(getVm(wrapper).durationSec).toBe(2.5);
    });

    it('revealTypeButton should display correct icon based on isManual', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      getVm(wrapper).isManual = true;
      expect(getVm(wrapper).revealTypeButton.icon).toBe('PhCursorClick');

      getVm(wrapper).isManual = false;
      expect(getVm(wrapper).revealTypeButton.icon).toBe('PhClockClockwise');
    });

    it('autoRevealMode should correctly combine mainMode and subMode', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      getVm(wrapper).mainMode = 'random';
      getVm(wrapper).subMode = '';
      expect(getVm(wrapper).autoRevealMode).toBe('random');

      getVm(wrapper).mainMode = 'linear';
      getVm(wrapper).subMode = 'horizontal';
      expect(getVm(wrapper).autoRevealMode).toBe('linear-horizontal');

      getVm(wrapper).mainMode = 'spiral';
      getVm(wrapper).subMode = 'clockwise-center';
      expect(getVm(wrapper).autoRevealMode).toBe('spiral-clockwise-center');
    });
  });

  describe('modeGet function', () => {
    it('should correctly parse spiral mode', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      const [main, sub] = getVm(wrapper).modeGet('spiral-clockwise-center');
      expect(main).toBe('spiral');
      expect(sub).toBe('clockwise-center');
    });

    it('should correctly parse linear mode', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      const [main, sub] = getVm(wrapper).modeGet('linear-horizontal');
      expect(main).toBe('linear');
      expect(sub).toBe('horizontal');
    });

    it('should correctly parse random mode', () => {
      const wrapper = mount(PanelManager, {
        global: {
          plugins: [pinia],
        },
      });

      const [main, sub] = getVm(wrapper).modeGet('random');
      expect(main).toBe('random');
      expect(sub).toBe('');
    });
  });
});
