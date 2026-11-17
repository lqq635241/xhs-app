/**
 * 文件下载与本地持久化 —— README「文件/下载」差异点
 *  - H5：浏览器下载行为，无持久文件系统 API
 *  - 小程序：uni.downloadFile + uni.getFileSystemManager（沙盒）
 *  - App：uni.downloadFile 无域名限制；plus.io 提供完整本地文件系统
 */
import { toast } from './index.js'
import { getPlatform } from './platform.js'

/** 下载文件到临时路径 */
export function downloadFile(url) {
	return new Promise((resolve) => {
		uni.downloadFile({
			url,
			success: (res) => resolve({ success: true, tempPath: res.tempFilePath }),
			fail: () => { toast('下载失败，检查域名白名单/HTTPS'); resolve({ success: false }) }
		})
	})
}

/**
 * 保存到持久化目录
 *  - App：plus.io 拷贝到 _doc（应用私有目录，卸载才清）
 *  - 小程序：uni.saveFile 持久化
 *  - H5：无持久化目录，返回临时路径
 */
export async function persistFile(tempPath, fileName) {
	const platform = getPlatform()
	if (platform === 'h5') return { success: false, platform, path: tempPath, note: 'H5 无持久化文件系统' }

	// #ifdef APP-PLUS
	return new Promise((resolve) => {
		plus.io.resolveLocalFileSystemURL(tempPath, (entry) => {
			plus.io.resolveLocalFileSystemURL('_doc/', (dir) => {
				entry.copyTo(dir, fileName, (newEntry) => resolve({ success: true, platform, path: newEntry.fullPath }),
					() => resolve({ success: false, platform }))
			}, () => resolve({ success: false, platform }))
		}, () => resolve({ success: false, platform }))
	})
	// #endif

	// #ifdef MP-WEIXIN
	return new Promise((resolve) => {
		uni.saveFile({
			tempFilePath: tempPath,
			success: (res) => resolve({ success: true, platform, path: res.savedFilePath }),
			fail: () => resolve({ success: false, platform })
		})
	})
	// #endif
}

/** 演示：下载并持久化网络占位图 */
export async function downloadAndPersist(url = 'https://picsum.photos/seed/download/200/200', name = 'demo.jpg') {
	const dl = await downloadFile(url)
	if (!dl.success) return dl
	return persistFile(dl.tempPath, name)
}
