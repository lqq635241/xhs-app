/**
 * 权限申请封装 —— README「权限与原生能力」核心差异点
 *
 * 端差异：
 *  - H5：浏览器权限由 chooseImage/getLocation 内部弹窗处理，无需显式申请；本模块直接放行
 *  - 小程序：权限在首次调用 API 时由微信统一弹窗；被拒后可引导 openSetting
 *  - App：Android 6+ 需动态申请（plus.android.requestPermissions），
 *         被勾选「不再询问」后必须引导 plus.runtime.openURL('app-settings:') 到系统设置
 */
import { toast } from './index.js'
import { isApp, isMp, isH5 } from './platform.js'

/** 权限名称映射（业务语义 -> 各端权限标识） */
const PERMISSION_MAP = {
	camera: { name: '相机', mpScope: 'scope.camera', android: 'android.permission.CAMERA' },
	album: { name: '相册/存储', mpScope: 'scope.writePhotosAlbum', android: 'android.permission.WRITE_EXTERNAL_STORAGE' },
	location: { name: '定位', mpScope: 'scope.userLocation', android: 'android.permission.ACCESS_FINE_LOCATION' },
	record: { name: '麦克风', mpScope: 'scope.record', android: 'android.permission.RECORD_AUDIO' }
}

/** App 端：动态申请 Android 权限 */
function requestAppPermission(androidPerm) {
	return new Promise((resolve) => {
		// #ifdef APP-PLUS
		if (plus.os.name !== 'Android') { resolve(true); return } // iOS 权限由系统按 API 弹窗
		plus.android.requestPermissions(
			[androidPerm],
			() => resolve(true),
			(err) => { console.warn('[permission] denied', err); resolve(false) }
		)
		// #endif
		// #ifndef APP-PLUS
		resolve(true)
		// #endif
	})
}

/** 小程序端：查询权限状态 */
function getMpSetting(scope) {
	return new Promise((resolve) => {
		// #ifdef MP-WEIXIN
		uni.getSetting({
			success: (res) => resolve(res.authSetting?.[scope] ?? null),
			fail: () => resolve(null)
		})
		// #endif
		// #ifndef MP-WEIXIN
		resolve(null)
		// #endif
	})
}

/**
 * 申请权限（统一入口）
 * @param {'camera'|'album'|'location'|'record'} key
 * @returns {Promise<{granted:boolean, platform:string, needGuide:boolean}>}
 */
export async function requestPermission(key) {
	const cfg = PERMISSION_MAP[key]
	if (!cfg) return { granted: false, platform: 'unknown', needGuide: false }

	// #ifdef H5
	// H5 无显式权限申请，浏览器在调用具体 API 时弹窗
	return { granted: true, platform: 'h5', needGuide: false }
	// #endif

	// #ifdef MP-WEIXIN
	const setting = await getMpSetting(cfg.mpScope)
	if (setting === true) return { granted: true, platform: 'mp-weixin', needGuide: false }
	if (setting === false) return { granted: false, platform: 'mp-weixin', needGuide: true } // 曾被拒
	return { granted: true, platform: 'mp-weixin', needGuide: false } // null=未询问，调用 API 时弹窗
	// #endif

	// #ifdef APP-PLUS
	if (plus.os.name === 'Android') {
		const ok = await requestAppPermission(cfg.android)
		return { granted: ok, platform: 'app', needGuide: !ok }
	}
	return { granted: true, platform: 'app', needGuide: false } // iOS 随 API 弹窗
	// #endif

	return { granted: true, platform: 'other', needGuide: false }
}

/** 引导用户到设置页开启权限（各端路径不同） */
export function guideToSettings() {
	// #ifdef MP-WEIXIN
	uni.openSetting({ success: (res) => console.log('[permission] openSetting', res.authSetting) })
	// #endif
	// #ifdef APP-PLUS
	if (plus.os.name === 'Android') {
		plus.runtime.openURL('package:com.android.settings') // 简化演示；正式用 plus.android 构造 Intent
	} else {
		plus.runtime.openURL('app-settings:') // iOS 跳转本 App 设置页
	}
	// #endif
	// #ifdef H5
	toast('请在浏览器设置中允许相关权限')
	// #endif
}

/** 申请权限并在被拒且需引导时弹窗询问 */
export async function ensurePermission(key) {
	const cfg = PERMISSION_MAP[key]
	const res = await requestPermission(key)
	if (!res.granted && res.needGuide) {
		uni.showModal({
			title: '需要权限',
			content: `「${cfg.name}」权限被拒绝，是否前往设置页开启？`,
			confirmText: '去设置',
			success: (r) => { if (r.confirm) guideToSettings() }
		})
	}
	return res
}
