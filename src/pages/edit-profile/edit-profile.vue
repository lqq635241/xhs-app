<script setup>
import { reactive } from 'vue'
import { useAppStore } from '@/store/index.js'
import { toast } from '@/utils/index.js'
import { chooseImage as pickImages } from '@/utils/media.js'

const store = useAppStore()
const form = reactive({
	nickname: store.currentUser.nickname,
	desc: store.currentUser.desc,
	location: store.currentUser.location,
	gender: store.currentUser.gender
})
function save() {
	if (!form.nickname.trim()) { toast('昵称不能为空'); return }
	store.updateProfile({ ...form })
	toast('保存成功', 'success')
	setTimeout(() => uni.navigateBack(), 600)
}
async function changeAvatar() {
	const paths = await pickImages(1)
	if (paths.length) {
		store.updateProfile({ avatar: paths[0] })
		toast('头像已更新')
	}
}
</script>

<template>
	<view class="page">
		<view class="form">
			<view class="avatar-row" @click="changeAvatar">
				<text>头像</text>
				<image :src="store.currentUser.avatar" mode="aspectFill"></image>
				<text class="arrow">›</text>
			</view>
			<view class="field">
				<text class="label">昵称</text>
				<input v-model="form.nickname" maxlength="20"></input>
			</view>
			<view class="field">
				<text class="label">简介</text>
				<textarea v-model="form.desc" maxlength="100"></textarea>
			</view>
			<view class="field">
				<text class="label">所在地</text>
				<input v-model="form.location"></input>
			</view>
			<view class="field gender">
				<text class="label">性别</text>
				<view class="gender-options">
					<text :class="{ active: form.gender === 'female' }" @click="form.gender = 'female'">女</text>
					<text :class="{ active: form.gender === 'male' }" @click="form.gender = 'male'">男</text>
				</view>
			</view>
		</view>
		<view class="save-btn" @click="save">保存修改</view>
	</view>
</template>

<style scoped>
.page { min-height: 100vh; background: #f7f7f7; padding-bottom: 120rpx; }
.form { background: #fff; padding: 0 28rpx; }
.avatar-row { display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid #f0f0f0; }
.avatar-row text:first-child { flex: 1; font-size: 28rpx; }
.avatar-row image { width: 96rpx; height: 96rpx; border-radius: 50%; }
.arrow { font-size: 40rpx; color: #ccc; margin-left: 16rpx; }
.field { display: flex; align-items: flex-start; padding: 24rpx 0; border-bottom: 1rpx solid #f0f0f0; }
.label { width: 140rpx; font-size: 28rpx; flex-shrink: 0; }
.field input, .field textarea { flex: 1; font-size: 28rpx; line-height: 1.6; }
.field textarea { height: 120rpx; }
.gender-options { display: flex; gap: 20rpx; }
.gender-options text { padding: 10rpx 36rpx; border-radius: 30rpx; background: #f5f5f5; font-size: 26rpx; }
.gender-options text.active { background: #ffe8ec; color: #ff2442; }
.save-btn { position: fixed; bottom: 40rpx; left: 28rpx; right: 28rpx; background: #ff2442; color: #fff; text-align: center; padding: 24rpx 0; border-radius: 44rpx; font-size: 30rpx; font-weight: bold; }
</style>
