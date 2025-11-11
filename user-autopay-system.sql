-- 用户端自助点餐系统 - 完整数据库建表SQL
-- 优化版本：考虑用户体验、功能完善、数据安全

-- 1. 创建 dishes 表（菜品表）
CREATE TABLE IF NOT EXISTS dishes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    image_url TEXT,
    category TEXT NOT NULL,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    status INTEGER DEFAULT 1 CHECK (status IN (0, 1)), -- 1=在售，0=下架
    spicy_level INTEGER DEFAULT 0 CHECK (spicy_level BETWEEN 0 AND 5), -- 辣度级别
    cooking_time INTEGER DEFAULT 15, -- 预计制作时间（分钟）
    tags TEXT[], -- 标签数组（如：['推荐','新品','热销']）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建 orders 表（订单表）
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_num TEXT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    pay_status INTEGER DEFAULT 0 CHECK (pay_status IN (0, 1)), -- 0=未支付，1=已支付
    order_status INTEGER DEFAULT 0 CHECK (order_status IN (0, 1, 2, 3, 4)), -- 0=新订单，1=已接单，2=制作中，3=已完成，4=已取消
    remark TEXT,
    estimated_time INTEGER, -- 预计完成时间（分钟）
    pay_time TIMESTAMP WITH TIME ZONE,
    completed_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建 order_details 表（订单详情表）
CREATE TABLE IF NOT EXISTS order_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    dish_id UUID REFERENCES dishes(id),
    dish_name TEXT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    special_request TEXT, -- 特殊要求（如：少盐、多辣）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建 tables 表（餐桌管理表）
CREATE TABLE IF NOT EXISTS tables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_num TEXT UNIQUE NOT NULL,
    table_type TEXT DEFAULT 'normal', -- normal/vip/large
    capacity INTEGER DEFAULT 4, -- 座位数
    status INTEGER DEFAULT 0 CHECK (status IN (0, 1, 2)), -- 0=空闲，1=占用，2=预订
    current_order_id UUID REFERENCES orders(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category);
CREATE INDEX IF NOT EXISTS idx_dishes_status ON dishes(status, stock);
CREATE INDEX IF NOT EXISTS idx_dishes_stock ON dishes(stock) WHERE status = 1;
CREATE INDEX IF NOT EXISTS idx_orders_table_num ON orders(table_num);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status, pay_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_details_order_id ON order_details(order_id);
CREATE INDEX IF NOT EXISTS idx_tables_status ON tables(status);

-- 6. 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. 为需要更新时间的表创建触发器
CREATE TRIGGER update_dishes_updated_at 
    BEFORE UPDATE ON dishes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tables_updated_at 
    BEFORE UPDATE ON tables 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. 设置行级安全策略（RLS）
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

-- 9. 创建安全策略
-- 允许匿名用户读取在售菜品
CREATE POLICY "允许匿名读取在售菜品" ON dishes FOR SELECT USING (status = 1);

-- 允许匿名用户创建订单
CREATE POLICY "允许匿名创建订单" ON orders FOR INSERT WITH CHECK (true);

-- 允许匿名用户根据桌号查询订单
CREATE POLICY "允许匿名查询桌号订单" ON orders FOR SELECT USING (
    table_num = current_setting('request.jwt.claims', true)::json->>'table_num' 
    OR current_setting('request.jwt.claims', true)::json->>'table_num' IS NULL
);

-- 允许匿名用户创建订单详情
CREATE POLICY "允许匿名创建订单详情" ON order_details FOR INSERT WITH CHECK (true);

-- 允许匿名用户读取餐桌信息
CREATE POLICY "允许匿名读取餐桌信息" ON tables FOR SELECT USING (true);

-- 10. 插入示例数据
-- 插入餐桌数据
INSERT INTO tables (table_num, table_type, capacity) VALUES 
('A01', 'normal', 4),
('A02', 'normal', 4),
('A03', 'normal', 2),
('B01', 'vip', 6),
('B02', 'vip', 8),
('C01', 'large', 10);

-- 插入菜品示例数据（更丰富的菜品信息）
INSERT INTO dishes (name, description, price, category, stock, spicy_level, cooking_time, tags, image_url) VALUES 
('宫保鸡丁', '经典川菜，鸡肉鲜嫩，花生香脆，麻辣适中', 48.00, '热菜', 20, 3, 12, '{"推荐","热销"}', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300'),
('北京烤鸭', '皮脆肉嫩，传统工艺，搭配薄饼和甜面酱', 128.00, '热菜', 15, 0, 25, '{"招牌","必点"}', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300'),
('麻婆豆腐', '麻辣鲜香，豆腐嫩滑，超级下饭', 32.00, '热菜', 25, 4, 8, '{"热销","川菜"}', 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=300'),
('清蒸鲈鱼', '鲜嫩清甜，原汁原味，健康美味', 88.00, '热菜', 10, 0, 15, '{"清淡","健康"}', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300'),
('扬州炒饭', '米饭粒粒分明，配料丰富，火候恰到好处', 28.00, '主食', 30, 0, 8, '{"主食","经典"}', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300'),
('小笼包', '皮薄馅大，汤汁丰富，上海特色', 36.00, '主食', 18, 0, 10, '{"点心","推荐"}', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300'),
('炸酱面', '面条劲道，炸酱香浓，老北京风味', 25.00, '主食', 22, 2, 6, '{"面食","传统"}', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300'),
('冰镇可乐', '冰镇可乐，清爽解渴，夏日必备', 8.00, '饮品', 50, 0, 2, '{"饮料","冷饮"}', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300'),
('鲜榨橙汁', '新鲜橙子现榨，富含维C，营养健康', 15.00, '饮品', 25, 0, 3, '{"果汁","健康"}', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300'),
('春卷', '外酥里嫩，香脆可口，传统小吃', 18.00, '小吃', 12, 0, 5, '{"小吃","炸物"}', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300'),
('水果拼盘', '时令水果搭配，新鲜美味，餐后佳品', 35.00, '甜点', 8, 0, 5, '{"水果","健康"}', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300'),
('提拉米苏', '意式经典甜品，咖啡香浓，口感细腻', 42.00, '甜点', 6, 0, 0, '{"西点","推荐"}', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300');

-- 11. 创建高级功能函数
-- 库存检查函数（下单时使用）
CREATE OR REPLACE FUNCTION check_dish_stock(dish_ids UUID[], quantities INTEGER[])
RETURNS TABLE(dish_id UUID, has_stock BOOLEAN, current_stock INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT d.id, d.stock >= quantities[i], d.stock
    FROM unnest(dish_ids, quantities) WITH ORDINALITY AS t(dish_id, quantity, i)
    JOIN dishes d ON d.id = t.dish_id;
END;
$$ language 'plpgsql';

-- 订单状态更新函数（包含时间记录）
CREATE OR REPLACE FUNCTION update_order_status(order_id UUID, new_status INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE orders 
    SET order_status = new_status, 
        updated_at = NOW(),
        completed_time = CASE WHEN new_status = 3 THEN NOW() ELSE completed_time END
    WHERE id = order_id;
    
    RETURN FOUND;
END;
$$ language 'plpgsql';

-- 餐桌状态更新函数
CREATE OR REPLACE FUNCTION update_table_status(table_num TEXT, new_status INTEGER, order_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE tables 
    SET status = new_status, 
        current_order_id = order_id,
        updated_at = NOW()
    WHERE table_num = table_num;
    
    RETURN FOUND;
END;
$$ language 'plpgsql';

-- 菜品分类统计函数
CREATE OR REPLACE FUNCTION get_dishes_by_category_stats()
RETURNS TABLE(category TEXT, dish_count BIGINT, avg_price DECIMAL) AS $$
BEGIN
    RETURN QUERY
    SELECT category, COUNT(*), AVG(price)
    FROM dishes 
    WHERE status = 1 
    GROUP BY category
    ORDER BY COUNT(*) DESC;
END;
$$ language 'plpgsql';

-- 完成提示
SELECT '用户端自助点餐系统数据库表创建完成！包含完整的安全策略和示例数据。' as message;