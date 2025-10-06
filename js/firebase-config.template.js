// Firebase Configuration Template
// نسخ هذا الملف إلى firebase-config.js وأضف مفاتيحك الخاصة

// احصل على هذه القيم من:
// Firebase Console > Project Settings > General > Your apps > Web app

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (error) {
  }
}
