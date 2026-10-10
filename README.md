# 阿呆 · ymstar 个人站点

基于 Astro 构建的个人 IP 展示站点，部署于 Vercel。

## 技术栈

- **框架**: Astro 5
- **样式**: Tailwind CSS 3
- **部署**: Vercel

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署到 Vercel

### 方式一：Git 接入（推荐）

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入仓库
3. Vercel 自动识别 Astro，无需额外配置
4. 在 Vercel 项目设置中添加自定义域名 `ymstar.cn`

### 方式二：CLI 部署

```bash
npm i -g vercel
vercel        # 预览部署
vercel --prod # 生产部署
```

### 域名绑定

1. 在域名 DNS 服务商添加 CNAME 记录：
   ```
   CNAME  ymstar.cn  →  cname.vercel-dns.com
   ```
2. 在 Vercel 项目 Settings → Domains 中添加 `ymstar.cn`

## 站点结构

- `/` — 首页：个人介绍 + 产品展示 + 最新文章
- `/blog` — 博客文章列表
- `/blog/[slug]` — 文章详情
- `/about` — 关于我

## 添加文章

在 `src/content/posts/` 下新建 `.md` 文件：

```yaml
---
title: 文章标题
pubDate: 2024-01-01
category: 分类
tags: [标签1, 标签2]
---

正文内容...
```
