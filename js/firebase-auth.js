// Firebase Authentication System
// نظام المصادقة الاحترافي

class FirebaseAuthManager {
  constructor() {
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.currentUser = null;

    // مراقبة حالة تسجيل الدخول
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      if (user) {
        this.logActivity('login', { email: user.email });
      }
    });
  }

  // تسجيل دخول المسؤول
  async adminLogin(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // التحقق من أن المستخدم مسؤول
      const adminDoc = await this.db.collection('Admin').doc(user.uid).get();

      if (!adminDoc.exists) {
        await this.auth.signOut();
        throw new Error('ليس لديك صلاحيات المسؤول');
      }

      // تسجيل النشاط
      await this.logActivity('admin_login', {
        email: user.email,
        timestamp: new Date()
      });

      return { success: true, user };
    } catch (error) {
      return { success: false, error: this.getArabicError(error) };
    }
  }

  // إنشاء حساب مسؤول جديد
  async createAdmin(email, password, adminData) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // إضافة المستخدم إلى مجموعة المسؤولين
      await this.db.collection('Admin').doc(user.uid).set({
        email: email,
        name: adminData.name || 'Admin',
        role: 'admin',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        permissions: adminData.permissions || ['all']
      });

      await this.logActivity('admin_created', { email, name: adminData.name });

      return { success: true, user };
    } catch (error) {
      return { success: false, error: this.getArabicError(error) };
    }
  }

  // تسجيل الخروج
  async logout() {
    try {
      await this.logActivity('logout', { email: this.currentUser?.email });
      await this.auth.signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: this.getArabicError(error) };
    }
  }

  // التحقق من صلاحيات المسؤول
  async checkAdminPermissions(user) {
    try {
      // البحث باستخدام البريد الإلكتروني
      const adminQuery = await this.db.collection('Admin')
        .where('email', '==', user.email)
        .limit(1)
        .get();

      if (!adminQuery.empty) {
        const adminDoc = adminQuery.docs[0];
        return adminDoc.data().role === 'Admin';
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // تسجيل النشاطات (Audit Logs)
  async logActivity(action, details) {
    try {
      const user = this.auth.currentUser;
      await this.db.collection('activity_logs').add({
        action,
        details,
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'unknown',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        ip: await this.getClientIP()
      });
    } catch (error) {
    }
  }

  // الحصول على IP العميل
  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  // ترجمة أخطاء Firebase إلى العربية
  getArabicError(error) {
    const errorMessages = {
      'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
      'auth/user-disabled': 'هذا الحساب معطل',
      'auth/user-not-found': 'المستخدم غير موجود',
      'auth/wrong-password': 'كلمة المرور خاطئة',
      'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
      'auth/weak-password': 'كلمة المرور ضعيفة (يجب أن تكون 6 أحرف على الأقل)',
      'auth/network-request-failed': 'خطأ في الاتصال بالإنترنت',
      'auth/too-many-requests': 'محاولات كثيرة جداً. حاول لاحقاً'
    };

    return errorMessages[error.code] || error.message || 'حدث خطأ غير متوقع';
  }

  // الحصول على المستخدم الحالي
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // التحقق من تسجيل الدخول
  isLoggedIn() {
    return this.auth.currentUser !== null;
  }
}

// إنشاء نسخة واحدة من المدير
const authManager = new FirebaseAuthManager();