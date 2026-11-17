<script setup>
/**
 * 端能力演示中心 —— 把 README 的每一个端差异点做成可点击的真实功能
 * 每个条目调用 src/utils/ 下的真实模块，实时显示当前端与调用结果。
 */
import { ref, computed } from 'vue'
import PlatformBadge from '@/components/PlatformBadge.vue'
import AbilityItem from '@/components/AbilityItem.vue'
import StatusBar from '@/components/StatusBar.vue'
import SafeAreaBottom from '@/components/SafeAreaBottom.vue'
import CustomNavBar from '@/components/CustomNavBar.vue'
import Skeleton from '@/components/Skeleton.vue'
import {
	getPlatform, getSystemInfo, getStatusBarHeight, getSafeAreaBottom,
	getAppVersion, getCapabilityMatrix, isApp, isH5
} from '@/utils/platform.js'
import { requestPermission, guideToSettings } from '@/utils/permission.js'
import { chooseImage, previewImage, saveImageToAlbum, chooseVideo } from '@/utils/media.js'
import { getLocation } from '@/utils/location.js'
import { shareContent } from '@/utils/share.js'
import { login } from '@/utils/auth.js'
import { requestPay } from '@/utils/pay.js'
import { enablePush } from '@/utils/push.js'
import { checkNetworkEnv, request } from '@/utils/request.js'
import { downloadAndPersist } from '@/utils/file.js'
import { checkUpdate } from '@/utils/update.js'
import { handleBackPress } from '@/utils/back.js'
import { enableRemoteDebug, logPlatform } from '@/utils/debug.js'
import { toast } from '@/utils/index.js'

const platform = computed(() => getPlatform())
const sys = computed(() => getSystemInfo())
const matrix = computed(() => getCapabilityMatrix())
const results = ref({})   // 每项能力的调用结果
const loading = ref({})
const showSkeleton = ref(false)

function setResult(key, text) { results.value[key] = text }
function begin(key) { loading.value[key] = true; results.value[key] = '' }
function end(key, text) { loading.value[key] = false; results.value[key] = text }

/** 判断某能力在当前端是否支持 */
function supported(key) {
	const row = matrix.value.find(m => m.key === key)
	if (!row) return true
	if (platform.value === 'app') return row.app
	if (platform.value.startsWith('mp-')) return row.mp
	return row.h5
}

// ===== 各能力真实调用 =====
async function testPermission() {
	begin('permission')
	const r = await requestPermission('camera')
	end('permission', `权限申请：${r.granted ? '已授权' : '被拒绝'}（端：${r.platform}）`)
}
async function testChooseImage() {
	begin('image')
	const paths = await chooseImage(3)
	end('image', paths.length ? `已选择 ${paths.length} 张图：${paths[0].slice(0, 40)}...` : '未选择图片')
	if (paths.length) previewImage(paths, 0)
}
async function testSaveImage() {
	begin('saveImage')
	const r = await saveImageToAlbum('https://picsum.photos/seed/save/300/300')
	end('saveImage', `保存结果：${r.success ? '成功' : '失败/降级'}（端：${r.platform}）`)
}
async function testVideo() {
	begin('video')
	const p = await chooseVideo()
	end('video', p ? `已选择视频：${p.slice(0, 40)}...` : '未选择视频')
}
async function testLocation() {
	begin('location')
	const r = await getLocation()
	end('location', r.success ? `定位成功：${r.latitude?.toFixed(4)}, ${r.longitude?.toFixed(4)} ${r.address || ''}` : `定位失败（端：${r.platform}）`)
}
async function testShare() {
	begin('share')
	const r = await shareContent({ title: '小红书端能力演示', summary: '一套代码，多端运行', imageUrl: '', href: '' })
	end('share', `分享：${r.success ? '完成' : '失败'} ${r.note || '（端：' + r.platform + '）'}`)
}
async function testLogin() {
	begin('login')
	const r = await login('weixin')
	end('login', `登录：${r.success ? '成功' : '降级/失败'}（端：${r.platform}）${r.note || ''}`)
}
async function testPay() {
	begin('pay')
	const r = await requestPay('wxpay', {})
	end('pay', `支付：${r.success ? '成功' : '演示/失败'}（端：${r.platform}）${r.note || ''}`)
}
async function testPush() {
	begin('push')
	const r = await enablePush()
	end('push', `推送：${r.success ? '已开启' : '不可用'}（端：${r.platform}）${r.clientId ? ' clientId:' + r.clientId.slice(0, 10) : ''}`)
}
function testNetwork() {
	begin('network')
	const httpCheck = checkNetworkEnv('http://example.com/api')
	const httpsCheck = checkNetworkEnv('https://example.com/api')
	end('network', `HTTP 检查：${httpCheck.tips.length ? httpCheck.tips[0] : 'OK'} | HTTPS：${httpsCheck.ok ? 'OK' : httpsCheck.tips[0]}`)
}
async function testFile() {
	begin('file')
	const r = await downloadAndPersist()
	end('file', `下载持久化：${r.success ? '成功 ' + r.path : '失败/降级'}（端：${r.platform}）`)
}
function testUpdate() {
	begin('update')
	const r = checkUpdate()
	end('update', `热更新检查：${r.hasUpdate ? '发现新版本 ' + r.latest : '无需更新'}（端：${r.platform}）${r.note || ''}`)
}
function testBack() {
	begin('back')
	const r = handleBackPress(true)
	end('back', platform.value === 'app' ? '已拦截返回键（双击退出，再按一次试试）' : `当前端不处理返回键（返回 ${r}）`)
}
function testDebug() {
	begin('debug')
	enableRemoteDebug(); logPlatform()
	end('debug', `调试日志已输出到控制台（端：${platform.value}）`)
}
function testStatusBar() {
	begin('statusBar')
	end('statusBar', `状态栏高度：${getStatusBarHeight()}px（App 端有值，H5 通常为 0）`)
}
function testSafeArea() {
	begin('safeArea')
	end('safeArea', `底部安全区：${getSafeAreaBottom()}px（全面屏 App/小程序有值）`)
}
function testSkeleton() {
	showSkeleton.value = true
	setTimeout(() => { showSkeleton.value = false; end('skeleton', '骨架屏展示完毕（App 冷启动首屏优化）') }, 1500)
}

const abilityGroups = [
	{
		title: '平台与布局差异', icon: '📐',
		items: [
			{ key: 'statusBar', icon: '📱', name: '状态栏适配', desc: 'App 端动态获取状态栏高度，避免内容被遮挡', run: testStatusBar },
			{ key: 'safeArea', icon: '🔲', name: '底部安全区', desc: '全面屏 Home 指示条区域适配', run: testSafeArea },
			{ key: 'skeleton', icon: '🦴', name: '首屏骨架屏', desc: 'App 冷启动优化（点击预览 1.5 秒）', run: testSkeleton },
			{ key: 'debug', icon: '🐞', name: '分端调试日志', desc: '条件编译日志 / App 远程调试', run: testDebug }
		]
	},
	{
		title: '权限与媒体差异', icon: '🔐',
		items: [
			{ key: 'permission', icon: '🔑', name: '相机权限申请', desc: 'App 动态授权 / 小程序 scope / H5 放行', run: testPermission },
			{ key: 'image', icon: '🖼️', name: '选图与预览', desc: '压缩图 + 图片预览（避免 App 大图 OOM）', run: testChooseImage },
			{ key: 'saveImage', icon: '💾', name: '保存图片到相册', desc: 'App 存储权限 / 小程序授权 / H5 降级', run: testSaveImage },
			{ key: 'video', icon: '🎬', name: '选择视频', desc: '相册/拍摄，各端统一入口', run: testVideo }
		]
	},
	{
		title: '定位与原生能力差异', icon: '🚀',
		items: [
			{ key: 'location', icon: '📍', name: '获取定位', desc: 'H5 HTTPS / 小程序 scope / App 定位 SDK', run: testLocation },
			{ key: 'share', icon: '↗️', name: '分享', desc: 'App 原生 SDK / 小程序转发 / H5 复制链接', run: testShare },
			{ key: 'login', icon: '🔐', name: '一键登录', desc: 'App OAuth SDK / 小程序 code / H5 降级', run: testLogin },
			{ key: 'pay', icon: '💰', name: '支付', desc: 'App/小程序 requestPayment / H5 降级', run: testPay },
			{ key: 'push', icon: '🔔', name: '推送通知', desc: 'App UniPush / 小程序订阅 / H5 浏览器通知', run: testPush }
		]
	},
	{
		title: '网络、文件与发布差异', icon: '🌐',
		items: [
			{ key: 'network', icon: '🔗', name: '网络环境检查', desc: '小程序域名白名单 / App 明文HTTP / H5 跨域', run: testNetwork },
			{ key: 'file', icon: '📁', name: '文件下载持久化', desc: 'App plus.io / 小程序 saveFile / H5 降级', run: testFile },
			{ key: 'update', icon: '⬆️', name: 'wgt 热更新', desc: 'App 热更新 / 小程序/H5 平台管理', run: testUpdate },
			{ key: 'back', icon: '🔙', name: '实体返回键', desc: 'App 双击退出（点击后连按两次返回键测试）', run: testBack }
		]
	}
]
</script>

<template>
	<view class="page">
		<CustomNavBar title="端能力演示中心" />

		<!-- 骨架屏预览 -->
		<Skeleton v-if="showSkeleton" :rows="3" />

		<!-- 平台信息卡 -->
		<view class="platform-card">
			<view class="pc-head">
				<PlatformBadge />
				<text class="pc-version">v{{ getAppVersion().versionName || '1.0.0' }}</text>
			</view>
			<view class="pc-grid">
				<view class="pc-cell"><text class="pc-label">系统</text><text class="pc-val">{{ sys.system || 'Web' }}</text></view>
				<view class="pc-cell"><text class="pc-label">设备</text><text class="pc-val">{{ sys.model || sys.platform || '-' }}</text></view>
				<view class="pc-cell"><text class="pc-label">状态栏</text><text class="pc-val">{{ getStatusBarHeight() }}px</text></view>
				<view class="pc-cell"><text class="pc-label">安全区</text><text class="pc-val">{{ getSafeAreaBottom() }}px</text></view>
			</view>
			<view class="pc-tip">点击下列任意条目，真实调用对应能力并查看当前端结果 👇</view>
		</view>

		<!-- 能力分组 -->
		<view v-for="(group, gi) in abilityGroups" :key="gi" class="group">
			<view class="group-title">{{ group.icon }} {{ group.title }}</view>
			<AbilityItem
				v-for="item in group.items" :key="item.key"
				:icon="item.icon" :name="item.name" :desc="item.desc"
				:supported="supported(item.key)"
				:result="results[item.key] || ''" :loading="!!loading[item.key]"
				@run="item.run"
			/>
		</view>

		<view class="footer">一套 Vue3 代码 · 条件编译隔离端差异 · 全部为真实可调用实现</view>
		<SafeAreaBottom bgColor="#f7f7f7" />
	</view>
</template>

<style scoped>
.page { min-height: 100vh; background: #f7f7f7; }
.platform-card { margin: 24rpx; background: linear-gradient(135deg, #fff0f3, #fff); border-radius: 20rpx; padding: 28rpx; box-shadow: 0 4rpx 20rpx rgba(255,36,66,0.08); }
.pc-head { display: flex; align-items: center; justify-content: space-between; }
.pc-version { font-size: 22rpx; color: #999; }
.pc-grid { display: flex; flex-wrap: wrap; margin-top: 24rpx; }
.pc-cell { width: 50%; display: flex; flex-direction: column; margin-bottom: 18rpx; }
.pc-label { font-size: 22rpx; color: #999; }
.pc-val { font-size: 26rpx; color: #333; margin-top: 4rpx; }
.pc-tip { font-size: 22rpx; color: #ff2442; margin-top: 12rpx; padding-top: 16rpx; border-top: 1rpx dashed #ffd0d8; }
.group { margin: 24rpx; }
.group-title { font-size: 28rpx; font-weight: bold; color: #333; margin-bottom: 12rpx; padding-left: 8rpx; }
.footer { text-align: center; font-size: 22rpx; color: #bbb; padding: 30rpx 20rpx 50rpx; }
</style>
