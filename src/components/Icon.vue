<template>
    <el-icon :size="size">
        <component :is="iconComponent" />
    </el-icon>
</template>

<script setup lang="ts">
import { computed } from "vue";
import * as Icons from "@element-plus/icons-vue";

const props = withDefaults(
    defineProps<{
        size?: string | null;
        name: string;
    }>(),
    {
        size: "20",
        name: "Plus"
    }
);

const iconComponent = computed(() => Icons[props.name]);
</script>