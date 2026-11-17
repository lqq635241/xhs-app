<script setup>
/**
 * 端能力演示条目 —— 演示中心列表项
 * 展示能力名称、当前端是否支持、点击调用结果
 */
import PlatformBadge from './PlatformBadge.vue'

const props = defineProps({
	icon: { type: String, default: '⚙️' },
	name: { type: String, required: true },
	desc: { type: String, default: '' },
	supported: { type: Boolean, default: true },
	result: { type: String, default: '' },
	loading: { type: Boolean, default: false }
})
const emit = defineEmits(['run'])
</script>

<template>
	<view class="ability-item" @click="emit('run')">
		<view class="icon">{{ icon }}</view>
		<view class="body">
			<view class="row">
				<text class="name">{{ name }}</text>
				<text class="support" :class="{ yes: supported, no: !supported }">{{ supported ? '支持' : '不支持' }}</text>
			</view>
			<view class="desc">{{ desc }}</view>
			<view v-if="result" class="result">{{ loading ? '处理中...' : result }}</view>
		</view>
		<view class="arrow">›</view>
	</view>
</template>

<style scoped>
.ability-item { display: flex; align-items: center; padding: 24rpx 28rpx; background: #fff; border-bottom: 1rpx solid #f5f5f5; }
.icon { font-size: 44rpx; width: 60rpx; text-align: center; flex-shrink: 0; }
.body { flex: 1; margin-left: 16rpx; min-width: 0; }
.row { display: flex; align-items: center; gap: 14rpx; }
.name { font-size: 28rpx; font-weight: 500; color: #333; }
.support { font-size: 18rpx; padding: 2rpx 10rpx; border-radius: 8rpx; }
.support.yes { background: #e8f8ee; color: #07c160; }
.support.no { background: #f5f5f5; color: #999; }
.desc { font-size: 22rpx; color: #999; margin-top: 6rpx; }
.result { font-size: 22rpx; color: #ff2442; margin-top: 8rpx; word-break: break-all; }
.arrow { font-size: 40rpx; color: #ccc; }
</style>
