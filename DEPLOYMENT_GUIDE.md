# 部署指南

## 项目已完成构建

你的美食餐厅系统已经成功创建，包含以下特性：

### ✅ 已完成的功能
- ✅ 3个独立页面：首页、点餐页、关于页
- ✅ 响应式设计，适配各种设备
- ✅ 完整的数据库设计（3张表：餐厅、菜品、订单）
- ✅ Supabase 集成配置
- ✅ Netlify 部署配置
- ✅ 现代化前端技术栈

### 项目文件结构
```
superbase/
├── index.html          # 首页 - 餐厅展示
├── order.html         # 点餐页面 - 在线下单
├── about.html         # 关于页面 - 项目介绍
├── supabase-config.js # Supabase 配置
├── package.json       # 项目配置
├── netlify.toml       # Netlify 部署配置
├── README.md          # 详细说明文档
└── dist/              # 构建输出目录
```

## 部署步骤

### 第一步：准备 GitHub 仓库
1. 在 GitHub 上创建新的仓库
2. 将项目文件推送到仓库：
```bash
git init
git add .
git commit -m "Initial commit: Food Restaurant System"
git branch -M main
git remote add origin [你的GitHub仓库URL]
git push -u origin main
```

### 第二步：配置 Supabase
1. 访问 [Supabase官网](https://supabase.com)
2. 创建新项目
3. 在项目设置中获取：
   - **项目 URL**
   - **匿名 API 密钥**
4. 在 `supabase-config.js` 中更新配置：
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```
5. 在 Supabase 控制台中创建数据表（参考 `database-design.md`）

### 第三步：部署到 Netlify
1. 访问 [Netlify官网](https://netlify.com)
2. 使用 GitHub 账号登录
3. 选择 "New site from Git"
4. 选择你的 GitHub 仓库
5. 配置构建设置：
   - **构建命令**: `npm run build`
   - **发布目录**: `dist`
6. 点击 "Deploy site"

### 第四步：获取部署链接
部署完成后，Netlify 会提供类似这样的链接：
`https://your-site-name.netlify.app`

## 作业提交要求

### 需要提交的内容
1. **Netlify 部署链接**（最重要的提交内容）
2. **GitHub 仓库链接**（可选，作为代码备份）

### 截止时间
**2025年11月23日17:00**

## 功能验证清单

在提交前，请验证以下功能：
- [ ] 首页能正常显示餐厅信息
- [ ] 点餐页面能选择菜品和数量
- [ ] 关于页面完整显示项目信息
- [ ] 所有页面响应式设计正常
- [ ] Supabase 连接配置正确

## 技术亮点

1. **现代前端技术**：使用 HTML5、CSS3、JavaScript ES6+
2. **响应式设计**：适配手机、平板、电脑
3. **数据库设计**：规范的3张数据表结构
4. **部署优化**：配置了 Netlify 自动化部署
5. **代码规范**：清晰的代码结构和注释

## 问题解决

如果遇到部署问题：
1. 检查 Netlify 构建日志
2. 验证 Supabase 配置是否正确
3. 确认所有文件已推送到 GitHub
4. 检查浏览器控制台是否有错误信息

## 联系方式

如有技术问题，可通过以下方式获取帮助：
- 查看项目 README.md 文件
- 检查代码注释和文档
- 联系课程教师或助教

---

**祝你作业顺利！** 🎉