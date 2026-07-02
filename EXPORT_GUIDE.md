# دليل تصدير ونقل مشروع شركاء

## خطوات التصدير من OnSpace

### الطريقة 1: تحميل ZIP مباشرة

1. في OnSpace App Builder، اضغط أيقونة **Download** في شريط الأدوات العلوي (أعلى اليمين)
2. اختر **Export Source Code**
3. ستحصل على ملف `shuraka.zip` يحتوي على كامل سورس الكود
4. فك الضغط وافتح المجلد في VS Code

### الطريقة 2: ربط GitHub مباشرة

1. اضغط أيقونة **GitHub** في شريط الأدوات العلوي
2. سجّل دخولك إلى GitHub
3. اختر إنشاء Repository جديد أو ربط Repository موجود
4. سيُرفع الكود تلقائيًا مع كل تغيير

---

## ما يحتويه هذا التصدير

```
الملفات الرئيسية المُصدَّرة:
├── app/                    ← كل صفحات التطبيق
├── components/             ← مكونات قابلة للاستخدام
├── contexts/               ← إدارة الحالة (Auth, Business)
├── hooks/                  ← Custom Hooks
├── constants/              ← الثوابت والتصميم
├── supabase/functions/     ← Edge Functions (Deno)
├── assets/                 ← الأيقونات والصور
├── app.json                ← إعدادات Expo
├── eas.json                ← إعدادات EAS Build
├── package.json            ← الاعتماديات
├── tsconfig.json           ← TypeScript Config
├── .env.example            ← نموذج متغيرات البيئة ✅
├── DATABASE_SCHEMA.sql     ← مخطط قاعدة البيانات كامل ✅
├── DATABASE_SEED.sql       ← بيانات تجريبية ✅
└── README.md               ← دليل التشغيل الكامل ✅
```

---

## إعداد البيئة الخارجية

### 1. إعداد Supabase الخارجي

```bash
# أنشئ مشروعًا على supabase.com
# ثم انسخ URL و anon_key إلى .env

# شغّل مخطط قاعدة البيانات
# افتح Supabase Dashboard → SQL Editor → New Query
# الصق محتوى DATABASE_SCHEMA.sql واضغط Run

# ثم شغّل بيانات تجريبية (اختياري)
# الصق محتوى DATABASE_SEED.sql بعد تعديل YOUR_USER_ID_HERE
```

### 2. إعداد Auth في Supabase

```
Supabase Dashboard → Authentication → Settings:

1. Email OTP Settings:
   - OTP Expiry: 600 seconds (10 دقائق)
   - OTP Length: 4 (تغيير من 6 إلى 4)

2. Email Templates → Magic Link:
   عدّل القالب بالنص العربي المطلوب

3. لتفعيل قيد "المستخدمين الموجودين فقط":
   التأكد من shouldCreateUser: false في Edge Function
```

### 3. نشر Edge Functions

```bash
# ثبّت Supabase CLI
npm install -g supabase

# ربط المشروع
supabase link --project-ref YOUR_PROJECT_REF

# أضف المتغيرات السرية لـ Edge Functions
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your_anon_key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# نشر الـ Functions
supabase functions deploy send-otp
supabase functions deploy verify-otp
```

### 4. إعداد ملف .env

```bash
cp .env.example .env
# عدّل .env وأضف قيمك الحقيقية:
# EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## الفرق بين OnSpace Cloud وSupabase العادي

| الميزة | OnSpace Cloud | Supabase |
|--------|--------------|---------|
| URL | `https://YOUR.backend.onspace.ai` | `https://YOUR.supabase.co` |
| تهيئة Client | `getSupabaseClient()` من `@/template` | `createClient()` من `@supabase/supabase-js` |
| Edge Functions | نفس الـ Deno API | نفس الـ Deno API |
| Auth | متوافق 100% | أصلي |
| Database | PostgreSQL متوافق | PostgreSQL أصلي |

### تحديث Client عند الانتقال لـ Supabase

في `template/core/client.ts` أو أي ملف يستخدم `getSupabaseClient()`:

```typescript
// الطريقة الحالية (OnSpace)
import { getSupabaseClient } from '@/template';
const supabase = getSupabaseClient();

// الطريقة الجديدة (Supabase مباشرة)
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

## تهيئة VS Code

### ملفات الإعداد الموصى بها

```bash
# أنشئ .vscode/settings.json
mkdir -p .vscode
```

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.tabSize": 2,
  "files.encoding": "utf8",
  "editor.wordWrap": "on"
}
```

```json
// .vscode/extensions.json
{
  "recommendations": [
    "expo.vscode-expo-tools",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

---

## نصائح مهمة للمطورين

1. **لا ترفع .env على GitHub** — تأكد من وجوده في `.gitignore`
2. **المتغيرات التي تبدأ بـ `EXPO_PUBLIC_`** تكون مرئية في Frontend
3. **المفاتيح السرية** (Stripe Secret, Service Role) للاستخدام في Edge Functions فقط
4. **OTP Length** يُعيَّن في Supabase Dashboard وليس في الكود
5. **Edge Functions** تعمل على Deno وليس Node.js — تأكد من التوافق

---

## التقنية المستخدمة بالتفصيل

```
Frontend:  React Native 0.76 + Expo SDK 52 + TypeScript 5.x
Router:    Expo Router v4 (file-based, web + mobile)
Backend:   Supabase (PostgreSQL 15 + Auth + Edge Functions)
Functions: Deno 1.x (داخل Supabase)
Build:     EAS Build (Expo Application Services)
State:     React Context API (لا Redux)
Icons:     @expo/vector-icons (MaterialIcons)
Images:    expo-image
Animation: react-native-reanimated ~3.17.5
RTL:       I18nManager.forceRTL(true)
```
