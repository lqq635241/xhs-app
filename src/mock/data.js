/**
 * Mock 数据层 —— 全端通用，纯 JS，无网络依赖。
 * 图片统一使用 picsum.photos 网络占位图：
 *   - H5 / App：可直接使用
 *   - 小程序：image 组件可显示；开发阶段需在开发者工具勾选「不校验合法域名」
 *     （详见 README「小程序端差异」）
 */

const avatar = (seed) => `https://picsum.photos/seed/${seed}/120/120`
const photo = (seed, w = 400, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`

export const currentUserId = 'u_me'

export const users = [
	{ id: 'u_me', nickname: '一颗小芒果', avatar: avatar('avatar_me'), gender: 'female', location: '上海', desc: '分享生活里的小确幸 ✨ | 摄影 / 美食 / 旅行', following: 128, followers: 2368, liked: 15200, tags: ['摄影', '美食'] },
	{ id: 'u1', nickname: '奶油小方', avatar: avatar('avatar1'), gender: 'female', location: '杭州', desc: '甜品控 | 每天都要甜甜的', following: 321, followers: 18900, liked: 89000, tags: ['美食'] },
	{ id: 'u2', nickname: '阿哲摄影', avatar: avatar('avatar2'), gender: 'male', location: '北京', desc: '风光摄影师 📷 | 用镜头记录世界', following: 88, followers: 45600, liked: 210000, tags: ['摄影', '旅行'] },
	{ id: 'u3', nickname: '早安日记', avatar: avatar('avatar3'), gender: 'female', location: '成都', desc: '早起打卡 | 自律给我自由', following: 210, followers: 8900, liked: 67000, tags: ['生活'] },
	{ id: 'u4', nickname: '旅行的小熊', avatar: avatar('avatar4'), gender: 'male', location: '广州', desc: '走遍中国 🌏', following: 156, followers: 12300, liked: 99000, tags: ['旅行'] },
	{ id: 'u5', nickname: '一颗柠檬', avatar: avatar('avatar5'), gender: 'female', location: '深圳', desc: '穿搭分享 | 小个子显高搭配', following: 430, followers: 32000, liked: 178000, tags: ['穿搭'] },
	{ id: 'u6', nickname: '健身达人Leo', avatar: avatar('avatar6'), gender: 'male', location: '上海', desc: '健身 5 年 | 科学增肌', following: 90, followers: 6700, liked: 45000, tags: ['健身'] },
	{ id: 'u7', nickname: '手工小屋', avatar: avatar('avatar7'), gender: 'female', location: '南京', desc: 'DIY 手作 | 治愈系', following: 267, followers: 15600, liked: 88000, tags: ['手工'] }
]

// 用固定种子生成笔记，保证每次刷新数据一致
const noteSeeds = [
	{ userId: 'u1', title: '入口即化的草莓慕斯蛋糕 🍓', desc: '不用烤箱也能做的甜品！教程放在图片里啦，零失败～', tags: ['甜品', '美食教程', '烘焙'], likes: 2341, collects: 892, commentsCount: 128, type: 'image', count: 4 },
	{ userId: 'u2', title: '带你看不一样的日出云海', desc: '凌晨 4 点爬上山顶， everything is worth it.', tags: ['摄影', '风光', '旅行'], likes: 8932, collects: 2103, commentsCount: 342, type: 'image', count: 3 },
	{ userId: 'u5', title: '小个子春季穿搭 | 显高 10cm', desc: '这 5 套搭配谁穿谁好看，快收藏起来！', tags: ['穿搭', '春季穿搭', '小个子'], likes: 5620, collects: 3401, commentsCount: 210, type: 'image', count: 6 },
	{ userId: 'u3', title: '早起 30 天，我的生活发生了什么变化', desc: '自律真的会让人上瘾，记录一下这段时间的改变。', tags: ['自律', '早起', '生活方式'], likes: 1290, collects: 567, commentsCount: 89, type: 'image', count: 3 },
	{ userId: 'u4', title: '云南 7 天自由行攻略（超详细）', desc: '大理—丽江—香格里拉，路线/住宿/美食全都有！', tags: ['旅行', '云南', '攻略'], likes: 6789, collects: 4521, commentsCount: 456, type: 'image', count: 5 },
	{ userId: 'u6', title: '新手健身计划 | 一周三练', desc: '适合小白的增肌计划，附动作图解。', tags: ['健身', '增肌', '运动'], likes: 3456, collects: 2340, commentsCount: 167, type: 'video', count: 1 },
	{ userId: 'u7', title: '超治愈的羊毛毡小动物 🐻', desc: '第一次做羊毛毡，虽然有点丑但真的很解压！', tags: ['手工', 'DIY', '治愈'], likes: 1980, collects: 678, commentsCount: 95, type: 'image', count: 3 },
	{ userId: 'u1', title: '一人食｜番茄牛腩面', desc: '周末给自己做一碗热腾腾的面，满满的幸福感。', tags: ['美食', '一人食', '菜谱'], likes: 4123, collects: 1567, commentsCount: 178, type: 'image', count: 4 },
	{ userId: 'u2', title: '城市夜景拍摄技巧分享', desc: '手机也能拍出大片感，参数都在这了。', tags: ['摄影', '夜景', '手机摄影'], likes: 7890, collects: 3200, commentsCount: 289, type: 'image', count: 5 },
	{ userId: 'u5', title: '通勤包里都装些什么？', desc: '翻包分享｜这些小物真的提升幸福感。', tags: ['好物分享', '通勤', '穿搭'], likes: 2345, collects: 1123, commentsCount: 134, type: 'image', count: 4 },
	{ userId: 'u3', title: '把出租屋改造成理想小家', desc: '花了 3000 块，让出租屋变得温馨又好看。', tags: ['家居', '租房改造', '生活'], likes: 9876, collects: 6543, commentsCount: 567, type: 'image', count: 6 },
	{ userId: 'u4', title: '川西自驾 | 此生必去的公路', desc: '一路上的风景美到窒息，建议收藏这条路线。', tags: ['旅行', '自驾', '川西'], likes: 5432, collects: 3980, commentsCount: 234, type: 'image', count: 5 },
	{ userId: 'u6', title: '每天 10 分钟的拉伸，缓解久坐', desc: '打工人必备！办公室也能做。', tags: ['健身', '拉伸', '健康'], likes: 3210, collects: 2678, commentsCount: 145, type: 'video', count: 1 },
	{ userId: 'u7', title: '用旧衣服做环保袋', desc: '旧衣改造，简单又实用，手残党也能学会。', tags: ['手工', '环保', 'DIY'], likes: 1567, collects: 890, commentsCount: 78, type: 'image', count: 3 },
	{ userId: 'u1', title: '夏日必喝的 5 款饮品', desc: '在家就能做，清爽解暑，比奶茶好喝！', tags: ['美食', '饮品', '夏天'], likes: 4567, collects: 2890, commentsCount: 198, type: 'image', count: 4 },
	{ userId: 'u2', title: '街头摄影的 10 个小技巧', desc: '扫街拍摄心得，学会这些你也能拍出故事感。', tags: ['摄影', '街头', '技巧'], likes: 6234, collects: 3456, commentsCount: 267, type: 'image', count: 5 },
	{ userId: 'u5', title: '秋冬叠穿公式，好看又保暖', desc: '掌握这几个公式，每天出门不用纠结穿什么。', tags: ['穿搭', '秋冬', '叠穿'], likes: 7891, collects: 5123, commentsCount: 345, type: 'image', count: 6 },
	{ userId: 'u3', title: '我的极简生活 | 断舍离一年', desc: '扔掉 80% 的东西后，生活反而更轻松了。', tags: ['极简', '生活', '断舍离'], likes: 3456, collects: 1980, commentsCount: 156, type: 'image', count: 4 },
	{ userId: 'u4', title: '小众海岛，人少景美还便宜', desc: '不想人挤人？这个地方强烈推荐给你！', tags: ['旅行', '海岛', '小众'], likes: 8765, collects: 6789, commentsCount: 432, type: 'image', count: 5 },
	{ userId: 'u6', title: '居家减脂操，跟练 20 分钟', desc: '无跳跃不扰民，新手友好的燃脂训练。', tags: ['健身', '减脂', '居家'], likes: 4567, collects: 3456, commentsCount: 201, type: 'video', count: 1 }
]

export const notes = noteSeeds.map((n, i) => {
	const id = `n${i + 1}`
	const imgs = []
	for (let j = 0; j < n.count; j++) {
		// 前两张用竖图模拟小红书封面比例，其余用方图
		imgs.push(photo(`${id}-${j}`, j < 2 ? 400 : 600, j < 2 ? 540 : 600))
	}
	return {
		id,
		userId: n.userId,
		title: n.title,
		desc: n.desc,
		tags: n.tags,
		images: imgs,
		type: n.type,
		videoUrl: n.type === 'video' ? 'https://www.w3schools.com/html/mov_bbb.mp4' : '',
		likes: n.likes,
		collects: n.collects,
		commentsCount: n.commentsCount,
		createTime: Date.now() - i * 3600 * 1000 * 3,
		location: users.find(u => u.id === n.userId)?.location || '',
		ipLocation: users.find(u => u.id === n.userId)?.location || ''
	}
})

const commentTexts = [
	'太好看了吧！收藏了～', '求详细教程 🙋', '已经按这个方法做了，效果真的不错！',
	'请问这是什么牌子的？', '博主太用心了，点赞！', '看起来好好吃 😋',
	'下周就去试试，期待～', '这个技巧我怎么没想到！', '求链接求链接',
	'拍得真好看，构图绝了', '跟着做了，姐妹们冲！', '哈哈哈哈太真实了'
]

export const comments = []
notes.forEach((note, ni) => {
	const friendIds = users.filter(u => u.id !== note.userId).map(u => u.id)
	const count = Math.min(note.commentsCount, 6 + (ni % 3))
	for (let i = 0; i < count; i++) {
		comments.push({
			id: `c_${note.id}_${i}`,
			noteId: note.id,
			userId: friendIds[i % friendIds.length],
			content: commentTexts[(ni + i * 3) % commentTexts.length],
			createTime: note.createTime + (i + 1) * 60000,
			likes: Math.floor(Math.random() * 200),
			replies: i === 0 ? [{
				id: `r_${note.id}_0`,
				userId: note.userId,
				content: '谢谢喜欢，有问题可以留言给我～',
				createTime: note.createTime + 120000
			}] : []
		})
	}
})

export const hotSearches = [
	{ keyword: '春日穿搭', heat: '热', count: '982.3万' },
	{ keyword: '周末去哪儿', heat: '热', count: '856.1万' },
	{ keyword: '懒人食谱', heat: '', count: '721.5万' },
	{ keyword: '手机摄影技巧', heat: '新', count: '654.8万' },
	{ keyword: '出租屋改造', heat: '', count: '543.2万' },
	{ keyword: '减脂餐', heat: '热', count: '487.6万' },
	{ keyword: '小个子穿搭', heat: '', count: '432.1万' },
	{ keyword: '云南旅行攻略', heat: '', count: '398.7万' },
	{ keyword: '羊毛毡教程', heat: '新', count: '321.4万' },
	{ keyword: '极简生活', heat: '', count: '298.5万' }
]

export const messages = [
	{ id: 'm1', type: 'like', userId: 'u1', noteId: 'n1', content: '赞了你的笔记', createTime: Date.now() - 1000 * 60 * 5 },
	{ id: 'm2', type: 'comment', userId: 'u2', noteId: 'n2', content: '评论了你的笔记：拍得真好看！', createTime: Date.now() - 1000 * 60 * 32 },
	{ id: 'm3', type: 'follow', userId: 'u5', content: '关注了你', createTime: Date.now() - 1000 * 60 * 60 * 2 },
	{ id: 'm4', type: 'like', userId: 'u4', noteId: 'n5', content: '收藏了你的笔记', createTime: Date.now() - 1000 * 60 * 60 * 5 },
	{ id: 'm5', type: 'comment', userId: 'u3', noteId: 'n4', content: '回复了你：一起加油！', createTime: Date.now() - 1000 * 60 * 60 * 26 }
]

export const conversations = [
	{
		id: 'conv1', userId: 'u1', unread: 2,
		list: [
			{ id: 'cm1', from: 'u1', content: 'Hi～ 你的照片拍得好好看！', createTime: Date.now() - 1000 * 60 * 60 * 2 },
			{ id: 'cm2', from: 'u_me', content: '谢谢呀，刚看到～', createTime: Date.now() - 1000 * 60 * 55 },
			{ id: 'cm3', from: 'u1', content: '有空可以一起约拍吗？', createTime: Date.now() - 1000 * 60 * 8 }
		]
	},
	{
		id: 'conv2', userId: 'u2', unread: 0,
		list: [
			{ id: 'cm4', from: 'u2', content: '上次说的相机推荐给你了，看看～', createTime: Date.now() - 1000 * 60 * 60 * 20 },
			{ id: 'cm5', from: 'u_me', content: '收到！太感谢了 🙏', createTime: Date.now() - 1000 * 60 * 60 * 19 }
		]
	},
	{
		id: 'conv3', userId: 'u5', unread: 0,
		list: [
			{ id: 'cm6', from: 'u5', content: '你的穿搭我超喜欢！', createTime: Date.now() - 1000 * 60 * 60 * 48 }
		]
	}
]

export const getUserById = (id) => users.find(u => u.id === id) || users[0]
export const getNoteById = (id) => notes.find(n => n.id === id)
