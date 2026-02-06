import Link from 'next/link';
import { Button, DecorativeCircles, DotPattern } from '@/components/ui';

export default function AccessDeniedPage() {
    return (
        <div className="container section">
            <div className="max-w-2xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-hero-glow border border-accent-sun/25 shadow-soft panel-pad text-center lux-aurora lux-aurora-lite">
                    <DecorativeCircles className="opacity-30" />
                    <DotPattern className="opacity-10" />

                    <div className="relative">
                        <div className="mb-6 flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-error/10 border border-error/20 flex items-center justify-center shadow-soft">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-12 h-12 text-error"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="heading-2 mb-4">الوصول مرفوض</h1>
                        <p className="body-lg text-ink-600 mb-8">
                            عذرًا، لا تملك الصلاحية لعرض هذه الصفحة.
                            <br />
                            يرجى التواصل مع المسؤول إذا كنت تعتقد أن هذا خطأ.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/dashboard">
                                <Button variant="primary">العودة إلى لوحة التحكم</Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline">العودة إلى الصفحة الرئيسية</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
