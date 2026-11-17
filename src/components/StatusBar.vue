<script setup>
/**
 * 状态栏占位组件 —— README「顶部安全区/状态栏适配」差异点
 * App 端自定义导航时必须用它撑开状态栏高度，避免内容被遮挡。
 * 高度由 platform.getStatusBarHeight() 动态获取（px），H5/小程序通常为 0。
 */
import { computed } from 'vue'
import { getStatusBarHeight, isApp } from '@/utils/platform.js'

const props = defineProps({
	bgColor: { type: String, default: '#ffffff' }
})
const height = computed(() => getStatusBarHeight())
</script>

<template>
	<view class="status-bar" :style="{ height: height + 'px', background: bgColor }"></view>
</template>

<style scoped>
.status-bar { width: 100%; flex-shrink: 0; }
</style>
