// 快点点餐厅自助点餐系统 - Supabase配置和服务类
class KuaidiandianService {
    constructor() {
        // Supabase客户端配置
        this.supabaseUrl = 'https://cghbobwnejjtzrduwety.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnaGJvYnduZWpqdHpyZHV3ZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTc1NzMsImV4cCI6MjA3ODA3MzU3M30.M8FyiW9mF1xaZoem75r6vBmVmtVMTnkLwfX1UPOw05Q';
        
        // 初始化Supabase客户端
        this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
        
        // 当前用户信息
        this.currentUser = null;
        
        // 购物车数据
        this.cart = this.loadCartFromStorage();
    }
    
    // 用户认证相关方法
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            this.currentUser = data.user;
            await this.createUserProfileIfNotExists(data.user.id);
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('登录失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    async signUp(email, password, username = '', phone = '') {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                        phone: phone
                    }
                }
            });
            
            if (error) throw error;
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('注册失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            
            this.currentUser = null;
            this.clearCart();
            
            return { success: true };
        } catch (error) {
            console.error('退出登录失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getCurrentUser() {
        try {
            const { data: { user } } = await this.supabase.auth.getUser();
            this.currentUser = user;
            return user;
        } catch (error) {
            console.error('获取当前用户失败:', error);
            return null;
        }
    }
    
    async createUserProfileIfNotExists(userId) {
        try {
            const { data: existingProfile } = await this.supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single();
            
            if (!existingProfile) {
                const { error } = await this.supabase
                    .from('profiles')
                    .insert([{ id: userId }]);
                
                if (error) throw error;
            }
        } catch (error) {
            console.error('创建用户资料失败:', error);
        }
    }
    
    // 菜单相关方法
    async getCategories() {
        try {
            const { data, error } = await this.supabase
                .from('categories')
                .select('*')
                .order('sort', { ascending: true });
            
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('获取分类失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getDishesByCategory(categoryId = null) {
        try {
            let query = this.supabase
                .from('dishes')
                .select('*')
                .eq('status', true);
            
            if (categoryId) {
                query = query.eq('category_id', categoryId);
            }
            
            const { data, error } = await query.order('created_at', { ascending: false });
            
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('获取菜品失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getDishById(dishId) {
        try {
            const { data, error } = await this.supabase
                .from('dishes')
                .select('*')
                .eq('id', dishId)
                .single();
            
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('获取菜品详情失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 购物车相关方法
    loadCartFromStorage() {
        try {
            const cartData = localStorage.getItem('kuaidiandian_cart');
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('加载购物车失败:', error);
            return [];
        }
    }
    
    saveCartToStorage() {
        try {
            localStorage.setItem('kuaidiandian_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('保存购物车失败:', error);
        }
    }
    
    addToCart(dish, quantity = 1) {
        try {
            const existingItemIndex = this.cart.findIndex(item => item.dish_id === dish.id);
            
            if (existingItemIndex > -1) {
                this.cart[existingItemIndex].quantity += quantity;
            } else {
                this.cart.push({
                    dish_id: dish.id,
                    name: dish.name,
                    price: dish.price,
                    image_url: dish.image_url,
                    quantity: quantity,
                    unit_price: dish.price
                });
            }
            
            this.saveCartToStorage();
            return { success: true, cart: this.cart };
        } catch (error) {
            console.error('添加到购物车失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    updateCartItem(dishId, quantity) {
        try {
            const itemIndex = this.cart.findIndex(item => item.dish_id === dishId);
            
            if (itemIndex > -1) {
                if (quantity <= 0) {
                    this.cart.splice(itemIndex, 1);
                } else {
                    this.cart[itemIndex].quantity = quantity;
                }
                
                this.saveCartToStorage();
            }
            
            return { success: true, cart: this.cart };
        } catch (error) {
            console.error('更新购物车失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    removeFromCart(dishId) {
        try {
            this.cart = this.cart.filter(item => item.dish_id !== dishId);
            this.saveCartToStorage();
            return { success: true, cart: this.cart };
        } catch (error) {
            console.error('从购物车删除失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    clearCart() {
        try {
            this.cart = [];
            localStorage.removeItem('kuaidiandian_cart');
            return { success: true };
        } catch (error) {
            console.error('清空购物车失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }
    
    // 订单相关方法
    async createOrder(orderData) {
        try {
            // 生成订单号
            const orderNo = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5);
            
            // 计算总金额
            const totalAmount = this.getCartTotal();
            
            // 创建订单主记录
            const { data: order, error: orderError } = await this.supabase
                .from('orders')
                .insert([{
                    user_id: this.currentUser?.id || null,
                    order_no: orderNo,
                    type: orderData.type,
                    table_no: orderData.tableNo || null,
                    address: orderData.address || null,
                    total_amount: totalAmount,
                    status: 'pending'
                }])
                .select()
                .single();
            
            if (orderError) throw orderError;
            
            // 创建订单项
            const orderItems = this.cart.map(item => ({
                order_id: order.id,
                dish_id: item.dish_id,
                quantity: item.quantity,
                unit_price: item.price
            }));
            
            const { error: itemsError } = await this.supabase
                .from('order_items')
                .insert(orderItems);
            
            if (itemsError) throw itemsError;
            
            // 清空购物车
            this.clearCart();
            
            return { success: true, order: order };
        } catch (error) {
            console.error('创建订单失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getOrderByNo(orderNo) {
        try {
            const { data, error } = await this.supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        dishes (*)
                    )
                `)
                .eq('order_no', orderNo)
                .single();
            
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('获取订单失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    async updateOrderStatus(orderId, status) {
        try {
            const { data, error } = await this.supabase
                .from('orders')
                .update({ status: status })
                .eq('id', orderId)
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('更新订单状态失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 支付相关方法（模拟支付）
    async processPayment(orderId) {
        try {
            // 模拟支付处理
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 更新订单状态为已支付
            const result = await this.updateOrderStatus(orderId, 'paid');
            
            if (result.success) {
                return { success: true, message: '支付成功' };
            } else {
                throw new Error('支付状态更新失败');
            }
        } catch (error) {
            console.error('支付处理失败:', error);
            return { success: false, error: error.message };
        }
    }
}

// 创建全局服务实例
window.kuaidiandianService = new KuaidiandianService();

// 页面加载完成后初始化用户状态
document.addEventListener('DOMContentLoaded', async function() {
    await window.kuaidiandianService.getCurrentUser();
    updateAuthUI();
});

// 更新认证状态UI
function updateAuthUI() {
    const user = window.kuaidiandianService.currentUser;
    const authElements = document.querySelectorAll('[data-auth]');
    
    authElements.forEach(element => {
        const authState = element.getAttribute('data-auth');
        if (authState === 'authenticated') {
            element.style.display = user ? 'block' : 'none';
        } else if (authState === 'unauthenticated') {
            element.style.display = user ? 'none' : 'block';
        }
    });
    
    // 更新购物车数量
    updateCartCount();
}

// 更新购物车数量显示
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const count = window.kuaidiandianService.getCartItemCount();
    
    cartCountElements.forEach(element => {
        element.textContent = count;
        element.style.display = count > 0 ? 'inline' : 'none';
    });
}

// 通用错误处理函数
function showError(message) {
    alert('错误: ' + message);
}

function showSuccess(message) {
    alert('成功: ' + message);
}