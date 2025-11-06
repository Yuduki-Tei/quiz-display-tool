<template>
  <el-container class="manager-layout">
    <el-main class="manager-main">
      <div class="manager-top-bar">
        <!-- File utils section -->
        <div class="top-bar-section file-utils">
          <Button
            @click="$emit('toggle-sidebar')"
            :disabled="disabled"
            icon="PhSidebarSimple"
            :title="t('sidebar.openSidebar')"
          />
          <slot name="file-input"></slot>
          <el-button-group>
            <Button
              @click="$emit('go-prev')"
              :disabled="!canGoPrev"
              icon="PhArrowLeft"
              :title="t('topbar.previous')"
            />
            <Button
              @click="$emit('go-next')"
              :disabled="!canGoNext"
              icon="PhArrowRight"
              :title="t('topbar.next')"
            />
          </el-button-group>
        </div>

        <!-- Common utils section (feature-specific buttons) -->
        <el-divider direction="vertical" />
        <slot name="common-utils"></slot>

        <!-- Auto play controls section (feature-specific controls) -->
        <el-divider direction="vertical" />
        <slot name="auto-play-controls"></slot>

        <!-- Mode toggle section (feature-specific mode toggle) -->
        <template v-if="$slots['mode-toggle']">
          <el-divider direction="vertical" />
          <slot name="mode-toggle"></slot>
        </template>
      </div>

      <!-- Display area (feature-specific view component) -->
      <div class="display-area">
        <slot name="display"></slot>
      </div>
    </el-main>
  </el-container>

  <!-- Floating play button -->
  <slot name="floating-button"></slot>

  <!-- Sidebar drawer -->
  <el-drawer
    :model-value="sidebarVisible"
    @update:model-value="$emit('update:sidebar-visible', $event)"
    direction="ltr"
    size="280px"
    :with-header="false"
  >
    <slot name="sidebar"></slot>
  </el-drawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Button from '@/components/Button.vue';

interface Props {
  canGoPrev?: boolean;
  canGoNext?: boolean;
  disabled?: boolean;
  sidebarVisible?: boolean;
}

withDefaults(defineProps<Props>(), {
  canGoPrev: false,
  canGoNext: false,
  disabled: false,
  sidebarVisible: false,
});

defineEmits<{
  'toggle-sidebar': [];
  'go-prev': [];
  'go-next': [];
  'update:sidebar-visible': [value: boolean];
}>();

const { t } = useI18n();
</script>

<style scoped>
/* Styles can be moved here from individual managers if they are truly common */
</style>
