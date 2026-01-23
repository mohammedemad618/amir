# دليل تحميل الصور - Images Download Guide

## الصور المطلوبة

المنصة تحتاج 4 صور طبية:

1. **doctor-clipboard.webp** - طبيب مع لوحة (Doctor with Clipboard)
2. **nutritionist.webp** - أخصائي تغذية (Nutrition Professional)
3. **occupational-therapy.webp** - علاج وظيفي (Occupational Therapy)
4. **consultation-scene.webp** - استشارة طبية (Doctor Patient Consultation)

## الحل الحالي

حالياً، المنصة تستخدم صور من Unsplash كبديل مؤقت. هذه الصور:
- ✅ مجانية تماماً
- ✅ عالية الجودة
- ✅ مناسبة للموضوع الطبي
- ✅ يمكن استخدامها تجارياً

## تحميل الصور الحقيقية

إذا أردت استخدام صور من المصادر الأصلية المذكورة في المتطلبات:

### الخيار 1: Storyset by Freepik
1. اذهب إلى: https://storyset.com/medical
2. ابحث عن: "doctor clipboard", "consultation"
3. حمل الصورة بصيغة SVG أو PNG
4. حولها إلى WebP (استخدم: https://cloudconvert.com/png-to-webp)
5. احفظها في: `public/illustrations/medical/doctor-clipboard.webp`

### الخيار 2: Icons8 Ouch!
1. اذهب إلى: https://icons8.com/ouch/illustrations/nutrition
2. اختر الصورة المناسبة
3. حمل PNG أو SVG
4. حول إلى WebP
5. احفظ في: `public/illustrations/medical/nutritionist.webp`

### الخيار 3: Blush
1. اذهب إلى: https://blush.design/collections/health
2. ابحث عن: "occupational therapy", "rehabilitation"
3. حمل الصورة
4. حول إلى WebP
5. احفظ في: `public/illustrations/medical/occupational-therapy.webp`

### الخيار 4: Unsplash (الأسهل - موصى به للتطوير)
الصور الحالية من Unsplash جيدة ويمكنك استخدامها مباشرة:

1. **Doctor Clipboard**: 
   - URL: https://images.unsplash.com/photo-1559839734-2b71ea197ec2
   - حمل الصورة من Unsplash مباشرة
   - احفظ كـ: `doctor-clipboard.webp`

2. **Nutritionist**:
   - URL: https://images.unsplash.com/photo-1490645935967-10de6ba17061
   - حمل الصورة من Unsplash مباشرة
   - احفظ كـ: `nutritionist.webp`

3. **Occupational Therapy**:
   - URL: https://images.unsplash.com/photo-1576091160399-112ba8d25d1f
   - حمل الصورة من Unsplash مباشرة
   - احفظ كـ: `occupational-therapy.webp`

4. **Consultation Scene**:
   - URL: https://images.unsplash.com/photo-1516549655169-df83a0774514
   - حمل الصورة من Unsplash مباشرة
   - احفظ كـ: `consultation-scene.webp`

## خطوات التحميل من Unsplash

1. افتح الرابط أعلاه في المتصفح
2. انقر على "Download" أو "Download free"
3. اختر الحجم المناسب (يفضل 800x600 أو أكبر)
4. احفظ الملف
5. حوله إلى WebP (اختياري، PNG يعمل أيضاً)
6. انسخ الملف إلى: `public/illustrations/medical/`
7. غير اسم الملف إلى الاسم المطلوب

## التحويل إلى WebP

يمكنك استخدام:
- **Online**: https://cloudconvert.com/png-to-webp
- **VS Code Extension**: "WebP Converter"
- **Command Line**: `cwebp input.png -q 80 -o output.webp`

## ملاحظات

- **الأسماء مهمة**: يجب أن تطابق الأسماء المذكورة في `src/content/illustrations.ts`
- **التنسيق**: WebP أفضل، لكن PNG/JPEG يعمل أيضاً
- **الحجم**: يفضل 800x600px أو أكبر
- **الجودة**: استخدم جودة 80-90 للتوازن بين الحجم والجودة

## بعد إضافة الصور

1. أعد تشغيل الخادم: `npm run dev`
2. الصور المحلية ستظهر تلقائياً بدلاً من Unsplash
3. المكون `MedicalIllustration` يستخدم الصور المحلية تلقائياً عند توفرها

## الإسناد (Attribution)

إذا استخدمت صور Unsplash أو مصادر مجانية:
- Unsplash: لا يتطلب إسناد (لكن مستحسن)
- Storyset/Icons8: يتطلب إسناد (تم تطبيقه في Footer)
- Blush: حسب الترخيص
