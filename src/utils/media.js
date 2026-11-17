/**
 * 图片/视频能力封装 —— README「图片与网络」差异点
 * 选图 / 拍照 / 预览 / 保存相册 / 选视频，各端统一入口
 */
import { toast } from './index.js'
import { ensurePermission } from './permission.js'

/** 选择图片（相册/拍照） */
export function chooseImage(count = 9) {
	return new Promise((resolve) => {
		uni.chooseImage({
			count,
			sizeType: ['compressed'], // 关键：压缩图，App 端避免大图 OOM
			sourceType: ['album', 'camera'],
			success: (res) => resolve(res.tempFilePaths || []),
			fail: () => { toast('选择图片失败'); resolve([]) }
		})
	})
}

/** 拍照（仅相机） */
export async function takePhoto() {
	await ensurePermission('camera')
	return chooseImage(1)
}

/** 预览图片（各端通用） */
export function previewImage(urls, current = 0) {
	uni.previewImage({ current, urls, indicator: 'number' })
}

/** 选择视频 */
export function chooseVideo() {
	return new Promise((resolve) => {
		uni.chooseVideo({
			sourceType: ['album', 'camera'],
			success: (res) => resolve(res.tempFilePath || ''),
			fail: () => { toast('选择视频失败'); resolve('') }
		})
	})
}

/**
 * 保存图片到相册 —— 端差异典型
 *  - H5：不支持直接存相册，降级为提示「长按图片保存」
 *  - 小程序：需 scope.writePhotosAlbum 授权
 *  - App：需存储权限（Android），iOS 随 API 弹窗
 */
export async function saveImageToAlbum(url) {
	// #ifdef H5
	toast('H5 端请长按图片保存')
	return { success: false, platform: 'h5' }
	// #endif

	// #ifndef H5
	const perm = await ensurePermission('album')
	if (!perm.granted) return { success: false, platform: perm.platform }
	return new Promise((resolve) => {
		uni.downloadFile({
			url,
			success: (dl) => {
				uni.saveImageToPhotosAlbum({
					filePath: dl.tempFilePath,
					success: () => { toast('已保存到相册', 'success'); resolve({ success: true, platform: perm.platform }) },
					fail: () => { toast('保存失败'); resolve({ success: false, platform: perm.platform }) }
				})
			},
			fail: () => { toast('图片下载失败，请检查域名白名单'); resolve({ success: false, platform: perm.platform }) }
		})
	})
	// #endif
}
