// Firebase Data Management
// إدارة البيانات عبر Firestore

class FirebaseDataManager {
  constructor() {
    this.db = firebase.firestore();
  }

  // ===== إدارة القائمة (Menu Items) =====
  
  async getMenuItems() {
    try {
      const snapshot = await this.db.collection('menu_items').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return [];
    }
  }

  async addMenuItem(item) {
    try {
      const docRef = await this.db.collection('menu_items').add({
        ...item,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      await authManager.logActivity('menu_item_added', { itemId: docRef.id, name: item.name });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateMenuItem(id, item) {
    try {
      await this.db.collection('menu_items').doc(id).update({
        ...item,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      await authManager.logActivity('menu_item_updated', { itemId: id, name: item.name });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteMenuItem(id) {
    try {
      await this.db.collection('menu_items').doc(id).delete();
      await authManager.logActivity('menu_item_deleted', { itemId: id });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== إدارة الحجوزات (Reservations) =====
  
  async getReservations() {
    try {
      const snapshot = await this.db.collection('reservations').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return [];
    }
  }

  async addReservation(reservation) {
    try {
      const docRef = await this.db.collection('reservations').add({
        ...reservation,
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateReservationStatus(id, status) {
    try {
      await this.db.collection('reservations').doc(id).update({
        status,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      await authManager.logActivity('reservation_status_updated', { reservationId: id, status });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteReservation(id) {
    try {
      await this.db.collection('reservations').doc(id).delete();
      await authManager.logActivity('reservation_deleted', { reservationId: id });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== إدارة الطلبات (Orders) =====
  
  async getOrders() {
    try {
      const snapshot = await this.db.collection('orders').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return [];
    }
  }

  async addOrder(order) {
    try {
      const docRef = await this.db.collection('orders').add({
        ...order,
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateOrderStatus(id, status) {
    try {
      await this.db.collection('orders').doc(id).update({
        status,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      await authManager.logActivity('order_status_updated', { orderId: id, status });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== الإحصائيات =====
  
  async getStats() {
    try {
      const [menuItems, reservations, orders] = await Promise.all([
        this.getMenuItems(),
        this.getReservations(),
        this.getOrders()
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = orders.filter(order => {
        const orderDate = order.createdAt?.toDate();
        return orderDate && orderDate >= today;
      });

      const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);

      return {
        totalMenuItems: menuItems.length,
        totalReservations: reservations.length,
        totalOrders: orders.length,
        todayRevenue,
        pendingReservations: reservations.filter(r => r.status === 'pending').length,
        pendingOrders: orders.filter(o => o.status === 'pending').length
      };
    } catch (error) {
      return {
        totalMenuItems: 0,
        totalReservations: 0,
        totalOrders: 0,
        todayRevenue: 0,
        pendingReservations: 0,
        pendingOrders: 0
      };
    }
  }

  // ===== سجل النشاطات =====
  
  async getActivityLogs(limit = 50) {
    try {
      const snapshot = await this.db.collection('activity_logs')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return [];
    }
  }
}

// إنشاء نسخة واحدة من المدير
const dataManager = new FirebaseDataManager();
