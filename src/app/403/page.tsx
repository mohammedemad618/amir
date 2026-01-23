import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AccessDeniedPage() {
    return (
        <div className="container section">
            <div className="max-w-2xl mx-auto text-center">
                <div className="glass-panel panel-pad rounded-3xl">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center">
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

                    {/* Content */}
                    <h1 className="heading-2 mb-4">الوصول مرفوض</h1>
                    <p className="body-lg text-ink-600 mb-8">
                        عذرًا، ليس لديك صلاحية للوصول إلى هذه الصفحة.
                        <br />
                        يرجى التواصل مع المسؤول إذا كنت تعتقد أن هذا خطأ.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/dashboard">
                            <Button variant="primary">
                                العودة إلى لوحة التحكم
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline">
                                العودة إلى الصفحة الرئيسية
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
