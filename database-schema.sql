-- 快点点餐厅自助点餐系统 - 数据库表结构
-- Created by: kuaidiandian Restaurant Self-Ordering System

-- 1. profiles（用户信息表，扩展 Supabase 自带的auth.users）
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 为用户表启用行级安全策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. categories（菜品分类表）
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    sort INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. dishes（菜品表）
CREATE TABLE dishes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    description TEXT,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. orders（订单表）
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    order_no TEXT UNIQUE NOT NULL,
    type TEXT CHECK (type IN ('dine_in', 'takeaway')) NOT NULL,
    table_no TEXT,
    address TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'paid', 'completed', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. order_items（订单项表）
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 为所有表启用行级安全策略
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 创建示例数据
INSERT INTO categories (name, sort) VALUES 
('热菜', 1),
('凉菜', 2),
('主食', 3),
('饮品', 4);

INSERT INTO dishes (name, category_id, price, description, image_url) VALUES
('宫保鸡丁', 1, 38.00, '香辣可口，配花生米', '/images/kungpao_chicken.jpg'),
('麻婆豆腐', 1, 28.00, '麻辣鲜香，下饭首选', '/images/mapo_tofu.jpg'),
('水煮鱼', 1, 58.00, '鲜嫩鱼肉，麻辣鲜香', '/images/boiled_fish.jpg'),
('凉拌黄瓜', 2, 12.00, '清爽可口，开胃小菜', '/images/cucumber_salad.jpg'),
('拍黄瓜', 2, 15.00, '蒜香浓郁，口感爽脆', '/images/smashed_cucumber.jpg'),
('扬州炒饭', 3, 25.00, '虾仁鸡蛋，粒粒分明', '/images/yangzhou_fried_rice.jpg'),
('担担面', 3, 20.00, '麻辣鲜香，面条劲道', '/images/dandan_noodles.jpg'),
('可乐', 4, 8.00, '冰镇可乐，畅爽解渴', '/images/coke.jpg'),
('雪碧', 4, 8.00, '清爽柠檬味', '/images/sprite.jpg'),
('橙汁', 4, 15.00, '鲜榨橙汁，富含维C', '/images/orange_juice.jpg');

-- 创建索引以提高查询性能
CREATE INDEX idx_dishes_category_id ON dishes(category_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_dish_id ON order_items(dish_id);

-- 创建行级安全策略
-- profiles表：用户只能查看和修改自己的信息
CREATE POLICY "用户只能管理自己的个人信息" ON profiles
    FOR ALL USING (auth.uid() = id);

-- categories表：所有人可查看
CREATE POLICY "所有人可查看分类" ON categories
    FOR SELECT USING (true);

-- dishes表：所有人可查看菜品
CREATE POLICY "所有人可查看菜品" ON dishes
    FOR SELECT USING (true);

-- orders表：用户只能查看和管理自己的订单
CREATE POLICY "用户只能管理自己的订单" ON orders
    FOR ALL USING (auth.uid() = user_id);

-- order_items表：通过关联订单实现权限控制
CREATE POLICY "通过订单权限控制订单项" ON order_items
    FOR ALL USING (EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    ));