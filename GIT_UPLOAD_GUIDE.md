# GitHub 代码上传指南

由于网络连接问题，自动推送GitHub失败。以下是几种手动上传代码的方法：

## 方法一：使用Git客户端手动推送

### 第一步：安装Git客户端
1. 访问 [Git官网](https://git-scm.com/downloads) 下载Git
2. 双击安装程序，保持默认设置安装
3. 重启电脑或重新打开命令行

### 第二步：上传代码到GitHub
1. 打开Git Bash或PowerShell
2. 运行以下命令：
```bash
cd "c:/Users/24538/Desktop/superbase"
git push -u origin main
```

## 方法二：使用GitHub Desktop

1. 下载 [GitHub Desktop](https://desktop.github.com/)
2. 登录你的GitHub账户
3. 添加本地仓库：
   - File → Add Local Repository
   - 选择路径：`c:/Users/24538/Desktop/superbase`
4. 点击 "Publish repository"

## 方法三：直接上传到GitHub网页

1. 访问你的GitHub仓库：https://github.com/mol092/super
2. 点击 "Upload files" 按钮
3. 将项目文件夹中的所有文件拖拽到上传区域
4. 添加提交信息："Initial commit: Food ordering system"
5. 点击 "Commit changes"

## 项目文件清单
确保上传以下所有文件：

- 📄 `index.html` - 首页
- 📄 `order.html` - 点餐页面
- 📄 `about.html` - 关于页面
- 📄 `package.json` - 项目配置
- 📄 `vite.config.js` - 构建配置
- 📄 `supabase-config.js` - Supabase配置
- 📄 `netlify.toml` - Netlify部署配置
- 📄 `README.md` - 项目说明
- 📄 `database-design.md` - 数据库设计
- 📄 `DEPLOYMENT_GUIDE.md` - 部署指南
- 📄 `.gitignore` - Git忽略文件
- 📁 `src/` - 源代码目录

## 验证上传成功
上传完成后，检查仓库是否包含所有文件：
1. 访问 https://github.com/mol092/super
2. 确认所有文件都显示在仓库中

## 下一步：部署到Netlify

代码上传到GitHub后，按照 `DEPLOYMENT_GUIDE.md` 中的说明部署到Netlify。

### 快速部署步骤：
1. 登录 [Netlify](https://app.netlify.com/)
2. 选择 "New site from Git"
3. 选择你的GitHub仓库
4. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击 "Deploy site"

---

**注意**：如果网络连接仍然有问题，建议使用校园网或移动热点尝试上传。