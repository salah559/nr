if (!sessionStorage.getItem('adminAuthenticated')) {
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('admin-logout');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const menuForm = document.getElementById('menu-form');
  const imageUpload = document.getElementById('menu-image-upload');
  const imagePreview = document.getElementById('image-preview');
  let uploadedImageBase64 = '';
  
  initializeMenuItems();
  
  if (!localStorage.getItem('reservations')) {
    localStorage.setItem('reservations', JSON.stringify([]));
  }
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
  }

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('adminAuthenticated');
    window.location.href = 'index.html';
  });

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
      }
    });
  });

  if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
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

  if (menuForm) {
    menuForm.addEventListener('submit', (e) => {
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
        alert('Please fill in all fields');
        return;
      }
      
      const id = idField ? idField.value : '';
      const name = nameField.value;
      const description = descField.value;
      const price = parseFloat(priceField.value);
      const category = catField.value;
      const image = uploadedImageBase64 || 'images/dish1.jpg';
      
      const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
      
      if (id) {
        const index = menuItems.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
          menuItems[index] = { id: parseInt(id), name, description, price, category, image };
        }
      } else {
        const newItem = {
          id: Date.now(),
          name,
          description,
          price,
          category,
          image
        };
        menuItems.push(newItem);
      }
      
      localStorage.setItem('menuItems', JSON.stringify(menuItems));
      
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
    });
  }

  function loadMenuItems() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems'));
    const tbody = document.getElementById('menu-items-list');
    tbody.innerHTML = '';
    
    if (menuItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No menu items yet. Add your first item above!</td></tr>';
      return;
    }
    
    menuItems.forEach(item => {
      const row = document.createElement('tr');
      const imgSrc = item.image.startsWith('data:') ? item.image : item.image;
      row.innerHTML = `
        <td><img src="${imgSrc}" alt="${item.name}" class="menu-item-thumb"></td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <button class="action-btn btn-edit" onclick="editMenuItem(${item.id})">Edit</button>
          <button class="action-btn btn-delete" onclick="deleteMenuItem(${item.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  window.editMenuItem = function(id) {
    const menuItems = JSON.parse(localStorage.getItem('menuItems'));
    const item = menuItems.find(item => item.id === id);
    
    if (item) {
      document.getElementById('menu-item-id').value = item.id;
      document.getElementById('menu-name').value = item.name;
      document.getElementById('menu-description').value = item.description;
      document.getElementById('menu-price').value = item.price;
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

  window.deleteMenuItem = function(id) {
    if (confirm('Are you sure you want to delete this menu item?')) {
      let menuItems = JSON.parse(localStorage.getItem('menuItems'));
      menuItems = menuItems.filter(item => item.id !== id);
      localStorage.setItem('menuItems', JSON.stringify(menuItems));
      loadMenuItems();
      updateStats();
    }
  };

  function loadReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations'));
    const tbody = document.getElementById('reservations-list');
    tbody.innerHTML = '';
    
    if (reservations.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No reservations yet.</td></tr>';
      return;
    }
    
    reservations.forEach((res, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${res.date}</td>
        <td>${res.time}</td>
        <td>${res.name}</td>
        <td>${res.phone}</td>
        <td>${res.guests}</td>
        <td>
          <button class="action-btn btn-delete" onclick="deleteReservation(${index})">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  window.deleteReservation = function(index) {
    if (confirm('Are you sure you want to delete this reservation?')) {
      let reservations = JSON.parse(localStorage.getItem('reservations'));
      reservations.splice(index, 1);
      localStorage.setItem('reservations', JSON.stringify(reservations));
      loadReservations();
      updateStats();
    }
  };

  function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders'));
    const tbody = document.getElementById('orders-list');
    tbody.innerHTML = '';
    
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No orders yet.</td></tr>';
      return;
    }
    
    orders.forEach((order, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>#${order.id}</td>
        <td>${order.date}</td>
        <td>${order.customer}</td>
        <td>${order.items}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td><span style="color: ${order.status === 'Completed' ? '#4caf50' : '#ff9800'};">${order.status}</span></td>
      `;
      tbody.appendChild(row);
    });
  }

  function updateStats() {
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
        return orderDate.toDateString() === today.toDateString();
      })
      .reduce((sum, order) => sum + order.total, 0);
    
    document.getElementById('total-revenue').textContent = `$${todayRevenue.toFixed(2)}`;
  }

  loadMenuItems();
  loadReservations();
  loadOrders();
  updateStats();
});
