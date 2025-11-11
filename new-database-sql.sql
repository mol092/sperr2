-- 用户端自助点餐系统 - 完整建表SQL
-- 基于3张核心表：dishes、orders、order_details

-- 1. 创建 dishes 表（菜品表）
CREATE TABLE IF NOT EXISTS dishes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1 CHECK (status IN (0, 1)), -- 1=在售，0=下架
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建 orders 表（订单表）
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_num TEXT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    pay_status INTEGER DEFAULT 0 CHECK (pay_status IN (0, 1)), -- 0=未支付，1=已支付
    order_status INTEGER DEFAULT 0 CHECK (order_status IN (0, 1, 2, 3)), -- 0=新订单，1=已接单，2=已完成，3=已取消
    remark TEXT,
    pay_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建 order_details 表（订单详情表）
CREATE TABLE IF NOT EXISTS order_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    dish_id UUID REFERENCES dishes(id),
    dish_name TEXT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category);
CREATE INDEX IF NOT EXISTS idx_dishes_status ON dishes(status);
CREATE INDEX IF NOT EXISTS idx_dishes_stock ON dishes(stock);
CREATE INDEX IF NOT EXISTS idx_orders_table_num ON orders(table_num);
CREATE INDEX IF NOT EXISTS idx_orders_pay_status ON orders(pay_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_details_order_id ON order_details(order_id);
CREATE INDEX IF NOT EXISTS idx_order_details_dish_id ON order_details(dish_id);

-- 5. 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. 为需要更新时间的表创建触发器
CREATE TRIGGER update_dishes_updated_at 
    BEFORE UPDATE ON dishes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. 设置行级安全策略（RLS）
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_details ENABLE ROW LEVEL SECURITY;

-- 8. 创建安全策略
-- 允许匿名用户读取在售菜品
CREATE POLICY "允许匿名读取在售菜品" ON dishes FOR SELECT USING (status = 1);

-- 允许匿名用户创建订单
CREATE POLICY "允许匿名创建订单" ON orders FOR INSERT WITH CHECK (true);

-- 允许匿名用户读取自己桌号的订单（通过桌号关联）
CREATE POLICY "允许匿名读取桌号订单" ON orders FOR SELECT USING (table_num = current_setting('request.jwt.claims', true)::json->>'table_num' OR current_setting('request.jwt.claims', true)::json->>'table_num' IS NULL);

-- 允许匿名用户创建订单详情
CREATE POLICY "允许匿名创建订单详情" ON order_details FOR INSERT WITH CHECK (true);

-- 9. 插入示例数据
-- 菜品示例数据
INSERT INTO dishes (name, description, price, category, stock, image_url) VALUES 
('宫保鸡丁', '经典川菜，麻辣鲜香，花生脆爽', 48.00, '热菜', 20, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300'),
('北京烤鸭', '皮脆肉嫩，传统工艺，经典京味', 128.00, '热菜', 15, 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300'),
('麻婆豆腐', '麻辣鲜香，豆腐嫩滑，下饭神器', 32.00, '热菜', 25, 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=300'),
('扬州炒饭', '米饭粒粒分明，配料丰富，经典主食', 28.00, '主食', 30, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300'),
('小笼包', '皮薄馅大，汤汁丰富，上海特色', 36.00, '主食', 18, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300'),
('可乐', '冰镇可乐，清爽解渴', 8.00, '饮品', 50, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300'),
('橙汁', '鲜榨橙汁，富含维C', 15.00, '饮品', 25, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300'),
('春卷', '外酥里嫩，香脆可口', 18.00, '小吃', 12, 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300'),
('冰淇淋', '多种口味，手工制作，甜蜜享受', 25.00, '甜点', 8, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300');

-- 10. 创建库存检查函数（下单时使用）
CREATE OR REPLACE FUNCTION check_dish_stock(dish_id UUID, required_quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    current_stock INTEGER;
BEGIN
    SELECT stock INTO current_stock FROM dishes WHERE id = dish_id;
    RETURN current_stock >= required_quantity;
END;
$$ language 'plpgsql';

-- 11. 创建订单状态更新函数
CREATE OR REPLACE FUNCTION update_order_status(order_id UUID, new_status INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE orders SET order_status = new_status, updated_at = NOW() WHERE id = order_id;
    RETURN FOUND;
END;
$$ language 'plpgsql';

-- 完成提示
SELECT '用户端自助点餐系统数据库表创建完成！' as message;