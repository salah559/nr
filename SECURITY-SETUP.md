# 🔐 دليل إعداد نظام الأمان الاحترافي

## نظرة عامة

تم تطوير نظام حماية احترافي كامل لموقع Nova Restaurant باستخدام Firebase. هذا النظام يوفر:

✅ **مصادقة آمنة** - تشفير كلمات المرور وإدارة الجلسات  
✅ **قاعدة بيانات سحابية** - Firestore بدلاً من localStorage  
✅ **قواعد أمان متقدمة** - حماية تلقائية للبيانات  
✅ **سجل النشاطات** - تتبع جميع العمليات الإدارية  
✅ **متوافق مع GitHub Pages** - لا يحتاج لـ backend

---

## 🚀 البدء السريع

### الوضع الحالي: Fallback Mode

الموقع يعمل حالياً في **وضع التوافق القديم** باستخدام:
- اسم المستخدم: `salah55`
- كلمة المرور: `salaho55`

⚠️ **هذا غير آمن للإنتاج!** اتبع الخطوات أدناه لتفعيل Firebase.

---

## 📋 خطوات الإعداد الكاملة

### الخطوة 1: إنشاء مشروع Firebase (مجاني)

1. اذهب إلى: **https://console.firebase.google.com/**
2. اضغط **"Add project"** (إضافة مشروع)
3. اسم المشروع: `nova-restaurant` (أو أي اسم تختاره)
4. يمكنك تعطيل Google Analytics (اختياري)
5. اضغط **"Create project"**

---

### الخطوة 2: تفعيل Authentication

1. من القائمة الجانبية: **Build > Authentication**
2. اضغط **"Get started"**
3. اختر **"Email/Password"**
4. فعّل الخيار الأول فقط (**Email/Password**)
5. اضغط **"Save"**

---

### الخطوة 3: تفعيل Firestore Database

1. من القائمة الجانبية: **Build > Firestore Database**
2. اضغط **"Create database"**
3. اختر **"Start in production mode"**
4. اختر الموقع القريب منك (مثل: `eur3 (Europe)`)
5. اضغط **"Enable"**

---

### الخطوة 4: رفع Security Rules

1. في **Firestore Database > Rules**
2. احذف القواعد الموجودة
3. افتح ملف `firestore.rules` من المشروع
4. انسخ جميع محتوياته والصقها
5. اضغط **"Publish"**

📝 **مهم:** هذه القواعد تحمي بياناتك تلقائياً!

---

### الخطوة 5: الحصول على Firebase Config

1. اضغط على رمز **الترس ⚙️** > **"Project settings"**
2. اسحب للأسفل إلى **"Your apps"**
3. اضغط على أيقونة **الويب `</>`**
4. اسم التطبيق: `Nova Restaurant Web`
5. **لا تختر** Firebase Hosting
6. اضغط **"Register app"**
7. انسخ كود `firebaseConfig` الذي يظهر

سيكون شكله مثل:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

---

### الخطوة 6: تحديث Firebase Config في المشروع

1. افتح ملف `js/firebase-config.js`
2. استبدل `YOUR_API_KEY` و `YOUR_PROJECT_ID` وباقي القيم بقيمك الخاصة
3. احفظ الملف

**مثال:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyABC123...",  // ضع مفتاحك هنا
  authDomain: "nova-restaurant-xyz.firebaseapp.com",
  projectId: "nova-restaurant-xyz",
  storageBucket: "nova-restaurant-xyz.appspot.com",
  messagingSenderId: "987654321",
  appId: "1:987654321:web:abc123"
};
```

---

### الخطوة 7: إنشاء أول حساب مسؤول

#### في Firebase Console:

1. اذهب إلى **Authentication > Users**
2. اضغط **"Add user"**
3. البريد: `your-email@example.com` (استخدم بريدك الحقيقي)
4. كلمة المرور: (اختر كلمة مرور قوية - 8 أحرف على الأقل)
5. اضغط **"Add user"**
6. **انسخ الـ UID** (معرف المستخدم) الذي يظهر

#### إضافة صلاحيات المسؤول:

1. اذهب إلى **Firestore Database > Data**
2. اضغط **"Start collection"**
3. Collection ID: `admins`
4. Document ID: **(الصق الـ UID الذي نسخته)**

5. أضف الحقول التالية:

| Field | Type | Value |
|-------|------|-------|
| `email` | string | your-email@example.com |
| `name` | string | Your Name |
| `role` | string | admin |
| `permissions` | array | ["all"] |
| `createdAt` | timestamp | (اختر الآن) |

6. اضغط **"Save"**

---

### الخطوة 8: تفعيل النطاقات المسموحة

1. اذهب إلى **Authentication > Settings > Authorized domains**
2. ستجد `localhost` موجود افتراضياً
3. أضف نطاقاتك:
   - للنشر على GitHub Pages: `your-username.github.io`
   - للنشر على Replit: `your-repl-name.repl.co`
   - أي نطاق مخصص تملكه

---

## ✅ اختبار النظام

### 1. اختبار تسجيل الدخول

1. افتح موقعك
2. اضغط على **الشعار (Logo)** في الأعلى
3. ستظهر نافذة تسجيل الدخول
4. أدخل:
   - البريد الإلكتروني الذي أنشأته
   - كلمة المرور
5. اضغط **"تسجيل الدخول"**

✅ **إذا نجح**: ستنتقل إلى لوحة التحكم  
❌ **إذا فشل**: تحقق من:
   - البريد وكلمة المرور صحيحين
   - تم إضافة المستخدم في مجموعة `admins`
   - Firebase Config صحيح
   - افتح Console في المتصفح (F12) وشاهد الأخطاء

---

### 2. اختبار الوظائف

بعد تسجيل الدخول، جرّب:

- ✅ **إضافة عنصر للقائمة**
- ✅ **تعديل عنصر موجود**
- ✅ **حذف عنصر**
- ✅ **عرض الحجوزات**
- ✅ **عرض الطلبات**
- ✅ **مراجعة سجل النشاطات**

---

## 🔒 الأمان والحماية

### ما يحميه النظام:

✅ **تشفير كلمات المرور** - Firebase يشفّر تلقائياً  
✅ **حماية قاعدة البيانات** - Security Rules تمنع الوصول غير المصرح  
✅ **سجل النشاطات** - تتبع جميع العمليات  
✅ **حماية من Injection** - Firebase يمنع SQL/NoSQL injection  
✅ **Rate Limiting** - Firebase يمنع الهجمات الآلية  

### ملف firebase-config.js محمي

ملف `js/firebase-config.js` مضاف إلى `.gitignore` لحماية المفاتيح.

⚠️ **مهم:**
- لا ترفع `firebase-config.js` إلى GitHub إذا كانت المفاتيح حساسة
- استخدم Environment Variables في الإنتاج
- أو استخدم Firebase Hosting مع متغيرات البيئة

---

## 📊 مميزات النظام

### 1. سجل النشاطات (Audit Logs)

كل عملية إدارية يتم تسجيلها تلقائياً:
- 🔓 تسجيل الدخول
- ➕ إضافة عنصر
- ✏️ تعديل عنصر
- 🗑️ حذف عنصر
- 📅 تحديث حالة الحجز

**البيانات المحفوظة:**
- التاريخ والوقت
- البريد الإلكتروني للمسؤول
- نوع العملية
- تفاصيل العملية
- IP Address

---

### 2. Security Rules

**للزبائن:**
- ✅ يمكنهم إنشاء حجوزات وطلبات
- ❌ لا يمكنهم رؤية أو تعديل البيانات

**للمسؤولين:**
- ✅ رؤية جميع الحجوزات والطلبات
- ✅ إدارة القائمة (إضافة/تعديل/حذف)
- ✅ تحديث حالة الطلبات
- ✅ مراجعة سجل النشاطات

**لسجل النشاطات:**
- ✅ يتم الإنشاء تلقائياً
- ❌ لا يمكن التعديل أو الحذف (للحماية)

---

### 3. التوافق مع GitHub Pages

النظام يعمل 100% على GitHub Pages لأنه:
- لا يحتاج لـ backend server
- كل المنطق في Frontend
- Firebase يوفر كل الخدمات السحابية

---

## 🆘 حل المشاكل الشائعة

### المشكلة: "Invalid API Key"
**الحل:**
1. تحقق من أن `apiKey` صحيح في `firebase-config.js`
2. تأكد من أن المشروع مفعّل في Firebase Console

---

### المشكلة: "Permission denied"
**الحل:**
1. تحقق من رفع `firestore.rules` بشكل صحيح
2. تأكد من إضافة المستخدم في مجموعة `admins`
3. تحقق من أن `UID` صحيح

---

### المشكلة: "User not found"
**الحل:**
1. تحقق من البريد الإلكتروني صحيح
2. تأكد من إنشاء المستخدم في Authentication

---

### المشكلة: "Firebase not initialized"
**الحل:**
1. افتح Console في المتصفح (F12)
2. تحقق من تحميل Firebase SDK بنجاح
3. تأكد من وجود ملف `firebase-config.js`

---

## 📈 الحدود المجانية (Spark Plan)

Firebase مجاني للمشاريع الصغيرة:

| الخدمة | الحد اليومي | الحد الشهري |
|--------|-------------|-------------|
| القراءات | 50,000 | 1.5 مليون |
| الكتابات | 20,000 | 600,000 |
| التخزين | - | 1 GB |
| النقل | - | 10 GB |

هذا يكفي لآلاف المستخدمين يومياً!

---

## 🔄 العودة للنظام القديم

إذا واجهت مشاكل، يمكنك العودة للنظام القديم:

1. افتح `js/firebase-config.js`
2. غيّر السطر الأول إلى:
```javascript
const firebaseConfig = null; // معطل
```

سيعمل الموقع بـ localStorage والنظام القديم.

---

## 📚 مصادر إضافية

- **Firebase Docs:** https://firebase.google.com/docs
- **Firestore Security Rules:** https://firebase.google.com/docs/firestore/security/get-started
- **Firebase Auth:** https://firebase.google.com/docs/auth

---

## 💡 نصائح للإنتاج

1. ✅ استخدم كلمات مرور قوية (12+ حرف)
2. ✅ فعّل Two-Factor Authentication في Firebase
3. ✅ راقب Usage في Firebase Console
4. ✅ راجع Activity Logs بانتظام
5. ✅ احفظ نسخة احتياطية من القواعد
6. ✅ استخدم Environment Variables للمفاتيح
7. ✅ قم بتحديث Firebase SDK دورياً

---

## 🎉 تمت!

الآن لديك نظام أمان احترافي كامل! 🔐

أي أسئلة؟ راجع ملف `firebase-setup-guide.txt` للمزيد من التفاصيل.
