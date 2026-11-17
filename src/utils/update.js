/**
 * 热更新（wgt）—— README「热更新」差异点（App 端核心）
 *  - App：下载 wgt 资源包，plus.runtime.install 静默安装，重启生效
 *  - 小程序：由微信后台版本管理，前端无法热更
 *  - H5：直接更新静态资源，无需热更逻辑
 */
import { toast } from './index.js'
import { getPlatform, getAppVersion } from './platform.js'

/**
 * 检查更新（演示：对比版本号）
 * 真实项目：请求后端接口拿最新版本号与 wgt 下载地址
 */
export function checkUpdate(localVersion) {
	const platform = getPlatform()
	if (platform !== 'app') {
		return { hasUpdate: false, platform, note: platform === 'h5' ? 'H5 刷新即更新' : '小程序由平台后台管理版本' }
	}
	const cur = localVersion || getAppVersion().versionName || '1.0.0'
	// 演示：假设服务端最新是 9.9.9
	return { hasUpdate: '9.9.9' !== cur, platform, latest: '9.9.9', wgtUrl: 'https://example.com/app.wgt' }
}

/** 安装 wgt 热更新包 */
export function installWgt(wgtUrl) {
	return new Promise((resolve) => {
		// #ifdef APP-PLUS
		uni.downloadFile({
			url: wgtUrl,
			success: (dl) => {
				plus.runtime.install(dl.tempFilePath, { force: false },
					() => { toast('更新完成，即将重启'); plus.runtime.restart() },
					(err) => { toast('安装失败'); resolve({ success: false, err }) })
			},
			fail: () => resolve({ success: false, note: 'wgt 下载失败' })
		})
		// #endif
		// #ifndef APP-PLUS
		toast('热更新仅 App 端支持')
		resolve({ success: false, note: '仅 App 端支持' })
		// #endif
	})
}
