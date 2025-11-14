# 快点点 - 餐厅自助点餐系统

## 项目简介

"快点点"是一个基于 Supabase 的现代化餐厅自助点餐系统，为顾客提供流畅的点餐体验，支持堂食和外卖两种点餐方式。

## 核心功能

- **📱 菜单浏览** - 分类展示菜品，支持图片和详细描述
- **🛒 智能购物车** - 实时计算总价，支持数量修改和删除
- **🍔 多类型点餐** - 支持堂食（需填写桌号）和外卖（需填写地址）
- **✅ 订单跟踪** - 实时查看订单状态和制作进度
- **🎨 响应式设计** - 完美适配手机和桌面设备

## 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **后端**: Supabase (PostgreSQL + 实时数据库)
- **存储**: Supabase Storage (图片存储)
- **认证**: Supabase Auth (用户认证)

## 项目结构

```
快点点餐厅点餐系统/
├── index.html          # 欢迎页面
├── menu.html           # 菜单页面
├── cart.html           # 购物车页面
├── order.html          # 订单确认页面
├── style.css           # 全局样式
├── supabase-config.js  # Supabase 配置
├── database-schema.sql # 数据库表结构
└── README.md           # 项目说明
```

## 数据库设计

系统包含 5 张核心数据表：

### 1. profiles (用户信息表)
- `id` (uuid) - 主键，关联 auth.users
- `username` (text) - 用户名
- `phone` (text) - 手机号
- `created_at` (timestamp) - 创建时间

### 2. categories (菜品分类表)
- `id` (serial) - 主键，自增
- `name` (text) - 分类名称
- `sort` (int) - 排序权重

### 3. dishes (菜品表)
- `id` (uuid) - 主键
- `name` (text) - 菜品名称
- `category_id` (int) - 分类ID
- `price` (decimal) - 价格
- `image_url` (text) - 图片URL
- `description` (text) - 描述
- `status` (boolean) - 在售状态

### 4. orders (订单表)
- `id` (uuid) - 主键
- `user_id` (uuid) - 用户ID
- `order_no` (text) - 订单号
- `type` (text) - 点餐类型 (dine_in/takeaway)
- `table_no` (text) - 桌号
- `address` (text) - 地址
- `phone` (text) - 联系电话
- `total_amount` (decimal) - 总金额
- `status` (text) - 订单状态
- `created_at` (timestamp) - 创建时间

### 5. order_items (订单项表)
- `id` (uuid) - 主键
- `order_id` (uuid) - 订单ID
- `dish_id` (uuid) - 菜品ID
- `quantity` (int) - 数量
- `unit_price` (decimal) - 单价

## 使用说明

### 1. 开始点餐
- 访问 `index.html` 进入欢迎页面
- 点击"开始点餐"按钮进入菜单页面

### 2. 浏览菜单
- 在菜单页面浏览菜品分类
- 点击分类标签筛选不同菜品
- 查看菜品图片、名称、价格和描述

### 3. 添加购物车
- 点击"加入购物车"按钮添加菜品
- 支持数量调整（+/- 按钮）
- 购物车图标显示当前商品数量

### 4. 结算订单
- 点击底部"去结算"按钮进入购物车
- 选择点餐类型（堂食/外卖）
- 填写必要信息（桌号/地址）
- 确认订单总金额并提交

### 5. 订单确认
- 系统自动跳转到订单确认页面
- 查看订单详细信息
- 模拟支付流程
- 跟踪订单状态

## 安装和部署

### 本地运行
1. 克隆项目到本地
2. 配置 Supabase 连接信息（修改 `supabase-config.js`）
3. 在浏览器中打开 `index.html`

### Supabase 配置
1. 在 Supabase 控制台创建新项目
2. 执行 `database-schema.sql` 创建表结构
3. 配置环境变量：
   ```javascript
   const SUPABASE_URL = '你的 Supabase 项目 URL';
   const SUPABASE_ANON_KEY = '你的 Supabase Anon Key';
   ```

## 特色功能

### 响应式设计
- 完美适配手机端和桌面端
- 触摸友好的交互设计
- 优化的加载性能

### 实时数据同步
- 基于 Supabase 实时订阅
- 订单状态实时更新
- 库存状态监控

### 用户体验优化
- 流畅的交互动画
- 清晰的视觉反馈
- 智能的错误处理

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

本项目仅供学习和演示使用。

## 联系方式

如有问题或建议，请联系技术支持团队。