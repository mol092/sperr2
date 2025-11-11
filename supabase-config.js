// Supabase 配置 - 用户端自助点餐系统
const SUPABASE_URL = 'https://mjmmvxcezdxiohmzngai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbW12eGNlemR4aW9obXpuZ2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTc2ODksImV4cCI6MjA3ODA3MzY4OX0.CbZPxyXA5UYFv2EMyfunDHEJir318zvqMLv0_XIlCC4';

// 初始化 Supabase 客户端
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 用户会话管理
class SessionService {
    // 设置桌号
    static setTableNumber(tableNum) {
        localStorage.setItem('current_table', tableNum);
        sessionStorage.setItem('table_session', tableNum);
    }

    // 获取当前桌号
    static getCurrentTable() {
        return localStorage.getItem('current_table') || sessionStorage.getItem('table_session');
    }

    // 清除会话
    static clearSession() {
        localStorage.removeItem('current_table');
        sessionStorage.removeItem('table_session');
        sessionStorage.removeItem('shopping_cart');
    }
}

// 菜品相关操作
class DishService {
    // 获取所有在售菜品
    static async getAllDishes() {
        const { data, error } = await supabaseClient
            .from('dishes')
            .select('*')
            .eq('status', 1) // 在售状态
            .order('category', { ascending: true })
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('获取菜品列表错误:', error);
            return [];
        }
        return data;
    }

    // 根据分类获取菜品
    static async getDishesByCategory(category) {
        const { data, error } = await supabaseClient
            .from('dishes')
            .select('*')
            .eq('category', category)
            .eq('status', 1)
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('获取分类菜品错误:', error);
            return [];
        }
        return data;
    }

    // 搜索菜品
    static async searchDishes(keyword) {
        const { data, error } = await supabaseClient
            .from('dishes')
            .select('*')
            .ilike('name', `%${keyword}%`)
            .eq('status', 1)
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('搜索菜品错误:', error);
            return [];
        }
        return data;
    }

    // 检查菜品库存
    static async checkStock(dishId, quantity) {
        const { data, error } = await supabaseClient
            .from('dishes')
            .select('stock')
            .eq('id', dishId)
            .single();
            
        if (error) {
            console.error('检查库存错误:', error);
            return false;
        }
        return data.stock >= quantity;
    }
}

// 购物车管理
class CartService {
    // 获取购物车
    static getCart() {
        const cartStr = sessionStorage.getItem('shopping_cart');
        return cartStr ? JSON.parse(cartStr) : [];
    }

    // 保存购物车
    static saveCart(cartItems) {
        sessionStorage.setItem('shopping_cart', JSON.stringify(cartItems));
    }

    // 添加菜品到购物车
    static addToCart(dish, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === dish.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.subtotal = existingItem.quantity * existingItem.price;
        } else {
            cart.push({
                id: dish.id,
                name: dish.name,
                price: dish.price,
                image_url: dish.image_url,
                quantity: quantity,
                subtotal: dish.price * quantity,
                maxStock: dish.stock
            });
        }
        
        this.saveCart(cart);
        return cart;
    }

    // 更新购物车数量
    static updateQuantity(dishId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === dishId);
        
        if (item && quantity > 0 && quantity <= item.maxStock) {
            item.quantity = quantity;
            item.subtotal = item.price * quantity;
            this.saveCart(cart);
        }
        
        return cart;
    }

    // 移除购物车菜品
    static removeFromCart(dishId) {
        const cart = this.getCart().filter(item => item.id !== dishId);
        this.saveCart(cart);
        return cart;
    }

    // 清空购物车
    static clearCart() {
        sessionStorage.removeItem('shopping_cart');
        return [];
    }

    // 计算购物车总金额
    static getTotalAmount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.subtotal, 0);
    }

    // 获取购物车总数
    static getTotalCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// 订单相关操作
class OrderService {
    // 创建新订单（包含库存校验）
    static async createOrder(orderData) {
        const { tableNum, remark, cartItems } = orderData;
        
        // 检查库存
        for (const item of cartItems) {
            const hasStock = await DishService.checkStock(item.id, item.quantity);
            if (!hasStock) {
                throw new Error(`菜品 ${item.name} 库存不足，当前库存为 ${item.maxStock}`);
            }
        }
        
        // 创建订单
        const { data: orderData, error: orderError } = await supabaseClient
            .from('orders')
            .insert([{
                table_num: tableNum,
                total_amount: orderData.totalAmount,
                pay_status: 0, // 未支付
                order_status: 0, // 新订单
                remark: remark
            }])
            .select();
            
        if (orderError) {
            console.error('创建订单错误:', orderError);
            throw new Error('创建订单失败');
        }
        
        const orderId = orderData[0].id;
        
        // 创建订单详情
        const orderDetails = cartItems.map(item => ({
            order_id: orderId,
            dish_id: item.id,
            dish_name: item.name,
            unit_price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal
        }));
        
        const { error: detailsError } = await supabaseClient
            .from('order_details')
            .insert(orderDetails);
            
        if (detailsError) {
            console.error('创建订单详情错误:', detailsError);
            throw new Error('创建订单详情失败');
        }
        
        // 扣减库存
        for (const item of cartItems) {
            const { error: stockError } = await supabaseClient
                .from('dishes')
                .update({ stock: supabaseClient.sql`stock - ${item.quantity}` })
                .eq('id', item.id);
                
            if (stockError) {
                console.error('扣减库存错误:', stockError);
                // 可以记录错误但不影响订单创建
            }
        }
        
        return orderData[0];
    }

    // 根据桌号获取订单
    static async getOrdersByTable(tableNum) {
        const { data, error } = await supabaseClient
            .from('orders')
            .select(`
                *,
                order_details (*)
            `)
            .eq('table_num', tableNum)
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('获取订单列表错误:', error);
            return [];
        }
        return data;
    }

    // 获取订单详情
    static async getOrderDetails(orderId) {
        const { data, error } = await supabaseClient
            .from('orders')
            .select(`
                *,
                order_details (*)
            `)
            .eq('id', orderId)
            .single();
            
        if (error) {
            console.error('获取订单详情错误:', error);
            return null;
        }
        return data;
    }

    // 模拟支付（实际项目中应接入真实支付接口）
    static async processPayment(orderId) {
        const { data, error } = await supabaseClient
            .from('orders')
            .update({
                pay_status: 1,
                order_status: 1, // 已接单
                pay_time: new Date().toISOString()
            })
            .eq('id', orderId)
            .select();
            
        if (error) {
            console.error('支付处理错误:', error);
            return null;
        }
        return data[0];
    }

    // 取消订单（恢复库存）
    static async cancelOrder(orderId) {
        // 获取订单详情
        const orderDetails = await supabaseClient
            .from('order_details')
            .select('*')
            .eq('order_id', orderId);
            
        if (orderDetails.error) {
            console.error('获取订单详情错误:', orderDetails.error);
            return false;
        }
        
        // 恢复库存
        for (const item of orderDetails.data) {
            await supabaseClient
                .from('dishes')
                .update({ stock: supabaseClient.sql`stock + ${item.quantity}` })
                .eq('id', item.dish_id);
        }
        
        // 更新订单状态
        const { error } = await supabaseClient
            .from('orders')
            .update({ order_status: 3 }) // 已取消
            .eq('id', orderId);
            
        if (error) {
            console.error('取消订单错误:', error);
            return false;
        }
        
        return true;
    }
}

// 导出服务
window.SessionService = SessionService;
window.DishService = DishService;
window.CartService = CartService;
window.OrderService = OrderService;
window.supabaseClient = supabaseClient;