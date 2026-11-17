/** 格式化数字：10000 -> 1万 */
export function formatCount(num = 0) {
	if (num >= 10000) return (num / 10000).toFixed(1).replace(/\.0$/, '') + '万'
	return String(num)
}

/** 格式化时间：刚刚 / x分钟前 / x小时前 / x天前 / MM-DD */
export function formatTime(timestamp) {
	if (!timestamp) return ''
	const diff = Date.now() - timestamp
	if (diff < 60000) return '刚刚'
	if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
	if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
	if (diff < 86400000 * 30) return Math.floor(diff / 86400000) + '天前'
	const d = new Date(timestamp)
	return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** 生成唯一 ID */
export function uid(prefix = 'id') {
	return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

/**
 * 跨端提示封装
 * App/H5/小程序均支持 uni.showToast；App 端另可调用 plus.nativeUI.toast
 */
export function toast(title, icon = 'none') {
	uni.showToast({ title, icon, duration: 1500 })
}

/** 跨端页面跳转（tabBar 页面需用 switchTab） */
export function goTo(url) {
	const tabPages = [
		'/pages/index/index', '/pages/video/video', '/pages/publish/publish',
		'/pages/message/message', '/pages/profile/profile'
	]
	if (tabPages.includes(url)) {
		uni.switchTab({ url })
	} else {
		uni.navigateTo({ url })
	}
}
