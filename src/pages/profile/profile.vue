<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '@/store/index.js'
import NoteCard from '@/components/NoteCard.vue'
import { formatCount } from '@/utils/index.js'

const store = useAppStore()
const tabs = [
	{ key: 'notes', label: '笔记' },
	{ key: 'collect', label: '收藏' },
	{ key: 'like', label: '赞过' }
]
const activeTab = ref('notes')
const user = computed(() => store.currentUser)
const list = computed(() => {
	if (activeTab.value === 'collect') return store.collectedNotes
	if (activeTab.value === 'like') return store.likedNotes
	return store.userNotes(user.value.id)
})
const leftList = computed(() => list.value.filter((_, i) => i % 2 === 0))
const rightList = computed(() => list.value.filter((_, i) => i % 2 === 1))

function goEdit() { uni.navigateTo({ url: '/pages/edit-profile/edit-profile' }) }
function goFans() { uni.navigateTo({ url: '/pages/fans/fans' }) }
function goAbility() { uni.navigateTo({ url: '/pages/ability/ability' }) }
function showAgreement() {
	uni.showModal({
		title: '用户协议与隐私政策',
		content: '欢迎使用小红书（演示版）。本应用所有内容均为 Mock 数据。正式 UGC 应用需提供完整的用户协议、隐私政策、内容审核与举报机制以满足 App Store / 各平台合规要求。',
		showCancel: false
	})
}
function showReport() {
	uni.showActionSheet({
		itemList: ['色情低俗', '虚假广告', '侵权内容', '其他违规'],
		success: () => uni.showToast({ title: '举报已提交，我们会尽快处理', icon: 'none' })
	})
}
</script>

<template>
	<view class="page">
		<!-- 背景 + 资料 -->
		<view class="profile-header">
			<view class="bg-decor"></view>
			<view class="user-row">
				<image class="avatar" :src="user.avatar" mode="aspectFill"></image>
				<view class="user-info">
					<view class="nickname">{{ user.nickname }}</view>
					<view class="desc">{{ user.desc }}</view>
					<view class="meta">
						<text class="location">📍 {{ user.location }}</text>
						<text class="gender">{{ user.gender === 'female' ? '♀' : '♂' }}</text>
					</view>
				</view>
				<view class="edit-btn" @click="goEdit">编辑资料</view>
			</view>
			<view class="stats-row" @click="goFans">
				<view class="stat"><text class="stat-num">{{ formatCount(user.following) }}</text><text class="stat-label">关注</text></view>
				<view class="stat"><text class="stat-num">{{ formatCount(user.followers) }}</text><text class="stat-label">粉丝</text></view>
				<view class="stat"><text class="stat-num">{{ formatCount(user.liked) }}</text><text class="stat-label">获赞与收藏</text></view>
			</view>
		</view>

		<!-- Tab -->
		<view class="tabs">
			<view v-for="t in tabs" :key="t.key" class="tab" :class="{ active: activeTab === t.key }" @click="activeTab = t.key">
				{{ t.label }}
			</view>
		</view>

		<!-- 笔记列表 -->
		<view class="waterfall">
			<view class="column"><NoteCard v-for="n in leftList" :key="n.id" :note="n" :show-author="false" /></view>
			<view class="column"><NoteCard v-for="n in rightList" :key="n.id" :note="n" :show-author="false" /></view>
		</view>
		<view v-if="!list.length" class="empty">这里还没有内容，去发布一篇笔记吧～</view>

		<!-- 端能力演示中心入口 + UGC 合规入口 -->
		<view class="tool-section">
			<view class="tool-item ability-entry" @click="goAbility">
				<text class="tool-icon">🧪</text>
				<view class="tool-body">
					<view class="tool-name">端能力演示中心</view>
					<view class="tool-desc">查看 H5 / 小程序 / App 各端差异点</view>
				</view>
				<text class="tool-arrow">›</text>
			</view>
			<view class="tool-item" @click="showAgreement">
				<text class="tool-icon">📄</text>
				<view class="tool-body"><view class="tool-name">用户协议与隐私政策</view></view>
				<text class="tool-arrow">›</text>
			</view>
			<view class="tool-item" @click="showReport">
				<text class="tool-icon">🚩</text>
				<view class="tool-body"><view class="tool-name">内容举报</view></view>
				<text class="tool-arrow">›</text>
			</view>
		</view>
	</view>
</template>

<style scoped>
.page { min-height: 100vh; background: #f7f7f7; }
.profile-header { background: #fff; padding: 0 28rpx 30rpx; position: relative; overflow: hidden; }
.bg-decor { position: absolute; top: 0; left: 0; right: 0; height: 160rpx; background: linear-gradient(135deg, #ffe8ec, #fff5f5); }
.user-row { position: relative; display: flex; align-items: center; padding-top: 40rpx; }
.avatar { width: 130rpx; height: 130rpx; border-radius: 50%; border: 4rpx solid #fff; flex-shrink: 0; }
.user-info { flex: 1; margin-left: 24rpx; min-width: 0; }
.nickname { font-size: 36rpx; font-weight: bold; }
.desc { font-size: 24rpx; color: #666; margin-top: 8rpx; line-height: 1.5; }
.meta { display: flex; gap: 16rpx; margin-top: 10rpx; font-size: 22rpx; color: #999; }
.edit-btn { align-self: flex-start; margin-top: 44rpx; padding: 12rpx 24rpx; border: 1rpx solid #ddd; border-radius: 30rpx; font-size: 24rpx; color: #666; }
.stats-row { display: flex; margin-top: 36rpx; }
.stat { flex: 1; display: flex; flex-direction: column; align-items: center; }
.stat-num { font-size: 34rpx; font-weight: bold; }
.stat-label { font-size: 22rpx; color: #999; margin-top: 6rpx; }
.tabs { display: flex; background: #fff; border-bottom: 1rpx solid #f0f0f0; height: 88rpx; align-items: center; justify-content: center; gap: 100rpx; }
.tab { font-size: 28rpx; color: #999; position: relative; height: 88rpx; line-height: 88rpx; }
.tab.active { color: #333; font-weight: bold; }
.tab.active::after { content: ''; position: absolute; bottom: 10rpx; left: 50%; transform: translateX(-50%); width: 36rpx; height: 6rpx; background: #ff2442; border-radius: 6rpx; }
.waterfall { display: flex; gap: 16rpx; padding: 20rpx; align-items: flex-start; }
.column { flex: 1; min-width: 0; }
.empty { text-align: center; color: #bbb; font-size: 26rpx; padding: 100rpx 0; }
.tool-section { margin: 20rpx; background: #fff; border-radius: 16rpx; overflow: hidden; }
.tool-item { display: flex; align-items: center; padding: 24rpx 28rpx; border-bottom: 1rpx solid #f5f5f5; }
.tool-item:last-child { border-bottom: none; }
.tool-icon { font-size: 40rpx; width: 56rpx; text-align: center; }
.tool-body { flex: 1; margin-left: 16rpx; }
.tool-name { font-size: 28rpx; color: #333; }
.tool-desc { font-size: 22rpx; color: #999; margin-top: 4rpx; }
.ability-entry { background: linear-gradient(90deg, #fff5f6, #fff); }
.ability-entry .tool-name { color: #ff2442; font-weight: 500; }
.tool-arrow { font-size: 40rpx; color: #ccc; }
</style>
