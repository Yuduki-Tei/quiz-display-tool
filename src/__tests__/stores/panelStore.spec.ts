import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { usePanelStore } from '@/features/Panel/stores/panelStore';
import type { PanelContext, PanelAmount } from '@/features/Panel/types/PanelTypes';

describe('usePanelStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('初始狀態', () => {
    it('應該有空的 contexts', () => {
      const store = usePanelStore();
      expect(store.contexts).toEqual({});
    });

    it('應該初始化 isPaused 為 false', () => {
      const store = usePanelStore();
      expect(store.isPaused).toBe(false);
    });

    it('應該初始化 isAutoRevealing 為 false', () => {
      const store = usePanelStore();
      expect(store.isAutoRevealing).toBe(false);
    });
  });

  describe('getContext', () => {
    it('應該在 id 存在時回傳 context', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 5, y: 5 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
        duration: 1000,
      };
      store.contexts['test-id'] = mockContext;

      const result = store.getContext('test-id');
      expect(result).toEqual(mockContext);
    });

    it('應該在 id 不存在時回傳 null', () => {
      const store = usePanelStore();
      const result = store.getContext('non-existent');
      expect(result).toBeNull();
    });

    it('應該在 id 為 null 時回傳 null', () => {
      const store = usePanelStore();
      const result = store.getContext(null);
      expect(result).toBeNull();
    });
  });

  describe('setContext', () => {
    it('應該設定新的 context', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 5, y: 5 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
        duration: 1000,
      };

      store.setContext('test-id', mockContext);
      expect(store.contexts['test-id']).toEqual(mockContext);
    });

    it('應該覆蓋已存在的 context', () => {
      const store = usePanelStore();
      const oldContext: PanelContext = {
        amount: { x: 3, y: 3 },
        revealed: [[0, 0]],
        isManual: false,
        autoRevealMode: 'random',
      };
      const newContext: PanelContext = {
        amount: { x: 5, y: 5 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'linear-horizontal',
      };

      store.setContext('test-id', oldContext);
      store.setContext('test-id', newContext);

      expect(store.contexts['test-id']).toEqual(newContext);
    });
  });

  describe('setAmount', () => {
    it('應該更新現有 context 的 amount', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 5, y: 5 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      const newAmount: PanelAmount = { x: 10, y: 10 };
      store.setAmount('test-id', newAmount);

      expect(store.contexts['test-id'].amount).toEqual(newAmount);
    });

    it('如果 context 不存在應該不做任何事', () => {
      const store = usePanelStore();
      const newAmount: PanelAmount = { x: 10, y: 10 };
      store.setAmount('non-existent', newAmount);
      expect(store.contexts['non-existent']).toBeUndefined();
    });
  });

  describe('hasSelection', () => {
    it('應該在有有效的 grid dimensions 時回傳 true', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 5, y: 5 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      expect(store.hasSelection('test-id')).toBe(true);
    });

    it('應該在 x 為 0 時回傳 false', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 0, y: 5 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      expect(store.hasSelection('test-id')).toBe(false);
    });

    it('應該在 y 為 0 時回傳 false', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 5, y: 0 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      expect(store.hasSelection('test-id')).toBe(false);
    });

    it('應該在 context 不存在時回傳 false', () => {
      const store = usePanelStore();
      expect(store.hasSelection('non-existent')).toBe(false);
    });
  });

  describe('hasContext', () => {
    it('應該在 context 存在時回傳 true', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 5, y: 5 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      expect(store.hasContext('test-id')).toBe(true);
    });

    it('應該在 context 不存在時回傳 false', () => {
      const store = usePanelStore();
      expect(store.hasContext('non-existent')).toBe(false);
    });
  });

  describe('removeContext', () => {
    it('應該成功刪除存在的 context', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 5, y: 5 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      const result = store.removeContext('test-id');

      expect(result).toBe(true);
      expect(store.contexts['test-id']).toBeUndefined();
    });

    it('應該在 context 不存在時回傳 false', () => {
      const store = usePanelStore();
      const result = store.removeContext('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('setPaused', () => {
    it('應該設定 isPaused 為 true', () => {
      const store = usePanelStore();
      store.setPaused(true);
      expect(store.isPaused).toBe(true);
    });

    it('應該設定 isPaused 為 false', () => {
      const store = usePanelStore();
      store.setPaused(true);
      store.setPaused(false);
      expect(store.isPaused).toBe(false);
    });
  });

  describe('setRevealing', () => {
    it('應該設定 isAutoRevealing 為 true', () => {
      const store = usePanelStore();
      store.setRevealing(true);
      expect(store.isAutoRevealing).toBe(true);
    });

    it('應該設定 isAutoRevealing 為 false', () => {
      const store = usePanelStore();
      store.setRevealing(true);
      store.setRevealing(false);
      expect(store.isAutoRevealing).toBe(false);
    });
  });

  describe('canReveal', () => {
    it('應該在還有未顯示的 panels 時回傳 true', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 3, y: 3 },
        revealed: [[0, 0], [0, 1]],
        isManual: true,
        autoRevealMode: 'random',
      };

      const result = store.canReveal(mockContext);
      expect(result).toBe(true);
    });

    it('應該在所有 panels 都已顯示時回傳 false', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 2, y: 2 },
        revealed: [[0, 0], [0, 1], [1, 0], [1, 1]],
        isManual: true,
        autoRevealMode: 'random',
      };

      const result = store.canReveal(mockContext);
      expect(result).toBe(false);
    });

    it('應該在 context 為 null 時回傳 false', () => {
      const store = usePanelStore();
      const result = store.canReveal(null as any);
      expect(result).toBe(false);
    });
  });

  describe('setOrder', () => {
    it('應該設定 reveal order', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 2, y: 2 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      const order: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]];
      store.setOrder('test-id', order);

      expect(store.contexts['test-id'].order).toEqual(order);
    });

    it('如果 context 不存在應該不做任何事', () => {
      const store = usePanelStore();
      const order: [number, number][] = [[0, 0]];
      store.setOrder('non-existent', order);
      expect(store.contexts['non-existent']).toBeUndefined();
    });
  });

  describe('addRevealedPanel', () => {
    it('應該將 panel 座標加入 revealed 陣列', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 3, y: 3 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      store.addRevealedPanel('test-id', [1, 2]);

      expect(store.contexts['test-id'].revealed).toContainEqual([1, 2]);
    });

    it('應該能連續加入多個 panels', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 3, y: 3 },
        revealed: [],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      store.addRevealedPanel('test-id', [0, 0]);
      store.addRevealedPanel('test-id', [1, 1]);
      store.addRevealedPanel('test-id', [2, 2]);

      expect(store.contexts['test-id'].revealed).toHaveLength(3);
      expect(store.contexts['test-id'].revealed).toContainEqual([0, 0]);
      expect(store.contexts['test-id'].revealed).toContainEqual([1, 1]);
      expect(store.contexts['test-id'].revealed).toContainEqual([2, 2]);
    });

    it('如果 context 不存在應該不做任何事', () => {
      const store = usePanelStore();
      expect(() => store.addRevealedPanel('non-existent', [0, 0])).not.toThrow();
    });
  });

  describe('clearRevealedPanels', () => {
    it('應該清空所有已顯示的 panels', () => {
      const store = usePanelStore();
      const mockContext: PanelContext = {
        amount: { x: 3, y: 3 },
        revealed: [[0, 0], [1, 1], [2, 2]],
        isManual: true,
        autoRevealMode: 'random',
      };
      store.setContext('test-id', mockContext);

      store.clearRevealedPanels('test-id');

      expect(store.contexts['test-id'].revealed).toEqual([]);
    });

    it('如果 context 不存在應該不做任何事', () => {
      const store = usePanelStore();
      expect(() => store.clearRevealedPanels('non-existent')).not.toThrow();
    });
  });

  describe('importData', () => {
    it('應該匯入 contexts 資料', () => {
      const store = usePanelStore();
      const mockContexts: Record<string, PanelContext> = {
        'id-1': {
          amount: { x: 5, y: 5 },
          revealed: [[0, 0]],
          isManual: true,
          autoRevealMode: 'random',
        },
        'id-2': {
          amount: { x: 3, y: 3 },
          revealed: [],
          isManual: false,
          autoRevealMode: 'linear-horizontal',
        },
      };

      store.importData({ contexts: mockContexts });

      expect(store.contexts).toEqual(mockContexts);
    });
  });
});
