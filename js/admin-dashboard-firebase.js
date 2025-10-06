// Admin Dashboard - Old System
// لوحة التحكم الإدارية - النظام القديم

// النظام القديم البسيط
const useFirebase = false;

if (useFirebase) {
  // التحقق من Firebase authentication
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = 'index.html';
      return;
    }
    
    // التحقق من صلاحيات المسؤول
    const isAdmin = await authManager.checkAdminPermission();
    if (!isAdmin) {
      alert('ليس لديك صلاحيات للوصول لهذه الصفحة');
      await authManager.logout();
      window.location.href = 'index.html';
    }
  });
} else {
  // Fallback للنظام القديم
  if (!sessionStorage.getItem('adminAuthenticated')) {
    window.location.href = 'index.html';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const logoutBtn = document.getElementById('admin-logout');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const menuForm = document.getElementById('menu-form');
  const imageUpload = document.getElementById('menu-image-upload');
  const imagePreview = document.getElementById('image-preview');
  let uploadedImageBase64 = '';
  
  // تهيئة القائمة للنظام القديم
  if (!useFirebase) {
    initializeMenuItems();
    if (!localStorage.getItem('reservations')) {
      localStorage.setItem('reservations', JSON.stringify([]));
    }
    if (!localStorage.getItem('orders')) {
      localStorage.setItem('orders', JSON.stringify([]));
    }
  }

  // تسجيل الخروج
  logoutBtn.addEventListener('click', async () => {
    if (useFirebase) {
      await authManager.logout();
    } else {
      sessionStorage.removeItem('adminAuthenticated');
    }
    window.location.href = 'index.html';
  });

  // التبويبات
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      const tabName = btn.getAttribute('data-tab');
      document.getElementById(`${tabName}-tab`).classList.add('active');
      
      if (tabName === 'menu') {
        loadMenuItems();
      } else if (tabName === 'reservations') {
        loadReservations();
      } else if (tabName === 'orders') {
        loadOrders();
      } else if (tabName === 'logs') {
        loadActivityLogs();
      }
    });
  });

  // رفع الصور
  if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('الصورة كبيرة جداً! الحد الأقصى 5 ميجابايت');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
          uploadedImageBase64 = event.target.result;
          if (imagePreview) {
            imagePreview.innerHTML = `<img src="${uploadedImageBase64}" alt="Preview">`;
            imagePreview.classList.add('show');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // إضافة/تعديل عنصر القائمة
  if (menuForm) {
    menuForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const idField = document.getElementById('menu-item-id');
      const nameField = document.getElementById('menu-name');
      const descField = document.getElementById('menu-description');
      const priceField = document.getElementById('menu-price');
      const catField = document.getElementById('menu-category');
      
      if (!nameField || !descField || !priceField || !catField) {
        return;
      }
      
      if (!nameField.value || !descField.value || !priceField.value || !catField.value) {
        alert('الرجاء ملء جميع الحقول');
        return;
      }
      
      const id = idField ? idField.value : '';
      const item = {
        name: nameField.value,
        description: descField.value,
        price: parseFloat(priceField.value),
        category: catField.value,
        image: uploadedImageBase64 || 'images/dish1.jpg'
      };

      let result;
      if (useFirebase) {
        // استخدام Firebase
        if (id) {
          result = await dataManager.updateMenuItem(id, item);
        } else {
          result = await dataManager.addMenuItem(item);
        }
      } else {
        // النظام القديم
        const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        
        if (id) {
          const index = menuItems.findIndex(item => item.id === parseInt(id));
          if (index !== -1) {
            menuItems[index] = { id: parseInt(id), ...item };
          }
        } else {
          item.id = Date.now();
          menuItems.push(item);
        }
        
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        result = { success: true };
      }

      if (result.success) {
        document.getElementById('menu-success').style.display = 'block';
        setTimeout(() => {
          document.getElementById('menu-success').style.display = 'none';
        }, 3000);
        
        menuForm.reset();
        document.getElementById('menu-item-id').value = '';
        uploadedImageBase64 = '';
        if (imagePreview) {
          imagePreview.innerHTML = '';
          imagePreview.classList.remove('show');
        }
        loadMenuItems();
        updateStats();
      } else {
        alert('خطأ: ' + (result.error || 'فشل حفظ العنصر'));
      }
    });
  }

  // تحميل عناصر القائمة
  async function loadMenuItems() {
    const tbody = document.getElementById('menu-items-list');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">جاري التحميل...</td></tr>';
    
    let menuItems;
    if (useFirebase) {
      menuItems = await dataManager.getMenuItems();
    } else {
      menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    }
    
    tbody.innerHTML = '';
    
    if (menuItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">لا توجد عناصر في القائمة. أضف أول عنصر!</td></tr>';
      return;
    }
    
    menuItems.forEach(item => {
      const row = document.createElement('tr');
      const imgSrc = item.image && item.image.startsWith('data:') ? item.image : item.image;
      const itemId = item.id;
      row.innerHTML = `
        <td><img src="${imgSrc}" alt="${item.name}" class="menu-item-thumb"></td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>$${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</td>
        <td>
          <button class="action-btn btn-edit" onclick="editMenuItem('${itemId}')">تعديل</button>
          <button class="action-btn btn-delete" onclick="deleteMenuItem('${itemId}')">حذف</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  window.editMenuItem = async function(id) {
    let menuItems;
    if (useFirebase) {
      menuItems = await dataManager.getMenuItems();
    } else {
      menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    }
    
    const item = menuItems.find(item => item.id == id);
    
    if (item) {
      document.getElementById('menu-item-id').value = item.id;
      document.getElementById('menu-name').value = item.name;
      document.getElementById('menu-description').value = item.description;
      document.getElementById('menu-price').value = typeof item.price === 'number' ? item.price : parseFloat(item.price);
      document.getElementById('menu-category').value = item.category;
      
      if (item.image && item.image.startsWith('data:')) {
        uploadedImageBase64 = item.image;
        imagePreview.innerHTML = `<img src="${item.image}" alt="Preview">`;
        imagePreview.classList.add('show');
      } else {
        uploadedImageBase64 = '';
        imagePreview.innerHTML = '';
        imagePreview.classList.remove('show');
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  window.deleteMenuItem = async function(id) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    
    let result;
    if (useFirebase) {
      result = await dataManager.deleteMenuItem(id);
    } else {
      let menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
      menuItems = menuItems.filter(item => item.id != id);
      localStorage.setItem('menuItems', JSON.stringify(menuItems));
      result = { success: true };
    }
    
    if (result.success) {
      loadMenuItems();
      updateStats();
    } else {
      alert('خطأ في الحذف: ' + (result.error || ''));
    }
  };

  // تحميل الحجوزات
  async function loadReservations() {
    const tbody = document.getElementById('reservations-list');
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">جاري التحميل...</td></tr>';
    
    let reservations;
    if (useFirebase) {
      reservations = await dataManager.getReservations();
    } else {
      reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    }
    
    tbody.innerHTML = '';
    
    if (reservations.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">لا توجد حجوزات.</td></tr>';
      return;
    }
    
    reservations.forEach((res, index) => {
      const row = document.createElement('tr');
      const status = res.status || 'pending';
      const statusText = status === 'pending' ? 'قيد الانتظار' : status === 'confirmed' ? 'مؤكد' : 'ملغى';
      const statusColor = status === 'pending' ? '#ff9800' : status === 'confirmed' ? '#4caf50' : '#f44336';
      
      row.innerHTML = `
        <td>${res.date}</td>
        <td>${res.time}</td>
        <td>${res.name}</td>
        <td>${res.phone}</td>
        <td>${res.guests}</td>
        <td><span style="color: ${statusColor};">${statusText}</span></td>
        <td>
          ${useFirebase && status === 'pending' ? `
            <button class="action-btn" onclick="updateReservationStatus('${res.id}', 'confirmed')" style="background: #4caf50;">تأكيد</button>
          ` : ''}
          <button class="action-btn btn-delete" onclick="deleteReservation('${useFirebase ? res.id : index}')">حذف</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  window.updateReservationStatus = async function(id, status) {
    if (useFirebase) {
      const result = await dataManager.updateReservationStatus(id, status);
      if (result.success) {
        loadReservations();
        updateStats();
      }
    }
  };

  window.deleteReservation = async function(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز؟')) return;
    
    let result;
    if (useFirebase) {
      result = await dataManager.deleteReservation(id);
    } else {
      let reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      reservations.splice(parseInt(id), 1);
      localStorage.setItem('reservations', JSON.stringify(reservations));
      result = { success: true };
    }
    
    if (result.success) {
      loadReservations();
      updateStats();
    }
  };

  window.cancelOrder = async function(id) {
    if (!confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) return;
    
    let result;
    if (useFirebase) {
      result = await dataManager.updateOrderStatus(id, 'cancelled');
    } else {
      let orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const index = parseInt(id);
      if (orders[index]) {
        orders[index].status = 'cancelled';
        localStorage.setItem('orders', JSON.stringify(orders));
        result = { success: true };
      }
    }
    
    if (result.success) {
      loadOrders();
      updateStats();
    }
  };

  // تحميل الطلبات
  async function loadOrders() {
    const tbody = document.getElementById('orders-list');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">جاري التحميل...</td></tr>';
    
    let orders;
    if (useFirebase) {
      orders = await dataManager.getOrders();
    } else {
      orders = JSON.parse(localStorage.getItem('orders') || '[]');
    }
    
    tbody.innerHTML = '';
    
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">لا توجد طلبات.</td></tr>';
      return;
    }
    
    orders.forEach((order, index) => {
      const row = document.createElement('tr');
      const status = order.status || 'confirmed';
      const statusText = status === 'confirmed' ? 'مؤكد' : status === 'completed' ? 'مكتمل' : 'ملغى';
      const statusColor = status === 'confirmed' ? '#4caf50' : status === 'completed' ? '#2196f3' : '#f44336';
      const orderDate = order.date || (order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : 'غير محدد');
      
      row.innerHTML = `
        <td>#${order.id || 'N/A'}</td>
        <td>${orderDate}</td>
        <td>${order.customer || 'غير محدد'}</td>
        <td>${order.items || 'N/A'}</td>
        <td>$${(order.total || 0).toFixed(2)}</td>
        <td><span style="color: ${statusColor};">${statusText}</span></td>
        <td>
          ${status === 'confirmed' ? `
            <button class="action-btn btn-delete" onclick="cancelOrder('${useFirebase ? order.id : index}')">إلغاء</button>
          ` : ''}
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // تحميل سجل النشاطات
  async function loadActivityLogs() {
    if (!useFirebase) return;
    
    const tbody = document.getElementById('activity-logs-list');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">جاري التحميل...</td></tr>';
    
    const logs = await dataManager.getActivityLogs(100);
    tbody.innerHTML = '';
    
    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">لا توجد سجلات.</td></tr>';
      return;
    }
    
    logs.forEach(log => {
      const row = document.createElement('tr');
      const timestamp = log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString('ar-SA') : 'غير محدد';
      const actionText = getActionText(log.action);
      
      row.innerHTML = `
        <td>${timestamp}</td>
        <td>${log.userEmail || 'غير معروف'}</td>
        <td>${actionText}</td>
        <td>${log.ip || 'N/A'}</td>
      `;
      tbody.appendChild(row);
    });
  }

  function getActionText(action) {
    const actions = {
      'login': '🔓 تسجيل دخول',
      'logout': '🔒 تسجيل خروج',
      'admin_login': '🔐 تسجيل دخول مسؤول',
      'menu_item_added': '➕ إضافة عنصر للقائمة',
      'menu_item_updated': '✏️ تعديل عنصر القائمة',
      'menu_item_deleted': '🗑️ حذف عنصر من القائمة',
      'reservation_status_updated': '📅 تحديث حالة حجز',
      'reservation_deleted': '🗑️ حذف حجز',
      'order_status_updated': '📦 تحديث حالة طلب'
    };
    return actions[action] || action;
  }

  // تحديث الإحصائيات
  async function updateStats() {
    if (useFirebase) {
      const stats = await dataManager.getStats();
      document.getElementById('total-menu-items').textContent = stats.totalMenuItems;
      document.getElementById('total-reservations').textContent = stats.totalReservations;
      document.getElementById('total-orders').textContent = stats.totalOrders;
      document.getElementById('total-revenue').textContent = `$${stats.todayRevenue.toFixed(2)}`;
    } else {
      const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
      const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      document.getElementById('total-menu-items').textContent = menuItems.length;
      document.getElementById('total-reservations').textContent = reservations.length;
      document.getElementById('total-orders').textContent = orders.length;
      
      const todayRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.date);
          const today = new Date();
          const status = order.status || 'confirmed';
          return orderDate.toDateString() === today.toDateString() && status !== 'cancelled';
        })
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      document.getElementById('total-revenue').textContent = `$${todayRevenue.toFixed(2)}`;
    }
  }

  // تحميل البيانات الأولية
  loadMenuItems();
  loadReservations();
  loadOrders();
  updateStats();
  
  if (useFirebase) {
    loadActivityLogs();
  }
});
