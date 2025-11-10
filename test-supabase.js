// Supabase 连接测试脚本
// 用于验证 Supabase 配置和连接状态

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

console.log('🚀 Supabase 连接测试开始...\n');

// 检查配置是否已设置
console.log('📋 当前配置检查:');
console.log(`- Supabase URL: ${SUPABASE_URL}`);
console.log(`- Supabase Anon Key: ${SUPABASE_ANON_KEY.substr(0, 20)}...`);

if (SUPABASE_URL === 'https://your-project.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key') {
    console.log('❌ 配置检测: Supabase 配置未更新（仍为默认值）\n');
} else {
    console.log('✅ 配置检测: Supabase 配置已更新\n');
}

console.log('🔧 使用说明:');
console.log('1. 访问 https://supabase.com 并创建新项目');
console.log('2. 在项目设置中获取项目 URL 和匿名密钥');
console.log('3. 更新 supabase-config.js 中的配置信息');
console.log('4. 在 Supabase 控制台中创建数据表（参考 database-design.md）\n');

console.log('📊 推荐的数据表 SQL 语句:');

const sqlStatements = `
-- 创建 restaurants 表
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    phone TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 dishes 表
CREATE TABLE IF NOT EXISTS dishes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category TEXT,
    restaurant_id UUID REFERENCES restaurants(id),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 orders 表
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    items JSONB NOT NULL,
    restaurant_id UUID REFERENCES restaurants(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建示例数据
INSERT INTO restaurants (name, description, address, phone, image_url) VALUES 
('东方美食', '专注于传统中式美食，提供正宗的口味体验', '北京市朝阳区美食街88号', '138-0013-8000', 'https://example.com/restaurant1.jpg'),
('西式餐厅', '提供精致的西式料理，营造浪漫的用餐氛围', '上海市浦东新区商业中心', '138-0013-8001', 'https://example.com/restaurant2.jpg'),
('日料专门店', '新鲜食材，专业制作，体验纯正日式料理', '广州市天河区日料街', '138-0013-8002', 'https://example.com/restaurant3.jpg');

INSERT INTO dishes (name, description, price, category, restaurant_id) VALUES 
('招牌汉堡', '精选牛肉，新鲜蔬菜，特制酱料', 38.00, '主食', (SELECT id FROM restaurants WHERE name = '西式餐厅')),
('意大利披萨', '薄脆饼底，丰富配料，正宗意式风味', 68.00, '主食', (SELECT id FROM restaurants WHERE name = '西式餐厅')),
('烤三文鱼', '新鲜三文鱼，精心烤制，营养丰富', 88.00, '主菜', (SELECT id FROM restaurants WHERE name = '日料专门店')),
('冰淇淋', '多种口味，手工制作，甜蜜享受', 25.00, '甜点', (SELECT id FROM restaurants WHERE name = '西式餐厅'));
`;

console.log(sqlStatements);

console.log('🔍 测试建议:');
console.log('- 配置完成后，可以使用浏览器开发者工具测试 API 调用');
console.log('- 在控制台中调用 RestaurantService.getAllRestaurants() 测试连接');
console.log('- 确保 Supabase 表权限设置为允许匿名访问（用于演示）\n');

console.log('✅ 测试完成！请按照上述步骤配置 Supabase。');