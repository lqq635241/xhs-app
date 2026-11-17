# 小红书 · uni-app 全端仿生 App（Vue3 + Vite）

一个用 uni-app 实现的小红书风格社交 App，数据全部为本地 Mock，**一套代码可编译到 H5 / 微信小程序 / App（iOS & Android）**。

---

## 一、快速开始

```bash
cd xhs-app
npm install

# 开发调试
npm run dev:h5              # H5 浏览器
npm run dev:mp-weixin       # 微信小程序（产物在 dist/dev/mp-weixin，用微信开发者工具打开）
npm run dev:app             # App（需 HBuilderX 运行到手机/模拟器）

# 打包构建
npm run build:h5            # H5 静态站点 -> dist/build/h5
npm run build:mp-weixin     # 小程序 -> dist/build/mp-weixin
npm run build:app           # App 资源 -> dist/build/app（云打包/本地打包仍需 HBuilderX）
```

> **环境**：Node ≥ 18（推荐 20+），npm ≥ 9。本项目实测 Node 22 / npm 10。

---

## 二、已实现功能

| 模块 | 功能点 |
|---|---|
| 首页·发现 | 关注/发现/附近 三个 Feed、双列瀑布流、下拉刷新、上拉加载、笔记卡片点赞 |
| 笔记详情 | 图文轮播预览、视频播放、作者信息、关注、点赞、收藏、评论列表/回复/发表、分享 |
| 搜索 | 搜索历史、热搜榜、关键词匹配笔记（标题/正文/话题）、结果瀑布流 |
| 发布 | 选图/拍视频、标题正文、话题标签、发布到首页信息流、存草稿提示 |
| 消息 | 聊天会话列表、未读数、互动通知（赞/评论/关注）、聊天收发消息 |
| 我的 | 个人资料、笔记/收藏/赞过三个列表、编辑资料、粉丝与关注 |
| 用户主页 | 他人资料、关注/取关、发消息、TA 的笔记 |
| 全局状态 | Pinia 管理点赞/收藏/关注/评论/发布/搜索历史/未读数，各页面实时联动 |

Mock 数据在 `src/mock/data.js`，全局状态在 `src/store/index.js`。图片统一用 `picsum.photos` 网络占位图。

---

## 二·补、端差异点代码实现对照表（每一项均为真实可运行代码）

> 下面每个端差异点都不只是文档描述，而是**已实现为真实模块/组件**，并集中在「端能力演示中心」页面可视化验证。
> 入口：**我的 → 端能力演示中心**（`/pages/ability/ability`）。点击任意条目即真实调用对应能力，实时显示当前端与结果。

| README 差异点 | 真实代码位置 | 演示中心验证项 |
|---|---|---|
| rpx 响应式 / 宽屏适配 | `utils/platform.js::getH5MaxWidth` + `App.vue` 全局单位 | 平台信息卡 |
| 顶部状态栏高度适配 | `utils/platform.js::getStatusBarHeight` + `components/StatusBar.vue` + `CustomNavBar.vue` | 📱 状态栏适配 |
| 底部安全区适配 | `utils/platform.js::getSafeAreaBottom` + `components/SafeAreaBottom.vue`（详情页底栏已接入） | 🔲 底部安全区 |
| 网络图片域名 / 选择 / 预览 | `utils/media.js::chooseImage/previewImage` + `manifest.json` 小程序 `urlCheck:false` | 🖼️ 选图与预览 |
| 保存图片到相册（权限差异） | `utils/media.js::saveImageToAlbum` + `utils/permission.js`（详情页长按图片已接入） | 💾 保存图片到相册 |
| 相机/相册/定位/麦克风权限 + 拒绝引导 | `utils/permission.js::requestPermission/ensurePermission/guideToSettings` | 🔑 相机权限申请 |
| 拍照/选视频 | `utils/media.js::takePhoto/chooseVideo`（发布页已接入） | 🎬 选择视频 |
| 定位（各端 SDK 差异） | `utils/location.js::getLocation` | 📍 获取定位 |
| 分享（App SDK / 小程序转发 / H5 复制） | `utils/share.js`（详情页分享按钮已接入） | ↗️ 分享 |
| 登录（App OAuth / 小程序 code / H5 降级） | `utils/auth.js` | 🔐 一键登录 |
| 支付（App/小程序 requestPayment / H5 降级） | `utils/pay.js` | 💰 支付 |
| 推送（UniPush / 订阅消息 / 浏览器通知） | `utils/push.js` + `App.vue::onLaunch` 初始化 | 🔔 推送通知 |
| 文件下载与持久化（plus.io / saveFile） | `utils/file.js::downloadAndPersist` | 📁 文件下载持久化 |
| 网络请求各端差异（域名/明文HTTP/跨域） | `utils/request.js::checkNetworkEnv/request` | 🔗 网络环境检查 |
| 实体返回键 / 双击退出 | `utils/back.js` + `index.vue::onBackPress` | 🔙 实体返回键 |
| 生命周期 / 分端日志 / 远程调试 | `utils/debug.js` + `App.vue` 生命周期 | 🐞 分端调试日志 |
| wgt 热更新 | `utils/update.js` + `App.vue` 启动检查 | ⬆️ wgt 热更新 |
| 包体积与首屏骨架屏 | `components/Skeleton.vue`（首页首屏已接入）+ `manifest.json` 启动图 | 🦴 首屏骨架屏 |
| 打包配置/签名/版本/SDK | `manifest.json`（包名/版本/appid/Android权限/iOS权限描述/各 SDK 配置占位） | 平台信息卡（版本号） |
| iOS UGC 合规（协议/举报入口） | `profile.vue::showAgreement/showReport` | 我的页底部入口 |

**能力层目录**：`src/utils/` 下 `platform / permission / media / location / share / auth / pay / push / file / request / update / back / debug` 共 13 个模块；`src/components/` 下 `StatusBar / SafeAreaBottom / CustomNavBar / PlatformBadge / Skeleton / AbilityItem` 共 6 个组件。

---

## 三、项目结构

```
xhs-app/
├─ src/
│  ├─ pages/
│  │  ├─ index/          首页·发现（tabBar）
│  │  ├─ video/          视频（tabBar）
│  │  ├─ publish/        发布（tabBar）
│  │  ├─ message/        消息（tabBar）
│  │  ├─ profile/        我的（tabBar）
│  │  ├─ search/ search.vue           搜索
│  │  ├─ note-detail/   笔记详情
│  │  ├─ user/          他人主页
│  │  ├─ chat/          聊天
│  │  ├─ fans/          粉丝与关注
│  │  └─ edit-profile/  编辑资料
│  ├─ components/NoteCard.vue   笔记卡片（瀑布流单元）
│  ├─ mock/data.js       Mock 数据
│  ├─ store/index.js     Pinia 全局状态
│  ├─ utils/index.js     跨端工具（数字/时间格式化、跳转、Toast）
│  ├─ pages.json         页面路由 + tabBar + 窗口样式
│  ├─ manifest.json      各端应用配置（App/小程序/H5）
│  ├─ App.vue            应用生命周期（含条件编译示例）
│  ├─ main.js            Vue3 createSSRApp + Pinia 注册
│  └─ uni.scss           uni-app 主题变量
├─ vite.config.js
└─ README.md
```

---

## 四、各端开发区别点（重点：App 端）

本项目用 **uni-app 条件编译** 在同一份代码里隔离各端差异：

```js
// #ifdef APP-PLUS    仅在 App 生效
// #ifdef MP-WEIXIN   仅微信小程序
// #ifdef H5          仅 H5
// #ifndef APP-PLUS   除 App 外的所有端
// #endif
```

### 1. 尺寸与布局

| 差异点 | H5 | 微信小程序 | App |
|---|---|---|---|
| 响应式单位 | `rpx` 会按 750 设计稿换算，但 H5 在宽屏（PC）下会等比放大，建议加 `max-width` 容器 | `rpx` 按屏幕宽度换算，表现最一致 | `rpx` 按屏幕宽度换算；**需额外适配状态栏/安全区** |
| 顶部安全区 | 无 | 由小程序导航栏接管，一般无需处理 | **必须处理**：`uni.getSystemInfoSync().statusBarHeight`，刘海屏/挖孔屏不适配会被遮挡 |
| 底部安全区 | 无 | 用 `env(safe-area-inset-bottom)` | **必须处理**：iPhone 底部 Home Indicator 区域，固定底栏要加 `padding-bottom: constant(safe-area-inset-bottom)` |
| 滚动容器 | 页面级滚动 + `position:sticky` 可用 | `sticky` 支持有限，建议用 `scroll-view` | 页面滚动流畅；长列表建议 `scroll-view` + 分页，避免一次性渲染上千节点 |

### 2. 图片与网络

| 差异点 | H5 | 微信小程序 | App |
|---|---|---|---|
| 网络图片域名 | 无限制 | **必须在小程序后台配置 downloadFile 合法域名**；开发阶段可在开发者工具勾选「不校验合法域名」（本项目已关闭 `urlCheck`） | 无域名白名单限制，可直接加载任意 http(s) 图片 |
| 本地图片 | 支持相对路径 | 支持，但 tabBar 图标**必须是本地文件** | 支持；本 Demo 的 tabBar 用纯文字，规避了各端图标差异 |
| 图片预览 | `uni.previewImage` 正常 | 正常 | 正常；长按保存图片需 `uni.saveImageToPhotosAlbum` + **相册权限** |
| 占位图策略 | picsum.photos 直接可用 | 需关闭域名校验或配置白名单 | 直接可用 |

### 3. 权限与原生能力（App 端核心差异）

**这是 App 端与 H5/小程序最大的不同：App 运行在真机原生环境，调用摄像头、相册、定位等需要动态申请系统权限。**

| 能力 | H5 | 微信小程序 | App（APP-PLUS） |
|---|---|---|---|
| 选择图片 | `<input type=file>`，受浏览器限制 | `uni.chooseImage`，**无需动态申请**（小程序统一授权） | `uni.chooseImage`，**首次需申请相册/相机权限**，Android 6+ 动态授权、iOS 需在 `manifest.json` 填写权限描述 |
| 拍照/录像 | 调用摄像头 API，受浏览器权限限制 | `uni.chooseVideo` / `camera` 组件 | `uni.chooseVideo`，**需 CAMERA 权限**（`manifest.json → app-plus.distribute.android.permissions` 已预置 CAMERA 等权限） |
| 保存图片到相册 | 浏览器下载行为 | `uni.saveImageToPhotosAlbum` + 用户授权 | `uni.saveImageToPhotosAlbum` + **WRITE_EXTERNAL_STORAGE（Android）/ 相册权限（iOS）** |
| 获取位置 | 浏览器 geolocation，需 HTTPS | `uni.getLocation` + `scope.userLocation` 授权 | `uni.getLocation` + **定位权限 + 腾讯/高德定位 SDK 配置**（`manifest.json → sdkConfigs.geolocation`） |
| 推送通知 | 无（浏览器 Notification 有限） | 订阅消息（一次性/长期） | **需集成个推/UniPush**，在 `manifest.json → sdkConfigs.push` 配置，且需厂商通道（小米/OPPO/vivo/华为/FCM） |
| 分享 | `navigator.share`（部分浏览器） | `onShareAppMessage` 转发 | `uni.share`，**需各平台 SDK 配置**（微信分享需 `sdkConfigs.share.weixin` 填 appid），本项目详情页分享按钮已做条件编译 |
| 登录 | 账号密码/第三方 OAuth 网页流程 | `wx.login` 拿 code | `uni.login(provider)` + **各平台 SDK 配置**（微信/QQ/微博登录） |
| 支付 | 网页支付跳转 | `uni.requestPayment`（微信支付） | `uni.requestPayment` + **支付 SDK 配置**（支付宝/微信支付） |
| 文件/下载 | 浏览器下载 | `uni.downloadFile` + 合法域名 | `uni.downloadFile` 无域名限制；持久化要用 `plus.io` 文件系统，注意沙盒路径 |

**App 端权限配置位置**：`src/manifest.json` → `app-plus.distribute.android.permissions`（Android）与 `app-plus.distribute.ios`（iOS 权限描述文案，如 `NSCameraUsageDescription`）。模板已预置 CAMERA 等常用权限，实际项目按需裁剪。

### 4. 打包与发布

| 差异点 | H5 | 微信小程序 | App |
|---|---|---|---|
| 产物 | `dist/build/h5`，纯静态文件，丢到任意 Web 服务器/Nginx/CDN | `dist/build/mp-weixin`，用微信开发者工具上传审核 | `dist/build/app` 只是资源，**真机运行/打包必须 HBuilderX** |
| 打包方式 | `npm run build:h5` | `npm run build:mp-weixin` + 开发者工具上传 | **云打包**（DCloud 服务器，简单，有次数/队列限制）或 **本地打包**（配 Android Studio / Xcode，自由度高） |
| 签名证书 | 无 | 无（微信平台托管） | **必须有**：Android 用 `.keystore`（`keytool` 生成），iOS 需 Apple Developer 证书 + 描述文件（`.p12` + `.mobileprovision`），否则无法安装 |
| 应用标识 | 域名 | 微信 `appid`（`manifest.json → mp-weixin.appid`，当前为空需替换） | Android 包名（如 `com.xxx.xhs`）、iOS Bundle ID；**appid 需在 DCloud 开发者中心申请** |
| 版本管理 | 静态文件覆盖 | 小程序后台版本号 | `manifest.json` 的 `versionName`（显示版本）/`versionCode`（内部版本号，递增） |
| 热更新 | 直接更新静态资源 | 微信审核发布 | **可用 wgt 热更新**（`plus.runtime.install` 安装 wgt 资源包）绕过部分原生更新，但涉及原生插件必须重新打包 |

### 5. 运行与调试差异

| 差异点 | H5 | 微信小程序 | App |
|---|---|---|---|
| 调试工具 | 浏览器 DevTools | 微信开发者工具（模拟器 + 真机调试） | HBuilderX 运行到手机/模拟器；**Android 用 adb，iOS 需真机 + 描述文件** |
| `console.log` | 浏览器控制台 | 开发者工具控制台 | HBuilderX 控制台 / Chrome DevTools 远程调试（`uni.setEnableDebug`） |
| 网络请求 | 浏览器可能有跨域（本项目 Mock 无请求，不涉及） | 需配置 request 合法域名 + HTTPS | 无跨域、无域名限制，但要注意 Android 9+ 默认禁明文 HTTP（需 `usesCleartextTraffic` 或改 HTTPS） |
| 返回键 | 浏览器后退 | 小程序左上角返回 | **实体返回键**：`onBackPress` 生命周期可拦截；双按退出需自行实现（本项目未覆盖，正式 App 建议加） |
| 生命周期 | `onLoad/onShow/onHide` | 同左 + 小程序特有 `onShareAppMessage` | 同左 + `onBackPress`、`onLaunch` 里可拿 `plus.runtime` 信息（见 `App.vue` 条件编译示例） |

### 6. App 端实战注意事项（本项目踩坑/建议）

1. **状态栏适配**：App 端页面从状态栏下方开始渲染，若自定义顶部导航，务必用 `uni.getSystemInfoSync().statusBarHeight` 设置 padding，否则内容被状态栏遮挡。本项目用原生导航栏规避了此问题。
2. **底部安全区**：iPhone X 及以后机型，固定底栏（评论输入框、发布按钮）需加 `padding-bottom: env(safe-area-inset-bottom)`，否则被 Home 指示条遮挡。
3. **权限"拒绝后不再询问"**：Android 用户勾选「不再询问」后再次申请会直接失败，必须引导用户到系统设置页开启（`plus.runtime.openURL('app-settings:')`）。
4. **图片内存**：App 端大图列表容易 OOM，务必用 `lazy-load` + 压缩图（`chooseImage` 的 `sizeType: ['compressed']`，本项目发布页已用）+ 长列表虚拟滚动。
5. **包体积与首屏**：App 冷启动慢于 H5/小程序，首屏图片建议加骨架屏；`manifest.json` 里 `splashscreen` 配置启动图可改善观感。
6. **条件编译验证**：改完代码至少跑一次 `dev:h5` 和 `dev:app`，因为 H5 能过不代表 App 能过（如 `plus` API 在 H5 不存在）。
7. **iOS 审核**：涉及用户生成内容（UGC）的 App（如小红书）上架 App Store 需提供内容审核机制、举报入口、用户协议与隐私政策，否则会被拒。本项目为演示 Demo，未实现这些合规能力。

---

## 五、已知限制

- 数据为纯前端 Mock，**刷新页面后互动状态（点赞/评论/发布）会重置**（Pinia 内存态）。如需持久化，可加 `pinia-plugin-persistedstate`，但 App 端建议用 `uni.setStorageSync` 封装。
- 网络占位图依赖外网 `picsum.photos`；离线环境图片不显示。
- 分享/推送/支付/登录等原生能力仅做了条件编译占位，未接真实 SDK。
- 视频使用公网示例 mp4，仅演示播放能力。
- tabBar 用纯文字，未配图标（规避各端图标尺寸规范差异）；正式项目建议按各端规范补 `@2x/@3x` 图标。

---

## 六、继续开发建议

- 接真实后端：把 `src/mock/data.js` 换成 `uni.request` 封装的 API 层，Pinia actions 里改调接口。
- 加持久化：`uni.setStorageSync` 保存 likedIds/collectedIds/发布内容。
- App 端补：状态栏适配、`onBackPress` 双击退出、UniPush推送、UGC 合规能力。
- 多端适配测试：每完成一个功能点，至少验证 H5 + 小程序 + App 三端编译。
