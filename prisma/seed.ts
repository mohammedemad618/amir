import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create sample user
  const userPasswordHash = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      role: 'USER',
    },
  });
  console.log('✅ Created test user:', user.email);

  // Create courses
  const courses = [
    {
      title: 'أساسيات التغذية العلاجية',
      category: 'nutrition',
      description: 'دورة شاملة تغطي أساسيات التغذية العلاجية وكيفية استخدامها في العلاج',
      objectives: JSON.stringify([
        'فهم أساسيات التغذية العلاجية',
        'تعلم كيفية تقييم الحالة الغذائية',
        'تطبيق مبادئ التغذية في العلاج',
      ]),
      hours: 20,
      price: 150,
      level: 'BEGINNER' as const,
      thumbnail: null,
    },
    {
      title: 'التغذية الرياضية المتقدمة',
      category: 'nutrition',
      description: 'دورة متقدمة في التغذية الرياضية وتحسين الأداء',
      objectives: JSON.stringify([
        'تعلم متطلبات الرياضيين الغذائية',
        'تخطيط برامج التغذية الرياضية',
        'تحسين الأداء من خلال التغذية',
      ]),
      hours: 30,
      price: 250,
      level: 'ADVANCED' as const,
      thumbnail: null,
    },
    {
      title: 'التغذية للأمراض المزمنة',
      category: 'nutrition',
      description: 'التعامل مع الأمراض المزمنة من خلال التغذية العلاجية',
      objectives: JSON.stringify([
        'فهم دور التغذية في الأمراض المزمنة',
        'تخطيط نظام غذائي للأمراض المزمنة',
        'متابعة وتحسين النتائج',
      ]),
      hours: 25,
      price: 200,
      level: 'INTERMEDIATE' as const,
      thumbnail: null,
    },
    {
      title: 'مقدمة في العلاج الوظيفي',
      category: 'occupational-therapy',
      description: 'دورة تمهيدية شاملة في العلاج الوظيفي وأساسياته',
      objectives: JSON.stringify([
        'فهم مفاهيم العلاج الوظيفي',
        'تعلم تقنيات التقييم الأساسية',
        'تطبيق مبادئ العلاج الوظيفي',
      ]),
      hours: 24,
      price: 180,
      level: 'BEGINNER' as const,
      thumbnail: null,
    },
    {
      title: 'العلاج الوظيفي للأطفال',
      category: 'occupational-therapy',
      description: 'تخصص في العلاج الوظيفي للأطفال وذوي الاحتياجات الخاصة',
      objectives: JSON.stringify([
        'تعلم تقنيات العلاج الوظيفي للأطفال',
        'تطوير مهارات التواصل والحركة',
        'دعم نمو الطفل الشامل',
      ]),
      hours: 35,
      price: 300,
      level: 'ADVANCED' as const,
      thumbnail: null,
    },
    {
      title: 'إعادة التأهيل الوظيفي',
      category: 'occupational-therapy',
      description: 'دورة متخصصة في إعادة التأهيل الوظيفي للمصابين',
      objectives: JSON.stringify([
        'تعلم برامج إعادة التأهيل',
        'تقييم القدرات الوظيفية',
        'تخطيط برامج العلاج الفردية',
      ]),
      hours: 28,
      price: 220,
      level: 'INTERMEDIATE' as const,
      thumbnail: null,
    },
  ];

  // Delete existing courses first (optional - comment out if you want to keep existing data)
  await prisma.course.deleteMany({});
  await prisma.enrollment.deleteMany({});

  // Create courses
  for (const courseData of courses) {
    const course = await prisma.course.create({
      data: courseData,
    });
    console.log(`✅ Created course: ${course.title}`);
  }

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
