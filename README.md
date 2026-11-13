<p align="center"><img src="assets/covers/30-QuickCompress.jpg" alt="图片压缩 项目封面" width="100%"></p>

<h1 align="center">QuickCompress · 批量图片压缩</h1>

<p align="center">拖进来、压下去、打包下载，全程在浏览器里完成</p>

<p align="center">
  <a href="http://compress.aikex.ink/">在线使用</a>
</p>

## 简介

纯前端批量压缩工具。图片不上传服务器，压缩在你的浏览器里跑，适合一次处理一整批截图、商品图和素材图，压完直接打包成 zip 拿走。

## 功能

- **拖拽上传**：多张图片一起拖进来，自动排队
- **批量压缩**：逐张处理并显示压缩前后的体积对比
- **ZIP 打包**：一次下载全部结果，不用逐张点保存
- **零服务器**：不上传、不留存，隐私上更放心
- **可调质量**：按需在体积与画质之间取平衡

## 技术栈

HTML5 + JavaScript（Canvas / `browser-image-compression`）· JSZip 打包 · 纯静态托管

## 使用

打开页面 → 拖入图片 → 等待处理 → 查看体积变化 → 点下载获取 zip。无需注册、无需安装。

## 项目结构

```
index.html    页面与交互
js/           压缩与打包逻辑
styles/       样式
```

## 许可证

仓库未附 LICENSE 文件，使用与分发请先联系作者确认。
