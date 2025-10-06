// نظام السلة الجديد
let cart = [];

// تحميل السلة من localStorage
function loadCart() {
  const saved = localStorage.getItem('nova_cart');
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch(e) {
      cart = [];
    }
  }
  updateCartBadge();
}

// حفظ السلة في localStorage
function saveCart() {
  localStorage.setItem('nova_cart', JSON.stringify(cart));
  updateCartBadge();
}

// إضافة عنصر للسلة
function addToCart(itemId) {
  // البحث عن العنصر في menu_data
  const menuItem = MENU_ITEMS.find(x => x.id == itemId);
  if (!menuItem) {
    return;
  }

  // التحقق من وجود العنصر في السلة
  const existingItem = cart.find(x => x.id == itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    // استخراج السعر من النص (مثل "$12" -> 12)
    const priceNum = parseFloat(menuItem.price.replace('$', ''));

    cart.push({
      id: menuItem.id,
      name_en: menuItem.name_en,
      name_ar: menuItem.name_ar,
      price: priceNum,
      quantity: 1
    });
  }

  saveCart();
  showAddedFeedback();
}

// حذف عنصر من السلة
function removeFromCart(itemId) {
  cart = cart.filter(x => x.id != itemId);
  saveCart();
  renderCart();
}

// تحديث الكمية
function updateQuantity(itemId, change) {
  const item = cart.find(x => x.id == itemId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(itemId);
  } else {
    saveCart();
    renderCart();
  }
}

// حساب الإجمالي
function calculateTotal() {
  return cart.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);
}

// تحديث شارة عدد العناصر
function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// فتح نافذة السلة
function openCart() {
  console.log('openCart function called');
  renderCart();
  const modal = document.getElementById('cart-modal');
  if (modal) {
    console.log('Modal found, opening...');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
  } else {
    console.error('Cart modal not found!');
  }
}

// إغلاق نافذة السلة
function closeCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
  }
}

// عرض محتويات السلة
function renderCart() {
  const container = document.getElementById('cart-items');
  const emptyMsg = document.getElementById('cart-empty');
  const summary = document.getElementById('cart-summary');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '';
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (summary) summary.style.display = 'none';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';
  if (summary) summary.style.display = 'block';

  const lang = document.documentElement.getAttribute('data-lang') || 'en';

  container.innerHTML = cart.map(item => {
    const name = lang === 'ar' ? item.name_ar : item.name_en;
    // التأكد من أن السعر رقم
    const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
    const subtotal = (itemPrice * item.quantity).toFixed(2);
    const removeText = lang === 'ar' ? 'حذف' : 'Remove';

    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${name}</h4>
          <p class="cart-item-price">$${itemPrice.toFixed(2)} × ${item.quantity} = $${subtotal}</p>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">${removeText}</button>
        </div>
      </div>
    `;
  }).join('');

  const totalPrice = calculateTotal().toFixed(2);
  const totalElement = document.getElementById('cart-total-price');
  if (totalElement) {
    totalElement.textContent = '$' + totalPrice;
  }
}

// رسالة تأكيد الإضافة
function showAddedFeedback() {
  const existingFeedback = document.querySelector('.cart-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }

  const feedback = document.createElement('div');
  feedback.className = 'cart-feedback';

  const lang = document.documentElement.getAttribute('data-lang') || 'en';
  feedback.textContent = lang === 'ar' ? 'تمت الإضافة للسلة!' : 'Added to cart!';

  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.classList.add('show');
  }, 10);

  setTimeout(() => {
    feedback.classList.remove('show');
    setTimeout(() => feedback.remove(), 300);
  }, 2000);
}

// إتمام الطلب
function checkout() {
  if (cart.length === 0) return;

  const lang = document.documentElement.getAttribute('data-lang') || 'en';
  const successMsg = lang === 'ar' 
    ? 'تم تقديم الطلب بنجاح! سنتواصل معك قريباً.' 
    : 'Order placed successfully! We\'ll contact you soon.';

  const order = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    customer: 'Customer',
    items: cart.map(item => (lang === 'ar' ? item.name_ar : item.name_en)).join(', '),
    total: calculateTotal(),
    status: 'confirmed'
  };

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // عرض رسالة تأكيد أنيقة
  showCheckoutSuccess(successMsg);

  cart = [];
  saveCart();
  renderCart();
  
  // إغلاق السلة بعد ثانيتين
  setTimeout(() => {
    closeCart();
  }, 2000);
}

// رسالة تأكيد الطلب
function showCheckoutSuccess(message) {
  const existingMsg = document.querySelector('.checkout-success');
  if (existingMsg) {
    existingMsg.remove();
  }

  const successDiv = document.createElement('div');
  successDiv.className = 'checkout-success';
  successDiv.innerHTML = `
    <div class="success-icon">✓</div>
    <p>${message}</p>
  `;

  const modal = document.getElementById('cart-modal');
  const modalInner = modal.querySelector('.modal-inner');
  modalInner.appendChild(successDiv);

  setTimeout(() => {
    successDiv.classList.add('show');
  }, 10);
}

// تهيئة السلة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  loadCart();

  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const closeCartBtn = document.getElementById('close-cart');
  const checkoutBtn = document.getElementById('cart-checkout');

  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Cart button clicked');
      openCart();
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCart();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      checkout();
    });
  }

  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        closeCart();
      }
    });
  }
});

// إضافة مستمع عالمي كخطة احتياطية
window.addEventListener('load', () => {
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn && !cartBtn.hasAttribute('data-listener-added')) {
    cartBtn.setAttribute('data-listener-added', 'true');
    cartBtn.onclick = function() {
      console.log('Cart button onclick triggered');
      openCart();
    };
  }
  
  // إضافة مستمع لزر الإغلاق كخطة احتياطية
  const closeBtn = document.getElementById('close-cart');
  if (closeBtn && !closeBtn.hasAttribute('data-listener-added')) {
    closeBtn.setAttribute('data-listener-added', 'true');
    closeBtn.onclick = function() {
      console.log('Close button clicked');
      closeCart();
    };
  }
});

// جعل closeCart متاحة عالمياً
window.closeCart = closeCart;