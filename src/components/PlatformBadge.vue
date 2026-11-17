<script setup>
/** 当前端标识徽标 —— 演示中心用，直观展示代码跑在哪个端 */
import { computed } from 'vue'
import { getPlatform, isIOS } from '@/utils/platform.js'

const platform = computed(() => getPlatform())
const label = computed(() => ({
	app: isIOS() ? 'App · iOS' : 'App · Android',
	'mp-weixin': '微信小程序',
	'mp-alipay': '支付宝小程序',
	h5: 'H5 浏览器',
	unknown: '未知平台'
})[platform.value] || platform.value)
const color = computed(() => ({
	app: '#ff2442', 'mp-weixin': '#07c160', 'mp-alipay': '#1677ff', h5: '#722ed1'
})[platform.value] || '#999')
</script>

<template>
	<view class="badge" :style="{ background: color }">{{ label }}</view>
</template>

<style scoped>
.badge { display: inline-block; color: #fff; font-size: 22rpx; padding: 6rpx 18rpx; border-radius: 24rpx; }
</style>
