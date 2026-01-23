'use client';

import { RequireRole } from '@/components/auth/RequireRole';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireRole role="ADMIN">
            <div className="flex min-h-screen bg-surface-base">
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
