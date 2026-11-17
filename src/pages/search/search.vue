<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '@/store/index.js'
import NoteCard from '@/components/NoteCard.vue'
import { hotSearches } from '@/mock/data.js'

const store = useAppStore()
const keyword = ref('')
const searched = ref(false)
const results = computed(() => {
	if (!keyword.value.trim()) return []
	const kw = keyword.value.trim().toLowerCase()
	return store.notes.filter(n =>
		n.title.toLowerCase().includes(kw) ||
		n.desc.toLowerCase().includes(kw) ||
		n.tags.some(t => t.toLowerCase().includes(kw))
	)
})
const leftResults = computed(() => results.value.filter((_, i) => i % 2 === 0))
const rightResults = computed(() => results.value.filter((_, i) => i % 2 === 1))

function doSearch(kw) {
	if (kw) keyword.value = kw
	if (!keyword.value.trim()) return
	searched.value = true
	store.addSearchHistory(keyword.value.trim())
	uni.hideKeyboard()
}
function clearInput() { keyword.value = ''; searched.value = false }
function goBack() { uni.navigateBack() }
</script>

<template>
	<view class="page">
		<StatusBar />
		<!-- 搜索栏 -->
		<view class="search-bar">
			<text class="back" @click="goBack">‹</text>
			<view class="input-wrap">
				<text class="search-ico">🔍</text>
				<input
					v-model="keyword" class="input" placeholder="搜索你感兴趣的内容"
					confirm-type="search" @confirm="doSearch()" :focus="true"
				></input>
				<text v-if="keyword" class="clear" @click="clearInput">✕</text>
			</view>
			<text class="search-btn" @click="doSearch()">搜索</text>
		</view>

		<!-- 搜索结果 -->
		<view v-if="searched" class="results">
			<view class="result-tip">找到 {{ results.length }} 篇相关笔记</view>
			<view v-if="results.length" class="waterfall">
				<view class="column"><NoteCard v-for="n in leftResults" :key="n.id" :note="n" /></view>
				<view class="column"><NoteCard v-for="n in rightResults" :key="n.id" :note="n" /></view>
			</view>
			<view v-else class="empty">没有找到相关内容，换个关键词试试～</view>
		</view>

		<!-- 搜索历史 + 热搜 -->
		<view v-else class="discover">
			<view v-if="store.searchHistory.length" class="section">
				<view class="section-head">
					<text class="section-title">搜索历史</text>
					<text class="clear-history" @click="store.clearSearchHistory()">🗑 清空</text>
				</view>
				<view class="history-tags">
					<text v-for="(h, i) in store.searchHistory" :key="i" class="history-tag" @click="doSearch(h)">{{ h }}</text>
				</view>
			</view>
			<view class="section">
				<view class="section-head"><text class="section-title">🔥 热搜榜</text></view>
				<view v-for="(h, i) in hotSearches" :key="i" class="hot-item" @click="doSearch(h.keyword)">
					<text class="hot-rank" :class="{ top: i < 3 }">{{ i + 1 }}</text>
					<text class="hot-keyword">{{ h.keyword }}</text>
					<text v-if="h.heat" class="hot-badge" :class="{ new: h.heat === '新' }">{{ h.heat }}</text>
					<text class="hot-count">{{ h.count }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff; }
.search-bar { display: flex; align-items: center; padding: 20rpx 24rpx; gap: 16rpx; }
.back { font-size: 56rpx; line-height: 1; color: #333; width: 40rpx; }
.input-wrap { flex: 1; display: flex; align-items: center; background: #f5f5f5; border-radius: 40rpx; padding: 0 20rpx; height: 72rpx; }
.search-ico { font-size: 28rpx; }
.input { flex: 1; margin-left: 12rpx; font-size: 28rpx; }
.clear { color: #999; font-size: 26rpx; padding: 0 8rpx; }
.search-btn { color: #ff2442; font-size: 28rpx; }
.results { padding: 0 20rpx; }
.result-tip { font-size: 24rpx; color: #999; padding: 12rpx 8rpx 20rpx; }
.waterfall { display: flex; gap: 16rpx; align-items: flex-start; }
.column { flex: 1; min-width: 0; }
.empty { text-align: center; color: #bbb; font-size: 28rpx; padding: 120rpx 0; }
.discover { padding: 10rpx 28rpx; }
.section { margin-bottom: 40rpx; }
.section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
.section-title { font-size: 30rpx; font-weight: bold; }
.clear-history { font-size: 24rpx; color: #999; }
.history-tags { display: flex; flex-wrap: wrap; gap: 16rpx; }
.history-tag { background: #f5f5f5; color: #666; padding: 12rpx 24rpx; border-radius: 30rpx; font-size: 26rpx; }
.hot-item { display: flex; align-items: center; padding: 18rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.hot-rank { width: 48rpx; font-size: 30rpx; color: #ccc; font-weight: bold; }
.hot-rank.top { color: #ff2442; }
.hot-keyword { flex: 1; font-size: 28rpx; color: #333; }
.hot-badge { background: #ff6b35; color: #fff; font-size: 18rpx; padding: 2rpx 8rpx; border-radius: 6rpx; margin-right: 16rpx; }
.hot-badge.new { background: #409eff; }
.hot-count { font-size: 22rpx; color: #bbb; }
</style>
