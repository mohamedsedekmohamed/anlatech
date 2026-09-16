'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import { adminsAdmin } from '@/services/admins';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import { useState } from 'react';
import { ShieldCheck, TrendingUp, UserCheck, Eye } from 'lucide-react';
import ROUTES from '@/core/manager/route.manager';
import ConfirmDelete from '@/components/shared/ConfirmDelete';
import ViewModal from '@/components/shared/ViewModal';
import { StatCardSkeleton, TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { Mail, Phone, ShieldCheck as ShieldIcon, Calendar, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import StatsCard from '@/components/dashboard/StatsCard';
interface Admin {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  image: string | null;
  role: string;
  phone: string;
  order_count: number;
  order_sum: number;
  created_at: string | null;
  updated_at: string | null;
  image_url: string | null;
  active?: boolean;
}

interface AdminsResponse {
  current_page: number;
  data: Admin[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  next_page_url: string | null;
  path: string | null;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

const fmt = (date: string | null) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

type ActiveFilter = 'all' | 'active' | 'inactive';

export default function AdminsPage() {
  const locale = useLocale();
  const router = useRouter();
  const tForm = useTranslations('admin.form');
  const t = useTranslations('admin');

  const columns: TableColumn<Admin>[] = [
    {
      key: 'name',
      header: t('table.name'),
      render: (_, row) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden relative">
      {row.image_url ? (
        <Image
          src={row.image_url}
          alt={row.name || "Avatar"}
          width={32}  // 32px تعادل w-8
          height={32} // 32px تعادل h-8
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-primary text-xs font-bold">
          {row.name?.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
    <div>
      <p className="font-medium text-foreground truncate max-w-[200px] text-sm">{row.name}</p>
      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{row.email}</p>
    </div>
  </div>
),
    },
    { key: 'phone', header: t('table.phone') },
   
    {
      key: 'active',
      header: t('table.status'),
      render: (val) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          val
            ? 'bg-emerald-50 text-primary ring-1 ring-primary'
            : 'bg-red-50 text-red-600 ring-1 ring-red-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-primary' : 'bg-red-500'}`} />
          {val ? t('table.active') : t('table.inactive')}
        </span>
      ),
    },
    // {
    //   key: 'order_count',
    //   header: t('table.orders'),
    //   render: (val) => <span className="text-foreground font-medium text-sm">{val}</span>,
    // },
    // {
    //   key: 'order_sum',
    //   header: t('table.totalSpent'),
    //   render: (val) => <span className="text-foreground font-medium text-sm">${val}</span>,
    // },
   
  ];

  const [page,         setPage]         = useState(1);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');

  // Build API params — remove active filter from API
  const apiParams: { page: number } = { page };

  const { data, isLoading, isFetching, refetch } = useApiGet(
    adminsAdmin.getAdmins,
    locale,
    apiParams,
  );

  const { execute: deleteAdmin }  = useApiAction(adminsAdmin.deleteAdmin,       { successMsg: tForm('successDelete')  });
  const { execute: toggleStatus } = useApiAction(adminsAdmin.changeAdminStatus, { successMsg: tForm('successDelete') });
  const [confirmDeleteRow,  setConfirmDeleteRow]  = useState<Admin | null>(null);
  const [viewId,            setViewId]            = useState<number | null>(null);
  const [activeMap,         setActiveMap]         = useState<Record<number, boolean>>({});

  const response: AdminsResponse | null = data ?? null;
  const rows: Admin[] = response?.data     ?? [];
  const totalPages    = response?.last_page ?? 1;
  const totalItems    = response?.total     ?? 0;

  const rowsWithActive: Admin[] = rows.map((r) => ({
    ...r,
    active: r.id in activeMap ? activeMap[r.id] : (r.active ?? true),
  }));

  const filteredRows = rowsWithActive;

  // ─── Page skeleton (first load only) ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <TableSkeleton rows={8} cols={7} />
      </div>
    );
  }



  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          title={t('pages.admins.totalAdmins')}
          value={totalItems}
          icon={ShieldCheck}
          iconBgColor="bg-primary/10"
          iconColor="text-primary-600"
        />

        <StatsCard 
          title={t('table.showing')}
          value={`${response?.from ?? 0} - ${response?.to ?? 0}`}
          icon={UserCheck}
          iconBgColor="bg-emerald-50"
          iconColor="text-primary"
        />

        <StatsCard 
          title={t('table.totalPages')}
          value={totalPages}
          icon={TrendingUp}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />
      </div>

      {/* Table — isFetching shows table-level loading overlay */}
      <ReusableTable<Admin>
        title={t('pages.admins.title')}
        subtitle={t('pages.admins.subtitle')}
        titleAdd={t('pages.admins.addTitle')}
        onAddClick={() => router.push(`/${locale}${ROUTES.dashboard.adminAdd}`)}
        onEdit={(row) => router.push(`/${locale}${ROUTES.dashboard.adminEdit(row.id)}`)}
        columns={columns}
        data={filteredRows}
        isLoading={isFetching}
        isServerSide
        serverCurrentPage={page}
        serverTotalPages={totalPages}
        serverTotalItems={totalItems}
        onServerPageChange={setPage}
        hasSearch={false}
        showStatusInActions
        statusKey="active"
        onToggleStatus={async (row) => {
          const newActive = !row.active;
          setActiveMap((prev) => ({ ...prev, [row.id]: newActive }));
          const result = await toggleStatus(row.id, newActive);
          if (!result.success) {
            setActiveMap((prev) => ({ ...prev, [row.id]: row.active ?? true }));
          }
        }}
        onDelete={(row) => setConfirmDeleteRow(row)}
        extraActions={(row) => (
          <button
            onClick={() => setViewId(row.id)}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-[10px] hover:bg-black/5 transition-colors"
            title={t('table.view')}
          >
            <Eye className="w-[16px] h-[16px] text-muted-foreground" strokeWidth={1.33} />
          </button>
        )}
      />

      {/* View Modal */}
      {viewId !== null && (
        <ViewModal
          onClose={() => setViewId(null)}
          fetchConfig={async () => {
            const res = await adminsAdmin.getAdmin(viewId, locale);
            const a   = res.data;
            return {
              title: t('pages.admins.adminDetails'),
              avatar: { src: a.image_url, fallback: a.name?.charAt(0).toUpperCase() ?? '?' },
              subtitle: { label: a.role, badge: true },
              fields: [
                { icon: <Mail    className="w-4 h-4" />, label: t('table.email'),          value: a.email },
                { icon: <Phone   className="w-4 h-4" />, label: t('table.phone'),          value: a.phone },
                { icon: <ShieldIcon className="w-4 h-4" />, label: t('table.emailVerified'),
                  value: a.email_verified_at ? fmt(a.email_verified_at) : t('table.notVerified'),
                  badge: a.email_verified_at ? 'success' : 'danger' },
                { icon: <UserIcon className="w-4 h-4" />, label: t('table.orders'),        value: a.order_count },
                { icon: <UserIcon className="w-4 h-4" />, label: t('table.totalSpent'),   value: a.order_sum },
                { icon: <Calendar className="w-4 h-4" />, label: t('table.created'),       value: fmt(a.created_at) },
                { icon: <Calendar className="w-4 h-4" />, label: t('table.lastUpdated'),  value: fmt(a.updated_at) },
              ],
            };
          }}
        />
      )}

      {/* Delete Confirm */}
      {confirmDeleteRow && (
        <ConfirmDelete
          title={t('pages.admins.deleteAdmin')}
          description={t('pages.admins.deleteConfirm', { name: confirmDeleteRow.name })}
          onConfirm={async () => {
            await deleteAdmin(confirmDeleteRow.id);
            setConfirmDeleteRow(null);
            refetch();
          }}
          onCancel={() => setConfirmDeleteRow(null)}
        />
      )}
    </div>
  );
}
