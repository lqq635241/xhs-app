<script setup>
/**
 * 骨架屏 —— README「包体积与首屏」差异点
 * App 冷启动较慢，首屏用骨架屏改善观感（App/小程序/H5 均可用）
 */
defineProps({ rows: { type: Number, default: 3 } })
</script>

<template>
	<view class="skeleton">
		<view v-for="i in rows" :key="i" class="sk-row">
			<view class="sk-img"></view>
			<view class="sk-lines">
				<view class="sk-line"></view>
				<view class="sk-line short"></view>
			</view>
		</view>
	</view>
</template>

<style scoped>
.skeleton { padding: 20rpx; }
.sk-row { display: flex; gap: 20rpx; margin-bottom: 30rpx; }
.sk-img { width: 160rpx; height: 160rpx; border-radius: 12rpx; background: #eee; animation: pulse 1.2s infinite; }
.sk-lines { flex: 1; padding-top: 20rpx; }
.sk-line { height: 28rpx; background: #eee; border-radius: 8rpx; margin-bottom: 20rpx; animation: pulse 1.2s infinite; }
.sk-line.short { width: 60%; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>
