import Sidebar from '@/components/dashboard/Sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ 
  children,
  params
}: { 
  children: React.ReactNode,
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <Sidebar />
      <main className="flex-1 overflow-auto w-full pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
