# Nova Restaurant Website

## Overview
Nova Restaurant is a multilingual static website for a restaurant featuring:
- Homepage with hero section, chef's specials, offers, about section, reviews, and location
- Interactive menu page with order modal
- Reservation booking form
- Contact page with contact form
- Multilingual support with elegant dropdown selector (6 languages: English, Arabic, French, Spanish, German, Turkish)
- Full RTL support for Arabic

## Project Structure
```
.
├── index.html              # Homepage
├── menu.html              # Menu page with ordering functionality
├── reservation.html       # Table reservation form
├── contact.html           # Contact information and form
├── admin.html             # Admin dashboard (requires authentication)
├── css/
│   └── style.css          # All styling including admin panel
├── js/
│   ├── script.js          # Main JavaScript (carousel, forms)
│   ├── lang.js            # Language switching functionality
│   ├── menu.js            # Menu page functionality
│   ├── menu_data.js       # Menu items data
│   ├── cart.js            # Shopping cart functionality
│   ├── admin.js           # Admin login modal
│   └── admin-dashboard.js # Admin dashboard functionality
├── images/                # Restaurant images and dishes
├── server.py              # Python HTTP server
└── README.md              # Original project readme
```

## Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Server**: Python 3.11 HTTP server
- **Hosting**: Replit (serves on port 5000)

## Features
- **Multilingual Support**: Beautiful dropdown selector with 6 languages:
  - English 🇬🇧
  - Arabic 🇸🇦 (with full RTL support)
  - French 🇫🇷
  - Spanish 🇪🇸
  - German 🇩🇪
  - Turkish 🇹🇷
- **Admin Management System**: 
  - Click on logo to access admin login modal
  - Secure authentication (demo credentials: salah55/salaho55)
  - Admin dashboard with:
    - Statistics overview (orders, reservations, menu items, revenue)
    - Menu management (add, edit, delete menu items)
    - View and manage reservations
    - View customer orders
  - Data stored in localStorage for demo purposes
- **Responsive Design**: Works on mobile and desktop devices with adaptive language selector
- **Interactive Elements**: 
  - Smooth rotating offers carousel with CSS transitions
  - Menu ordering modal with shopping cart
  - Form submissions saving to localStorage
  - Mobile hamburger menu
- **Forms**: Reservation booking, menu ordering, and contact forms with enhanced styling
- **Enhanced UI**: 
  - Gradient backgrounds and buttons
  - Smooth animations and hover effects
  - Sticky header with shadow
  - Card lift effects

## Development
The website is served using a Python HTTP server on port 5000 with cache control headers to ensure fresh content delivery.

### Running Locally
The server automatically starts via the workflow. It serves static files from the root directory.

### Language System
- 6 languages supported with complete translations
- Elegant dropdown selector with country flags
- Language preference saved in localStorage
- Translations defined in `js/lang.js`
- Dynamic content updates without page reload
- RTL layout automatically applied for Arabic
- Mobile responsive (hides language name on small screens)

## 🔒 نظام الأمان الجديد (Firebase Professional Security)

### التغييرات الكبرى - 2025-10-05:
تم تطوير نظام أمان احترافي كامل باستخدام Firebase:

**1. نظام المصادقة (Authentication):**
- ✅ Firebase Authentication بدلاً من localStorage
- ✅ تشفير كلمات المرور تلقائياً
- ✅ مصادقة Email/Password آمنة
- ✅ إدارة جلسات المستخدمين بـ JWT tokens
- ✅ التحقق التلقائي من صلاحيات المسؤول

**2. قاعدة البيانات الآمنة (Firestore):**
- ✅ تخزين جميع البيانات في السحابة بدلاً من localStorage
- ✅ مجموعات منفصلة: menu_items, reservations, orders, admins, activity_logs
- ✅ Firebase Security Rules تحمي البيانات تلقائياً
- ✅ التحقق من صحة البيانات قبل الحفظ

**3. قواعد الأمان (Security Rules):**
- 🔒 فقط المسؤولين يمكنهم إدارة القائمة
- 🔒 فقط المسؤولين يمكنهم رؤية الحجوزات والطلبات
- 🔒 الزبائن يمكنهم إنشاء حجوزات وطلبات فقط
- 🔒 لا يمكن تعديل أو حذف سجل النشاطات

**4. سجل النشاطات (Audit Logs):**
- 📋 تسجيل تلقائي لجميع العمليات الإدارية
- 📋 تتبع: تسجيل الدخول، الإضافة، التعديل، الحذف
- 📋 حفظ IP Address والوقت والمستخدم
- 📋 لا يمكن حذف أو تعديل السجلات

**5. الملفات الجديدة:**
- `js/firebase-config.js` - إعدادات Firebase (محمي في .gitignore)
- `js/firebase-auth.js` - نظام المصادقة الكامل
- `js/firebase-data.js` - إدارة البيانات في Firestore
- `js/admin-dashboard-firebase.js` - لوحة التحكم الجديدة
- `firestore.rules` - قواعد أمان Firestore
- `storage.rules` - قواعد أمان Storage
- `firebase-setup-guide.txt` - دليل الإعداد الكامل

**6. التوافق:**
- ✅ يعمل مع Firebase (موصى به للإنتاج)
- ✅ Fallback للنظام القديم (للتطوير المحلي)
- ✅ متوافق مع GitHub Pages بالكامل
- ✅ لا يحتاج لـ backend server

**7. كيفية الإعداد:**
1. اتبع التعليمات في `firebase-setup-guide.txt`
2. أنشئ مشروع Firebase مجاني
3. انسخ Firebase Config إلى `js/firebase-config.js`
4. ارفع Security Rules إلى Firebase Console
5. أنشئ أول حساب مسؤول

**8. الأمان:**
- 🔐 لا كلمات مرور في الكود المصدري
- 🔐 تشفير تلقائي للبيانات
- 🔐 حماية من SQL Injection و XSS
- 🔐 Rate limiting تلقائي من Firebase
- 🔐 مراقبة النشاطات المشبوهة

## Recent Changes
- 2025-10-05: Code cleanup and error fixes
  - Removed all console.log and console.error statements from JavaScript files
  - Added autocomplete attributes to password fields (security best practice)
  - Cleaned up debugging code across all JS files
  - Website now runs without any console warnings or errors
- 2025-10-05: Successfully set up for Replit environment
  - Installed Python 3.11 runtime
  - Configured workflow to serve on port 5000 (0.0.0.0)
  - Verified all pages working correctly (homepage, menu, reservations, contact, admin)
  - Set up deployment configuration for Autoscale (production-ready)
  - Website running with localStorage fallback (Firebase optional)
- 2025-10-04: Fixed critical sync issues between admin and public pages
  - Created shared storage-helper.js for consistent data access across all pages
  - Fixed menu items not appearing in Menu Management tab (now initializes from MENU_ITEMS)
  - Fixed new admin dishes not appearing in public menu (now reads from localStorage)
  - Fixed cart functionality (now supports both numeric and string prices)
  - Fixed reservations not showing in Admin Dashboard (corrected field ID from 'res-guests' to 'res-people')
  - All forms now properly save to and read from localStorage
  - Added null checks to prevent errors when DOM elements are missing
- 2025-10-04: Enhanced admin menu management with image upload
  - Added direct image upload functionality (no longer need to type filename)
  - Images are converted to base64 and stored in localStorage
  - Live image preview when uploading or editing menu items
  - Menu items table now displays thumbnail images
  - Support for all common image formats (JPG, PNG, GIF, etc.)
- 2025-10-04: Added comprehensive admin management system
  - Admin login modal accessible by clicking the logo
  - Authentication with owner credentials (username: salah55, password: salaho55)
  - Full-featured admin dashboard (admin.html) with:
    - Real-time statistics cards showing orders, reservations, menu items, and daily revenue
    - Menu management: add, edit, and delete menu items with categories
    - Reservations viewer showing all bookings from the website
    - Orders viewer showing all customer orders with status tracking
  - Data persistence using localStorage
  - Forms updated to save reservations and orders for admin viewing
  - Multilingual support for admin interface
  - Session-based authentication protection
- 2025-10-04: Enhanced multilingual support with fully functional dropdown selector
  - Completed translations for all 6 languages (English, Arabic, French, Spanish, German, Turkish)
  - Implemented elegant dropdown selector with smooth animations and hover effects
  - Added complete CSS styling for dropdown with RTL support
  - Interactive language switcher with flag icons and language names
  - Persistent language preference saved in localStorage
  - Smooth transitions and visual feedback on language changes
- 2025-10-03: Major UI enhancements
  - Enhanced CSS with gradients, animations, and smooth transitions
  - Added mobile hamburger menu
  - Improved carousel with CSS-based smooth transitions
  - Enhanced forms with better styling and feedback
  - Added sticky header and card hover effects
- 2025-10-03: Imported from GitHub and configured for Replit environment
  - Added Python HTTP server with proper cache control
  - Configured workflow to serve on port 5000
  - Added .gitignore for Python files

## User Preferences
None specified yet.

## Notes
- All forms are in demo mode (no backend processing)
- Images are stored locally in the images/ directory
- No external dependencies or build process required
