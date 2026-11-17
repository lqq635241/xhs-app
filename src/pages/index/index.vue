<script setup>
import { computed, ref } from 'vue'
import { onBackPress } from '@dcloudio/uni-app'
import { useAppStore } from '@/store/index.js'
import NoteCard from '@/components/NoteCard.vue'
import Skeleton from '@/components/Skeleton.vue'
import { handleBackPress } from '@/utils/back.js'

const store = useAppStore()
const tabs = [
	{ key: 'follow', label: '关注' },
	{ key: 'discover', label: '发现' },
	{ key: 'nearby', label: '附近' }
]
const activeTab = ref('discover')
const page = ref(1)
const loadingMore = ref(false)
const firstLoading = ref(true) // 首屏骨架屏（App 冷启动优化）
setTimeout(() => { firstLoading.value = false }, 600)

// App 端：首页实体返回键双击退出
onBackPress(() => handleBackPress(true))

const notes = computed(() => {
	let list = [...store.notes]
	if (activeTab.value === 'follow') {
		list = list.filter(n => store.isFollowing(n.userId) || n.userId === store.currentUser.id)
	} else if (activeTab.value === 'nearby') {
		list = list.filter((_, i) => i % 2 === 0)
	}
	return list.slice(0, page.value * 10)
})

// 两列瀑布流：按索引奇偶分配到左右列（前端模拟，无后端排序）
const leftNotes = computed(() => notes.value.filter((_, i) => i % 2 === 0))
const rightNotes = computed(() => notes.value.filter((_, i) => i % 2 === 1))

function switchTab(key) {
	activeTab.value = key
	store.activeTab = key
	page.value = 1
}
function goSearch() { uni.navigateTo({ url: '/pages/search/search' }) }
function onPullDownRefresh() {
	page.value = 1
	setTimeout(() => uni.stopPullDownRefresh(), 700)
}
function onReachBottom() {
	if (loadingMore.value) return
	loadingMore.value = true
	setTimeout(() => { if (page.value * 10 < store.notes.length) page.value++; loadingMore.value = false }, 500)
}
</script>

<template>
	<view class="page">
		<!-- 顶部：关注/发现/附近 Tab + 搜索入口 -->
		<view class="header">
			<view class="tabs">
				<view
					v-for="t in tabs" :key="t.key" class="tab"
					:class="{ active: activeTab === t.key }"
					@click="switchTab(t.key)"
				>{{ t.label }}</view>
			</view>
			<view class="search-icon" @click="goSearch">🔍</view>
		</view>

		<!-- 首屏骨架屏（App 冷启动观感优化） -->
		<Skeleton v-if="firstLoading" :rows="4" />

		<!-- 瀑布流双列 -->
		<view class="waterfall" v-else>
			<view class="column">
				<NoteCard v-for="n in leftNotes" :key="n.id" :note="n" />
			</view>
			<view class="column">
				<NoteCard v-for="n in rightNotes" :key="n.id" :note="n" />
			</view>
		</view>
		<view class="list-end">{{ notes.length >= store.notes.length ? '— 到底啦 —' : '加载中...' }}</view>
	</view>
</template>

<style scoped>
.page { min-height: 100vh; background: #f7f7f7; }
.header {
	position: sticky; top: 0; z-index: 10; display: flex; align-items: center;
	justify-content: center; height: 92rpx; background: #fff; border-bottom: 1rpx solid #f0f0f0;
}
.tabs { display: flex; align-items: center; gap: 48rpx; }
.tab { font-size: 30rpx; color: #999; position: relative; padding: 16rpx 0; }
.tab.active { color: #333; font-weight: bold; font-size: 34rpx; }
.tab.active::after {
	content: ''; position: absolute; bottom: 6rpx; left: 50%; transform: translateX(-50%);
	width: 36rpx; height: 6rpx; border-radius: 6rpx; background: #ff2442;
}
.search-icon { position: absolute; right: 28rpx; font-size: 36rpx; }
.waterfall { display: flex; gap: 16rpx; padding: 20rpx 20rpx 0; align-items: flex-start; }
.column { flex: 1; min-width: 0; }
.list-end { text-align: center; color: #bbb; font-size: 24rpx; padding: 30rpx 0 40rpx; }
</style>
