import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useZoomerStore } from '@/features/Zoomer/stores/zoomerStore';
import type { ZoomerContext, SelectionRect } from '@/features/Zoomer/types/ZoomerTypes';

describe('useZoomerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('初始狀態', () => {
    it('應該有空的 contexts', () => {
      const store = useZoomerStore();
      expect(store.contexts).toEqual({});
    });

    it('應該初始化 isPaused 為 false', () => {
      const store = useZoomerStore();
      expect(store.isPaused).toBe(false);
    });

    it('應該初始化 isZooming 為 false', () => {
      const store = useZoomerStore();
      expect(store.isZooming).toBe(false);
    });
  });

  describe('getContext', () => {
    it('應該在 id 存在時回傳 context', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 100, h: 150 },
        duration: 30000,
      };
      store.contexts['test-id'] = mockContext;

      const result = store.getContext('test-id');
      expect(result).toEqual(mockContext);
    });

    it('應該在 id 不存在時回傳 null', () => {
      const store = useZoomerStore();
      const result = store.getContext('non-existent');
      expect(result).toBeNull();
    });

    it('應該在 id 為 null 時回傳 null', () => {
      const store = useZoomerStore();
      const result = store.getContext(null);
      expect(result).toBeNull();
    });
  });

  describe('setContext', () => {
    it('應該設定新的 context', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 100, h: 150 },
        duration: 30000,
      };

      store.setContext('test-id', mockContext);
      expect(store.contexts['test-id']).toEqual(mockContext);
    });

    it('應該覆蓋已存在的 context', () => {
      const store = useZoomerStore();
      const oldContext: ZoomerContext = {
        selection: { x: 0, y: 0, w: 50, h: 50 },
        duration: 20000,
      };
      const newContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 100, h: 150 },
        duration: 30000,
      };

      store.setContext('test-id', oldContext);
      store.setContext('test-id', newContext);

      expect(store.contexts['test-id']).toEqual(newContext);
    });
  });

  describe('setRect', () => {
    it('應該更新現有 context 的 selection', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 0, y: 0, w: 50, h: 50 },
        duration: 30000,
      };
      store.setContext('test-id', mockContext);

      const newRect: SelectionRect = { x: 10, y: 20, w: 100, h: 150 };
      store.setRect('test-id', newRect);

      expect(store.contexts['test-id'].selection).toEqual(newRect);
    });

    it('如果 context 不存在應該不做任何事', () => {
      const store = useZoomerStore();
      const newRect: SelectionRect = { x: 10, y: 20, w: 100, h: 150 };
      store.setRect('non-existent', newRect);
      expect(store.contexts['non-existent']).toBeUndefined();
    });
  });

  describe('removeContext', () => {
    it('應該成功刪除存在的 context', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 100, h: 150 },
        duration: 30000,
      };
      store.setContext('test-id', mockContext);

      const result = store.removeContext('test-id');

      expect(result).toBe(true);
      expect(store.contexts['test-id']).toBeUndefined();
    });

    it('應該在 context 不存在時回傳 false', () => {
      const store = useZoomerStore();
      const result = store.removeContext('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('setPaused', () => {
    it('應該設定 isPaused 為 true', () => {
      const store = useZoomerStore();
      store.setPaused(true);
      expect(store.isPaused).toBe(true);
    });

    it('應該設定 isPaused 為 false', () => {
      const store = useZoomerStore();
      store.setPaused(true);
      store.setPaused(false);
      expect(store.isPaused).toBe(false);
    });
  });

  describe('setZooming', () => {
    it('應該設定 isZooming 為 true', () => {
      const store = useZoomerStore();
      store.setZooming(true);
      expect(store.isZooming).toBe(true);
    });

    it('應該設定 isZooming 為 false', () => {
      const store = useZoomerStore();
      store.setZooming(true);
      store.setZooming(false);
      expect(store.isZooming).toBe(false);
    });
  });

  describe('hasSelection', () => {
    it('應該在有有效的 selection (w 和 h 都大於 0) 時回傳 true', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 100, h: 150 },
        duration: 30000,
      };
      store.setContext('test-id', mockContext);

      expect(store.hasSelection('test-id')).toBe(true);
    });

    it('應該在 w 為 0 時回傳 false', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 0, h: 150 },
        duration: 30000,
      };
      store.setContext('test-id', mockContext);

      expect(store.hasSelection('test-id')).toBe(false);
    });

    it('應該在 h 為 0 時回傳 false', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 100, h: 0 },
        duration: 30000,
      };
      store.setContext('test-id', mockContext);

      expect(store.hasSelection('test-id')).toBe(false);
    });

    it('應該在 w 和 h 都為 0 時回傳 false', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 0, h: 0 },
        duration: 30000,
      };
      store.setContext('test-id', mockContext);

      expect(store.hasSelection('test-id')).toBe(false);
    });

    it('應該在 context 不存在時回傳 false', () => {
      const store = useZoomerStore();
      expect(store.hasSelection('non-existent')).toBe(false);
    });
  });

  describe('hasContext', () => {
    it('應該在 context 存在時回傳 true', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 100, h: 150 },
        duration: 30000,
      };
      store.setContext('test-id', mockContext);

      expect(store.hasContext('test-id')).toBe(true);
    });

    it('應該在 context 不存在時回傳 false', () => {
      const store = useZoomerStore();
      expect(store.hasContext('non-existent')).toBe(false);
    });
  });

  describe('importData', () => {
    it('應該匯入 contexts 資料', () => {
      const store = useZoomerStore();
      const mockContexts: Record<string, ZoomerContext> = {
        'id-1': {
          selection: { x: 10, y: 20, w: 100, h: 150 },
          duration: 30000,
        },
        'id-2': {
          selection: { x: 50, y: 60, w: 200, h: 250 },
          duration: 40000,
        },
      };

      store.importData({ contexts: mockContexts });

      expect(store.contexts).toEqual(mockContexts);
    });

    it('應該覆蓋現有的 contexts', () => {
      const store = useZoomerStore();
      const oldContexts: Record<string, ZoomerContext> = {
        'old-id': {
          selection: { x: 0, y: 0, w: 50, h: 50 },
          duration: 20000,
        },
      };
      const newContexts: Record<string, ZoomerContext> = {
        'new-id': {
          selection: { x: 10, y: 20, w: 100, h: 150 },
          duration: 30000,
        },
      };

      store.importData({ contexts: oldContexts });
      store.importData({ contexts: newContexts });

      expect(store.contexts).toEqual(newContexts);
      expect(store.contexts['old-id']).toBeUndefined();
    });
  });
});
