<p align="center">
  <img src="https://img.shields.io/badge/Type-Web_App-3498db?style=for-the-badge&logo=html5" alt="Type">
  <img src="https://img.shields.io/badge/Zero_Server-✓-2ecc71?style=for-the-badge" alt="Serverless">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</p>

<h1 align="center">🖼️ QuickCompress</h1>

<p align="center">
  <b>客户端批量图片压缩工具</b>
</p>

<p align="center">
  拖拽上传 · 批量压缩 · 保持原始文件名 · 一键打包下载 · 纯前端零服务器
</p>

---

## 📌 项目简介

QuickCompress（IC 智能图片压缩）是一款纯前端实现的批量图片压缩工具。所有压缩操作均在浏览器本地完成，图片不会上传到任何服务器，保障用户隐私安全。支持拖拽上传、实时进度展示、单张/批量下载，压缩后保持原始文件名。

---

## ✨ 核心特性

- 🖼️ **批量图片上传** — 支持多图片同时上传，拖拽或点击两种方式
- 🎯 **高质量压缩算法** — 基于 browser-image-compression，最大 1920px 自适应
- 📦 **保持原始文件名** — 压缩后文件名与原始文件完全一致
- 📊 **实时压缩进度** — 每张图片独立进度条 + 全局进度统计
- 📥 **一键打包下载** — 多文件自动打包为 ZIP，单文件直接下载
- 💻 **纯前端实现** — 零服务器依赖，所有处理在浏览器本地完成
- 🔒 **隐私安全** — 图片不上传服务器，本地压缩本地下载
- 🌐 **全浏览器兼容** — Chrome / Firefox / Safari / Edge 全支持
- 📐 **EXIF 保留** — 压缩后保留原始照片的 EXIF 信息

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **HTML5** | 页面结构 |
| **CSS3** | 界面样式与动画 |
| **JavaScript (ES6+)** | 核心逻辑 |
| **browser-image-compression** | 图片压缩引擎 |
| **JSZip** | 多文件 ZIP 打包 |
| **Font Awesome** | 图标库 |

---

## 🚀 快速开始

### 前置条件

- 现代浏览器（Chrome / Firefox / Safari / Edge）

### 安装步骤

```bash
git clone https://github.com/aiyangdie/QuickCompress.git
cd QuickCompress
```

### 运行命令

直接用浏览器打开 `index.html` 即可使用，无需任何服务器。

也可使用本地服务器：

```bash
npx serve .
```

---

## 📂 项目结构

```
QuickCompress/
├── index.html      # 主页面
├── script.js       # 核心逻辑（上传/压缩/下载）
├── style.css       # 界面样式
├── favicon.ico     # 网站图标
├── CNAME           # 自定义域名配置
├── .gitignore
└── README.md
```

---

## 🤝 贡献与许可证

欢迎贡献！请遵循以下流程：

1. **Fork** 本仓库
2. 创建特性分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'feat: add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 **Pull Request**

本项目基于 **MIT License** 开源协议。
