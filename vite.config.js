import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// H5 部署到 GitHub Pages 子路径时，base 需设为 '/仓库名/'。
// 本地默认 '/'，CI 通过环境变量 VITE_BASE 注入（见 .github/workflows/deploy.yml）。
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [
    uni(),
  ],
})
