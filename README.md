# 刑天

刑天是一个个人成长记录与复盘系统。当前版本聚焦：
- 主页面包含今日寄语、每日复盘、当下计划
- 本地持久化（localStorage）与可选 Supabase 云同步
- JSON 数据导出/导入（合并/替换）
- 双栏栅格布局优化、类型检查与单元测试

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

打开 `http://localhost:5173/`，右上角工具栏可见“云同步：状态”。

### Supabase（可选）
- 在项目根目录创建 `.env`：

```
VITE_SUPABASE_URL=https://<你的项目ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<你的 anon 公钥>
```

- 在 Supabase SQL 编辑器执行 `.trae/documents/supabase-schema.sql`
- 重启 `pnpm dev` 后，状态应为“正常”，新增复盘与任务会写入云端

### 备份与恢复
- 主页面工具栏支持“导出数据”与“导入数据”（JSON）
- 导入默认合并同 ID 记录；如需覆盖，可在代码中切换为 `replace`

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

（E2E 测试暂未使用）

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
