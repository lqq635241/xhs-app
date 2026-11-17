/**
 * 定位能力 —— README「获取位置」差异点
 *  - H5：浏览器 geolocation，需 HTTPS，精度低
 *  - 小程序：uni.getLocation + scope.userLocation，type=gcj02
 *  - App：uni.getLocation + 定位 SDK（manifest.json sdkConfigs.geolocation 配腾讯/高德）
 */
import { toast } from './index.js'
import { ensurePermission } from './permission.js'
import { getPlatform } from './platform.js'

/** 获取当前位置 */
export async function getLocation() {
	const platform = getPlatform()
	const perm = await ensurePermission('location')
	if (!perm.granted) return { success: false, platform }

	// H5 需 HTTPS，且浏览器弹窗由下面 API 内部处理
	return new Promise((resolve) => {
		uni.getLocation({
			type: 'gcj02', // 各端统一国测局坐标，避免 App 端 wgs84 与地图不匹配
			geocode: true,
			success: (res) => {
				resolve({
					success: true, platform,
					latitude: res.latitude, longitude: res.longitude,
					address: res.address ? `${res.address.city || ''}${res.address.district || ''}` : '（无逆地理信息）'
				})
			},
			fail: (err) => {
				console.warn('[location] fail', err)
				const tip = platform === 'h5' ? 'H5 定位需 HTTPS 且浏览器授权' :
					platform === 'app' ? 'App 需在 manifest 配置定位 SDK' : '请检查小程序定位权限'
				toast('定位失败：' + tip)
				resolve({ success: false, platform })
			}
		})
	})
}
