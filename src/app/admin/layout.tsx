'use client';

import { RequireRole } from '@/features/auth';
import { AdminSidebar } from '@/features/admin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireRole role="ADMIN">
            <div className="flex min-h-screen bg-surface-muted">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </RequireRole>
    );
}
