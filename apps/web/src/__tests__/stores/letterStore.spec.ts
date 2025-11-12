import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useLetterStore } from '@/features/Letter/stores/letterStore';
import type { LetterContext } from '@/features/Letter/types/LetterTypes';

describe('useLetterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Initial state', () => {
    it('should have empty contexts', () => {
      const store = useLetterStore();
      expect(store.contexts).toEqual({});
    });

    it('should initialize isPaused to false', () => {
      const store = useLetterStore();
      expect(store.isPaused).toBe(false);
    });

    it('should initialize isAutoRevealing to false', () => {
      const store = useLetterStore();
      expect(store.isAutoRevealing).toBe(false);
    });
  });

  describe('getContext', () => {
    it('should return context when id exists', () => {
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

    it('should return null when id does not exist', () => {
      const store = useLetterStore();
      const result = store.getContext('non-existent');
      expect(result).toBeNull();
    });

    it('should return null when id is null', () => {
      const store = useLetterStore();
      const result = store.getContext(null);
      expect(result).toBeNull();
    });
  });

  describe('setContext', () => {
    it('should set a new context', () => {
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

    it('should overwrite an existing context', () => {
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
    it('should update charsPerRow of an existing context', () => {
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

    it('should do nothing if context does not exist', () => {
      const store = useLetterStore();
      store.setCharsPerRow('non-existent', 10);
      expect(store.contexts['non-existent']).toBeUndefined();
    });
  });

  describe('hasContext', () => {
    it('should return true when context exists', () => {
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

    it('should return false when context does not exist', () => {
      const store = useLetterStore();
      expect(store.hasContext('non-existent')).toBe(false);
    });
  });

  describe('setAutoRevealing', () => {
    it('should set isAutoRevealing to true', () => {
      const store = useLetterStore();
      store.setAutoRevealing(true);
      expect(store.isAutoRevealing).toBe(true);
    });

    it('should set isAutoRevealing to false', () => {
      const store = useLetterStore();
      store.setAutoRevealing(true);
      store.setAutoRevealing(false);
      expect(store.isAutoRevealing).toBe(false);
    });
  });

  describe('setPaused', () => {
    it('should set isPaused to true', () => {
      const store = useLetterStore();
      store.setPaused(true);
      expect(store.isPaused).toBe(true);
    });

    it('should set isPaused to false', () => {
      const store = useLetterStore();
      store.setPaused(true);
      store.setPaused(false);
      expect(store.isPaused).toBe(false);
    });
  });

  describe('revealChar', () => {
    it('should add character index to revealed array', () => {
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

    it('should not add duplicate indices', () => {
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

    it('should do nothing if context does not exist', () => {
      const store = useLetterStore();
      expect(() => store.revealChar('non-existent', 0)).not.toThrow();
    });
  });

  describe('revealAll', () => {
    it('should reveal all characters', () => {
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

    it('should do nothing if context does not exist', () => {
      const store = useLetterStore();
      expect(() => store.revealAll('non-existent')).not.toThrow();
    });
  });

  describe('coverAll', () => {
    it('should hide all characters', () => {
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

    it('should do nothing if context does not exist', () => {
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

    it('should generate a shuffled array for random mode', () => {
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
      expect(new Set(order).size).toBe(5); // all elements are unique
    });

    it('should generate a sequential array for sequential mode', () => {
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

    it('should generate a reverse array for reverse mode', () => {
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

    it('should do nothing if context does not exist', () => {
      const store = useLetterStore();
      expect(() => store.generateOrder('non-existent', 'random')).not.toThrow();
    });
  });
});
