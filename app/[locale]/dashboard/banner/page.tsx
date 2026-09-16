'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import ReusableTable, {
  TableColumn,
} from '@/components/shared/ReusableTable';

import ConfirmDelete from '@/components/shared/ConfirmDelete';
import ViewModal from '@/components/shared/ViewModal';

import {
  StatCardSkeleton,
  TableSkeleton,
} from '@/components/dashboard/DashboardSkeleton';

import { useApiGet, useApiAction } from '@/hooks/useApi';
import { bannersAdmin } from '@/services/banner';

import ROUTES from '@/core/manager/route.manager';
import Image from 'next/image';
import {
  Eye,
  Image as ImageIcon,
  Layers,
  Calendar,
} from 'lucide-react';

interface Banner {
  id: number;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  image: string;
  image_url: string;
  status: number;
  created_at: string;
  updated_at: string;
}

interface BannersResponse {
  current_page: number;
  data: Banner[];
  from: number;
  to: number;
  total: number;
  last_page: number;
}

export default function Page() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');

  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState<number | null>(null);

  const { data, isLoading, isFetching, refetch } = useApiGet(
    bannersAdmin.getBanners,
    locale,
    { page }
  );

  const { execute: updateStatus } = useApiAction(
    bannersAdmin.updatestatus,
    {
      successMsg: tForm('successDelete'),
    }
  );

  const [confirmDeleteRow, setConfirmDeleteRow] = useState<Banner | null>(null);

  const { execute: deleteBanner } = useApiAction(
    bannersAdmin.deleteBanner,
    {
      successMsg: tForm('successDelete'),
    }
  );

  const response: BannersResponse | null = data ?? null;
  const rows = response?.data ?? [];
  const totalPages = response?.last_page ?? 1;
  const totalItems = response?.total ?? 0;

  const columns: TableColumn<Banner>[] = [
    {
      key: 'name',
      header: t('table.name'),
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
           <Image
      src={row.image_url}
      alt={row.name.en || "Item Image"}
      width={48}   // 48px تعادل w-12
      height={48}  // 48px تعادل h-12
      className="w-full h-full object-cover"
    />
          </div>

          <div>
            <p className="font-medium text-sm">
              {locale === 'ar' ? row.name.ar : row.name.en}
            </p>

            <p className="text-xs text-muted-foreground truncate max-w-[250px]">
              {locale === 'ar' ? row.description.ar : row.description.en}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: 'status',
      header: t('table.status'),
      render: (val) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            val === 1
              ? 'bg-emerald-50 text-primary ring-1 ring-primary'
              : 'bg-red-50 text-red-600 ring-1 ring-red-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              val === 1 ? 'bg-primary' : 'bg-red-500'
            }`}
          />

          {val === 1 ? t('table.active') : t('table.inactive')}
        </span>
      ),
    },

    {
      key: 'created_at',
      header: t('table.created'),
      render: (val) => new Date(val).toLocaleDateString('en-GB'),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        <TableSkeleton rows={8} cols={4} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-primary" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase">
              {t('pages.banners.total')}
            </p>
            <p className="text-2xl font-bold">{totalItems}</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Eye className="w-6 h-6 text-primary" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase">{t('table.showingResults', { start: '', end: '', total: '' }).split(' ')[0]}</p>
            <p className="text-2xl font-bold">
              {response?.from ?? 0} - {response?.to ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Layers className="w-6 h-6 text-primary" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase">
              {t('table.total')}
            </p>
            <p className="text-2xl font-bold">{totalPages}</p>
          </div>
        </div>
      </div>

      <ReusableTable<Banner>
        title={t('pages.banners.title')}
        subtitle={t('pages.banners.subtitle')}
        titleAdd={t('pages.banners.addTitle')}
        columns={columns}
        data={rows}
        isLoading={isFetching}
        hasSearch={false}
        isServerSide
        serverCurrentPage={page}
        serverTotalPages={totalPages}
        serverTotalItems={totalItems}
        onServerPageChange={setPage}
        showStatusInActions
        statusKey="status"
        onToggleStatus={async (row) => {
          const nextStatus = row.status === 1 ? 0 : 1;
          const result = await updateStatus(row.id, nextStatus === 1);
          if (result?.success) {
            refetch();
          }
        }}
        onAddClick={() =>
          router.push(`/${locale}${ROUTES.dashboard.bannerAdd}`)
        }
        onEdit={(row) =>
          router.push(`/${locale}${ROUTES.dashboard.bannerEdit(row.id)}`)
        }
        onDelete={(row) => setConfirmDeleteRow(row)}
      />

      {viewId && (
        <ViewModal
          onClose={() => setViewId(null)}
          fetchConfig={async () => {
            const res = await bannersAdmin.getBanner(viewId, locale);
            const banner = res.data.data ?? res.data;

            return {
              title: t('pages.banners.titleAdd'),
              avatar: {
                src: banner.image_url,
                fallback: 'B',
              },
              fields: [
                {
                  icon: <ImageIcon className="w-4 h-4" />,
                  label: tForm('nameAr'),
                  value: banner.name.ar,
                },
                {
                  icon: <ImageIcon className="w-4 h-4" />,
                  label: tForm('nameEn'),
                  value: banner.name.en,
                },
                {
                  icon: <Calendar className="w-4 h-4" />,
                  label: t('table.created'),
                  value: new Date(banner.created_at).toLocaleDateString(
                    'en-GB'
                  ),
                },
              ],
            };
          }}
        />
      )}

      {confirmDeleteRow && (
        <ConfirmDelete
          title={t('pages.banners.delete')}
          description={t('pages.banners.deleteConfirm', { name: confirmDeleteRow.name?.[locale as 'ar' | 'en'] || confirmDeleteRow.name?.en })}
          onCancel={() => setConfirmDeleteRow(null)}
          onConfirm={async () => {
            await deleteBanner(confirmDeleteRow.id);
            setConfirmDeleteRow(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}