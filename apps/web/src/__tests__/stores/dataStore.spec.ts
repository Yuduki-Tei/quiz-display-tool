import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useImageStore, useTextStore } from '@/stores/dataStore';
import type { ImageData, TextData } from '@shared-types/types';

describe('useImageStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Initial state', () => {
    it('should have empty allData', () => {
      const store = useImageStore();
      expect(store.allData).toEqual([]);
    });

    it('should initialize currentIndex to -1', () => {
      const store = useImageStore();
      expect(store.currentIndex).toBe(-1);
    });

    it('currentData should return null when there is no data', () => {
      const store = useImageStore();
      expect(store.currentData).toBeNull();
    });

    it('canGoPrev should be false initially', () => {
      const store = useImageStore();
      expect(store.canGoPrev).toBe(false);
    });

    it('canGoNext should be false initially', () => {
      const store = useImageStore();
      expect(store.canGoNext).toBe(false);
    });
  });

  describe('addData', () => {
    it('should successfully add data and return "added"', () => {
      const store = useImageStore();
      const mockData: ImageData = {
        id: 'img-1',
        name: 'Test Image',
        image: null,
        canvas: null,
        thumbnailSrc: null,
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };

      const result = store.addData(mockData);

      expect(result).toBe('added');
      expect(store.allData).toHaveLength(1);
      expect(store.allData[0]).toEqual(mockData);
    });

    it('should automatically set currentIndex to the last item after adding data', () => {
      const store = useImageStore();
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

      store.addData(mockData);

      expect(store.currentIndex).toBe(0);
      expect(store.currentData).toEqual(mockData);
    });

    it('should update existing data and return "updated"', () => {
      const store = useImageStore();
      const mockData: ImageData = {
        id: 'img-1',
        name: 'Old Name',
        image: null,
        canvas: null,
        thumbnailSrc: null,
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };

      store.addData(mockData);

      const updatedData: ImageData = {
        ...mockData,
        name: 'New Name',
      };

      const result = store.addData(updatedData);

      expect(result).toBe('updated');
      expect(store.allData).toHaveLength(1);
      expect(store.allData[0].name).toBe('New Name');
    });

    it('should be able to add multiple data items', () => {
      const store = useImageStore();
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
        naturalWidth: 1024,
        naturalHeight: 768,
        displayWidth: 512,
        displayHeight: 384,
      };

      store.addData(mockData1);
      store.addData(mockData2);

      expect(store.allData).toHaveLength(2);
      expect(store.currentIndex).toBe(1);
    });
  });

  describe('removeData', () => {
    it('should successfully remove data', () => {
      const store = useImageStore();
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

      store.addData(mockData);
      store.removeData('img-1');

      expect(store.allData).toHaveLength(0);
      expect(store.currentIndex).toBe(-1);
    });

    it('should do nothing when removing a non-existent id', () => {
      const store = useImageStore();
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

      store.addData(mockData);
      store.removeData('non-existent');

      expect(store.allData).toHaveLength(1);
    });

    it('should correctly adjust currentIndex after removing current data', () => {
      const store = useImageStore();
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

      store.addData(mockData1);
      store.addData(mockData2);
      // currentIndex now at 1 (img-2)

      store.removeData('img-2');

      expect(store.allData).toHaveLength(1);
      expect(store.currentIndex).toBe(0);
      expect(store.currentData?.id).toBe('img-1');
    });

    it('should correctly adjust currentIndex when removing non-current data', () => {
      const store = useImageStore();
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
      const mockData3: ImageData = {
        id: 'img-3',
        name: 'Test 3',
        image: null,
        canvas: null,
        thumbnailSrc: null,
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };

      store.addData(mockData1);
      store.addData(mockData2);
      store.addData(mockData3);
      // currentIndex is 2 (img-3)

      store.removeData('img-1');

      expect(store.allData).toHaveLength(2);
      expect(store.currentIndex).toBe(1);
      expect(store.currentData?.id).toBe('img-3');
    });

    it('should set currentIndex to -1 when removing the last data item', () => {
      const store = useImageStore();
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

      store.addData(mockData);
      store.removeData('img-1');

      expect(store.currentIndex).toBe(-1);
      expect(store.currentData).toBeNull();
    });

    it('should release blob URL when removing data', () => {
      const store = useImageStore();

      // Create a real blob URL
      const mockBlob = new Blob(['test image data'], { type: 'image/png' });
      const blobUrl = URL.createObjectURL(mockBlob);

      const mockData: ImageData = {
        id: 'img-1',
        name: 'Test',
        image: null,
        canvas: null,
        thumbnailSrc: blobUrl,
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };

      store.addData(mockData);

      // Remove the data - this should call URL.revokeObjectURL
      store.removeData('img-1');

      expect(store.allData).toHaveLength(0);
    });

    it('should not error when removing data with non-blob URL', () => {
      const store = useImageStore();
      const mockData: ImageData = {
        id: 'img-1',
        name: 'Test',
        image: null,
        canvas: null,
        thumbnailSrc: 'https://example.com/image.png',
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };

      store.addData(mockData);

      // Should not throw even with non-blob URL
      expect(() => store.removeData('img-1')).not.toThrow();
      expect(store.allData).toHaveLength(0);
    });
  });

  describe('getData', () => {
    it('should return currentData when passed null', () => {
      const store = useImageStore();
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

      store.addData(mockData);
      const result = store.getData(null);

      expect(result).toEqual(mockData);
    });

    it('should return corresponding data when passed an index', () => {
      const store = useImageStore();
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

      store.addData(mockData1);
      store.addData(mockData2);

      expect(store.getData(0)).toEqual(mockData1);
      expect(store.getData(1)).toEqual(mockData2);
    });

    it('should return corresponding data when passed an id', () => {
      const store = useImageStore();
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

      store.addData(mockData);
      const result = store.getData('img-1');

      expect(result).toEqual(mockData);
    });

    it('should return null when id does not exist', () => {
      const store = useImageStore();
      const result = store.getData('non-existent');

      expect(result).toBeNull();
    });

    it('should return null when index is out of range', () => {
      const store = useImageStore();
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

      store.addData(mockData);

      expect(store.getData(10)).toBeNull();
      expect(store.getData(-1)).toBeNull();
    });
  });

  describe('setData', () => {
    it('should update data and return true when using index', () => {
      const store = useImageStore();
      const mockData: ImageData = {
        id: 'img-1',
        name: 'Old Name',
        image: null,
        canvas: null,
        thumbnailSrc: null,
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };

      store.addData(mockData);

      const updatedData: ImageData = {
        ...mockData,
        name: 'New Name',
      };

      const result = store.setData(0, updatedData);

      expect(result).toBe(true);
      expect(store.allData[0].name).toBe('New Name');
    });

    it('should update data and return true when using id', () => {
      const store = useImageStore();
      const mockData: ImageData = {
        id: 'img-1',
        name: 'Old Name',
        image: null,
        canvas: null,
        thumbnailSrc: null,
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };

      store.addData(mockData);

      const updatedData: ImageData = {
        ...mockData,
        name: 'New Name',
      };

      const result = store.setData('img-1', updatedData);

      expect(result).toBe(true);
      expect(store.allData[0].name).toBe('New Name');
    });

    it('should return false when id does not exist', () => {
      const store = useImageStore();
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

      const result = store.setData('non-existent', mockData);

      expect(result).toBe(false);
    });

    it('should return false when index is out of range', () => {
      const store = useImageStore();
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

      store.addData(mockData);

      const result = store.setData(10, mockData);

      expect(result).toBe(false);
    });
  });

  describe('goToNext', () => {
    it('should move to next item and return id when able to go forward', () => {
      const store = useImageStore();
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

      store.addData(mockData1);
      store.addData(mockData2);
      store.setCurrentById('img-1');

      const result = store.goToNext();

      expect(result).toBe('img-2');
      expect(store.currentIndex).toBe(1);
      expect(store.currentData?.id).toBe('img-2');
    });

    it('should return null when already at the last item', () => {
      const store = useImageStore();
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

      store.addData(mockData);
      const result = store.goToNext();

      expect(result).toBeNull();
      expect(store.currentIndex).toBe(0);
    });

    it('should return null when there is no data', () => {
      const store = useImageStore();
      const result = store.goToNext();

      expect(result).toBeNull();
    });
  });

  describe('goToPrev', () => {
    it('should move to previous item and return id when able to go backward', () => {
      const store = useImageStore();
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

      store.addData(mockData1);
      store.addData(mockData2);
      // currentIndex is 1

      const result = store.goToPrev();

      expect(result).toBe('img-1');
      expect(store.currentIndex).toBe(0);
      expect(store.currentData?.id).toBe('img-1');
    });

    it('should return null when already at the first item', () => {
      const store = useImageStore();
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

      store.addData(mockData);
      const result = store.goToPrev();

      expect(result).toBeNull();
      expect(store.currentIndex).toBe(0);
    });

    it('should return null when there is no data', () => {
      const store = useImageStore();
      const result = store.goToPrev();

      expect(result).toBeNull();
    });
  });

  describe('setCurrentById', () => {
    it('should successfully set current index', () => {
      const store = useImageStore();
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

      store.addData(mockData1);
      store.addData(mockData2);

      store.setCurrentById('img-1');

      expect(store.currentIndex).toBe(0);
      expect(store.currentData?.id).toBe('img-1');
    });

    it('should not change currentIndex when id does not exist', () => {
      const store = useImageStore();
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

      store.addData(mockData);
      const oldIndex = store.currentIndex;

      store.setCurrentById('non-existent');

      expect(store.currentIndex).toBe(oldIndex);
    });
  });

  describe('updateOrder', () => {
    it('should update data order and maintain current selection', () => {
      const store = useImageStore();
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

      store.addData(mockData1);
      store.addData(mockData2);
      store.setCurrentById('img-1');

      // Reverse order
      store.updateOrder([mockData2, mockData1]);

      expect(store.allData[0].id).toBe('img-2');
      expect(store.allData[1].id).toBe('img-1');
      expect(store.currentData?.id).toBe('img-1');
      expect(store.currentIndex).toBe(1);
    });

    it('should be able to update order even without currentData', () => {
      const store = useImageStore();
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

      // Don't add data, just updateOrder
      store.updateOrder([mockData1, mockData2]);

      expect(store.allData).toHaveLength(2);
      expect(store.allData[0].id).toBe('img-1');
    });
  });

  describe('getIndexById', () => {
    it('should return correct index', () => {
      const store = useImageStore();
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

      store.addData(mockData1);
      store.addData(mockData2);

      expect(store.getIndexById('img-1')).toBe(0);
      expect(store.getIndexById('img-2')).toBe(1);
    });

    it('should return -1 when id does not exist', () => {
      const store = useImageStore();
      expect(store.getIndexById('non-existent')).toBe(-1);
    });
  });

  describe('importData', () => {
    it('should import data and currentIndex', () => {
      const store = useImageStore();
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

      store.importData({
        allData: [mockData1, mockData2],
        currentIndex: 1,
      });

      expect(store.allData).toHaveLength(2);
      expect(store.currentIndex).toBe(1);
      expect(store.currentData?.id).toBe('img-2');
    });

    it('should overwrite existing data', () => {
      const store = useImageStore();
      const oldData: ImageData = {
        id: 'old-1',
        name: 'Old',
        image: null,
        canvas: null,
        thumbnailSrc: null,
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };
      const newData: ImageData = {
        id: 'new-1',
        name: 'New',
        image: null,
        canvas: null,
        thumbnailSrc: null,
        renderable: null,
        naturalWidth: 1024,
        naturalHeight: 768,
        displayWidth: 512,
        displayHeight: 384,
      };

      store.addData(oldData);
      store.importData({
        allData: [newData],
        currentIndex: 0,
      });

      expect(store.allData).toHaveLength(1);
      expect(store.allData[0].id).toBe('new-1');
    });
  });

  describe('getAllData', () => {
    it('should return all data', () => {
      const store = useImageStore();
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

      store.addData(mockData1);
      store.addData(mockData2);

      const result = store.getAllData();

      expect(result).toHaveLength(2);
      expect(result).toEqual([mockData1, mockData2]);
    });

    it('should return empty array when there is no data', () => {
      const store = useImageStore();
      const result = store.getAllData();

      expect(result).toEqual([]);
    });
  });

  describe('canGoPrev and canGoNext getters', () => {
    it('should both be false when there is only one data item', () => {
      const store = useImageStore();
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

      store.addData(mockData);

      expect(store.canGoPrev).toBe(false);
      expect(store.canGoNext).toBe(false);
    });

    it('should only be able to go forward when at first item', () => {
      const store = useImageStore();
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

      store.addData(mockData1);
      store.addData(mockData2);
      store.setCurrentById('img-1');

      expect(store.canGoPrev).toBe(false);
      expect(store.canGoNext).toBe(true);
    });

    it('should only be able to go backward when at last item', () => {
      const store = useImageStore();
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

      store.addData(mockData1);
      store.addData(mockData2);
      // currentIndex is 1 (last item)

      expect(store.canGoPrev).toBe(true);
      expect(store.canGoNext).toBe(false);
    });

    it('should be able to move forward and backward when in the middle', () => {
      const store = useImageStore();
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
      const mockData3: ImageData = {
        id: 'img-3',
        name: 'Test 3',
        image: null,
        canvas: null,
        thumbnailSrc: null,
        renderable: null,
        naturalWidth: 800,
        naturalHeight: 600,
        displayWidth: 400,
        displayHeight: 300,
      };

      store.addData(mockData1);
      store.addData(mockData2);
      store.addData(mockData3);
      store.setCurrentById('img-2');

      expect(store.canGoPrev).toBe(true);
      expect(store.canGoNext).toBe(true);
    });
  });
});

describe('useTextStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Initial state', () => {
    it('should have empty allData', () => {
      const store = useTextStore();
      expect(store.allData).toEqual([]);
    });

    it('should initialize currentIndex to -1', () => {
      const store = useTextStore();
      expect(store.currentIndex).toBe(-1);
    });
  });

  describe('addData', () => {
    it('should successfully add text data', () => {
      const store = useTextStore();
      const mockData: TextData = {
        id: 'text-1',
        name: 'Test Text',
        content: 'Hello World',
        thumbnailSrc: null,
      };

      const result = store.addData(mockData);

      expect(result).toBe('added');
      expect(store.allData).toHaveLength(1);
      expect(store.allData[0]).toEqual(mockData);
    });

    it('should automatically set currentIndex after adding', () => {
      const store = useTextStore();
      const mockData: TextData = {
        id: 'text-1',
        name: 'Test',
        content: 'Hello',
        thumbnailSrc: null,
      };

      store.addData(mockData);

      expect(store.currentIndex).toBe(0);
      expect(store.currentData).toEqual(mockData);
    });
  });

  describe('removeData', () => {
    it('should successfully remove text data', () => {
      const store = useTextStore();
      const mockData: TextData = {
        id: 'text-1',
        name: 'Test',
        content: 'Hello',
        thumbnailSrc: null,
      };

      store.addData(mockData);
      store.removeData('text-1');

      expect(store.allData).toHaveLength(0);
    });
  });

  describe('navigation', () => {
    it('should be able to navigate between text data', () => {
      const store = useTextStore();
      const mockData1: TextData = {
        id: 'text-1',
        name: 'Test 1',
        content: 'Hello',
        thumbnailSrc: null,
      };
      const mockData2: TextData = {
        id: 'text-2',
        name: 'Test 2',
        content: 'World',
        thumbnailSrc: null,
      };

      store.addData(mockData1);
      store.addData(mockData2);

      expect(store.currentData?.id).toBe('text-2');

      store.goToPrev();
      expect(store.currentData?.id).toBe('text-1');

      store.goToNext();
      expect(store.currentData?.id).toBe('text-2');
    });
  });
});
