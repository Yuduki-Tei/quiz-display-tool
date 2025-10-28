<template>
  <div class="data-sidebar-ep">
    <div class="sidebar-header">
      <h4 class="sidebar-title"></h4>
      <el-switch v-model="showThumbnails" />
    </div>
    <el-scrollbar>
      <vuedraggable
        v-if="dataList.length > 0"
        v-model="dataList"
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
            @click="selectData(element.id)"
          >
            <!-- Image thumbnail -->
            <el-image
              v-if="dataType === 'image'"
              :src="showThumbnails ? element.thumbnailSrc : ''"
              fit="cover"
              class="thumbnail-ep"
            >
              <template #error>
                <div class="thumbnail-slot-error">
                  <Icon name="PhImage" />
                </div>
              </template>
            </el-image>
            <!-- Text thumbnail -->
            <div v-else class="thumbnail-ep text-thumbnail">
              {{ showThumbnails ? element.thumbnailSrc : "" }}
            </div>
            <span class="filename">{{
              showThumbnails
                ? element.name
                : dataStore.getIndexById(element.id) + 1
            }}</span>
            <Button
              type="danger"
              size="small"
              circle
              plain
              class="delete-btn"
              icon="PhTrash"
              icon-size="16"
              @click.stop="handleDelete(element.id)"
            />
          </div>
        </template>
      </vuedraggable>
      <el-empty v-else description=" ">
        <Button type="primary" icon="PhBoxArrowUp" @click="handleImport" />
      </el-empty>
    </el-scrollbar>
    <div v-if="dataList.length > 0" class="sidebar-footer">
      <Button icon="PhBoxArrowDown" @click="handleExport" />
    </div>
    <DataManager
      ref="dataManagerRef"
      :dataStore="dataStore"
      :extraStore="props.extraStore"
      :dataType="props.dataType"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import vuedraggable from "vuedraggable";
import Icon from "@/components/Icon.vue";
import Button from "@/components/Button.vue";
import DataManager from "./DataManager.vue";

const props = defineProps<{
  currentId: string | null;
  dataStore: any;
  extraStore: any;
  dataType: "image" | "text";
}>();

const emit = defineEmits<{
  (e: "select-data", id: string): void;
}>();

const dataStore = props.dataStore;
const allData = computed(() => dataStore.allData);

const extraStore = props.extraStore;
const showThumbnails = ref(true);

const dataManagerRef = ref<InstanceType<typeof DataManager> | null>(null);

const dataList = computed({
  get: () => allData.value,
  set: (newOrder) => {
    dataStore.updateOrder(newOrder);
  },
});

const selectData = (id: string) => {
  emit("select-data", id);
};

const handleDelete = (id: string) => {
  dataStore.removeData(id);
  extraStore.removeContext(id);
};

const handleImport = () => {
  dataManagerRef.value?.triggerImport();
};

const handleExport = () => {
  dataManagerRef.value?.handleExport();
};
</script>

<style scoped>
.data-sidebar-ep {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 0.5rem;
  padding-right: 0;
  padding-bottom: 1rem;
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
  background-color: var(--el-color-primary-light-5);
}

.list-item-ep.not-selected {
  color: var(--el-color-warning);
}

.list-item-ep.not-selected.is-active {
  background-color: var(--el-color-warning-light-8);
}

.thumbnail-ep {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border-radius: 4px;
  flex-shrink: 0;
}

.text-thumbnail {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  font-size: 12px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 4px;
}

.thumbnail-slot-error {
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

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--el-color-primary-light-5);
  display: flex;
  justify-content: flex-end;
}
</style>
