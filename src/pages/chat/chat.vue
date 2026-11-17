<script setup>
import { computed, ref, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useAppStore } from '@/store/index.js'
import { formatTime, toast, uid } from '@/utils/index.js'

const store = useAppStore()
const convId = ref('conv1')
const peerId = ref('u1')
const text = ref('')
// 聊天记录仅存在于当前页面：进页面时从 mock 会话拷贝一份本地副本，发送/回复只改这里，离开页面即失效
const messages = ref([])
const isTyping = ref(false)
const scrollIntoId = ref('')
const replying = ref(false)

const peer = computed(() => store.getUser(peerId.value))
const myId = computed(() => store.currentUser.id)

// 模拟对方的自动回复语料
const autoReplies = [
	'好呀～ 听起来不错！',
	'哈哈哈，真的吗 😆',
	'我也这么觉得！',
	'改天一起呀～',
	'谢谢你的喜欢 ❤️',
	'这个主意不错，回头试试',
	'收到收到 🙌'
]

onLoad((o) => {
	convId.value = o.id || 'conv1'
	store.clearUnread(convId.value)
	const conv = store.conversations.find(c => c.id === convId.value) || store.conversations[0]
	peerId.value = conv.userId
	messages.value = conv.list.map(m => ({ ...m })) // 本地副本，与全局 store 解耦
	uni.setNavigationBarTitle({ title: peer.value?.nickname || '聊天' })
	scrollToLatest()
})

function scrollToLatest() {
	nextTick(() => {
		const last = messages.value[messages.value.length - 1]
		if (last) scrollIntoId.value = 'msg-' + last.id
	})
}

function send() {
	const content = text.value.trim()
	if (!content) { toast('请输入内容'); return }
	// 自己的消息（仅本地）
	messages.value.push({ id: uid('cm'), from: myId.value, content, createTime: Date.now() })
	text.value = ''
	scrollToLatest()
	// 模拟对方回复：先显示"正在输入"，延时后追加一条回复（仅当前页面）
	if (!replying.value) {
		replying.value = true
		isTyping.value = true
		scrollToLatest()
		const delay = 700 + Math.floor(Math.random() * 800)
		setTimeout(() => {
			const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)]
			messages.value.push({ id: uid('cm'), from: peerId.value, content: reply, createTime: Date.now() })
			isTyping.value = false
			replying.value = false
			scrollToLatest()
		}, delay)
	}
}

function onInputFocus() { scrollToLatest() }
</script>

<template>
	<view class="page">
		<scroll-view
			class="messages" scroll-y :scroll-into-view="scrollIntoId" scroll-with-animation
		>
			<view v-for="m in messages" :key="m.id" :id="'msg-' + m.id" class="msg-row" :class="{ mine: m.from === myId }">
				<image v-if="m.from !== myId" class="msg-avatar" :src="peer.avatar" mode="aspectFill"></image>
				<view class="bubble-wrap">
					<view class="msg-time">{{ formatTime(m.createTime) }}</view>
					<view class="bubble">{{ m.content }}</view>
				</view>
				<image v-if="m.from === myId" class="msg-avatar" :src="store.currentUser.avatar" mode="aspectFill"></image>
			</view>
			<!-- 对方正在输入 -->
			<view v-if="isTyping" class="msg-row">
				<image class="msg-avatar" :src="peer.avatar" mode="aspectFill"></image>
				<view class="bubble typing"><text class="dot"></text><text class="dot"></text><text class="dot"></text></view>
			</view>
		</scroll-view>

		<view class="input-bar">
			<input
				v-model="text" class="input" placeholder="发条消息..." confirm-type="send"
				:cursor-spacing="20" :adjust-position="true"
				@confirm="send" @focus="onInputFocus"
			></input>
			<view class="send-btn" @click="send">发送</view>
		</view>
	</view>
</template>

<style scoped>
.page { height: 100vh; background: #f7f7f7; }
/* 输入栏 fixed 后脱离文档流，消息区底部留白避免最后一条消息被遮挡 */
.messages { height: 100%; padding: 24rpx 24rpx 160rpx; overflow-y: auto; box-sizing: border-box; }
.msg-row { display: flex; align-items: flex-start; margin-bottom: 30rpx; gap: 16rpx; }
.msg-row.mine { flex-direction: row-reverse; }
.msg-avatar { width: 72rpx; height: 72rpx; border-radius: 50%; flex-shrink: 0; }
.bubble-wrap { display: flex; flex-direction: column; max-width: 70%; }
.mine .bubble-wrap { align-items: flex-end; }
.msg-time { font-size: 20rpx; color: #bbb; margin: 0 8rpx 8rpx; }
.bubble { background: #fff; padding: 20rpx 24rpx; border-radius: 8rpx 20rpx 20rpx 20rpx; font-size: 28rpx; line-height: 1.5; word-break: break-all; }
.mine .bubble { background: #ff2442; color: #fff; border-radius: 20rpx 8rpx 20rpx 20rpx; }
/* 正在输入的三个跳动圆点 */
.typing { display: flex; gap: 8rpx; align-items: center; padding: 26rpx 24rpx; }
.dot { width: 12rpx; height: 12rpx; border-radius: 50%; background: #bbb; animation: blink 1.2s infinite; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-6rpx); } }
.input-bar {
	position: fixed; bottom: 0; left: 0; right: 0; z-index: 20;
	display: flex; align-items: center; gap: 16rpx; padding: 16rpx 24rpx;
	background: #fff; border-top: 1rpx solid #eee;
}
/* App 端：避让 iPhone home indicator */
/* #ifdef APP-PLUS */
.input-bar { padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); }
.messages { padding-bottom: calc(160rpx + env(safe-area-inset-bottom)); }
/* #endif */
/* 必须给 uni-input 显式 height：H5 端靠 padding 撑高会导致内部原生 input 高度算成 0，点击无法聚焦 */
.input { flex: 1; height: 80rpx; line-height: 80rpx; background: #f5f5f5; border-radius: 40rpx; padding: 0 28rpx; font-size: 28rpx; }
.send-btn { background: #ff2442; color: #fff; padding: 18rpx 32rpx; border-radius: 40rpx; font-size: 26rpx; }
</style>
