document.addEventListener('DOMContentLoaded', () => {
  const logoClick = document.getElementById('logo-click');
  const modal = document.getElementById('admin-login-modal');
  const closeModal = document.querySelector('.close-modal');
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('login-error');
  const submitBtn = loginForm?.querySelector('button[type="submit"]');

  // النظام القديم البسيط
  const useFirebase = false;

  if (logoClick) {
    logoClick.addEventListener('click', () => {
      modal.style.display = 'block';
      loginError.textContent = '';
      loginError.style.display = 'none';
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
      loginForm.reset();
      loginError.textContent = '';
      loginError.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      loginForm.reset();
      loginError.textContent = '';
      loginError.style.display = 'none';
    }
  });

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('admin-username').value;
      const password = document.getElementById('admin-password').value;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري تسجيل الدخول...';
      }

      if (useFirebase) {
        // استخدام Firebase للمصادقة
        try {
          const result = await authManager.adminLogin(email, password);
          
          if (result.success) {
            window.location.href = 'admin.html';
          } else {
            loginError.textContent = result.error || 'فشل تسجيل الدخول';
            loginError.style.display = 'block';
          }
        } catch (error) {
          loginError.textContent = 'حدث خطأ أثناء تسجيل الدخول';
          loginError.style.display = 'block';
        }
      } else {
        // النظام القديم البسيط
        const ADMIN_USERNAME = 'Salah55';
        const ADMIN_PASSWORD = 'salaho55';
        
        if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          sessionStorage.setItem('adminAuthenticated', 'true');
          window.location.href = 'admin.html';
        } else {
          loginError.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
          loginError.style.display = 'block';
        }
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'تسجيل الدخول';
      }
    });
  }
});
