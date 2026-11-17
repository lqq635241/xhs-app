<script setup>
/**
 * 自定义导航栏 —— 综合「状态栏适配 + 返回键 + 各端标题」差异点
 * 演示用：展示如何在 App 端做真正适配原生状态栏的导航，
 * 小程序/H5 可切回原生导航（pages.json 配 navigationStyle: custom 才生效）。
 */
import StatusBar from './StatusBar.vue'

const props = defineProps({
	title: { type: String, default: '' },
	showBack: { type: Boolean, default: true }
})
function goBack() { uni.navigateBack() }
</script>

<template>
	<view class="custom-nav">
		<StatusBar bgColor="#ffffff" />
		<view class="nav-content" :style="{ height: '88rpx' }">
			<view v-if="showBack" class="back" @click="goBack">‹</view>
			<view class="title">{{ title }}</view>
		</view>
	</view>
</template>

<style scoped>
.custom-nav { background: #fff; position: sticky; top: 0; z-index: 50; }
.nav-content { display: flex; align-items: center; position: relative; }
.back { font-size: 56rpx; width: 80rpx; line-height: 1; padding-left: 20rpx; }
.title { position: absolute; left: 0; right: 0; text-align: center; font-size: 32rpx; font-weight: bold; pointer-events: none; }
</style>
