/**
 * 支付能力 —— README「支付」差异点
 *  - App：uni.requestPayment(provider) + manifest sdkConfigs.payment（支付宝/微信支付）
 *  - 小程序：uni.requestPayment 微信支付（需后端下单返回支付参数）
 *  - H5：需接支付宝/微信网页支付跳转，本模块返回提示
 *
 * 注意：真实支付参数（orderInfo / paySign 等）必须由后端生成，前端不落密钥。
 */
import { toast } from './index.js'
import { getPlatform } from './platform.js'

/** 统一支付入口（演示用，参数为 mock） */
export function requestPay(provider = 'wxpay', orderInfo = {}) {
	const platform = getPlatform()
	if (platform === 'h5') {
		toast('H5 支付需接网页支付跳转')
		return Promise.resolve({ success: false, platform, note: '需对接网页支付 SDK' })
	}
	return new Promise((resolve) => {
		uni.requestPayment({
			provider,
			orderInfo: platform === 'app' ? (orderInfo.app || 'mock_order_info') : undefined,
			timeStamp: orderInfo.timeStamp, nonceStr: orderInfo.nonceStr,
			package: orderInfo.package, signType: 'RSA', paySign: orderInfo.paySign,
			success: () => { toast('支付成功', 'success'); resolve({ success: true, platform }) },
			fail: (err) => {
				console.warn('[pay] fail', err)
				toast('支付失败（演示环境无真实订单）')
				resolve({ success: false, platform, note: '演示环境，无真实支付参数' })
			}
		})
	})
}
