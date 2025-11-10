// Supabase 配置
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// 初始化 Supabase 客户端
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 餐厅相关操作
class RestaurantService {
    // 获取所有餐厅
    static async getAllRestaurants() {
        const { data, error } = await supabaseClient
            .from('restaurants')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('获取餐厅列表错误:', error);
            return [];
        }
        return data;
    }

    // 根据ID获取餐厅
    static async getRestaurantById(id) {
        const { data, error } = await supabaseClient
            .from('restaurants')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error) {
            console.error('获取餐厅详情错误:', error);
            return null;
        }
        return data;
    }
}

// 菜品相关操作
class DishService {
    // 获取餐厅的菜品
    static async getDishesByRestaurant(restaurantId) {
        const { data, error } = await supabaseClient
            .from('dishes')
            .select('*')
            .eq('restaurant_id', restaurantId)
            .eq('available', true)
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('获取菜品列表错误:', error);
            return [];
        }
        return data;
    }

    // 根据分类获取菜品
    static async getDishesByCategory(restaurantId, category) {
        const { data, error } = await supabaseClient
            .from('dishes')
            .select('*')
            .eq('restaurant_id', restaurantId)
            .eq('category', category)
            .eq('available', true)
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('获取分类菜品错误:', error);
            return [];
        }
        return data;
    }
}

// 订单相关操作
class OrderService {
    // 创建新订单
    static async createOrder(orderData) {
        const { data, error } = await supabaseClient
            .from('orders')
            .insert([{
                customer_name: orderData.customerName,
                customer_phone: orderData.customerPhone,
                customer_address: orderData.customerAddress,
                total_amount: orderData.totalAmount,
                status: 'pending',
                items: orderData.items,
                restaurant_id: orderData.restaurantId
            }])
            .select();
            
        if (error) {
            console.error('创建订单错误:', error);
            return null;
        }
        return data[0];
    }

    // 获取订单列表
    static async getOrders(customerPhone) {
        const { data, error } = await supabaseClient
            .from('orders')
            .select('*')
            .eq('customer_phone', customerPhone)
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('获取订单列表错误:', error);
            return [];
        }
        return data;
    }

    // 更新订单状态
    static async updateOrderStatus(orderId, status) {
        const { data, error } = await supabaseClient
            .from('orders')
            .update({ status: status })
            .eq('id', orderId)
            .select();
            
        if (error) {
            console.error('更新订单状态错误:', error);
            return null;
        }
        return data[0];
    }
}

// 导出服务
window.RestaurantService = RestaurantService;
window.DishService = DishService;
window.OrderService = OrderService;
window.supabaseClient = supabaseClient;