import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useLetterStore } from '@/features/Letter/stores/letterStore';
import type { LetterContext } from '@/features/Letter/types/LetterTypes';

describe('useLetterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('初始狀態', () => {
    it('應該有空的 contexts', () => {
      const store = useLetterStore();
      expect(store.contexts).toEqual({});
    });

    it('應該初始化 isPaused 為 false', () => {
      const store = useLetterStore();
      expect(store.isPaused).toBe(false);
    });

    it('應該初始化 isAutoRevealing 為 false', () => {
      const store = useLetterStore();
      expect(store.isAutoRevealing).toBe(false);
    });
  });

  describe('getContext', () => {
    it('應該在 id 存在時回傳 context', () => {
      const store = useLetterStore();
      const mockContext: LetterContext = {
        totalChars: 10,
        charsPerRow: 5,
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
        duration: 200,
      };
      store.contexts['test-id'] = mockContext;

      const result = store.getContext('test-id');
      expect(result).toEqual(mockContext);
    });

    it('應該在 id 不存在時回傳 null', () => {
      const store = useLetterStore();
      const result = store.getContext('non-existent');
      expect(result).toBeNull();
    });

    it('應該在 id 為 null 時回傳 null', () => {
      const store = useLetterStore();
      const result = store.getContext(null);
      expect(result).toBeNull();
    });
  });

  describe('setContext', () => {
    it('應該設定新的 context', () => {
      const store = useLetterStore();
      const mockContext: LetterContext = {
        totalChars: 10,
        charsPerRow: 5,
        revealed: [],
        isManual: true,
        autoRevealMode: 'sequential',
        duration: 300,
      };

      store.setContext('test-id', mockContext);
      expect(store.contexts['test-id']).toEqual(mockContext);
    });

    it('應該覆蓋已存在的 context', () => {
      const store = useLetterStore();
      const oldContext: LetterContext = {
        totalChars: 5,
        charsPerRow: 2,
        revealed: [0, 1],
        isManual: false,
        autoRevealMode: 'random',
      };
      const newContext: LetterContext = {
        totalChars: 10,
        charsPerRow: 5,
        revealed: [],
        isManual: true,
        autoRevealMode: 'sequential',
      };

      store.setContext('test-id', oldContext);
      store.setContext('test-id', newContext);

      expect(store.contexts['test-id']).toEqual(newContext);
    });
  });

  describe('setCharsPerRow', () => {
    it('應該更新現有 context 的 charsPerRow', () => {
      const store = useLetterStore();
      const mockContext: LetterContext = {
        totalChars: 10,
        charsPerRow: 5,
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      store.setCharsPerRow('test-id', 10);
      expect(store.contexts['test-id'].charsPerRow).toBe(10);
    });

    it('如果 context 不存在應該不做任何事', () => {
      const store = useLetterStore();
      store.setCharsPerRow('non-existent', 10);
      expect(store.contexts['non-existent']).toBeUndefined();
    });
  });

  describe('hasContext', () => {
    it('應該在 context 存在時回傳 true', () => {
      const store = useLetterStore();
      const mockContext: LetterContext = {
        totalChars: 10,
        charsPerRow: 5,
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      expect(store.hasContext('test-id')).toBe(true);
    });

    it('應該在 context 不存在時回傳 false', () => {
      const store = useLetterStore();
      expect(store.hasContext('non-existent')).toBe(false);
    });
  });

  describe('setAutoRevealing', () => {
    it('應該設定 isAutoRevealing 為 true', () => {
      const store = useLetterStore();
      store.setAutoRevealing(true);
      expect(store.isAutoRevealing).toBe(true);
    });

    it('應該設定 isAutoRevealing 為 false', () => {
      const store = useLetterStore();
      store.setAutoRevealing(true);
      store.setAutoRevealing(false);
      expect(store.isAutoRevealing).toBe(false);
    });
  });

  describe('setPaused', () => {
    it('應該設定 isPaused 為 true', () => {
      const store = useLetterStore();
      store.setPaused(true);
      expect(store.isPaused).toBe(true);
    });

    it('應該設定 isPaused 為 false', () => {
      const store = useLetterStore();
      store.setPaused(true);
      store.setPaused(false);
      expect(store.isPaused).toBe(false);
    });
  });

  describe('revealChar', () => {
    it('應該將字符索引加入 revealed 陣列', () => {
      const store = useLetterStore();
      const mockContext: LetterContext = {
        totalChars: 10,
        charsPerRow: 5,
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      store.revealChar('test-id', 3);
      expect(store.contexts['test-id'].revealed).toContain(3);
    });

    it('應該不重複加入已存在的索引', () => {
      const store = useLetterStore();
      const mockContext: LetterContext = {
        totalChars: 10,
        charsPerRow: 5,
        revealed: [3],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      store.revealChar('test-id', 3);
      expect(store.contexts['test-id'].revealed).toEqual([3]);
    });

    it('如果 context 不存在應該不做任何事', () => {
      const store = useLetterStore();
      expect(() => store.revealChar('non-existent', 0)).not.toThrow();
    });
  });

  describe('revealAll', () => {
    it('應該顯示所有字符', () => {
      const store = useLetterStore();
      const mockContext: LetterContext = {
        totalChars: 5,
        charsPerRow: 5,
        revealed: [0, 1],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      store.revealAll('test-id');
      expect(store.contexts['test-id'].revealed).toEqual([0, 1, 2, 3, 4]);
    });

    it('如果 context 不存在應該不做任何事', () => {
      const store = useLetterStore();
      expect(() => store.revealAll('non-existent')).not.toThrow();
    });
  });

  describe('coverAll', () => {
    it('應該隱藏所有字符', () => {
      const store = useLetterStore();
      const mockContext: LetterContext = {
        totalChars: 5,
        charsPerRow: 5,
        revealed: [0, 1, 2, 3, 4],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      store.coverAll('test-id');
      expect(store.contexts['test-id'].revealed).toEqual([]);
    });

    it('如果 context 不存在應該不做任何事', () => {
      const store = useLetterStore();
      expect(() => store.coverAll('non-existent')).not.toThrow();
    });
  });

  describe('generateOrder', () => {
    beforeEach(() => {
      // Mock Math.random for predictable testing
      let counter = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        counter++;
        return counter / 100;
      });
    });

    it('應該為 random 模式生成亂序陣列', () => {
      const store = useLetterStore();
      const mockContext: LetterContext = {
        totalChars: 5,
        charsPerRow: 5,
        revealed: [],
        isManual: false,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      store.generateOrder('test-id', 'random');

      const order = store.contexts['test-id'].order;
      expect(order).toBeDefined();
      expect(order?.length).toBe(5);
      expect(new Set(order).size).toBe(5); // 所有元素都不重複
    });

    it('應該為 sequential 模式生成順序陣列', () => {
      const store = useLetterStore();
      const mockContext: LetterContext = {
        totalChars: 5,
        charsPerRow: 5,
        revealed: [],
        isManual: false,
        autoRevealMode: 'sequential',
      };
      store.setContext('test-id', mockContext);

      store.generateOrder('test-id', 'sequential');

      expect(store.contexts['test-id'].order).toEqual([0, 1, 2, 3, 4]);
    });

    it('應該為 reverse 模式生成反序陣列', () => {
      const store = useLetterStore();
      const mockContext: LetterContext = {
        totalChars: 5,
        charsPerRow: 5,
        revealed: [],
        isManual: false,
        autoRevealMode: 'reverse',
      };
      store.setContext('test-id', mockContext);

      store.generateOrder('test-id', 'reverse');

      expect(store.contexts['test-id'].order).toEqual([4, 3, 2, 1, 0]);
    });

    it('如果 context 不存在應該不做任何事', () => {
      const store = useLetterStore();
      expect(() => store.generateOrder('non-existent', 'random')).not.toThrow();
    });
  });
});
