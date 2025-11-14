// 快点点餐厅自助点餐系统 - 纯前端模拟数据服务类
class KuaidiandianService {
    constructor() {
        // 模拟数据 - 菜品分类
        this.categories = [
            { id: 1, name: '热菜', sort: 1 },
            { id: 2, name: '凉菜', sort: 2 },
            { id: 3, name: '汤品', sort: 3 },
            { id: 4, name: '主食', sort: 4 },
            { id: 5, name: '饮品', sort: 5 }
        ];
        
        // 模拟数据 - 菜品列表
        this.dishes = [
            // 热菜
            { id: '1', name: '宫保鸡丁', category_id: 1, price: 38.00, description: '香辣可口，花生香脆', image_url: 'https://via.placeholder.com/150x150?text=宫保鸡丁' },
            { id: '2', name: '麻婆豆腐', category_id: 1, price: 28.00, description: '麻辣鲜香，豆腐嫩滑', image_url: 'https://via.placeholder.com/150x150?text=麻婆豆腐' },
            { id: '3', name: '红烧肉', category_id: 1, price: 48.00, description: '肥而不腻，入口即化', image_url: 'https://via.placeholder.com/150x150?text=红烧肉' },
            
            // 凉菜
            { id: '4', name: '拍黄瓜', category_id: 2, price: 12.00, description: '清爽开胃', image_url: 'https://via.placeholder.com/150x150?text=拍黄瓜' },
            { id: '5', name: '凉拌海带丝', category_id: 2, price: 15.00, description: '酸甜可口', image_url: 'https://via.placeholder.com/150x150?text=海带丝' },
            
            // 汤品
            { id: '6', name: '西红柿鸡蛋汤', category_id: 3, price: 18.00, description: '家常美味', image_url: 'https://via.placeholder.com/150x150?text=西红柿汤' },
            { id: '7', name: '酸辣汤', category_id: 3, price: 22.00, description: '酸辣开胃', image_url: 'https://via.placeholder.com/150x150?text=酸辣汤' },
            
            // 主食
            { id: '8', name: '扬州炒饭', category_id: 4, price: 25.00, description: '米饭粒粒分明', image_url: 'https://via.placeholder.com/150x150?text=扬州炒饭' },
            { id: '9', name: '牛肉面', category_id: 4, price: 32.00, description: '汤鲜味美', image_url: 'https://via.placeholder.com/150x150?text=牛肉面' },
            
            // 饮品
            { id: '10', name: '可乐', category_id: 5, price: 8.00, description: '冰镇可乐', image_url: 'https://via.placeholder.com/150x150?text=可乐' },
            { id: '11', name: '橙汁', category_id: 5, price: 12.00, description: '鲜榨橙汁', image_url: 'https://via.placeholder.com/150x150?text=橙汁' },
            { id: '12', name: '啤酒', category_id: 5, price: 15.00, description: '青岛啤酒', image_url: 'https://via.placeholder.com/150x150?text=啤酒' }
        ];
        
        // 当前用户信息（匿名用户）
        this.currentUser = { id: 'anonymous-user', email: 'guest@example.com' };
        
        // 购物车数据
        this.cart = this.loadCartFromStorage();
        
        // 订单历史
        this.orderHistory = [];
    }
    
    // 从本地存储加载购物车
    loadCartFromStorage() {
        try {
            const cartData = localStorage.getItem('kuaidiandian_cart');
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('加载购物车失败:', error);
            return [];
        }
    }
    
    // 保存购物车到本地存储
    saveCartToStorage() {
        try {
            localStorage.setItem('kuaidiandian_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('保存购物车失败:', error);
        }
    }
    
    // 获取分类列表
    async getCategories() {
        return {
            success: true,
            data: this.categories
        };
    }
    
    // 获取菜品列表
    async getDishes() {
        return {
            success: true,
            data: this.dishes
        };
    }
    
    // 添加到购物车
    addToCart(dish) {
        const existingItem = this.cart.find(item => item.id === dish.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: dish.id,
                name: dish.name,
                price: dish.price,
                image_url: dish.image_url,
                quantity: 1
            });
        }
        
        this.saveCartToStorage();
        return { success: true };
    }
    
    // 从购物车移除
    removeFromCart(dishId) {
        this.cart = this.cart.filter(item => item.id !== dishId);
        this.saveCartToStorage();
        return { success: true };
    }
    
    // 更新购物车商品数量
    updateCartQuantity(dishId, quantity) {
        const item = this.cart.find(item => item.id === dishId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(dishId);
            } else {
                item.quantity = quantity;
                this.saveCartToStorage();
            }
        }
        return { success: true };
    }
    
    // 获取购物车商品数量
    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    // 获取购物车总价
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // 清空购物车
    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        return { success: true };
    }
    
    // 提交订单（模拟）
    async submitOrder(orderData) {
        // 生成订单号
        const orderNo = 'ORD' + Date.now().toString();
        
        const order = {
            id: orderNo,
            order_no: orderNo,
            type: orderData.type,
            table_no: orderData.tableNo || '',
            address: orderData.address || '',
            total_amount: this.getCartTotal(),
            status: 'pending',
            created_at: new Date().toISOString(),
            items: [...this.cart]
        };
        
        // 保存订单到历史
        this.orderHistory.push(order);
        
        // 清空购物车
        this.clearCart();
        
        return {
            success: true,
            data: order
        };
    }
    
    // 获取订单详情
    async getOrderDetails(orderNo) {
        const order = this.orderHistory.find(order => order.order_no === orderNo);
        
        if (!order) {
            return {
                success: false,
                error: '订单不存在'
            };
        }
        
        return {
            success: true,
            data: order
        };
    }
    
    // 模拟支付
    async simulatePayment(orderNo) {
        const order = this.orderHistory.find(order => order.order_no === orderNo);
        
        if (!order) {
            return {
                success: false,
                error: '订单不存在'
            };
        }
        
        // 更新订单状态
        order.status = 'paid';
        
        return {
            success: true,
            data: order
        };
    }
    
    // 用户登录（模拟）
    async signIn(email, password) {
        // 模拟登录成功
        this.currentUser = {
            id: 'user-' + Date.now(),
            email: email,
            username: email.split('@')[0]
        };
        
        return {
            success: true,
            user: this.currentUser
        };
    }
    
    // 用户注册（模拟）
    async signUp(email, password, username = '', phone = '') {
        this.currentUser = {
            id: 'user-' + Date.now(),
            email: email,
            username: username || email.split('@')[0],
            phone: phone
        };
        
        return {
            success: true,
            user: this.currentUser
        };
    }
    
    // 用户登出（模拟）
    async signOut() {
        this.currentUser = null;
        return { success: true };
    }
}

// 导出服务实例
window.kuaidiandianService = new KuaidiandianService();