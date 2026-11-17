/**
 * 推送能力 —— README「推送通知」差异点（App 端核心）
 *  - App：UniPush 2.0，manifest sdkConfigs.push 开启，需各厂商通道（小米/OPPO/vivo/华为/FCM）
 *  - 小程序：订阅消息 wx.requestSubscribeMessage（一次性/长期）
 *  - H5：无原生推送，可用浏览器 Notification（需授权）
 */
import { toast } from './index.js'
import { getPlatform } from './platform.js'

let _clientId = ''

/** App 端：初始化 UniPush，监听推送 */
export function initPush() {
	// #ifdef APP-PLUS
	if (plus.push) {
		plus.push.getClientInfoAsync((info) => { _clientId = info.clientid || '' }, () => {})
		plus.push.addEventListener('click', (msg) => console.log('[push] click', msg))
		plus.push.addEventListener('receive', (msg) => console.log('[push] receive', msg))
		console.log('[push] App UniPush 已初始化')
	}
	// #endif
}

export function getClientId() { return _clientId }

/** 小程序端：请求订阅消息 */
export function subscribeMp(tmplIds = []) {
	return new Promise((resolve) => {
		// #ifdef MP-WEIXIN
		if (!tmplIds.length) { resolve({ success: false, note: '无模板ID' }); return }
		uni.requestSubscribeMessage({
			tmplIds,
			success: (res) => resolve({ success: true, result: res }),
			fail: () => resolve({ success: false })
		})
		// #endif
		// #ifndef MP-WEIXIN
		resolve({ success: false, note: '仅小程序支持订阅消息' })
		// #endif
	})
}

/** H5：浏览器桌面通知 */
export function requestBrowserNotify() {
	// #ifdef H5
	if (typeof Notification === 'undefined') { toast('浏览器不支持通知'); return Promise.resolve(false) }
	return Notification.requestPermission().then((p) => {
		if (p === 'granted') { new Notification('小红书', { body: 'H5 浏览器通知已开启' }); return true }
		return false
	})
	// #endif
	// #ifndef H5
	return Promise.resolve(false)
	// #endif
}

/** 统一推送入口 */
export async function enablePush() {
	const platform = getPlatform()
	if (platform === 'app') { initPush(); toast('App 推送已初始化'); return { success: true, platform, clientId: getClientId() } }
	if (platform.startsWith('mp-')) { const r = await subscribeMp(); return { ...r, platform } }
	const ok = await requestBrowserNotify()
	return { success: ok, platform, note: ok ? '浏览器通知已开启' : '通知未授权' }
}
