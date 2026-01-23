export interface Illustration {
  id: string;
  title: string;
  sourceName: string;
  author: string;
  license: string;
  sourceUrl: string;
  assetPath: string;
  usageLocations: string[];
}

export const illustrations: Illustration[] = [
  {
    id: 'doctorClipboard',
    title: 'Doctor with Clipboard',
    sourceName: 'Storyset by Freepik',
    author: 'Freepik',
    license: 'Freemium (Attribution Required)',
    sourceUrl: 'https://storyset.com/medical',
    assetPath: '/illustrations/medical/doctor-clipboard.webp',
    usageLocations: ['Home hero', 'About page header'],
  },
  {
    id: 'nutritionist',
    title: 'Nutrition Professional',
    sourceName: 'Icons8 Ouch!',
    author: 'Icons8',
    license: 'Free with Attribution',
    sourceUrl: 'https://icons8.com/ouch/illustrations/nutrition',
    assetPath: '/illustrations/medical/nutritionist.webp',
    usageLocations: ['Features section', 'Courses empty state'],
  },
  {
    id: 'occupationalTherapy',
    title: 'Occupational Therapy Character',
    sourceName: 'Blush',
    author: 'Blush Design',
    license: 'Free Commercial Use',
    sourceUrl: 'https://blush.design/collections/health',
    assetPath: '/illustrations/medical/occupational-therapy.webp',
    usageLocations: ['Features section', 'About page'],
  },
  {
    id: 'consultationScene',
    title: 'Doctor Patient Consultation',
    sourceName: 'Storyset by Freepik',
    author: 'Freepik',
    license: 'Freemium (Attribution Required)',
    sourceUrl: 'https://storyset.com/medical',
    assetPath: '/illustrations/medical/consultation-scene.webp',
    usageLocations: ['Contact page banner', 'Dashboard'],
  },
];

export function getIllustrationById(id: string): Illustration | undefined {
  return illustrations.find((ill) => ill.id === id);
}

export function getIllustrationsBySource(sourceName: string): Illustration[] {
  return illustrations.filter((ill) => ill.sourceName === sourceName);
}
