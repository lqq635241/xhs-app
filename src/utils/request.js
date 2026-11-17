/**
 * 统一网络请求封装 —— README「网络请求各端差异」差异点
 *  - H5：浏览器同源/跨域策略，由 DevServer proxy 或后端 CORS 解决
 *  - 小程序：request 合法域名必须是 https 且在后台白名单，开发期可关校验
 *  - App：无域名白名单，但 Android 9+ 默认禁明文 HTTP，需 HTTPS 或配置 usesCleartextTraffic
 * 本 Demo 全 Mock 不发真实请求，但保留封装以便接后端。
 */
import { getPlatform } from './platform.js'

const BASE_URL = '' // 接后端时填，如 'https://api.xxx.com'

/** 请求前检查：根据端给出配置提示 */
export function checkNetworkEnv(url) {
	const platform = getPlatform()
	const tips = []
	if (platform.startsWith('mp-') && !url.startsWith('https')) {
		tips.push('小程序要求 https 且域名在白名单内')
	}
	if (platform === 'app' && url.startsWith('http://')) {
		tips.push('App Android 9+ 默认禁明文 HTTP，建议改用 https')
	}
	if (platform === 'h5' && BASE_URL && !url.startsWith('http')) {
		tips.push('H5 跨域需后端 CORS 或 devServer proxy')
	}
	return { platform, ok: tips.length === 0, tips }
}

/** 统一 request（带各端超时/提示差异） */
export function request(options) {
	const check = checkNetworkEnv(options.url || '')
	if (!check.ok) console.warn('[request] 环境提示：', check.tips.join('；'))
	return new Promise((resolve, reject) => {
		uni.request({
			url: (BASE_URL + (options.url || '')),
			method: options.method || 'GET',
			data: options.data || {},
			header: { 'content-type': 'application/json', ...(options.header || {}) },
			timeout: options.timeout || (getPlatform() === 'app' ? 15000 : 10000), // App 端网络可能更慢
			success: (res) => resolve(res.data),
			fail: (err) => { console.warn('[request] fail', err); reject(err) }
		})
	})
}
