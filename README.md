# شركاء — منصة الولاء الرقمية

> تطبيق SaaS عربي لإدارة برامج الولاء والمحافظ الرقمية للأعمال التجارية في الخليج.

---

## 📋 نظرة عامة على المشروع

**شركاء** هو تطبيق موبايل وويب متكامل يتيح لأصحاب الأعمال:
- إنشاء برامج ولاء (نقاط وطوابع ومكافآت)
- إدارة العملاء بمحافظ رقمية مع QR Code
- مسح QR من قِبَل الموظفين لإضافة النقاط
- إرسال إشعارات وعروض للعملاء
- متابعة التقارير والإحصائيات
- إدارة الفروع والموظفين
- اشتراكات شهرية بثلاث باقات

---

## 🛠 التقنيات المستخدمة

| الطبقة | التقنية |
|--------|---------|
| Frontend (Mobile + Web) | **React Native** + **Expo SDK 52** + **TypeScript** |
| التنقل | **Expo Router v4** (File-based routing) |
| Backend | **Supabase** (قاعدة بيانات PostgreSQL + Auth + Edge Functions + Storage) |
| Auth | **Supabase Auth** — Email OTP (4 أرقام) |
| Edge Functions | **Deno** (داخل Supabase) |
| State Management | **React Context API** |
| UI Icons | **@expo/vector-icons** (MaterialIcons) |
| Animations | **react-native-reanimated ~3.17.5** |
| Images | **expo-image** |
| Safe Area | **react-native-safe-area-context** |
| Payments | **Stripe** (مُعدّ للتفعيل — يحتاج مفاتيح) |
| Wallet Passes | Apple Wallet + Google Wallet (Placeholders جاهزة) |
| الاتجاه | **RTL** عربي كامل |

---

## 📁 هيكل المشروع

```
shuraka/
├── app/                          # صفحات التطبيق (Expo Router)
│   ├── index.tsx                 # نقطة الدخول — توجيه حسب الدور
│   ├── _layout.tsx               # Root Layout (Providers)
│   ├── (auth)/                   # صفحات المصادقة
│   │   ├── login.tsx             # تسجيل الدخول بـ OTP
│   │   ├── register.tsx          # التسجيل
│   │   └── forgot-password.tsx   # نسيان كلمة المرور
│   ├── (business)/               # لوحة صاحب العمل
│   │   ├── index.tsx             # Dashboard
│   │   ├── customers.tsx         # إدارة العملاء
│   │   ├── loyalty.tsx           # برامج الولاء
│   │   ├── scanner.tsx           # QR Scanner
│   │   ├── employees.tsx         # الموظفون
│   │   ├── branches.tsx          # الفروع
│   │   ├── offers.tsx            # العروض والإشعارات
│   │   ├── reviews.tsx           # التقييمات
│   │   ├── reports.tsx           # التقارير
│   │   ├── subscription.tsx      # الاشتراكات والفواتير
│   │   ├── settings.tsx          # الإعدادات
│   │   └── wallet/[id].tsx       # محفظة العميل (داخل لوحة صاحب العمل)
│   ├── (customer)/               # واجهة العميل
│   │   ├── index.tsx             # المحفظة الذكية
│   │   ├── history.tsx           # سجل العمليات
│   │   ├── offers.tsx            # العروض
│   │   └── review.tsx            # التقييم
│   ├── (admin)/                  # لوحة المدير
│   │   └── index.tsx             # Admin Dashboard
│   ├── (legal)/                  # الصفحات القانونية
│   │   ├── privacy-policy.tsx
│   │   ├── terms.tsx
│   │   ├── contact.tsx
│   │   └── about.tsx
│   └── wallet/[id].tsx           # محفظة عامة (بدون تسجيل دخول)
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Sidebar للويب والتابلت
│   │   ├── TopBar.tsx            # شريط علوي للموبايل
│   │   ├── WebTopBar.tsx         # شريط علوي للويب
│   │   ├── OfflineBanner.tsx     # شريط انقطاع الإنترنت
│   │   └── UpsellModal.tsx       # نافذة ترقية الباقة
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       └── StatCard.tsx
├── contexts/
│   ├── AuthContext.tsx            # حالة المصادقة وجلسة Supabase
│   └── BusinessContext.tsx        # بيانات النشاط التجاري والاشتراك
├── hooks/
│   ├── useAuth.ts                 # Hook لـ AuthContext
│   ├── useBusiness.ts             # Hook لـ BusinessContext
│   ├── useResponsive.ts           # Breakpoints للويب والتابلت
│   └── useNetworkStatus.ts        # مراقبة حالة الإنترنت
├── constants/
│   ├── theme.ts                   # الألوان والخطوط والمسافات
│   └── mockData.ts                # بيانات تجريبية للتطوير
├── supabase/
│   └── functions/
│       ├── _shared/cors.ts        # CORS Headers مشتركة
│       ├── send-otp/index.ts      # Edge Function: إرسال OTP
│       └── verify-otp/index.ts    # Edge Function: التحقق من OTP
├── assets/
│   └── images/
│       ├── icon.png               # أيقونة التطبيق
│       ├── splash.png             # Splash Screen
│       ├── adaptive-icon.png      # Android Adaptive Icon
│       └── feature-graphic.png    # Google Play Feature Graphic
├── app.json                       # إعدادات Expo
├── eas.json                       # إعدادات EAS Build
├── .env.example                   # نموذج متغيرات البيئة
└── package.json
```

---

## ⚡ تشغيل المشروع محليًا

### المتطلبات المسبقة

```bash
# تأكد من تثبيت:
node --version     # v18 أو أعلى
npm --version      # v9 أو أعلى
# أو
yarn --version     # v1.22 أو أعلى
```

### خطوات التثبيت

```bash
# 1. استنسخ المشروع
git clone https://github.com/YOUR_USERNAME/shuraka.git
cd shuraka

# 2. ثبّت الاعتماديات
npm install
# أو
yarn install

# 3. أنشئ ملف .env من النموذج
cp .env.example .env
# ثم عدّل .env بقيمك الحقيقية (راجع قسم متغيرات البيئة)

# 4. شغّل التطبيق
npx expo start
```

### أوامر التشغيل

```bash
# تشغيل عام (يفتح Expo DevTools)
npx expo start

# تشغيل على Android
npx expo start --android
# أو
npx expo run:android

# تشغيل على iOS
npx expo start --ios
# أو
npx expo run:ios

# تشغيل على الويب
npx expo start --web
# أو
npx expo export:web
```

---

## 🏗 بناء نسخة Production

### الطريقة 1: EAS Build (موصى بها)

```bash
# ثبّت EAS CLI
npm install -g eas-cli

# سجّل دخول
eas login

# بناء APK للاختبار
eas build --platform android --profile preview

# بناء AAB للنشر على Google Play
eas build --platform android --profile production

# بناء iOS للنشر على App Store
eas build --platform ios --profile production
```

### الطريقة 2: بناء محلي

```bash
# Android
npx expo run:android --variant release

# iOS
npx expo run:ios --configuration Release
```

### بناء نسخة الويب

```bash
# بناء Static Web Export
npx expo export --platform web

# الناتج في مجلد dist/
# يمكن رفعه على: Vercel / Netlify / Firebase Hosting
```

---

## 🌐 نشر نسخة الويب

### على Vercel

```bash
# ثبّت Vercel CLI
npm install -g vercel

# بناء ثم نشر
npx expo export --platform web
vercel deploy dist/
```

### على Netlify

```bash
# بناء
npx expo export --platform web

# ارفع مجلد dist/ على netlify.com
# أو استخدم Netlify CLI:
npm install -g netlify-cli
netlify deploy --dir=dist --prod
```

### على Firebase Hosting

```bash
npm install -g firebase-tools
firebase init hosting
npx expo export --platform web
firebase deploy
```

---

## 🗄 قاعدة البيانات (Supabase)

### إعداد Supabase

1. أنشئ مشروعًا على [supabase.com](https://supabase.com)
2. انسخ `Project URL` و `anon key` إلى ملف `.env`
3. شغّل ملف `DATABASE_SCHEMA.sql` في Supabase SQL Editor
4. شغّل ملف `DATABASE_SEED.sql` لإضافة بيانات تجريبية

### الجداول الرئيسية

| الجدول | الوصف |
|--------|--------|
| `user_profiles` | بيانات المستخدمين والأدوار |
| `businesses` | بيانات الأعمال التجارية |
| `branches` | الفروع لكل نشاط |
| `employees` | الموظفون وصلاحياتهم |
| `customers` | العملاء ورصيد النقاط |
| `wallets` | المحافظ الرقمية مع QR token |
| `wallet_passes` | بطاقات Apple/Google Wallet |
| `loyalty_programs` | برامج الولاء |
| `rewards` | المكافآت المتاحة |
| `transactions` | سجل جميع العمليات |
| `notifications` | الإشعارات المرسلة |
| `reviews` | تقييمات العملاء |
| `subscriptions` | اشتراكات Stripe |
| `invoices` | الفواتير |
| `plans` | باقات الاشتراك |
| `login_otps` | سجل رموز OTP |
| `audit_logs` | سجل العمليات الأمنية |

### تشغيل Edge Functions محليًا

```bash
# ثبّت Supabase CLI
npm install -g supabase

# شغّل البيئة المحلية
supabase start

# نشر Edge Functions على Supabase
supabase functions deploy send-otp
supabase functions deploy verify-otp
```

---

## 🔐 نظام المصادقة

### تدفق تسجيل الدخول (Email OTP)

```
المستخدم يدخل البريد الإلكتروني
        ↓
Edge Function: send-otp
  → التحقق من وجود البريد في user_profiles
  → إرسال OTP عبر Supabase Auth (4 أرقام)
        ↓
المستخدم يدخل الرمز
        ↓
Edge Function: verify-otp
  → التحقق من الرمز عبر Supabase Auth
  → إرجاع session + user role
        ↓
التوجيه حسب الدور:
  admin          → /(admin)
  business_owner → /(business)
  employee       → /(business)/scanner
  customer       → /(customer)
```

### الأدوار المدعومة

| الدور | الصلاحيات |
|-------|------------|
| `admin` | إدارة كاملة للنظام |
| `business_owner` | لوحة تحكم النشاط التجاري |
| `employee` | مسح QR وإضافة نقاط |
| `customer` | عرض المحفظة الشخصية |

---

## 💳 الباقات والأسعار

| الباقة | السعر | العملاء | الفروع | الموظفون |
|--------|-------|---------|--------|----------|
| انطلاقة | 8 ر.ع/شهر | 300 | 1 | 1 |
| نمو | 18 ر.ع/شهر | 2,000 | 3 | 10 |
| شركاء بلس | 39 ر.ع/شهر | غير محدود | 10 | 50 |

---

## 📱 توافق المنصات

| المنصة | الحالة |
|--------|--------|
| Android | ✅ مدعوم (API 26+) |
| iOS | ✅ مدعوم (iOS 15+) |
| Web Browser | ✅ مدعوم (Chrome/Safari/Firefox) |
| Windows PWA | ✅ عبر المتصفح |

---

## 🔄 تحديث التطبيق

```bash
# تحديث رقم الإصدار في app.json
# android.versionCode += 1
# version: "1.x.x"

# بناء إصدار جديد
eas build --platform android --profile production

# رفع على Google Play Console
# أو استخدام EAS Submit:
eas submit --platform android
```

---

## 🚀 النشر على متاجر التطبيقات

### Google Play Store

```bash
# بناء AAB
eas build --platform android --profile production

# رفع تلقائي
eas submit --platform android --latest
```

### Apple App Store

```bash
# بناء IPA
eas build --platform ios --profile production

# رفع تلقائي
eas submit --platform ios --latest
```

---

## 📧 إعداد خدمة البريد الإلكتروني

Supabase Auth يرسل رسائل OTP تلقائيًا. لتخصيص قالب البريد:

1. افتح Supabase Dashboard → Authentication → Email Templates
2. عدّل قالب "Magic Link" أو "OTP"
3. أضف النص العربي المطلوب

أو استخدم SMTP مخصص في: Authentication → Settings → SMTP Settings

---

## 📋 متطلبات VS Code

```json
// .vscode/extensions.json (موصى بها)
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "expo.vscode-expo-tools",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## 🤝 المساهمة في المشروع

```bash
# إنشاء branch جديدة
git checkout -b feature/اسم-الميزة

# Commit التغييرات
git add .
git commit -m "feat: وصف التغيير"

# رفع على GitHub
git push origin feature/اسم-الميزة

# إنشاء Pull Request
```

---

## 📞 الدعم والتواصل

- البريد: support@shuraka.app
- الموقع: shuraka.app
- الهاتف: +968 2456 7890

---

*آخر تحديث: يوليو ٢٠٢٦ — الإصدار 1.0.0*
