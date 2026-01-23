# منصة الدكتور عامر سلمان عرابي - Medical Education Platform

منصة تعليم طبي احترافية في التغذية العلاجية والعلاج الوظيفي، مبنية باستخدام Next.js 14+ مع دعم كامل للغة العربية (RTL).

## المميزات

- ✅ **5 صفحات رئيسية**: الرئيسية، عن الدكتور، الدورات، اتصل بنا، لوحة التحكم
- ✅ **نظام مصادقة كامل**: JWT مع Refresh Tokens (HTTP-only cookies)
- ✅ **نظام الدورات**: تصفح، تسجيل، تتبع التقدم، شهادات إتمام
- ✅ **دعم RTL كامل**: تصميم متجاوب بالعربية
- ✅ **مكتبة مكونات UI**: Button, Card, Input, Badge, Alert, ProgressBar
- ✅ **الأمان**: Rate limiting, Secure headers, CSRF protection, Input validation
- ✅ **SEO**: Meta tags, Open Graph, JSON-LD, Sitemap, Robots.txt
- ✅ **رسوم توضيحية طبية**: دعم الرسوم من Storyset, Icons8, Blush

## التقنيات المستخدمة

### Frontend
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- TailwindCSS
- Framer Motion
- React Hook Form + Zod

### Backend
- Next.js API Routes
- Prisma ORM
- SQLite (للتنمية، يمكن التحويل لـ PostgreSQL)
- JWT Authentication
- bcrypt

## الإعداد والتشغيل

### المتطلبات
- Node.js 18+ 
- npm أو yarn

### الخطوات

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd amer_v1.1
```

2. **تثبيت الحزم**
```bash
npm install
# أو
yarn install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env
```

قم بتحرير `.env` وتغيير القيم المطلوبة:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

4. **إعداد قاعدة البيانات**
```bash
# إنشاء قاعدة البيانات
npx prisma db push

# تشغيل seed script (إنشاء بيانات تجريبية)
npm run db:seed
```

5. **تشغيل المشروع**
```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

### بيانات الدخول الافتراضية

بعد تشغيل seed script، يمكنك استخدام:

- **مدير**: 
  - البريد: `admin@example.com`
  - كلمة المرور: `admin123`

- **مستخدم**: 
  - البريد: `user@example.com`
  - كلمة المرور: `user123`

## بنية المشروع

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── courses/         # Courses endpoints
│   │   ├── enroll/          # Enrollment endpoint
│   │   ├── progress/        # Progress tracking
│   │   └── certificates/    # Certificate generation
│   ├── auth/                # Auth pages (login, register)
│   ├── courses/             # Courses pages
│   ├── dashboard/           # Dashboard (protected)
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # UI Components
│   ├── layout/              # Layout components (Navbar, Footer)
│   └── courses/             # Course-specific components
├── content/                 # Content files
│   ├── courses.ts           # Sample courses data
│   └── illustrations.ts     # Illustration registry
├── lib/
│   ├── auth/                # Auth utilities (JWT, cookies, guards)
│   ├── db/                  # Prisma client
│   └── security/            # Security utilities (rate limiter)
├── theme/                   # Theme tokens
└── utils/                   # Utility functions

prisma/
├── schema.prisma            # Prisma schema
└── seed.ts                  # Seed script

public/
└── illustrations/
    └── medical/             # Medical illustration placeholders
```

## الرسوم التوضيحية الطبية

المنصة تستخدم رسوم توضيحية من مصادر خارجية:

- **Storyset by Freepik**: `doctor-clipboard.webp`, `consultation-scene.webp`
- **Icons8 Ouch!**: `nutritionist.webp`
- **Blush**: `occupational-therapy.webp`

### إضافة الرسوم التوضيحية الحقيقية

1. قم بتحميل الرسوم التوضيحية من المصادر المذكورة أعلاه
2. احفظها في `public/illustrations/medical/` بالأسماء التالية:
   - `doctor-clipboard.webp`
   - `nutritionist.webp`
   - `occupational-therapy.webp`
   - `consultation-scene.webp`
3. تأكد من أن التنسيق WebP أو PNG/JPEG (سيتم تحسينها تلقائياً)

**ملاحظة**: تأكد من الالتزام بتراخيص المصادر وإضافة الإسناد في Footer (تم تطبيقه تلقائياً).

## الأمان

### المصادقة
- **Access Token**: صالح لمدة 15 دقيقة
- **Refresh Token**: صالح لمدة 7 أيام (HTTP-only cookie)
- **Password Hashing**: bcrypt مع salt rounds = 10

### Rate Limiting
- **Login/Register**: 10 محاولات كل 10 دقائق لكل IP
- **ملاحظة**: يستخدم in-memory store في التنمية (استخدم Redis في الإنتاج)

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy (معدّلة)

### Input Validation
- Zod schemas لجميع المدخلات
- Sanitization تلقائي من Next.js

## الإنتاج (Production)

### قبل النشر

1. **غيّر JWT Secrets** في `.env`:
```env
JWT_SECRET="<strong-random-secret>"
JWT_REFRESH_SECRET="<another-strong-random-secret>"
```

2. **استخدم قاعدة بيانات PostgreSQL** (اختياري):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

3. **فعّل HTTPS** (للـ cookies الآمنة)

4. **استخدم Redis للـ Rate Limiting** (بدلاً من in-memory)

5. **راجع Security Headers** في `next.config.js`

### البناء
```bash
npm run build
npm start
```

## التطوير

### الأوامر المتاحة

```bash
npm run dev          # تشغيل بيئة التطوير
npm run build        # بناء المشروع للإنتاج
npm run start        # تشغيل الإنتاج
npm run lint         # فحص الكود
npm run db:push      # تحديث قاعدة البيانات
npm run db:seed      # تشغيل seed script
npm run db:studio    # فتح Prisma Studio
```

## المساهمة

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## الترخيص

هذا المشروع مخصص للدكتور عامر سلمان عرابي. جميع الحقوق محفوظة.

## معلومات الاتصال

**الدكتور عامر سلمان عرابي**
- الهاتف: +00963985391696
- الموقع: سوريا – اللاذقية
- التخصص: دكتوراه بعلوم التغذية العلاجية والعلاج الوظيفي

## الدعم

للدعم أو الاستفسارات، يمكنك:
- فتح Issue في GitHub
- التواصل عبر صفحة "اتصل بنا" في الموقع

---

**تم البناء بـ ❤️ باستخدام Next.js 14 + React + TypeScript + TailwindCSS**
#   a m i r  
 