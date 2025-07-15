<template>
  <div class="image-sidebar-ep">
    <div class="sidebar-header">
      <h4 class="sidebar-title"></h4>
      <el-switch
        v-model="showThumbnails"
        :active-action-icon="View"
        :inactive-action-icon="Hide"
      />
    </div>
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
            :class="{
              'is-active': element.id === currentId,
              'not-selected': !extraStore?.hasSelection?.(element.id),
            }"
            @click="selectImage(element.id)"
          >
            <el-image
              :src="showThumbnails ? element.thumbnailSrc : ''"
              fit="cover"
              class="thumbnail-ep"
            >
              <template #error>
                <div class="image-slot-error">
                  <Icon name="Picture" />
                </div>
              </template>
            </el-image>
            <span class="filename">{{
              showThumbnails
                ? element.name
                : imageStore.getIndexById(element.id) + 1
            }}</span>
            <Button
              type="danger"
              size="small"
              circle
              plain
              class="delete-btn"
              icon="Delete"
              icon-size="16"
              @click.stop="handleDelete(element.id)"
            />
          </div>
        </template>
      </vuedraggable>
      <el-empty v-else description=" " />
    </el-scrollbar>
    <div class="sidebar-footer">
      <DataManager />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useImageStore } from "@/stores/imageStore";
import { storeToRefs } from "pinia";
import vuedraggable from "vuedraggable";
import Icon from "@/components/Icon.vue";
import Button from "@/components/Button.vue";
import { View, Hide } from "@element-plus/icons-vue";
import DataManager from "./DataManager.vue";

const props = defineProps<{
  currentId: string | null;
  extraStore: any;
}>();

const emit = defineEmits<{
  (e: "select-image", id: string): void;
}>();

const imageStore = useImageStore();
const { allData } = storeToRefs(imageStore);

const extraStore = props.extraStore;
const showThumbnails = ref(true);

const imageList = computed({
  get: () => allData.value,
  set: (newOrder) => {
    imageStore.updateOrder(newOrder);
  },
});

const selectImage = (id: string) => {
  emit("select-image", id);
};

const handleDelete = (id: string) => {
  imageStore.removeData(id);
};
</script>

<style scoped>
.image-sidebar-ep {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 0.5rem;
}

.list-item-ep {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, box-shadow 0.3s;
  margin-bottom: 4px;
  position: relative;
}

.list-item-ep:hover {
  background-color: var(--el-color-info);
}

.list-item-ep .delete-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.2s;
}

.list-item-ep:hover .delete-btn {
  opacity: 1;
}

.list-item-ep.is-active {
  background-color: var(--el-color-primary-light-9);
}

.list-item-ep.not-selected {
  color: var(--el-color-warning);
}

.list-item-ep.not-selected.is-active {
  background-color: var(--el-color-warning-light-9);
}

.thumbnail-ep {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border-radius: 4px;
  flex-shrink: 0;
}

.image-slot-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: var(--el-text-color-secondary);
  font-size: 20px;
}

.filename {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 30px;
}

.ghost {
  opacity: 0.5;
}
.sidebar-header {
  padding-right: 0;
  padding-bottom: 1rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--el-color-primary-light-5);
  display: flex;
  justify-content: flex-end;
}
</style>
