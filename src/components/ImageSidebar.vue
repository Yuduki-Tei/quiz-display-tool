<template>
  <div class="image-sidebar-ep">
    <h4 class="sidebar-title">圖片列表</h4>
    <el-scrollbar>
      <vuedraggable
        v-if="imageList.length > 0"
        v-model="imageList"
        item-key="id"
        class="draggable-list"
        ghost-class="ghost"
        tag="div"
      >
        <template #item="{ element }">
          <div
            class="list-item-ep"
            :class="{ 'is-active': element.id === currentId }"
            @click="selectImage(element.id)"
          >
            <el-image
              :src="element.renderable?.src"
              fit="cover"
              class="thumbnail-ep"
            >
              <template #error>
                <div class="image-slot-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <span class="filename">{{ element.file?.name || element.id }}</span>
          </div>
        </template>
      </vuedraggable>
      <el-empty v-else description="尚未載入圖片" />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useImageStore } from "@/stores/imageStore";
import { storeToRefs } from "pinia";
import vuedraggable from "vuedraggable";
import { Picture } from "@element-plus/icons-vue";

const props = defineProps<{
  currentId: string | null;
}>();

const emit = defineEmits<{
  (e: "select-image", id: string): void;
}>();

const imageStore = useImageStore();
const { allData } = storeToRefs(imageStore);

const imageList = computed({
  get: () => allData.value,
  set: (newOrder) => {
    imageStore.updateOrder(newOrder);
  },
});

const selectImage = (id: string) => {
  emit("select-image", id);
};
</script>

<style scoped>
.image-sidebar-ep {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color-page);
}
.sidebar-title {
  padding: 1rem 1rem 0.5rem;
  margin: 0;
  font-weight: 500;
  color: var(--el-text-color-primary);
}
.el-scrollbar {
  padding: 0 1rem 1rem;
}
.list-item-ep {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
  margin-bottom: 4px;
}
.list-item-ep:hover {
  background-color: var(--el-fill-color-light);
}
.list-item-ep.is-active {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.thumbnail-ep {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border-radius: 4px;
  flex-shrink: 0;
  background-color: var(--el-fill-color);
}
.image-slot-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 20px;
}
.filename {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ghost {
  opacity: 0.5;
  background: var(--el-color-primary-light-8);
}
</style>
