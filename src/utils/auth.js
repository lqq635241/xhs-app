/**
 * 登录能力 —— README「登录」差异点
 *  - App：uni.login(provider) 唤起微信/QQ/Apple 等 SDK（manifest 配 sdkConfigs.oauth）
 *  - 小程序：uni.login() 拿 code，后端换 openid（wx.login）
 *  - H5：无一键登录，降级为账号密码表单（本模块返回提示）
 */
import { toast } from './index.js'
import { getPlatform } from './platform.js'

/** App 端：第三方登录 */
export function loginWithProvider(provider = 'weixin') {
	return new Promise((resolve) => {
		// #ifdef APP-PLUS
		uni.login({
			provider,
			success: (res) => { toast('登录成功'); resolve({ success: true, platform: 'app', provider, code: res.authResult?.code || '' }) },
			fail: (err) => { console.warn('[auth] fail', err); toast('登录失败：请检查 manifest OAuth 配置'); resolve({ success: false, platform: 'app' }) }
		})
		// #endif
	})
}

/** 小程序端：wx.login 拿 code */
export function loginMp() {
	return new Promise((resolve) => {
		// #ifdef MP-WEIXIN
		uni.login({
			provider: 'weixin',
			success: (res) => resolve({ success: true, platform: 'mp-weixin', code: res.code }),
			fail: () => resolve({ success: false, platform: 'mp-weixin' })
		})
		// #endif
	})
}

/** 统一登录入口 */
export async function login(provider = 'weixin') {
	const platform = getPlatform()
	if (platform === 'app') return loginWithProvider(provider)
	if (platform.startsWith('mp-')) return loginMp()
	toast('H5 端请使用账号密码登录')
	return { success: false, platform: 'h5', note: 'H5 需自建账号密码登录流程' }
}

/** 退出登录（全端通用，清本地态） */
export function logout() {
	uni.removeStorageSync('xhs_token')
	toast('已退出登录')
}
