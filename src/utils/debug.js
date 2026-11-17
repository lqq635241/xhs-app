/**
 * 调试与日志封装 —— 覆盖 README「运行与调试差异」
 * H5: console；小程序：开发者工具 console；App: console + 可开启远程调试
 */

const PREFIX = '[XHS]'
let enabled = true

/** 开启 App 端 V8 远程调试（仅 App，需 HBuilderX/真机） */
export function enableRemoteDebug() {
	// #ifdef APP-PLUS
	if (uni.setEnableDebug) {
		uni.setEnableDebug({ enableDebug: true })
		console.log(PREFIX, 'App 远程调试已开启')
	}
	// #endif
	// #ifndef APP-PLUS
	console.log(PREFIX, '远程调试仅 App 端可用，当前端忽略')
	// #endif
}

export function setDebug(v) { enabled = !!v }

export function log(...args) {
	if (!enabled) return
	console.log(PREFIX, ...args)
}

/** 分端日志：打印当前端标识（条件编译演示） */
export function logPlatform() {
	// #ifdef APP-PLUS
	log('运行环境：APP-PLUS', plus.runtime.version)
	// #endif
	// #ifdef MP-WEIXIN
	log('运行环境：微信小程序')
	// #endif
	// #ifdef H5
	log('运行环境：H5', location.href)
	// #endif
}

/**
 * 全局错误捕获 —— App/小程序用 onError，H5 用 window.onerror
 * 便于在各端收集线上异常
 */
export function setupErrorHandler() {
	// #ifdef APP-PLUS || MP-WEIXIN
	uni.onError && uni.onError((err) => log('全局异常：', err))
	// #endif
	// #ifdef H5
	if (typeof window !== 'undefined') {
		window.addEventListener('error', (e) => log('全局异常：', e.message))
	}
	// #endif
}
