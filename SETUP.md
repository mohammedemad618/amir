# دليل الإعداد السريع - Quick Setup Guide

## خطوات الإعداد (Setup Steps)

### 1. تثبيت الحزم (Install Dependencies)
```bash
npm install
```

### 2. إعداد متغيرات البيئة (Environment Variables)
```bash
cp .env.example .env
```

قم بتحرير `.env` وتغيير:
- `JWT_SECRET`: مفتاح عشوائي قوي
- `JWT_REFRESH_SECRET`: مفتاح عشوائي آخر
- `DATABASE_URL`: مسار قاعدة البيانات (افتراضي: `file:./dev.db`)

### 3. إعداد قاعدة البيانات (Database Setup)
```bash
# إنشاء قاعدة البيانات
npm run db:push

# تشغيل seed script (إنشاء بيانات تجريبية)
npm run db:seed
```

### 4. تشغيل المشروع (Run Development Server)
```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

### 5. بيانات الدخول الافتراضية (Default Login Credentials)

بعد تشغيل seed script:

**مدير (Admin):**
- البريد: `admin@example.com`
- كلمة المرور: `admin123`

**مستخدم (User):**
- البريد: `user@example.com`
- كلمة المرور: `user123`

## الرسوم التوضيحية الطبية (Medical Illustrations)

المنصة تحتاج لرسوم توضيحية طبية من مصادر خارجية. 

### المصادر المطلوبة:
1. **Storyset by Freepik**: `doctor-clipboard.webp`, `consultation-scene.webp`
2. **Icons8 Ouch!**: `nutritionist.webp`
3. **Blush**: `occupational-therapy.webp`

### إضافة الرسوم:
1. قم بتحميل الرسوم من المصادر المذكورة
2. احفظها في `public/illustrations/medical/` بالأسماء المذكورة
3. تأكد من الالتزام بالتراخيص (الإسناد مطلوب)

**ملاحظة**: يمكنك استخدام صور placeholder مؤقتة حتى تحصل على الرسوم الحقيقية.

## الأمان (Security)

### في الإنتاج (Production):

1. **غيّر JWT Secrets** - استخدم مفاتيح عشوائية قوية
2. **فعّل HTTPS** - مطلوب للـ cookies الآمنة
3. **استخدم PostgreSQL** - بدلاً من SQLite
4. **استخدم Redis** - للـ Rate Limiting
5. **راجع Security Headers** - في `next.config.js`

## استكشاف الأخطاء (Troubleshooting)

### خطأ في قاعدة البيانات:
```bash
# إعادة إنشاء قاعدة البيانات
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### خطأ في تثبيت الحزم:
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

### خطأ في Prisma:
```bash
# إعادة توليد Prisma Client
npx prisma generate
```

## المساعدة (Help)

للمزيد من المعلومات، راجع `README.md`
