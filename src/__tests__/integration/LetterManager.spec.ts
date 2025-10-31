import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LetterManager from '@/features/Letter/LetterManager.vue';
import { useTextStore } from '@/stores/dataStore';
import { useLetterStore } from '@/features/Letter/stores/letterStore';
import type { TextData } from '@/@types/types';

// Helper to get typed component instance
const getVm = (wrapper: ReturnType<typeof mount>) => wrapper.vm as any;

// Mock i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Letter component
vi.mock('@/features/Letter/views/Letter.vue', () => ({
  default: {
    name: 'Letter',
    template: '<div class="letter-mock">Letter Component</div>',
    methods: {
      startAutoReveal: vi.fn(),
      pauseAutoReveal: vi.fn(),
      resumeAutoReveal: vi.fn(),
      revealAllLetters: vi.fn(),
      coverAllLetters: vi.fn(),
    },
  },
}));

describe('LetterManager 整合測試', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe('初始渲染', () => {
    it('應該成功渲染組件', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.manager-layout').exists()).toBe(true);
    });

    it('應該顯示主要的 UI 區塊', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(wrapper.find('.manager-top-bar').exists()).toBe(true);
      expect(wrapper.find('.display-area').exists()).toBe(true);
      expect(wrapper.find('.floating-play-button').exists()).toBe(false); // 預設是手動模式
    });

    it('應該顯示檔案工具列按鈕', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      const fileUtils = wrapper.find('.top-bar-section.file-utils');
      expect(fileUtils.exists()).toBe(true);
    });

    it('應該顯示通用工具按鈕', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      const commonUtils = wrapper.find('.top-bar-section.common-utils');
      expect(commonUtils.exists()).toBe(true);
    });
  });

  describe('資料導航功能', () => {
    it('應該在沒有資料時禁用導航按鈕', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      const textStore = useTextStore();
      expect(textStore.canGoPrev).toBe(false);
      expect(textStore.canGoNext).toBe(false);
    });

    it('應該在有多筆資料時啟用導航按鈕', async () => {
      const textStore = useTextStore();
      const letterStore = useLetterStore();

      const mockData1: TextData = {
        id: 'text-1',
        name: 'Test 1',
        content: 'Hello World',
        thumbnailSrc: null,
      };
      const mockData2: TextData = {
        id: 'text-2',
        name: 'Test 2',
        content: 'Hello Again',
        thumbnailSrc: null,
      };

      textStore.addData(mockData1);
      textStore.addData(mockData2);

      letterStore.setContext('text-1', {
        totalChars: mockData1.content.length,
        charsPerRow: 10,
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
        duration: 200,
      });

      letterStore.setContext('text-2', {
        totalChars: mockData2.content.length,
        charsPerRow: 10,
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
        duration: 200,
      });

      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      // After adding two items, currentIndex is at 1 (the second item)
      expect(textStore.canGoPrev).toBe(true);
      expect(textStore.canGoNext).toBe(false);

      textStore.goToPrev();
      await getVm(wrapper).$nextTick();

      expect(textStore.canGoPrev).toBe(false);
      expect(textStore.canGoNext).toBe(true);
    });
  });

  describe('側邊欄功能', () => {
    it('應該初始時隱藏側邊欄', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      const drawer = wrapper.find('.el-drawer');
      expect(getVm(wrapper).isSidebarVisible).toBe(false);
    });
  });

  describe('字符顯示控制', () => {
    it('應該正確初始化 charsPerRow', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).charsPerRow).toBe(10);
    });

    it('應該正確初始化手動模式', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).isManual).toBe(true);
    });

    it('應該正確初始化 duration', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).duration).toBe(200);
    });
  });

  describe('自動播放模式', () => {
    it('應該在手動模式時隱藏浮動播放按鈕', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).isManual).toBe(true);
      expect(wrapper.find('.floating-play-button').exists()).toBe(false);
    });

    it('應該正確設定預設的 autoRevealMode', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).autoRevealMode).toBe('random');
    });
  });

  describe('Store 同步', () => {
    it('應該在有 currentData 時同步 currentId', async () => {
      const textStore = useTextStore();
      const mockData: TextData = {
        id: 'text-1',
        name: 'Test',
        content: 'Hello',
        thumbnailSrc: null,
      };

      textStore.addData(mockData);

      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).currentId).toBe('text-1');
    });

    it('應該在沒有資料時 currentId 為 null', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).currentId).toBe(null);
    });

    it('應該正確計算 canShowAll', async () => {
      const textStore = useTextStore();
      const letterStore = useLetterStore();

      const mockData: TextData = {
        id: 'text-1',
        name: 'Test',
        content: 'Hello',
        thumbnailSrc: null,
      };

      textStore.addData(mockData);

      letterStore.setContext('text-1', {
        totalChars: 5,
        charsPerRow: 5,
        revealed: [0, 1],
        isManual: true,
        autoRevealMode: 'random',
        duration: 200,
      });

      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).canShowAll).toBe(true);
    });

    it('應該正確計算 canHideAll', async () => {
      const textStore = useTextStore();
      const letterStore = useLetterStore();

      const mockData: TextData = {
        id: 'text-1',
        name: 'Test',
        content: 'Hello',
        thumbnailSrc: null,
      };

      textStore.addData(mockData);

      letterStore.setContext('text-1', {
        totalChars: 5,
        charsPerRow: 5,
        revealed: [0, 1, 2],
        isManual: true,
        autoRevealMode: 'random',
        duration: 200,
      });

      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).canHideAll).toBe(true);
    });

    it('應該正確計算 isSomeRevealed', async () => {
      const textStore = useTextStore();
      const letterStore = useLetterStore();

      const mockData: TextData = {
        id: 'text-1',
        name: 'Test',
        content: 'Hello',
        thumbnailSrc: null,
      };

      textStore.addData(mockData);

      letterStore.setContext('text-1', {
        totalChars: 5,
        charsPerRow: 5,
        revealed: [0, 1],
        isManual: true,
        autoRevealMode: 'random',
        duration: 200,
      });

      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).isSomeRevealed).toBe(true);
    });
  });

  describe('檔案上傳', () => {
    it('應該有隱藏的檔案輸入元素', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      const fileInput = wrapper.find('input[type="file"]');
      expect(fileInput.exists()).toBe(true);
      expect(fileInput.attributes('accept')).toBe('.txt');
      expect(fileInput.attributes('style')).toContain('display: none');
    });
  });

  describe('reveal modes', () => {
    it('應該有三種 reveal 模式', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).revealModes).toHaveLength(3);
      expect(getVm(wrapper).revealModes[0].value).toBe('random');
      expect(getVm(wrapper).revealModes[1].value).toBe('sequential');
      expect(getVm(wrapper).revealModes[2].value).toBe('reverse');
    });
  });

  describe('computed properties', () => {
    it('durationSec 應該正確轉換毫秒為秒', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      getVm(wrapper).duration = 1000;
      expect(getVm(wrapper).durationSec).toBe(1);

      getVm(wrapper).duration = 2500;
      expect(getVm(wrapper).durationSec).toBe(2.5);
    });

    it('revealTypeButton 應該根據 isManual 顯示正確的圖示', () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      getVm(wrapper).isManual = true;
      expect(getVm(wrapper).revealTypeButton.icon).toBe('PhCursorClick');

      getVm(wrapper).isManual = false;
      expect(getVm(wrapper).revealTypeButton.icon).toBe('PhClockClockwise');
    });
  });
});
