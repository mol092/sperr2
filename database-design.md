# 餐饮系统数据库设计

## 数据表结构（3张表）

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
- category: 菜品分类（如：主食、小吃、饮品等）
- restaurant_id: 外键，关联餐厅表
- available: 是否可用
- created_at: 创建时间
- updated_at: 更新时间

### 3. orders 表（订单表）
- id: 主键，唯一标识
- customer_name: 客户姓名
- customer_phone: 客户电话
- total_amount: 总金额
- status: 订单状态（pending, confirmed, completed, cancelled）
- items: JSON格式的订单详情，包含菜品ID、数量等
- restaurant_id: 外键，关联餐厅表
- created_at: 创建时间
- updated_at: 更新时间

## 关系说明
- 一个餐厅可以有多个菜品
- 一个订单属于一个餐厅
- 订单包含多个菜品