import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { usePanelStore } from '@/features/Panel/stores/panelStore';
import type { PanelContext, PanelAmount } from '@/features/Panel/types/PanelTypes';

describe('usePanelStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Initial state', () => {
    it('should have empty contexts', () => {
      const store = usePanelStore();
      expect(store.contexts).toEqual({});
    });

    it('should initialize isPaused to false', () => {
      const store = usePanelStore();
      expect(store.isPaused).toBe(false);
    });

    it('should initialize isAutoRevealing to false', () => {
      const store = usePanelStore();
      expect(store.isAutoRevealing).toBe(false);
    });
  });

  describe('getContext', () => {
    it('should return context when id exists', () => {
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

    it('should return null when id does not exist', () => {
      const store = usePanelStore();
      const result = store.getContext('non-existent');
      expect(result).toBeNull();
    });

    it('should return null when id is null', () => {
      const store = usePanelStore();
      const result = store.getContext(null);
      expect(result).toBeNull();
    });
  });

  describe('setContext', () => {
    it('should set a new context', () => {
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

    it('should overwrite an existing context', () => {
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
    it('should update the amount of an existing context', () => {
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

    it('should do nothing if context does not exist', () => {
      const store = usePanelStore();
      const newAmount: PanelAmount = { x: 10, y: 10 };
      store.setAmount('non-existent', newAmount);
      expect(store.contexts['non-existent']).toBeUndefined();
    });
  });

  describe('hasSelection', () => {
    it('should return true when there are valid grid dimensions', () => {
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

    it('should return false when x is 0', () => {
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

    it('should return false when y is 0', () => {
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

    it('should return false when context does not exist', () => {
      const store = usePanelStore();
      expect(store.hasSelection('non-existent')).toBe(false);
    });
  });

  describe('hasContext', () => {
    it('should return true when context exists', () => {
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

    it('should return false when context does not exist', () => {
      const store = usePanelStore();
      expect(store.hasContext('non-existent')).toBe(false);
    });
  });

  describe('removeContext', () => {
    it('should successfully delete an existing context', () => {
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

    it('should return false when context does not exist', () => {
      const store = usePanelStore();
      const result = store.removeContext('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('setPaused', () => {
    it('should set isPaused to true', () => {
      const store = usePanelStore();
      store.setPaused(true);
      expect(store.isPaused).toBe(true);
    });

    it('should set isPaused to false', () => {
      const store = usePanelStore();
      store.setPaused(true);
      store.setPaused(false);
      expect(store.isPaused).toBe(false);
    });
  });

  describe('setRevealing', () => {
    it('should set isAutoRevealing to true', () => {
      const store = usePanelStore();
      store.setRevealing(true);
      expect(store.isAutoRevealing).toBe(true);
    });

    it('should set isAutoRevealing to false', () => {
      const store = usePanelStore();
      store.setRevealing(true);
      store.setRevealing(false);
      expect(store.isAutoRevealing).toBe(false);
    });
  });

  describe('canReveal', () => {
    it('should return true when there are unrevealed panels', () => {
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

    it('should return false when all panels are revealed', () => {
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

    it('should return false when context is null', () => {
      const store = usePanelStore();
      const result = store.canReveal(null as any);
      expect(result).toBe(false);
    });
  });

  describe('setOrder', () => {
    it('should set reveal order', () => {
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

    it('should do nothing if context does not exist', () => {
      const store = usePanelStore();
      const order: [number, number][] = [[0, 0]];
      store.setOrder('non-existent', order);
      expect(store.contexts['non-existent']).toBeUndefined();
    });
  });

  describe('addRevealedPanel', () => {
    it('should add panel coordinates to revealed array', () => {
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

    it('should add multiple panels consecutively', () => {
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

    it('should do nothing if context does not exist', () => {
      const store = usePanelStore();
      expect(() => store.addRevealedPanel('non-existent', [0, 0])).not.toThrow();
    });
  });

  describe('clearRevealedPanels', () => {
    it('should clear all revealed panels', () => {
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

    it('should do nothing if context does not exist', () => {
      const store = usePanelStore();
      expect(() => store.clearRevealedPanels('non-existent')).not.toThrow();
    });
  });

  describe('importData', () => {
    it('should import contexts data', () => {
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
