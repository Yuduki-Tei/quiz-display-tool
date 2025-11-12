import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import LetterManager from "@/features/Letter/LetterManager.vue";
import { useTextStore } from "@/stores/dataStore";
import { useLetterStore } from "@/features/Letter/stores/letterStore";
import type { TextData } from "@/@types/types";

// Helper to get typed component instance
const getVm = (wrapper: ReturnType<typeof mount>) => wrapper.vm as any;

// Mock i18n
vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Letter component
vi.mock("@/features/Letter/views/Letter.vue", () => ({
  default: {
    name: "Letter",
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

describe("LetterManager Integration Tests", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("Initial Rendering", () => {
    it("Should render the component successfully", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find(".manager-layout").exists()).toBe(true);
    });

    it("Should display main UI sections", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(wrapper.find(".manager-top-bar").exists()).toBe(true);
      expect(wrapper.find(".display-area").exists()).toBe(true);
      expect(wrapper.find(".floating-play-button").exists()).toBe(false); // Default is manual mode
    });

    it("Should display file toolbar buttons", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      const fileUtils = wrapper.find(".top-bar-section.file-utils");
      expect(fileUtils.exists()).toBe(true);
    });

    it("Should display common utility buttons", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      const commonUtils = wrapper.find(".top-bar-section.common-utils");
      expect(commonUtils.exists()).toBe(true);
    });
  });

  describe("Data Navigation Functionality", () => {
    it("Should disable navigation buttons when there is no data", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      const textStore = useTextStore();
      expect(textStore.canGoPrev).toBe(false);
      expect(textStore.canGoNext).toBe(false);
    });

    it("Should enable navigation buttons when there are multiple data items", async () => {
      const textStore = useTextStore();
      const letterStore = useLetterStore();

      const mockData1: TextData = {
        id: "text-1",
        name: "Test 1",
        content: "Hello World",
        thumbnailSrc: null,
      };
      const mockData2: TextData = {
        id: "text-2",
        name: "Test 2",
        content: "Hello Again",
        thumbnailSrc: null,
      };

      textStore.addData(mockData1);
      textStore.addData(mockData2);

      letterStore.setContext("text-1", {
        totalChars: mockData1.content.length,
        charsPerRow: 10,
        revealed: [],
        isManual: true,
        autoRevealMode: "random",
        charsPerSecond: 5,
      });

      letterStore.setContext("text-2", {
        totalChars: mockData2.content.length,
        charsPerRow: 10,
        revealed: [],
        isManual: true,
        autoRevealMode: "random",
        charsPerSecond: 5,
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

  describe("Sidebar Functionality", () => {
    it("Should hide the sidebar initially", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      const managerLayout = wrapper.findComponent({ name: "ManagerLayout" });
      expect(managerLayout.vm.isSidebarVisible).toBe(false);
    });
  });

  describe("Character Display Control", () => {
    it("Should correctly initialize charsPerRow", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).charsPerRow).toBe(10);
    });

    it("Should correctly initialize manual mode", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).isManual).toBe(true);
    });

    it("Should correctly initialize charsPerSecond", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).charsPerSecond).toBe(5);
    });
  });

  describe("Auto Play Mode", () => {
    it("Should hide the floating play button in manual mode", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).isManual).toBe(true);
      expect(wrapper.find(".floating-play-button").exists()).toBe(false);
    });

    it("Should correctly set the default autoRevealMode", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).autoRevealMode).toBe("random");
    });
  });

  describe("Store Synchronization", () => {
    it("Should synchronize currentId when currentData exists", async () => {
      const textStore = useTextStore();
      const mockData: TextData = {
        id: "text-1",
        name: "Test",
        content: "Hello",
        thumbnailSrc: null,
      };

      textStore.addData(mockData);

      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).currentId).toBe("text-1");
    });

    it("Should have currentId as null when there is no data", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).currentId).toBe(null);
    });

    it("Should correctly calculate canShowAll", async () => {
      const textStore = useTextStore();
      const letterStore = useLetterStore();

      const mockData: TextData = {
        id: "text-1",
        name: "Test",
        content: "Hello",
        thumbnailSrc: null,
      };

      textStore.addData(mockData);

      letterStore.setContext("text-1", {
        totalChars: 5,
        charsPerRow: 5,
        revealed: [0, 1],
        isManual: true,
        autoRevealMode: "random",
        charsPerSecond: 5,
      });

      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).canShowAll).toBe(true);
    });

    it("Should correctly calculate canHideAll", async () => {
      const textStore = useTextStore();
      const letterStore = useLetterStore();

      const mockData: TextData = {
        id: "text-1",
        name: "Test",
        content: "Hello",
        thumbnailSrc: null,
      };

      textStore.addData(mockData);

      letterStore.setContext("text-1", {
        totalChars: 5,
        charsPerRow: 5,
        revealed: [0, 1, 2],
        isManual: true,
        autoRevealMode: "random",
        charsPerSecond: 5,
      });

      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      await getVm(wrapper).$nextTick();

      expect(getVm(wrapper).canHideAll).toBe(true);
    });

    it("Should correctly calculate isSomeRevealed", async () => {
      const textStore = useTextStore();
      const letterStore = useLetterStore();

      const mockData: TextData = {
        id: "text-1",
        name: "Test",
        content: "Hello",
        thumbnailSrc: null,
      };

      textStore.addData(mockData);

      letterStore.setContext("text-1", {
        totalChars: 5,
        charsPerRow: 5,
        revealed: [0, 1],
        isManual: true,
        autoRevealMode: "random",
        charsPerSecond: 5,
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

  describe("File Upload", () => {
    it("Should have a hidden file input element", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      const fileInput = wrapper.find('input[type="file"]');
      expect(fileInput.exists()).toBe(true);
      expect(fileInput.attributes("accept")).toBe(".txt");
      expect(fileInput.attributes("style")).toContain("display: none");
    });
  });

  describe("reveal modes", () => {
    it("Should have three reveal modes", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      expect(getVm(wrapper).revealModes).toHaveLength(3);
      expect(getVm(wrapper).revealModes[0].value).toBe("random");
      expect(getVm(wrapper).revealModes[1].value).toBe("sequential");
      expect(getVm(wrapper).revealModes[2].value).toBe("reverse");
    });
  });

  describe("computed properties", () => {
    it("charsPerSecondControl should sync with store and update context", async () => {
      const textStore = useTextStore();
      const letterStore = useLetterStore();
      textStore.addData({
        id: "text-1",
        name: "Test",
        content: "HelloWorld",
        thumbnailSrc: null,
      });
      letterStore.setContext("text-1", {
        totalChars: 10,
        charsPerRow: 10,
        revealed: [],
        isManual: false,
        autoRevealMode: "random",
        charsPerSecond: 5,
      });
      const wrapper = mount(LetterManager, {
        global: { plugins: [pinia] },
      });
      await getVm(wrapper).$nextTick();
      expect(getVm(wrapper).charsPerSecond).toBe(5);
      // simulate slider/input change via computed setter
      getVm(wrapper).charsPerSecondControl = 8;
      await getVm(wrapper).$nextTick();
      const ctx = letterStore.getContext("text-1");
      expect(ctx?.charsPerSecond).toBe(8);
    });

    it("revealTypeButton should display the correct icon based on isManual", () => {
      const wrapper = mount(LetterManager, {
        global: {
          plugins: [pinia],
        },
      });

      getVm(wrapper).isManual = true;
      expect(getVm(wrapper).revealTypeButton.icon).toBe("PhCursorClick");

      getVm(wrapper).isManual = false;
      expect(getVm(wrapper).revealTypeButton.icon).toBe("PhClockClockwise");
    });
  });
});
