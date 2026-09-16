'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye } from 'lucide-react';

import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import ViewModal from '@/components/shared/ViewModal';
import ConfirmDelete from '@/components/shared/ConfirmDelete';
import { StatCardSkeleton, TableSkeleton } from '@/components/dashboard/DashboardSkeleton';

import { useApiGet, useApiAction } from '@/hooks/useApi';
import { servicesAdmin } from '@/services/service'; // أو غيّرها لمسارها الصحيح
import ROUTES from '@/core/manager/route.manager';

import { Image as ImageIcon, Package, Layers } from 'lucide-react';
import Image from 'next/image';
interface Service {
  id: number;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  icon: string | null;
  icon_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface ServicesResponse {
  current_page: number;
  data: Service[];
  last_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

const fmt = (date: string | null) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function ServicesPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');

  const columns: TableColumn<Service>[] = [
  {
    key: 'name',
    header: t('table.name'),
    render: (_, row) => (
      <div className="flex items-center gap-3">
       <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 relative">
  {row.icon_url ? (
    <Image
      src={row.icon_url}
      alt="Icon"
      width={40}  // 40px تعادل w-10
      height={40} // 40px تعادل h-10
      className="w-full h-full object-cover"
    />
  ) : (
    <ImageIcon className="w-5 h-5 text-primary" />
  )}
</div>

        <div>
          <p className="font-medium text-sm text-foreground">
            {row.name?.[locale as 'ar' | 'en'] || row.name?.en}
          </p>
        </div>
      </div>
    ),
  },

  {
    key: 'description',
    header: t('table.desc'),
    render: (_, row) => (
      <p className="text-xs text-muted-foreground max-w-[320px] truncate">
        {row.description?.[locale as 'ar' | 'en'] || row.description?.en}
      </p>
    ),
  },

  {
    key: 'created_at',
    header: t('table.created'),
    render: (val) => (
      <span className="text-sm text-foreground font-medium">
        {fmt(val)}
      </span>
    ),
  },


  ];

  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);


  const { data, isLoading, isFetching, refetch } = useApiGet(
    servicesAdmin.getServices
  );

  const { execute: deleteService } = useApiAction(
    servicesAdmin.deleteService,
    { successMsg: tForm('successDelete') }
  );

  const response: ServicesResponse | null = data ?? null;
  const rows = response?.data ?? [];
  const totalPages = response?.last_page ?? 1;
  const totalItems = response?.total ?? 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <TableSkeleton rows={6} cols={5} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-5 border flex gap-4 items-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">{t('pages.services.total')}</p>
            <p className="text-2xl font-bold">{totalItems}</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border flex gap-4 items-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Layers className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">{t('table.showingResults', { start: '', end: '', total: '' }).split(' ')[0]}</p>
            <p className="text-2xl font-bold">
              {response?.from ?? 0} – {response?.to ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border flex gap-4 items-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Layers className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">{t('table.total')}</p>
            <p className="text-2xl font-bold">{totalPages}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <ReusableTable<Service>
        title={t('pages.services.title')}
        subtitle={t('pages.services.subtitle')}
        titleAdd={t('pages.services.addTitle')}
        onAddClick={() =>
          router.push(`/${locale}${ROUTES.dashboard.addservice}`)
        }
        onEdit={(row) =>
          router.push(`/${locale}${ROUTES.dashboard.serviceEdit(row.id)}`)
        }
        columns={columns}
        data={rows}
        isLoading={isFetching}
        isServerSide
        serverCurrentPage={page}
        serverTotalPages={totalPages}
        serverTotalItems={totalItems}
        onServerPageChange={setPage}
        hasSearch={false}
        onDelete={(row) => setConfirmDelete(row)}
        extraActions={(row) => (
          <button
            onClick={() => setViewId(row.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5"
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      />

      {/* View Modal */}
      {viewId !== null && (
        <ViewModal
          onClose={() => setViewId(null)}
          fetchConfig={async () => {
            const res = await servicesAdmin.getService(viewId);
            const s = res.data;

            return {
              title: t('pages.services.titleAdd'),
              avatar: {
                src: s.icon_url,
                fallback: s.name?.en?.charAt(0) ?? '?',
              },
              subtitle: {
                label: s.name?.en,
                badge: true,
              },
              fields: [
                { label: tForm('nameEn'), value: s.name?.en },
                { label: tForm('nameAr'), value: s.name?.ar },
                { label: tForm('descEn'), value: s.description?.en },
                { label: tForm('descAr'), value: s.description?.ar },
                { label: t('table.created'), value: fmt(s.created_at) },
                { label: t('table.updated'), value: fmt(s.updated_at) },
              ],
            };
          }}
        />
      )}

      {/* Delete */}
      {confirmDelete && (
        <ConfirmDelete
          title={t('pages.services.delete')}
          description={t('pages.services.deleteConfirm', { name: confirmDelete.name?.[locale as 'ar' | 'en'] || confirmDelete.name?.en })}
          onConfirm={async () => {
            await deleteService(confirmDelete.id);
            setConfirmDelete(null);
            refetch();
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}