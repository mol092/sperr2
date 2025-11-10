# 美食餐厅系统

一个基于 Supabase 和 Netlify 的在线餐饮服务平台。

## 项目概述

本项目是一个完整的餐饮系统网站，包含以下功能：
- **餐厅展示**：展示合作餐厅信息
- **菜品浏览**：在线浏览菜单和菜品详情
- **在线点餐**：选择菜品生成订单
- **订单管理**：订单状态跟踪和管理

## 技术栈

- **前端**：HTML5 + CSS3 + JavaScript
- **后端**：Supabase（数据库和API服务）
- **部署**：Netlify
- **版本控制**：Git

## 项目结构

```
superbase/
├── index.html          # 首页
├── order.html         # 点餐页面
├── about.html         # 关于页面
├── supabase-config.js # Supabase配置
├── package.json       # 项目配置
├── vite.config.js     # Vite配置
├── database-design.md # 数据库设计文档
└── README.md         # 项目说明
```

## 数据库设计

系统包含3张核心数据表：

### 1. restaurants 表（餐厅表）
- id: 主键，唯一标识
- name: 餐厅名称
- description: 餐厅描述
- address: 餐厅地址
- phone: 联系电话
- image_url: 餐厅图片
- created_at: 创建时间
- updated_at: 更新时间

### 2. dishes 表（菜品表）
- id: 主键，唯一标识
- name: 菜品名称
- description: 菜品描述
- price: 价格
- image_url: 菜品图片
- category: 菜品分类
- restaurant_id: 外键，关联餐厅表
- available: 是否可用
- created_at: 创建时间
- updated_at: 更新时间

### 3. orders 表（订单表）
- id: 主键，唯一标识
- customer_name: 客户姓名
- customer_phone: 客户电话
- total_amount: 总金额
- status: 订单状态
- items: JSON格式的订单详情
- restaurant_id: 外键，关联餐厅表
- created_at: 创建时间
- updated_at: 更新时间

## 功能特性

### 首页 (index.html)
- 响应式设计，适配各种设备
- 餐厅展示和介绍
- 菜品推荐展示
- 导航到点餐和关于页面

### 点餐页面 (order.html)
- 餐厅选择功能
- 动态菜单加载
- 菜品选择和数量控制
- 订单汇总和价格计算
- 客户信息填写

### 关于页面 (about.html)
- 项目详细介绍
- 技术栈说明
- 系统功能特性
- 联系信息和作业说明

## 部署说明

### 本地开发
1. 安装依赖：`npm install`
2. 启动开发服务器：`npm run dev`
3. 访问：http://localhost:3000

### Netlify 部署
1. 将项目推送到 GitHub 仓库
2. 登录 Netlify，选择 GitHub 仓库
3. 配置构建设置：
   - 构建命令：`npm run build`
   - 发布目录：`dist`
4. 部署完成，获取访问链接

### Supabase 配置
1. 在 Supabase 创建新项目
2. 根据 `database-design.md` 创建数据表
3. 在 `supabase-config.js` 中配置项目 URL 和密钥

## 使用说明

1. **浏览餐厅**：在首页查看合作餐厅信息
2. **选择菜品**：进入点餐页面，选择餐厅和菜品
3. **下单**：填写客户信息，确认订单
4. **订单跟踪**：系统会记录订单状态

## 开发规范

- 代码遵循 Web 标准
- 使用语义化 HTML 标签
- CSS 采用现代布局技术（Flexbox、Grid）
- JavaScript 使用 ES6+ 语法
- 保持代码简洁和可维护性

## 作业要求

- ✅ 使用 Supabase 和 Netlify
- ✅ 至少 3 个独立页面
- ✅ Supabase 中至少 3 张数据表
- ✅ 网站定位明确（餐饮系统）
- ✅ 提交 Netlify 部署链接

## 截止时间

**2025年11月23日17:00**

## 作者信息

项目开发者：学生作业项目
联系方式：通过系统反馈

---

*本项目为网站开发作业，旨在展示现代Web开发技术在实际项目中的应用。*