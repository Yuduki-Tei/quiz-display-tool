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

describe('ZoomerManager 整合測試', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe('初始渲染', () => {
    it('應該成功渲染組件', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.manager-layout').exists()).toBe(true);
    });

    it('應該顯示主要的 UI 區塊', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(wrapper.find('.manager-top-bar').exists()).toBe(true);
      expect(wrapper.find('.display-area').exists()).toBe(true);
      expect(wrapper.find('.floating-play-button').exists()).toBe(true); // Zoomer 永久顯示
    });

    it('應該顯示 duration 控制', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      const durationControl = wrapper.find('.duration-control');
      expect(durationControl.exists()).toBe(true);
    });
  });

  describe('資料導航功能', () => {
    it('應該在沒有資料時禁用導航按鈕', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      const imageStore = useImageStore();
      expect(imageStore.canGoPrev).toBe(false);
      expect(imageStore.canGoNext).toBe(false);
    });

    it('應該在有多筆資料時啟用導航按鈕', async () => {
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

  describe('顯示模式', () => {
    it('應該正確初始化 displayMode', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).displayMode).toBe('full');
    });

    it('應該有三種顯示模式', () => {
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

    it('cycleDisplayMode 應該循環切換模式', () => {
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

  describe('Duration 設定', () => {
    it('應該正確初始化 duration', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).duration).toBe(30000);
    });
  });

  describe('側邊欄功能', () => {
    it('應該初始時隱藏側邊欄', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).isSidebarVisible).toBe(false);
    });
  });

  describe('Store 同步', () => {
    it('應該在有 currentData 時同步 currentId', async () => {
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

    it('應該在沒有資料時 currentId 為 null', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).currentId).toBe(null);
    });

    it('應該正確計算 hasSelection', async () => {
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

    it('hasSelection 應該在沒有選取區域時回傳 false', async () => {
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

  describe('檔案上傳', () => {
    it('應該有隱藏的檔案輸入元素', () => {
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

  describe('computed properties', () => {
    it('durationSec 應該正確轉換毫秒為秒', () => {
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

    it('currentDisplayMode 應該根據 displayMode 回傳正確的 icon', () => {
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

    it('currentDisplayMode 應該根據 displayMode 回傳正確的 tooltip', () => {
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

  describe('浮動播放按鈕', () => {
    it('Zoomer 應該永久顯示浮動播放按鈕', () => {
      const wrapper = mount(ZoomerManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(wrapper.find('.floating-play-button').exists()).toBe(true);
    });
  });
});
