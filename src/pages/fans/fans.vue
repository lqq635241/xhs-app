<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/store/index.js'
import { toast } from '@/utils/index.js'

const store = useAppStore()
const activeTab = ref('followers')
const tabs = [{ key: 'followers', label: '粉丝' }, { key: 'following', label: '关注' }]
const list = () => activeTab.value === 'followers'
	? store.users.filter(u => u.id !== store.currentUser.id).slice(0, 6)
	: store.users.filter(u => store.isFollowing(u.id))
function toggle(id) { store.toggleFollow(id) }
function openUser(id) { uni.navigateTo({ url: `/pages/user/user?id=${id}` }) }
</script>

<template>
	<view class="page">
		<view class="tabs">
			<view v-for="t in tabs" :key="t.key" :class="{ active: activeTab === t.key }" @click="activeTab = t.key">{{ t.label }}</view>
		</view>
		<view v-for="u in list()" :key="u.id" class="user-item">
			<image :src="u.avatar" mode="aspectFill" @click="openUser(u.id)"></image>
			<view class="user-info" @click="openUser(u.id)">
				<view class="nickname">{{ u.nickname }}</view>
				<view class="desc ellipsis">{{ u.desc }}</view>
			</view>
			<view class="follow-btn" :class="{ following: store.isFollowing(u.id) }" @click="toggle(u.id)">
				{{ store.isFollowing(u.id) ? '已关注' : '+ 关注' }}
			</view>
		</view>
	</view>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff; }
.tabs { display: flex; justify-content: center; gap: 100rpx; height: 90rpx; align-items: center; border-bottom: 1rpx solid #f0f0f0; }
.tabs view { font-size: 30rpx; color: #999; }
.tabs view.active { color: #333; font-weight: bold; }
.user-item { display: flex; align-items: center; padding: 24rpx 28rpx; border-bottom: 1rpx solid #f5f5f5; }
.user-item image { width: 88rpx; height: 88rpx; border-radius: 50%; }
.user-info { flex: 1; margin-left: 20rpx; min-width: 0; }
.nickname { font-size: 28rpx; font-weight: 500; }
.desc { font-size: 24rpx; color: #999; margin-top: 6rpx; }
.follow-btn { padding: 12rpx 28rpx; background: #ff2442; color: #fff; border-radius: 30rpx; font-size: 24rpx; }
.follow-btn.following { background: #f5f5f5; color: #999; }
</style>
