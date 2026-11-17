<script setup>
/**
 * 底部安全区占位组件 —— README「底部安全区」差异点
 * iPhone X+ / 全面屏 App、小程序底部有 Home 指示条区域。
 * App/小程序：用 JS 计算 safeArea bottom 高度（px）
 * H5：用 CSS env(safe-area-inset-bottom) 兜底
 */
import { computed } from 'vue'
import { getSafeAreaBottom } from '@/utils/platform.js'
import { isH5 } from '@/utils/platform.js'

const props = defineProps({ bgColor: { type: String, default: 'transparent' } })
const pxHeight = computed(() => getSafeAreaBottom())
</script>

<template>
	<view
		class="safe-bottom"
		:style="{ height: pxHeight + 'px', background: bgColor, paddingBottom: isH5() ? 'env(safe-area-inset-bottom)' : '0' }"
	></view>
</template>

<style scoped>
.safe-bottom { width: 100%; flex-shrink: 0; }
</style>
