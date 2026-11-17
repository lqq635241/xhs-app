/**
 * 分享能力 —— README「分享」差异点
 *  - App：uni.share，需在 manifest.json sdkConfigs.share 配置微信等平台 appid
 *  - 小程序：button open-type="share" / onShareAppMessage（本模块提供配置生成器）
 *  - H5：无原生分享，降级为复制文字到剪贴板
 */
import { toast } from './index.js'
import { getPlatform } from './platform.js'

/** App 端：调起原生分享面板 */
export function shareApp({ title, summary, imageUrl, href }) {
	return new Promise((resolve) => {
		// #ifdef APP-PLUS
		uni.share({
			provider: 'weixin', scene: 'WXSceneSession', type: 0,
			title, summary, imageUrl, href,
			success: () => { toast('分享成功'); resolve({ success: true, platform: 'app', channel: 'weixin' }) },
			fail: (err) => { console.warn('[share] fail', err); toast('分享失败：请检查 manifest 分享 SDK 配置'); resolve({ success: false, platform: 'app' }) }
		})
		// #endif
		// 非 App 端不会进入上面的分支，这里兜底 resolve，避免 Promise 悬挂
		if (typeof plus === 'undefined') resolve({ success: false, platform: 'non-app', note: '原生分享仅 App 端可用' })
	})
}

/** 小程序：生成 onShareAppMessage 配置（在页面中 return 它） */
export function getMpShareConfig({ title, imageUrl, path }) {
	return { title, path: path || '/pages/index/index', imageUrl }
}

/** 复制到剪贴板（全端可用，H5 分享降级方案） */
export function copyToClipboard(text) {
	return new Promise((resolve) => {
		uni.setClipboardData({
			data: text,
			success: () => { toast('已复制到剪贴板'); resolve(true) },
			fail: () => resolve(false)
		})
	})
}

/** 统一分享入口 */
export async function shareContent(payload) {
	const platform = getPlatform()
	const text = `${payload.title} ${payload.summary || ''}`
	if (platform === 'app') return shareApp(payload)
	if (platform.startsWith('mp-')) {
		await copyToClipboard(text)
		return { success: true, platform, note: '小程序请用右上角转发，链接已复制' }
	}
	await copyToClipboard(text)
	return { success: true, platform, note: 'H5 无原生分享，链接已复制' }
}
