<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useAppStore } from '@/store/index.js'
import NoteCard from '@/components/NoteCard.vue'
import { formatCount, toast } from '@/utils/index.js'

const store = useAppStore()
const userId = ref('')
const user = computed(() => store.getUser(userId.value))
const notes = computed(() => store.userNotes(userId.value))
const following = computed(() => store.isFollowing(userId.value))
const leftNotes = computed(() => notes.value.filter((_, i) => i % 2 === 0))
const rightNotes = computed(() => notes.value.filter((_, i) => i % 2 === 1))

onLoad((o) => { userId.value = o.id || 'u1' })
function toggleFollow() {
	store.toggleFollow(userId.value)
	toast(following.value ? '已关注' : '取消关注')
}
function goChat() {
	// 演示：跳到消息页的聊天入口
	uni.navigateTo({ url: '/pages/chat/chat?id=conv1' })
}
</script>

<template>
	<view class="page">
		<view class="header">
			<image class="avatar" :src="user.avatar" mode="aspectFill"></image>
			<view class="info">
				<view class="nickname">{{ user.nickname }}</view>
				<view class="desc">{{ user.desc }}</view>
				<view class="stats">
					<text>{{ formatCount(user.following) }} 关注</text>
					<text>{{ formatCount(user.followers) }} 粉丝</text>
					<text>{{ formatCount(user.liked) }} 获赞</text>
				</view>
			</view>
		</view>
		<view class="actions">
			<view class="chat-btn" @click="goChat">发消息</view>
			<view class="follow-btn" :class="{ following }" @click="toggleFollow">{{ following ? '已关注' : '+ 关注' }}</view>
		</view>
		<view class="tab-bar"><text>笔记 · {{ notes.length }}</text></view>
		<view class="waterfall">
			<view class="column"><NoteCard v-for="n in leftNotes" :key="n.id" :note="n" :show-author="false" /></view>
			<view class="column"><NoteCard v-for="n in rightNotes" :key="n.id" :note="n" :show-author="false" /></view>
		</view>
	</view>
</template>

<style scoped>
.page { min-height: 100vh; background: #f7f7f7; }
.header { display: flex; align-items: center; padding: 40rpx 28rpx 20rpx; background: #fff; }
.avatar { width: 130rpx; height: 130rpx; border-radius: 50%; }
.info { flex: 1; margin-left: 24rpx; }
.nickname { font-size: 34rpx; font-weight: bold; }
.desc { font-size: 24rpx; color: #666; margin-top: 8rpx; }
.stats { display: flex; gap: 24rpx; font-size: 22rpx; color: #999; margin-top: 14rpx; }
.actions { display: flex; gap: 20rpx; padding: 0 28rpx 28rpx; background: #fff; }
.chat-btn, .follow-btn { flex: 1; text-align: center; padding: 18rpx 0; border-radius: 40rpx; font-size: 28rpx; }
.chat-btn { border: 1rpx solid #ddd; color: #666; }
.follow-btn { background: #ff2442; color: #fff; }
.follow-btn.following { background: #f5f5f5; color: #999; }
.tab-bar { padding: 24rpx 28rpx; background: #fff; font-size: 28rpx; font-weight: bold; margin-bottom: 20rpx; }
.waterfall { display: flex; gap: 16rpx; padding: 0 20rpx; align-items: flex-start; }
.column { flex: 1; min-width: 0; }
</style>
