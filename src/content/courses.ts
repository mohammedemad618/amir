// This is seed-like content for initial display
// In production, courses come from the database

export interface CourseData {
  title: string;
  category: string;
  description: string;
  objectives: string[];
  hours: number;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail?: string;
}

export const sampleCourses: CourseData[] = [
  {
    title: 'أساسيات التغذية العلاجية',
    category: 'nutrition',
    description: 'دورة شاملة تغطي أساسيات التغذية العلاجية وكيفية استخدامها في العلاج',
    objectives: [
      'فهم أساسيات التغذية العلاجية',
      'تعلم كيفية تقييم الحالة الغذائية',
      'تطبيق مبادئ التغذية في العلاج',
    ],
    hours: 20,
    price: 150,
    level: 'BEGINNER',
  },
  {
    title: 'التغذية الرياضية المتقدمة',
    category: 'nutrition',
    description: 'دورة متقدمة في التغذية الرياضية وتحسين الأداء',
    objectives: [
      'تعلم متطلبات الرياضيين الغذائية',
      'تخطيط برامج التغذية الرياضية',
      'تحسين الأداء من خلال التغذية',
    ],
    hours: 30,
    price: 250,
    level: 'ADVANCED',
  },
  {
    title: 'التغذية للأمراض المزمنة',
    category: 'nutrition',
    description: 'التعامل مع الأمراض المزمنة من خلال التغذية العلاجية',
    objectives: [
      'فهم دور التغذية في الأمراض المزمنة',
      'تخطيط نظام غذائي للأمراض المزمنة',
      'متابعة وتحسين النتائج',
    ],
    hours: 25,
    price: 200,
    level: 'INTERMEDIATE',
  },
  {
    title: 'مقدمة في العلاج الوظيفي',
    category: 'occupational-therapy',
    description: 'دورة تمهيدية شاملة في العلاج الوظيفي وأساسياته',
    objectives: [
      'فهم مفاهيم العلاج الوظيفي',
      'تعلم تقنيات التقييم الأساسية',
      'تطبيق مبادئ العلاج الوظيفي',
    ],
    hours: 24,
    price: 180,
    level: 'BEGINNER',
  },
  {
    title: 'العلاج الوظيفي للأطفال',
    category: 'occupational-therapy',
    description: 'تخصص في العلاج الوظيفي للأطفال وذوي الاحتياجات الخاصة',
    objectives: [
      'تعلم تقنيات العلاج الوظيفي للأطفال',
      'تطوير مهارات التواصل والحركة',
      'دعم نمو الطفل الشامل',
    ],
    hours: 35,
    price: 300,
    level: 'ADVANCED',
  },
  {
    title: 'إعادة التأهيل الوظيفي',
    category: 'occupational-therapy',
    description: 'دورة متخصصة في إعادة التأهيل الوظيفي للمصابين',
    objectives: [
      'تعلم برامج إعادة التأهيل',
      'تقييم القدرات الوظيفية',
      'تخطيط برامج العلاج الفردية',
    ],
    hours: 28,
    price: 220,
    level: 'INTERMEDIATE',
  },
];
