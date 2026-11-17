/**
 * 平台检测核心 —— 所有端差异点的基座
 * 统一封装「我在哪个端 / 什么系统 / 状态栏多高 / 安全区在哪 / 什么版本」
 * 用条件编译保证每个判断只在编译期保留对应端代码，不引入运行时歧义。
 */

let _sysInfo = null
/** 带缓存的系统信息（各端字段名有差异，这里做归一化） */
export function getSystemInfo() {
	if (_sysInfo) return _sysInfo
	const raw = uni.getSystemInfoSync ? uni.getSystemInfoSync() : {}
	_sysInfo = {
		raw,
		platform: raw.platform || '',          // 'ios' | 'android' | 'devtools' | 'h5' ...
		system: raw.system || '',              // 'iOS 16.5' / 'Android 13' / ...
		brand: raw.brand || '',                // App 端有：'Apple' / 'Xiaomi'
		model: raw.model || '',                // 设备型号
		pixelRatio: raw.pixelRatio || 1,
		windowWidth: raw.windowWidth || 375,
		windowHeight: raw.windowHeight || 667,
		statusBarHeight: raw.statusBarHeight || 0,       // 状态栏高度（px）
		safeArea: raw.safeArea || null,                   // 安全区 {top,left,right,bottom,height,width}
		screenHeight: raw.screenHeight || 0,
		language: raw.language || '',
		version: raw.version || '',                       // 宿主/系统版本
		runtimeVersion: raw.appVersion || ''              // App 版本（部分端）
	}
	return _sysInfo
}

/** 当前端标识：'app' | 'mp-weixin' | 'mp-alipay' | 'h5'（编译期确定） */
export function getPlatform() {
	// #ifdef APP-PLUS
	return 'app'
	// #endif
	// #ifdef MP-WEIXIN
	return 'mp-weixin'
	// #endif
	// #ifdef MP-ALIPAY
	return 'mp-alipay'
	// #endif
	// #ifdef H5
	return 'h5'
	// #endif
	return 'unknown'
}

export const isApp = () => getPlatform() === 'app'
export const isMp = () => getPlatform().startsWith('mp-')
export const isH5 = () => getPlatform() === 'h5'

/** 是否 iOS（App 端判断最准；小程序/H5 尽力而为） */
export function isIOS() {
	const info = getSystemInfo()
	// #ifdef APP-PLUS
	return info.platform.toLowerCase() === 'ios'
	// #endif
	// #ifndef APP-PLUS
	return /ios|iphone|ipad/i.test(info.platform + info.system)
	// #endif
}

/** 状态栏高度 px —— App/小程序有值，H5 通常为 0（用原生导航栏时无需处理） */
export function getStatusBarHeight() {
	return getSystemInfo().statusBarHeight || 0
}

/**
 * 底部安全区高度 px —— iPhone 刘海/Home 指示条区域
 * App/小程序：用 safeArea 计算；H5：用 CSS env(safe-area-inset-bottom) 兜底，返回 0
 */
export function getSafeAreaBottom() {
	// H5 无原生安全区概念，用 CSS env(safe-area-inset-bottom) 兜底，JS 返回 0
	// #ifdef H5
	return 0
	// #endif
	// #ifndef H5
	const info = getSystemInfo()
	if (info.safeArea && info.screenHeight) {
		return Math.max(0, info.screenHeight - info.safeArea.bottom)
	}
	return 0
	// #endif
}

/** H5 宽屏适配：PC 上给出最大内容宽度，移动端返回 0（铺满） */
export function getH5MaxWidth() {
	// #ifdef H5
	return getSystemInfo().windowWidth > 600 ? 480 : 0
	// #endif
	// #ifndef H5
	return 0
	// #endif
}

/** 应用版本信息（App 端读 plus.runtime，其他端返回宿主版本） */
export function getAppVersion() {
	// #ifdef APP-PLUS
	return {
		versionName: plus.runtime.version || '',
		versionCode: plus.runtime.versionCode || '',
		appid: plus.runtime.appid || ''
	}
	// #endif
	// #ifndef APP-PLUS
	return { versionName: getSystemInfo().version, versionCode: '', appid: '' }
	// #endif
}

/** 平台能力清单：各端支持哪些原生能力（供演示中心展示） */
export function getCapabilityMatrix() {
	const p = getPlatform()
	const app = p === 'app', mp = p.startsWith('mp-'), h5 = p === 'h5'
	return [
		{ key: 'share', name: '原生分享', app, mp: true, h5: false },
		{ key: 'login', name: '一键登录', app, mp: true, h5: false },
		{ key: 'pay', name: '原生支付', app, mp: true, h5: false },
		{ key: 'push', name: '推送通知', app, mp: true, h5: false },
		{ key: 'location', name: '精确定位', app, mp: true, h5: true },
		{ key: 'saveImage', name: '保存相册', app, mp: true, h5: false },
		{ key: 'statusBar', name: '状态栏适配', app: true, mp: false, h5: false },
		{ key: 'safeArea', name: '安全区适配', app: true, mp: true, h5: false },
		{ key: 'returnKey', name: '实体返回键', app: true, mp: false, h5: false },
		{ key: 'hotUpdate', name: 'wgt 热更新', app: true, mp: false, h5: false },
		{ key: 'fileSystem', name: '本地文件系统', app: true, mp: true, h5: false },
		{ key: 'networkDomain', name: '域名白名单限制', app: false, mp: true, h5: false }
	]
}
