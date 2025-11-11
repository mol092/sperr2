# 用户端自助点餐系统数据库设计

## 数据表结构（基于3张核心表：dishes、orders、order_details）

### 1. dishes 表（菜品表）
- id: UUID 主键，唯一标识
- name: TEXT 菜品名称
- description: TEXT 菜品描述
- price: DECIMAL(10,2) 价格
- image_url: TEXT 菜品图片URL
- category: TEXT 菜品分类（热菜、主食、饮品、小吃等）
- stock: INTEGER 库存数量
- status: INTEGER 状态（1=在售，0=下架）
- available: BOOLEAN 是否可用（备用字段）
- created_at: TIMESTAMP 创建时间
- updated_at: TIMESTAMP 更新时间

### 2. orders 表（订单表）
- id: UUID 主键，唯一标识
- table_num: TEXT 桌号标识（如 "A01", "2号桌"）
- total_amount: DECIMAL(10,2) 总金额
- pay_status: INTEGER 支付状态（0=未支付，1=已支付）
- order_status: INTEGER 订单状态（0=新订单，1=已接单，2=已完成，3=已取消）
- remark: TEXT 用户备注
- pay_time: TIMESTAMP 支付时间
- created_at: TIMESTAMP 创建时间
- updated_at: TIMESTAMP 更新时间

### 3. order_details 表（订单详情表）
- id: UUID 主键，唯一标识
- order_id: UUID 外键，关联orders表
- dish_id: UUID 外键，关联dishes表
- dish_name: TEXT 菜品名称（冗余存储，避免菜品信息变更影响订单）
- unit_price: DECIMAL(10,2) 下单时的单价
- quantity: INTEGER 数量
- subtotal: DECIMAL(10,2) 小计金额
- created_at: TIMESTAMP 创建时间

## 核心业务流程设计

### 用户端零门槛点餐流程
1. **桌号绑定**：用户输入桌号→系统校验→绑定会话
2. **菜品浏览**：分类筛选+搜索+库存状态显示
3. **购物车操作**：加购+数量调整+库存实时校验
4. **订单提交**：确认菜品+填写备注+库存校验
5. **支付流程**：多方式支付+状态轮询+超时取消
6. **状态查询**：实时订单进度跟踪
7. **历史记录**：桌号历史订单查询

## 数据交互关系
- 订单与菜品：一对多关系（通过order_details连接）
- 库存管理：下单时实时扣减，取消时自动回滚
- 状态流转：支付状态和订单状态的完整闭环管理