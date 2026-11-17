<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useAppStore } from '@/store/index.js'
import { formatTime, toast } from '@/utils/index.js'

const store = useAppStore()
const convId = ref('conv1')
const text = ref('')
const conv = computed(() => store.conversations.find(c => c.id === convId.value) || store.conversations[0])
const peer = computed(() => store.getUser(conv.value?.userId))

onLoad((o) => {
	convId.value = o.id || 'conv1'
	store.clearUnread(convId.value)
	uni.setNavigationBarTitle({ title: peer.value?.nickname || '聊天' })
})
function send() {
	if (!text.value.trim()) { toast('请输入内容'); return }
	store.sendMessage(convId.value, text.value.trim())
	text.value = ''
}
</script>

<template>
	<view class="page">
		<view class="messages">
			<view v-for="m in conv.list" :key="m.id" class="msg-row" :class="{ mine: m.from === store.currentUser.id }">
				<image v-if="m.from !== store.currentUser.id" class="msg-avatar" :src="peer.avatar" mode="aspectFill"></image>
				<view class="bubble">{{ m.content }}</view>
				<image v-if="m.from === store.currentUser.id" class="msg-avatar" :src="store.currentUser.avatar" mode="aspectFill"></image>
			</view>
		</view>
		<view class="input-bar">
			<input v-model="text" class="input" placeholder="发条消息..." confirm-type="send" @confirm="send"></input>
			<view class="send-btn" @click="send">发送</view>
		</view>
	</view>
</template>

<style scoped>
.page { height: 100vh; background: #f7f7f7; display: flex; flex-direction: column; }
.messages { flex: 1; padding: 24rpx; overflow-y: auto; }
.msg-row { display: flex; align-items: flex-start; margin-bottom: 30rpx; gap: 16rpx; }
.msg-row.mine { flex-direction: row-reverse; }
.msg-avatar { width: 72rpx; height: 72rpx; border-radius: 50%; flex-shrink: 0; }
.bubble { max-width: 70%; background: #fff; padding: 20rpx 24rpx; border-radius: 8rpx 20rpx 20rpx 20rpx; font-size: 28rpx; line-height: 1.5; word-break: break-all; }
.mine .bubble { background: #ff2442; color: #fff; border-radius: 20rpx 8rpx 20rpx 20rpx; }
.input-bar { display: flex; align-items: center; gap: 16rpx; padding: 16rpx 24rpx; background: #fff; border-top: 1rpx solid #eee; }
.input { flex: 1; background: #f5f5f5; border-radius: 40rpx; padding: 18rpx 28rpx; font-size: 28rpx; }
.send-btn { background: #ff2442; color: #fff; padding: 18rpx 32rpx; border-radius: 40rpx; font-size: 26rpx; }
</style>
