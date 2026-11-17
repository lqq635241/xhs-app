<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/index.js'
import { formatCount } from '@/utils/index.js'
import StatusBar from '@/components/StatusBar.vue'

const store = useAppStore()
const videos = computed(() => store.notes.filter(n => n.type === 'video'))
function openVideo(n) { uni.navigateTo({ url: `/pages/note-detail/note-detail?id=${n.id}` }) }
</script>

<template>
	<view class="page">
		<StatusBar bgColor="#000" />
		<view class="video-card" v-for="n in videos" :key="n.id" @click="openVideo(n)">
			<image class="cover" :src="n.images[0]" mode="aspectFill"></image>
			<view class="play-btn">▶</view>
			<view class="video-info">
				<view class="video-title">{{ n.title }}</view>
				<view class="video-meta">
					<image :src="store.getUser(n.userId).avatar" mode="aspectFill"></image>
					<text>{{ store.getUser(n.userId).nickname }}</text>
					<text class="likes">❤️ {{ formatCount(n.likes) }}</text>
				</view>
			</view>
		</view>
		<view v-if="!videos.length" class="empty">暂无视频内容</view>
	</view>
</template>

<style scoped>
.page { min-height: 100vh; background: #000; }
.video-card { position: relative; height: 620rpx; margin-bottom: 4rpx; }
.cover { width: 100%; height: 100%; opacity: 0.85; }
.play-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 110rpx; height: 110rpx; border-radius: 50%; background: rgba(0,0,0,0.45); color: #fff; font-size: 44rpx; text-align: center; line-height: 110rpx; }
.video-info { position: absolute; bottom: 40rpx; left: 28rpx; right: 28rpx; color: #fff; }
.video-title { font-size: 30rpx; font-weight: bold; }
.video-meta { display: flex; align-items: center; gap: 14rpx; margin-top: 16rpx; font-size: 24rpx; }
.video-meta image { width: 48rpx; height: 48rpx; border-radius: 50%; }
.likes { margin-left: auto; }
.empty { color: #666; text-align: center; padding-top: 200rpx; }
</style>
