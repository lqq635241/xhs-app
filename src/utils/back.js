/**
 * 返回键处理 —— README「实体返回键」差异点（App 端核心）
 *  - App：有实体返回键，需 onBackPress 拦截；首页双击退出
 *  - 小程序/H5：由宿主提供返回，无需（也无法）拦截 onBackPress
 */
let lastBackTime = 0

/**
 * 在页面中调用：处理返回逻辑
 * @param {boolean} isHome 是否首页（首页才双击退出）
 * @returns {boolean|undefined} App 端返回 true 表示拦截默认返回
 */
export function handleBackPress(isHome = false) {
	// #ifdef APP-PLUS
	const now = Date.now()
	if (isHome) {
		if (now - lastBackTime < 2000) {
			plus.runtime.quit() // 双击退出
			return true
		}
		lastBackTime = now
		uni.showToast({ title: '再按一次退出应用', icon: 'none' })
		return true // 拦截，不执行默认返回
	}
	return false // 非首页交还系统
	// #endif
	// #ifndef APP-PLUS
	return undefined // 其他端不处理
	// #endif
}
