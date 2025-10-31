import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useImageStore, useTextStore } from '@/stores/dataStore';
import type { ImageData, TextData } from '@/@types/types';

describe('useImageStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('初始狀態', () => {
    it('應該有空的 allData', () => {
      const store = useImageStore();
      expect(store.allData).toEqual([]);
    });

    it('應該初始化 currentIndex 為 -1', () => {
      const store = useImageStore();
      expect(store.currentIndex).toBe(-1);
    });

    it('currentData 應該在沒有資料時回傳 null', () => {
      const store = useImageStore();
      expect(store.currentData).toBeNull();
    });

    it('canGoPrev 應該在初始時為 false', () => {
      const store = useImageStore();
      expect(store.canGoPrev).toBe(false);
    });

    it('canGoNext 應該在初始時為 false', () => {
      const store = useImageStore();
      expect(store.canGoNext).toBe(false);
    });
  });

  describe('addData', () => {
    it('應該成功新增資料並回傳 "added"', () => {
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

    it('應該在新增資料後自動設定 currentIndex 為最後一筆', () => {
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

    it('應該更新已存在的資料並回傳 "updated"', () => {
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

    it('應該能夠新增多筆資料', () => {
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
    it('應該成功刪除資料', () => {
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

    it('應該在刪除不存在的 id 時不做任何事', () => {
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

    it('應該在刪除當前資料後正確調整 currentIndex', () => {
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

    it('應該在刪除非當前資料時正確調整 currentIndex', () => {
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

    it('應該在刪除最後一筆資料時設定 currentIndex 為 -1', () => {
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

    it('應該在刪除資料時釋放 blob URL', () => {
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

    it('應該在刪除非 blob URL 的資料時不會出錯', () => {
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
    it('應該在傳入 null 時回傳 currentData', () => {
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

    it('應該在傳入 index 時回傳對應的資料', () => {
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

    it('應該在傳入 id 時回傳對應的資料', () => {
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

    it('應該在 id 不存在時回傳 null', () => {
      const store = useImageStore();
      const result = store.getData('non-existent');

      expect(result).toBeNull();
    });

    it('應該在 index 超出範圍時回傳 null', () => {
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
    it('應該在使用 index 時更新資料並回傳 true', () => {
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

    it('應該在使用 id 時更新資料並回傳 true', () => {
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

    it('應該在 id 不存在時回傳 false', () => {
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

    it('應該在 index 超出範圍時回傳 false', () => {
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
    it('應該在可以前進時移動到下一筆並回傳 id', () => {
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

    it('應該在已經是最後一筆時回傳 null', () => {
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

    it('應該在沒有資料時回傳 null', () => {
      const store = useImageStore();
      const result = store.goToNext();

      expect(result).toBeNull();
    });
  });

  describe('goToPrev', () => {
    it('應該在可以後退時移動到上一筆並回傳 id', () => {
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

    it('應該在已經是第一筆時回傳 null', () => {
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

    it('應該在沒有資料時回傳 null', () => {
      const store = useImageStore();
      const result = store.goToPrev();

      expect(result).toBeNull();
    });
  });

  describe('setCurrentById', () => {
    it('應該成功設定當前 index', () => {
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

    it('應該在 id 不存在時不改變 currentIndex', () => {
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
    it('應該更新資料順序並保持當前選取', () => {
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

    it('應該在沒有 currentData 時也能更新順序', () => {
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
    it('應該回傳正確的 index', () => {
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

    it('應該在 id 不存在時回傳 -1', () => {
      const store = useImageStore();
      expect(store.getIndexById('non-existent')).toBe(-1);
    });
  });

  describe('importData', () => {
    it('應該匯入資料和 currentIndex', () => {
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

    it('應該覆蓋現有資料', () => {
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
    it('應該回傳所有資料', () => {
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

    it('應該在沒有資料時回傳空陣列', () => {
      const store = useImageStore();
      const result = store.getAllData();

      expect(result).toEqual([]);
    });
  });

  describe('canGoPrev and canGoNext getters', () => {
    it('應該在只有一筆資料時兩者都為 false', () => {
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

    it('應該在第一筆時只能前進', () => {
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

    it('應該在最後一筆時只能後退', () => {
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

    it('應該在中間時可以前後移動', () => {
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

  describe('初始狀態', () => {
    it('應該有空的 allData', () => {
      const store = useTextStore();
      expect(store.allData).toEqual([]);
    });

    it('應該初始化 currentIndex 為 -1', () => {
      const store = useTextStore();
      expect(store.currentIndex).toBe(-1);
    });
  });

  describe('addData', () => {
    it('應該成功新增文字資料', () => {
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

    it('應該在新增後自動設定 currentIndex', () => {
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
    it('應該成功刪除文字資料', () => {
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
    it('應該能在文字資料間導航', () => {
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
