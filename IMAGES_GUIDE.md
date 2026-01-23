# دليل الصور والرسوم التوضيحية - Images Guide

## المشكلة الحالية

الصور والرسوم التوضيحية لا تظهر لأن الملفات غير موجودة في المجلد `/public/illustrations/medical/`.

## الحل

### الخيار 1: إضافة الصور الحقيقية (موصى به)

1. قم بتحميل الرسوم التوضيحية الطبية من المصادر المذكورة أدناه
2. احفظها في المجلد: `public/illustrations/medical/`
3. استخدم الأسماء التالية:

   - `doctor-clipboard.webp` (أو `.png`, `.jpg`)
   - `nutritionist.webp`
   - `occupational-therapy.webp`
   - `consultation-scene.webp`

### الخيار 2: استخدام صور مؤقتة

يمكنك استخدام أي صور مؤقتة مع الأسماء المذكورة أعلاه حتى تحصل على الصور الحقيقية.

## المصادر الموصى بها للرسوم التوضيحية

### 1. Storyset by Freepik
- الموقع: https://storyset.com/medical
- البحث عن: "doctor with clipboard", "consultation scene"
- الترخيص: Freemium (يتطلب الإسناد)

### 2. Icons8 Ouch!
- الموقع: https://icons8.com/ouch/illustrations/nutrition
- البحث عن: "nutrition professional"
- الترخيص: Free مع الإسناد

### 3. Blush
- الموقع: https://blush.design/collections/health
- البحث عن: "occupational therapy", "rehabilitation"
- الترخيص: Free Commercial Use

### 4. DrawKit
- الموقع: https://www.drawkit.com/
- البحث عن: "medical", "health"
- الترخيص: Free مع الإسناد

## ملاحظات مهمة

1. **الأسماء**: يجب أن تطابق الأسماء المذكورة في `src/content/illustrations.ts`
2. **التنسيق**: يفضل WebP، لكن PNG/JPEG تعمل أيضاً
3. **الحجم**: يفضل أن تكون الصور بعرض 600-1200px
4. **الإسناد**: تأكد من إضافة الإسناد في Footer (تم تطبيقه تلقائياً)

## الاختبار

بعد إضافة الصور:
1. تأكد من أن الملفات موجودة في `public/illustrations/medical/`
2. أعد تشغيل الخادم: `npm run dev`
3. تحقق من أن الصور تظهر في:
   - الصفحة الرئيسية (Home)
   - صفحة عن الدكتور (About)
   - صفحة الاتصال (Contact)

## المكون الحالي

المكون `MedicalIllustration` الآن يعرض رسالة واضحة عندما تكون الصور مفقودة، مما يساعد في تحديد المشكلة.
