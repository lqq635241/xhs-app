<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/store/index.js'
import { uid, toast } from '@/utils/index.js'
import { chooseImage as pickImages, chooseVideo as pickVideo } from '@/utils/media.js'
import StatusBar from '@/components/StatusBar.vue'

const store = useAppStore()
const title = ref('')
const desc = ref('')
const images = ref([])
const type = ref('image')
const publishing = ref(false)

const hotTags = ['日常', '穿搭', '美食', '旅行', '摄影', '生活记录', '好物分享']

async function chooseImage() {
	// 接入统一媒体模块：压缩图 + 权限处理（App 动态授权 / 小程序 scope / H5 放行）
	const paths = await pickImages(9)
	images.value = [...images.value, ...paths].slice(0, 9)
}
function deleteImage(index) { images.value.splice(index, 1) }
function addTag(tag) {
	const text = `#${tag} `
	if (!desc.value.includes(text)) desc.value += (desc.value ? ' ' : '') + text
}
async function selectVideo() {
	const path = await pickVideo()
	if (path) { type.value = 'video'; toast('已选择视频（示例）') }
}
function doPublish() {
	if (!title.value.trim()) { toast('请输入标题'); return }
	if (!desc.value.trim() && !images.value.length) { toast('写点正文或添加图片吧'); return }
	publishing.value = true
	const tags = []
	const matches = desc.value.match(/#([^\s#]+)/g)
	if (matches) matches.forEach(m => tags.push(m.slice(1)))
	store.publishNote({
		title: title.value.trim(), desc: desc.value.trim(),
		tags: tags.length ? tags : ['日常'],
		images: images.value, type: type.value
	})
	setTimeout(() => {
		publishing.value = false
		toast('发布成功', 'success')
		uni.switchTab({ url: '/pages/index/index' })
	}, 600)
}
</script>

<template>
	<view class="page">
		<StatusBar />
		<view class="form">
			<view class="media-picker">
				<view v-for="(img, i) in images" :key="i" class="img-item">
					<image :src="img" mode="aspectFill"></image>
					<text class="img-del" @click="deleteImage(i)">✕</text>
				</view>
				<view v-if="images.length < 9 && type === 'image'" class="add-box" @click="chooseImage">
					<text class="add-plus">+</text>
					<text class="add-text">添加图片</text>
				</view>
			</view>

			<view class="type-switch">
				<text :class="{ active: type === 'image' }" @click="type = 'image'">📷 图文</text>
				<text :class="{ active: type === 'video' }" @click="selectVideo">🎬 视频</text>
			</view>

			<input v-model="title" class="title-input" placeholder="填写标题会有更多赞哦～" maxlength="30"></input>
			<textarea
				v-model="desc" class="desc-input" placeholder="分享你的生活、经验和想法..."
				maxlength="1000"
			></textarea>
			<view class="word-count">{{ desc.length }}/1000</view>

			<view class="tag-section">
				<view class="tag-title">添加话题</view>
				<view class="tag-list">
					<text v-for="t in hotTags" :key="t" class="hot-tag" @click="addTag(t)">#{{ t }}</text>
				</view>
			</view>
		</view>

		<view class="publish-footer">
			<view class="draft-btn" @click="toast('草稿已保存')">存草稿</view>
			<view class="publish-btn" :class="{ disabled: publishing }" @click="doPublish">
				{{ publishing ? '发布中...' : '发布笔记' }}
			</view>
		</view>
	</view>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff; padding-bottom: 140rpx; }
.form { padding: 28rpx; }
.media-picker { display: flex; flex-wrap: wrap; gap: 16rpx; }
.img-item { position: relative; width: 200rpx; height: 200rpx; }
.img-item image { width: 100%; height: 100%; border-radius: 12rpx; }
.img-del { position: absolute; right: -8rpx; top: -8rpx; background: rgba(0,0,0,0.6); color: #fff; width: 40rpx; height: 40rpx; border-radius: 50%; text-align: center; line-height: 40rpx; font-size: 24rpx; }
.add-box { width: 200rpx; height: 200rpx; border: 2rpx dashed #ddd; border-radius: 12rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fafafa; }
.add-plus { font-size: 60rpx; color: #ccc; line-height: 1; }
.add-text { font-size: 24rpx; color: #999; margin-top: 12rpx; }
.type-switch { display: flex; gap: 20rpx; margin: 30rpx 0; }
.type-switch text { padding: 12rpx 28rpx; border-radius: 30rpx; background: #f5f5f5; font-size: 26rpx; color: #666; }
.type-switch text.active { background: #ffe8ec; color: #ff2442; }
.title-input { font-size: 32rpx; font-weight: bold; padding: 20rpx 0; border-bottom: 1rpx solid #f0f0f0; width: 100%; }
.desc-input { width: 100%; height: 300rpx; font-size: 28rpx; line-height: 1.7; padding: 24rpx 0; }
.word-count { text-align: right; font-size: 22rpx; color: #bbb; }
.tag-section { margin-top: 20rpx; }
.tag-title { font-size: 28rpx; font-weight: bold; margin-bottom: 16rpx; }
.tag-list { display: flex; flex-wrap: wrap; gap: 16rpx; }
.hot-tag { background: #f0f4ff; color: #4a6fa5; padding: 12rpx 22rpx; border-radius: 30rpx; font-size: 24rpx; }
.publish-footer {
	position: fixed; bottom: 0; left: 0; right: 0; z-index: 20;
	display: flex; gap: 20rpx; padding: 20rpx 28rpx;
	background: #fff; border-top: 1rpx solid #f0f0f0;
}
/* H5 端 tabBar 是覆盖在页面上的 fixed 层（高 50px），底部栏需上移避开；App/小程序端 tabBar 为原生组件，页面区域已排除，无需处理 */
/* #ifdef H5 */
.publish-footer { bottom: 50px; }
.page { padding-bottom: 240rpx; }
/* #endif */
/* App 端：底部栏追加安全区，避让 iPhone home indicator */
/* #ifdef APP-PLUS */
.publish-footer { padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); }
.page { padding-bottom: calc(140rpx + env(safe-area-inset-bottom)); }
/* #endif */
.draft-btn { padding: 22rpx 40rpx; border: 1rpx solid #ddd; border-radius: 40rpx; font-size: 28rpx; color: #666; }
.publish-btn { flex: 1; background: #ff2442; color: #fff; text-align: center; padding: 22rpx 0; border-radius: 40rpx; font-size: 30rpx; font-weight: bold; }
.publish-btn.disabled { opacity: 0.6; }
</style>
