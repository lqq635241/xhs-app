<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/index.js'
import { formatCount } from '@/utils/index.js'

const props = defineProps({
	note: { type: Object, required: true },
	showAuthor: { type: Boolean, default: true }
})
const store = useAppStore()
const author = computed(() => store.getUser(props.note.userId))
const liked = computed(() => store.isLiked(props.note.id))

function openDetail() {
	uni.navigateTo({ url: `/pages/note-detail/note-detail?id=${props.note.id}` })
}
function toggleLike(e) {
	e.stopPropagation && e.stopPropagation()
	store.toggleLike(props.note.id)
}
</script>

<template>
	<view class="note-card" @click="openDetail">
		<view class="cover-wrap">
			<image class="cover" :src="note.images[0]" mode="widthFix" lazy-load></image>
			<view v-if="note.type === 'video'" class="video-badge">▶ 视频</view>
		</view>
		<view class="info">
			<view class="title ellipsis-2">{{ note.title }}</view>
			<view class="author-row" v-if="showAuthor">
				<image class="avatar" :src="author.avatar" mode="aspectFill"></image>
				<text class="nickname ellipsis">{{ author.nickname }}</text>
				<view class="like-box" @click.stop="toggleLike">
					<text class="heart" :class="{ liked }">{{ liked ? '❤️' : '🤍' }}</text>
					<text class="like-num">{{ formatCount(note.likes) }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped>
.note-card {
	background: #fff; border-radius: 16rpx; overflow: hidden; margin-bottom: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
}
.cover-wrap { position: relative; width: 100%; background: #f5f5f5; }
.cover { width: 100%; display: block; }
.video-badge {
	position: absolute; right: 12rpx; top: 12rpx; background: rgba(0,0,0,0.55);
	color: #fff; font-size: 20rpx; padding: 4rpx 12rpx; border-radius: 20rpx;
}
.info { padding: 16rpx 16rpx 18rpx; }
.title { font-size: 27rpx; line-height: 1.4; color: #333; font-weight: 500; min-height: 38rpx; }
.author-row { display: flex; align-items: center; margin-top: 14rpx; }
.avatar { width: 40rpx; height: 40rpx; border-radius: 50%; flex-shrink: 0; }
.nickname { flex: 1; font-size: 22rpx; color: #999; margin-left: 10rpx; }
.like-box { display: flex; align-items: center; flex-shrink: 0; margin-left: 8rpx; }
.heart { font-size: 24rpx; line-height: 1; }
.like-num { font-size: 22rpx; color: #999; margin-left: 6rpx; }
</style>
