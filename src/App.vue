<script>
import { getPlatform, getAppVersion } from '@/utils/platform.js'
import { log, logPlatform, setupErrorHandler, enableRemoteDebug } from '@/utils/debug.js'
import { initPush } from '@/utils/push.js'
import { checkUpdate } from '@/utils/update.js'

export default {
	onLaunch() {
		const platform = getPlatform()
		logPlatform()
		setupErrorHandler()

		// #ifdef APP-PLUS
		log('App 启动，appid:', plus.runtime.appid, 'version:', plus.runtime.version)
		// App 端：开启远程调试（正式发布可关）
		enableRemoteDebug()
		// App 端：初始化推送（manifest 需配 UniPush）
		try { initPush() } catch (e) { log('push 初始化失败（未配置 SDK 时正常）', e) }
		// App 端：启动时检查 wgt 热更新
		const upd = checkUpdate()
		if (upd.hasUpdate) log('发现新版本', upd.latest, '（演示：未真正下载）')
		// #endif

		// #ifdef MP-WEIXIN
		log('微信小程序启动', getAppVersion())
		// #endif

		// #ifdef H5
		log('H5 浏览器启动', location.href)
		// #endif
	},
	onShow() { log('App Show', getPlatform()) },
	onHide() { log('App Hide') },
	// App 端实体返回键：首页双击退出（各页面可自行 override）
	onBackPress(options) {
		// #ifdef APP-PLUS
		// 说明：具体双击逻辑在 utils/back.js，页面 onBackPress 中调用 handleBackPress
		// 这里不全局拦截，避免影响子页面返回；首页已在 index.vue 单独处理
		// #endif
	}
}
</script>

<style>
/* 全局基础样式 —— 全端通用（rpx 为 uni-app 跨端响应式单位） */
page {
	background: #ffffff;
	color: #333333;
	font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Microsoft YaHei', sans-serif;
	font-size: 28rpx;
	line-height: 1.5;
}
* { box-sizing: border-box; }
view, text, image, scroll-view, input, textarea { box-sizing: border-box; }
image { display: block; }
button::after { border: none; }
.xhs-red { color: #ff2442; }
.xhs-gray { color: #999999; }
.ellipsis { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ellipsis-2 {
	display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
	overflow: hidden;
}
.row { display: flex; align-items: center; }
.between { display: flex; align-items: center; justify-content: space-between; }
.center { display: flex; align-items: center; justify-content: center; }
</style>
