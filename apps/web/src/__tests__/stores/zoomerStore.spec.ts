import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useZoomerStore } from '@/features/Zoomer/stores/zoomerStore';
import type { ZoomerContext, SelectionRect } from '@/features/Zoomer/types/ZoomerTypes';

describe('useZoomerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Initial State', () => {
    it('should have empty contexts', () => {
      const store = useZoomerStore();
      expect(store.contexts).toEqual({});
    });

    it('should initialize isPaused to false', () => {
      const store = useZoomerStore();
      expect(store.isPaused).toBe(false);
    });

    it('should initialize isZooming to false', () => {
      const store = useZoomerStore();
      expect(store.isZooming).toBe(false);
    });
  });

  describe('getContext', () => {
    it('should return context when id exists', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 100, h: 150 },
        duration: 30000,
      };
      store.contexts['test-id'] = mockContext;

      const result = store.getContext('test-id');
      expect(result).toEqual(mockContext);
    });

    it('should return null when id does not exist', () => {
      const store = useZoomerStore();
      const result = store.getContext('non-existent');
      expect(result).toBeNull();
    });

    it('should return null when id is null', () => {
      const store = useZoomerStore();
      const result = store.getContext(null);
      expect(result).toBeNull();
    });
  });

  describe('setContext', () => {
    it('should set a new context', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 100, h: 150 },
        duration: 30000,
      };

      store.setContext('test-id', mockContext);
      expect(store.contexts['test-id']).toEqual(mockContext);
    });

    it('should overwrite existing context', () => {
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
    it('should update selection of existing context', () => {
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

    it('should do nothing if context does not exist', () => {
      const store = useZoomerStore();
      const newRect: SelectionRect = { x: 10, y: 20, w: 100, h: 150 };
      store.setRect('non-existent', newRect);
      expect(store.contexts['non-existent']).toBeUndefined();
    });
  });

  describe('removeContext', () => {
    it('should successfully delete existing context', () => {
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

    it('should return false when context does not exist', () => {
      const store = useZoomerStore();
      const result = store.removeContext('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('setPaused', () => {
    it('should set isPaused to true', () => {
      const store = useZoomerStore();
      store.setPaused(true);
      expect(store.isPaused).toBe(true);
    });

    it('should set isPaused to false', () => {
      const store = useZoomerStore();
      store.setPaused(true);
      store.setPaused(false);
      expect(store.isPaused).toBe(false);
    });
  });

  describe('setZooming', () => {
    it('should set isZooming to true', () => {
      const store = useZoomerStore();
      store.setZooming(true);
      expect(store.isZooming).toBe(true);
    });

    it('should set isZooming to false', () => {
      const store = useZoomerStore();
      store.setZooming(true);
      store.setZooming(false);
      expect(store.isZooming).toBe(false);
    });
  });

  describe('hasSelection', () => {
    it('should return true when selection is valid (w and h both greater than 0)', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 100, h: 150 },
        duration: 30000,
      };
      store.setContext('test-id', mockContext);

      expect(store.hasSelection('test-id')).toBe(true);
    });

    it('should return false when w is 0', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 0, h: 150 },
        duration: 30000,
      };
      store.setContext('test-id', mockContext);

      expect(store.hasSelection('test-id')).toBe(false);
    });

    it('should return false when h is 0', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 100, h: 0 },
        duration: 30000,
      };
      store.setContext('test-id', mockContext);

      expect(store.hasSelection('test-id')).toBe(false);
    });

    it('should return false when both w and h are 0', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 0, h: 0 },
        duration: 30000,
      };
      store.setContext('test-id', mockContext);

      expect(store.hasSelection('test-id')).toBe(false);
    });

    it('should return false when context does not exist', () => {
      const store = useZoomerStore();
      expect(store.hasSelection('non-existent')).toBe(false);
    });
  });

  describe('hasContext', () => {
    it('should return true when context exists', () => {
      const store = useZoomerStore();
      const mockContext: ZoomerContext = {
        selection: { x: 10, y: 20, w: 100, h: 150 },
        duration: 30000,
      };
      store.setContext('test-id', mockContext);

      expect(store.hasContext('test-id')).toBe(true);
    });

    it('should return false when context does not exist', () => {
      const store = useZoomerStore();
      expect(store.hasContext('non-existent')).toBe(false);
    });
  });

  describe('importData', () => {
    it('should import contexts data', () => {
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

    it('should overwrite existing contexts', () => {
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
