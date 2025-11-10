// 主入口文件
console.log('美食餐厅系统已加载');

// 模拟一些交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏活跃状态
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href').includes(currentPage.replace('.html', '')) || 
            (currentPage === '/' && link.getAttribute('href') === '#home')) {
            link.style.backgroundColor = 'rgba(255,255,255,0.3)';
        }
    });

    // 简单的表单验证示例
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff6b6b';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('请填写所有必填字段');
            }
        });
    });

    // 页面加载动画
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.5s ease-in';
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 100);
    }
});

// 工具函数
window.Utils = {
    // 格式化价格
    formatPrice: function(price) {
        return '¥' + parseFloat(price).toFixed(2);
    },
    
    // 验证手机号
    validatePhone: function(phone) {
        return /^1[3-9]\d{9}$/.test(phone);
    },
    
    // 显示提示信息
    showMessage: function(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            z-index: 1000;
            transition: all 0.3s;
            background: ${type === 'error' ? '#ff6b6b' : type === 'success' ? '#51cf66' : '#339af0'};
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
};