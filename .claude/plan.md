# Astro 个人 IP 站点重建计划

## 技术栈

- **框架**: Astro (最新版)
- **样式**: Tailwind CSS v4 — 快速构建明亮清爽风格
- **内容**: Astro Content Collections — 原生 Markdown 支持
- **图片**: Astro `<Image>` — 自动压缩 + WebP
- **部署**: Vercel（@astrojs/vercel adapter）
- **域名**: ymstar.cn

## 站点结构

```
orca-blog/                    # 在当前仓库新建 astro 子目录或直接初始化
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── public/
│   ├── favicon.svg
│   └── avatar.jpeg           # 从现有博客复制
├── src/
│   ├── content/
│   │   ├── config.ts         # Content Collection schema
│   │   └── posts/*.md        # 40 篇文章迁移
│   ├── data/
│   │   └── projects.ts       # 4 个个人产品数据
│   ├── layouts/
│   │   ├── Base.astro        # <html> 骨架 + nav + footer
│   │   └── Post.astro        # 文章详情布局
│   ├── components/
│   │   ├── Nav.astro         # 顶部导航栏
│   │   ├── Footer.astro
│   │   ├── Hero.astro        # 首页个人介绍区
│   │   ├── ProductCard.astro # 产品展示卡片
│   │   ├── ProductGrid.astro
│   │   ├── PostCard.astro    # 文章卡片
│   │   └── PostList.astro    # 文章列表
│   ├── pages/
│   │   ├── index.astro       # 首页: Hero + Products + Latest Posts
│   │   ├── about.astro       # 关于我
│   │   ├── blog.astro        # 文章列表页
│   │   └── blog/
│   │       └── [slug].astro  # 文章详情
│   └── styles/
│       └── global.css
```

## 页面设计

### 首页 (index.astro) — 三段式

**1. Hero 区**（全屏高度 60vh）
- 左侧：大标题「Hi, I'm 阿呆 👋」+ 副标题「Software Engineer & Indie Maker」
- 一句话简介：「一个不务正业的程序员，不愿躺平的年轻人」
- 社交链接：GitHub / 邮箱 / 知乎
- 右侧：头像（圆形，柔和阴影）

**2. Products 区**（核心区域）
- 标题：「我的产品」
- 4 张产品卡片网格（2×2 或 4×1 响应式）
- 每张卡片：产品名 / 一句话描述 / 标签（开源/在线）/ 外链图标
- 卡片 hover 微动效（上浮 + 阴影加深）

**3. Latest Writing 区**（次要）
- 标题：「最新文章」+ 「查看全部 →」链接到 /blog
- 展示最新 5 篇文章的简要列表（日期 / 标题 / 分类）
- 无封面图，纯文字排版，简洁

### 博客列表页 (blog.astro)
- 按年份分组的文章列表
- 每条：日期 / 标题 / 分类标签
- 简洁列表样式，非卡片瀑布流

### 文章详情页 (blog/[slug].astro)
- 顶部：标题 / 日期 / 分类 / 标签
- 正文：Markdown 渲染，Tailwind Typography 插件美化
- 底部：上下篇导航
- 无 banner 轮播、无 Live2D、无音乐播放器

### 关于页 (about.astro)
- 个人介绍 + 技能标签 + 社交链接
- 复用现有 about 内容，精简优化

## 产品数据定义 (src/data/projects.ts)

```ts
export const projects = [
  {
    name: '卡雷达',
    description: '在线雷达图表生成工具',
    url: 'https://kaleida.com.cn',
    type: 'online',        // 在线产品
    openSource: false,
  },
  {
    name: '个人菜谱',
    description: '个人菜谱集合网站',
    url: 'https://cookbook.ymstar.cn',
    type: 'online',
    openSource: true,
    repo: 'https://github.com/ymstar/cookbook',
  },
  {
    name: 'Temporal 中文文档',
    description: 'Temporal 工作流引擎中文翻译文档',
    url: 'https://temporalcn.site',
    type: 'docs',
    openSource: true,
    repo: 'https://github.com/ymstar/temporalcn',
  },
  {
    name: 'DyHub',
    description: '抖音弹幕互动中台',
    url: 'https://github.com/ymstar/dyhub',
    type: 'tool',
    openSource: true,
    repo: 'https://github.com/ymstar/dyhub',
  },
];
```

## 文章迁移方案

### Front-matter 映射
现有格式 → Astro Content Collection schema：

```yaml
# 现有                          # 新 schema
title: 线程池                   → title: string
date: 2019-06-04 22:21:54      → pubDate: Date
categories: [并发]             → category: string (取第一个)
tags: [线程池]                 → tags: string[]
top: true                      → featured: boolean (可选)
cover: /img/Random-img/58.jpg  → 丢弃（新设计不用随机封面图）
```

### 迁移步骤
1. 复制 `source/_posts/*.md` → `src/content/posts/`
2. 脚本批量转换 front-matter 字段名
3. 文件名转为 slug（去除特殊字符，中文保留或转拼音）
4. 正文中的图片引用：
   - 外链图片（cos.ap-beijing.myqcloud.com）保留原样
   - 本地 /img/ 路径的图片 → 丢弃或替换为占位说明

### Content Collection Schema (src/content/config.ts)
```ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().default('未分类'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

## 视觉规范

- **主色调**: 蓝色系 (#3B82F6 为点缀色，非满屏)
- **背景**: 纯白 #FFFFFF / 浅灰区段 #F8FAFC
- **文字**: 深灰 #1E293B（非纯黑，更柔和）
- **卡片**: 白底 + 1px 边框 #E2E8F0 + hover 时 shadow-lg
- **字体**: 系统字体栈，中文用 PingFang SC / Microsoft YaHei
- **圆角**: 12px（卡片）/ 8px（按钮）
- **间距**: 充足留白，内容区最大宽度 768px（文章）/ 1200px（首页）

## 实施步骤

### Step 1: 项目初始化
- `npm create astro@latest` 初始化项目
- 安装 Tailwind CSS v4 + @tailwindcss/typography
- 配置 astro.config.mjs（site URL、Vercel adapter）
- 配置 tailwind.config.mjs（自定义颜色/字体）

### Step 2: 基础布局与组件
- Base.astro 布局（<html> 骨架、全局样式、nav、footer）
- Nav.astro 导航栏（logo + 菜单 + 移动端汉堡菜单）
- Footer.astro（版权 + 社交链接）
- global.css（Tailwind 指令 + 自定义变量）

### Step 3: 首页开发
- Hero.astro（个人介绍区）
- ProductCard.astro + ProductGrid.astro（产品展示）
- PostList.astro（最新文章列表）
- index.astro 组装三段式首页

### Step 4: 博客页面
- Content Collection 配置 (config.ts)
- blog.astro 列表页（按年份分组）
- blog/[slug].astro 详情页（Markdown 渲染 + Typography）
- PostCard.astro

### Step 5: 关于页
- about.astro（个人介绍 + 技能 + 社交链接）

### Step 6: 文章迁移
- 批量复制 40 篇 .md 文件
- 脚本转换 front-matter
- 验证每篇文章可正常渲染

### Step 7: 资源与部署
- 复制 avatar.jpeg 到 public/
- 生成 favicon.svg
- 配置 Vercel adapter
- 本地 build 验证
- 输出部署说明（Vercel + 域名绑定 ymstar.cn）

## 不做的事情（明确排除）
- ❌ 不做暗色模式（先出亮色，后续可加）
- ❌ 不做 Live2D / 音乐播放器 / banner 轮播
- ❌ 不做文章封面图（纯文字排版）
- ❌ 不做评论系统（后续可加 Giscus）
- ❌ 不做搜索功能（后续可加 Pagefind）
- ❌ 不迁移 friends / gallery / music 页面
