<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useAppStore } from '@/store/index.js'
import { formatCount, formatTime, toast } from '@/utils/index.js'
import { shareContent } from '@/utils/share.js'
import { saveImageToAlbum } from '@/utils/media.js'
import SafeAreaBottom from '@/components/SafeAreaBottom.vue'

const store = useAppStore()
const noteId = ref('')
const note = computed(() => store.getNote(noteId.value))
const author = computed(() => note.value ? store.getUser(note.value.userId) : null)
const comments = computed(() => note.value ? store.getComments(note.value.id) : [])
const liked = computed(() => note.value ? store.isLiked(note.value.id) : false)
const collected = computed(() => note.value ? store.isCollected(note.value.id) : false)
const following = computed(() => note.value ? store.isFollowing(note.value.userId) : false)
const commentText = ref('')
const showCommentInput = ref(false)

onLoad((options) => { noteId.value = options.id || store.notes[0]?.id || '' })

function toggleLike() { if (note.value) store.toggleLike(note.value.id) }
function toggleCollect() {
	if (!note.value) return
	store.toggleCollect(note.value.id)
	toast(collected.value ? '已收藏' : '取消收藏')
}
function toggleFollow() {
	if (!author.value) return
	store.toggleFollow(author.value.id)
	toast(following.value ? '已关注' : '取消关注')
}
function openUser() {
	if (author.value) uni.navigateTo({ url: `/pages/user/user?id=${author.value.id}` })
}
function submitComment() {
	if (!commentText.value.trim()) { toast('请输入评论内容'); return }
	store.addComment(noteId.value, commentText.value.trim())
	commentText.value = ''
	showCommentInput.value = false
	toast('评论成功', 'success')
}
function previewImage(index) {
	if (!note.value) return
	uni.previewImage({ current: index, urls: note.value.images })
}
async function share() {
	// 接入统一分享模块：App 原生分享 SDK / 小程序转发 / H5 复制链接
	await shareContent({
		title: note.value?.title || '小红书笔记',
		summary: note.value?.desc || '',
		imageUrl: note.value?.images[0] || '',
		href: ''
	})
}
function saveCover() {
	// 长按封面保存到相册（App 权限 / 小程序授权 / H5 降级）
	if (note.value?.images[0]) saveImageToAlbum(note.value.images[0])
}
</script>

<template>
	<view class="page" v-if="note">
		<!-- 作者栏 -->
		<view class="author-bar">
			<image class="avatar" :src="author.avatar" mode="aspectFill" @click="openUser"></image>
			<view class="author-info" @click="openUser">
				<text class="nickname">{{ author.nickname }}</text>
				<text class="sub-info">{{ formatTime(note.createTime) }} · {{ note.location }}</text>
			</view>
			<view class="follow-btn" :class="{ following }" @click="toggleFollow">
				{{ following ? '已关注' : '+ 关注' }}
			</view>
		</view>

		<!-- 正文 -->
		<view class="content">
			<view class="title">{{ note.title }}</view>
			<view class="desc">{{ note.desc }}</view>
			<view class="tags">
				<text v-for="(tag, i) in note.tags" :key="i" class="tag">#{{ tag }}</text>
			</view>
		</view>

		<!-- 图片 / 视频 -->
		<view class="media">
			<video
				v-if="note.type === 'video'" class="video" :src="note.videoUrl"
				:poster="note.images[0]" controls
			></video>
			<image
				v-else v-for="(img, i) in note.images" :key="i"
				class="note-image" :src="img" mode="widthFix" lazy-load
				@click="previewImage(i)" @longpress="saveCover"
			></image>
		</view>

		<!-- 互动数据 -->
		<view class="stats">
			<text>{{ formatCount(note.likes) }} 赞</text>
			<text>{{ formatCount(note.collects) }} 收藏</text>
			<text>{{ note.commentsCount }} 评论</text>
		</view>

		<!-- 评论区 -->
		<view class="comments">
			<view class="section-title">共 {{ comments.length }} 条评论</view>
			<view v-for="c in comments" :key="c.id" class="comment-item">
				<image class="comment-avatar" :src="store.getUser(c.userId).avatar" mode="aspectFill"></image>
				<view class="comment-body">
					<view class="comment-nickname">{{ store.getUser(c.userId).nickname }}</view>
					<view class="comment-content">{{ c.content }}</view>
					<view class="comment-meta">
						<text>{{ formatTime(c.createTime) }}</text>
						<text class="reply">回复</text>
					</view>
					<view v-for="r in c.replies" :key="r.id" class="reply-item">
						<text class="reply-author">{{ store.getUser(r.userId).nickname }}：</text>
						<text>{{ r.content }}</text>
					</view>
				</view>
			</view>
			<view v-if="!comments.length" class="empty-comments">还没有评论，来抢沙发吧～</view>
		</view>

		<!-- 底部操作栏（含安全区适配，避免被 Home 指示条遮挡） -->
		<view class="bottom-bar">
			<view class="comment-input" @click="showCommentInput = true">说点什么...</view>
			<view class="action-item" @click="toggleLike">
				<text class="action-icon">{{ liked ? '❤️' : '🤍' }}</text>
				<text>{{ formatCount(note.likes) }}</text>
			</view>
			<view class="action-item" @click="toggleCollect">
				<text class="action-icon">{{ collected ? '⭐' : '☆' }}</text>
				<text>{{ formatCount(note.collects) }}</text>
			</view>
			<view class="action-item" @click="share">
				<text class="action-icon">↗️</text>
				<text>分享</text>
			</view>
			<SafeAreaBottom bgColor="#ffffff" />
		</view>

		<!-- 评论输入弹窗 -->
		<view v-if="showCommentInput" class="input-mask" @click.self="showCommentInput = false">
			<view class="input-panel">
				<textarea
					v-model="commentText" class="comment-textarea"
					placeholder="说点什么..." :focus="true" maxlength="200"
				></textarea>
				<view class="send-btn" @click="submitComment">发送</view>
			</view>
		</view>
	</view>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff; padding-bottom: 140rpx; }
.author-bar { display: flex; align-items: center; padding: 24rpx 28rpx; }
.avatar { width: 76rpx; height: 76rpx; border-radius: 50%; }
.author-info { flex: 1; margin-left: 18rpx; display: flex; flex-direction: column; }
.nickname { font-size: 30rpx; font-weight: bold; color: #333; }
.sub-info { font-size: 22rpx; color: #999; margin-top: 6rpx; }
.follow-btn { padding: 10rpx 28rpx; background: #ff2442; color: #fff; border-radius: 30rpx; font-size: 24rpx; }
.follow-btn.following { background: #f5f5f5; color: #999; }
.content { padding: 0 28rpx 20rpx; }
.title { font-size: 34rpx; font-weight: bold; line-height: 1.4; color: #333; }
.desc { font-size: 28rpx; line-height: 1.7; color: #444; margin-top: 16rpx; }
.tags { margin-top: 16rpx; display: flex; flex-wrap: wrap; gap: 14rpx; }
.tag { color: #2b6cb0; font-size: 26rpx; }
.media { background: #f7f7f7; }
.note-image { width: 100%; display: block; }
.video { width: 100%; height: 700rpx; }
.stats { display: flex; gap: 30rpx; padding: 24rpx 28rpx; font-size: 24rpx; color: #999; border-bottom: 1rpx solid #f0f0f0; }
.comments { padding: 24rpx 28rpx; }
.section-title { font-size: 28rpx; font-weight: bold; color: #333; margin-bottom: 24rpx; }
.comment-item { display: flex; margin-bottom: 30rpx; }
.comment-avatar { width: 60rpx; height: 60rpx; border-radius: 50%; flex-shrink: 0; }
.comment-body { flex: 1; margin-left: 16rpx; }
.comment-nickname { font-size: 24rpx; color: #999; }
.comment-content { font-size: 28rpx; color: #333; margin-top: 6rpx; line-height: 1.5; }
.comment-meta { display: flex; gap: 24rpx; font-size: 22rpx; color: #bbb; margin-top: 10rpx; }
.reply { color: #666; }
.reply-item { background: #f7f7f7; padding: 12rpx 16rpx; border-radius: 10rpx; margin-top: 12rpx; font-size: 26rpx; color: #555; line-height: 1.5; }
.reply-author { color: #2b6cb0; }
.empty-comments { text-align: center; color: #bbb; font-size: 26rpx; padding: 40rpx 0; }
.bottom-bar {
	position: fixed; bottom: 0; left: 0; right: 0; z-index: 20;
	display: flex; flex-wrap: wrap; align-items: center; gap: 20rpx;
	padding: 16rpx 28rpx 0;
	background: #fff; border-top: 1rpx solid #f0f0f0;
}
.bottom-bar > .safe-bottom { flex-basis: 100%; height: 0; }
.comment-input { flex: 1; background: #f5f5f5; border-radius: 40rpx; padding: 18rpx 28rpx; font-size: 26rpx; color: #999; }
.action-item { display: flex; flex-direction: column; align-items: center; font-size: 20rpx; color: #666; }
.action-icon { font-size: 36rpx; line-height: 1.2; }
.input-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 30; display: flex; align-items: flex-end; }
.input-panel { width: 100%; background: #fff; padding: 24rpx; display: flex; align-items: flex-end; gap: 20rpx; }
.comment-textarea { flex: 1; height: 140rpx; background: #f5f5f5; border-radius: 12rpx; padding: 16rpx; font-size: 28rpx; }
.send-btn { background: #ff2442; color: #fff; padding: 18rpx 32rpx; border-radius: 40rpx; font-size: 26rpx; }
</style>
