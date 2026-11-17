<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '@/store/index.js'
import { formatTime } from '@/utils/index.js'

const store = useAppStore()
const activeTab = ref('chat')
const tabs = [
	{ key: 'chat', label: '聊天' },
	{ key: 'notify', label: '通知' }
]
const typeIcons = { like: '❤️', comment: '💬', follow: '➕' }
const sortedConversations = computed(() => [...store.conversations].sort((a, b) => {
	const at = a.list[a.list.length - 1]?.createTime || 0
	const bt = b.list[b.list.length - 1]?.createTime || 0
	return bt - at
}))

function openChat(id) {
	store.clearUnread(id)
	uni.navigateTo({ url: `/pages/chat/chat?id=${id}` })
}
function openNote(noteId) {
	if (noteId) uni.navigateTo({ url: `/pages/note-detail/note-detail?id=${noteId}` })
}
function openUser(userId) { uni.navigateTo({ url: `/pages/user/user?id=${userId}` }) }
</script>

<template>
	<view class="page">
		<view class="header">
			<view
				v-for="t in tabs" :key="t.key" class="tab"
				:class="{ active: activeTab === t.key }" @click="activeTab = t.key"
			>
				{{ t.label }}
				<text v-if="t.key === 'chat' && store.unreadMessageCount" class="badge">{{ store.unreadMessageCount }}</text>
			</view>
		</view>

		<!-- 聊天列表 -->
		<view v-if="activeTab === 'chat'" class="list">
			<view v-for="conv in sortedConversations" :key="conv.id" class="chat-item" @click="openChat(conv.id)">
				<image class="avatar" :src="store.getUser(conv.userId).avatar" mode="aspectFill"></image>
				<view class="chat-main">
					<view class="chat-top">
						<text class="chat-name">{{ store.getUser(conv.userId).nickname }}</text>
						<text class="chat-time">{{ formatTime(conv.list[conv.list.length - 1]?.createTime) }}</text>
					</view>
					<view class="chat-bottom">
						<text class="chat-last ellipsis">{{ conv.list[conv.list.length - 1]?.content }}</text>
						<text v-if="conv.unread" class="unread">{{ conv.unread }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 通知列表 -->
		<view v-else class="list">
			<view v-for="m in store.messages" :key="m.id" class="notify-item" @click="openNote(m.noteId)">
				<view class="notify-avatar">
					<image :src="store.getUser(m.userId).avatar" mode="aspectFill"></image>
					<text class="notify-type">{{ typeIcons[m.type] }}</text>
				</view>
				<view class="notify-main">
					<view class="notify-name" @click.stop="openUser(m.userId)">{{ store.getUser(m.userId).nickname }}</view>
					<view class="notify-content">{{ m.content }}</view>
					<view class="notify-time">{{ formatTime(m.createTime) }}</view>
				</view>
				<view v-if="m.noteId" class="notify-cover">
					<image :src="store.getNote(m.noteId)?.images[0]" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff; }
.header { display: flex; justify-content: center; gap: 80rpx; height: 92rpx; align-items: center; border-bottom: 1rpx solid #f0f0f0; }
.tab { font-size: 30rpx; color: #999; position: relative; padding: 16rpx 0; }
.tab.active { color: #333; font-weight: bold; font-size: 34rpx; }
.tab.active::after { content: ''; position: absolute; bottom: 4rpx; left: 50%; transform: translateX(-50%); width: 36rpx; height: 6rpx; background: #ff2442; border-radius: 6rpx; }
.badge { position: absolute; right: -28rpx; top: 8rpx; background: #ff2442; color: #fff; font-size: 18rpx; padding: 2rpx 10rpx; border-radius: 20rpx; }
.list { padding: 0 28rpx; }
.chat-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.avatar { width: 96rpx; height: 96rpx; border-radius: 50%; }
.chat-main { flex: 1; margin-left: 20rpx; min-width: 0; }
.chat-top { display: flex; justify-content: space-between; align-items: center; }
.chat-name { font-size: 30rpx; font-weight: 500; color: #333; }
.chat-time { font-size: 22rpx; color: #bbb; }
.chat-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 10rpx; }
.chat-last { flex: 1; font-size: 26rpx; color: #999; }
.unread { background: #ff2442; color: #fff; font-size: 20rpx; min-width: 34rpx; height: 34rpx; line-height: 34rpx; text-align: center; border-radius: 20rpx; margin-left: 12rpx; }
.notify-item { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.notify-avatar { position: relative; flex-shrink: 0; }
.notify-avatar image { width: 88rpx; height: 88rpx; border-radius: 50%; }
.notify-type { position: absolute; right: -6rpx; bottom: -4rpx; background: #ff2442; border-radius: 50%; width: 34rpx; height: 34rpx; text-align: center; line-height: 34rpx; font-size: 18rpx; border: 2rpx solid #fff; }
.notify-main { flex: 1; margin-left: 20rpx; }
.notify-name { font-size: 28rpx; font-weight: 500; }
.notify-content { font-size: 26rpx; color: #666; margin-top: 6rpx; }
.notify-time { font-size: 22rpx; color: #bbb; margin-top: 8rpx; }
.notify-cover image { width: 88rpx; height: 88rpx; border-radius: 8rpx; margin-left: 16rpx; }
</style>
