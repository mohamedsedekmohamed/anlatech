'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import { categoriesAdmin } from '@/services/categories';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import { useState } from 'react';
import { Tag, Eye } from 'lucide-react';
import ROUTES from '@/core/manager/route.manager';
import ConfirmDelete from '@/components/shared/ConfirmDelete';
import ViewModal from '@/components/shared/ViewModal';
import { StatCardSkeleton, TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { Tag as TagIcon, Calendar } from 'lucide-react';
import Image from 'next/image';
import StatsCard from '@/components/dashboard/StatsCard';
interface LocalizedValue { en?: string; ar?: string; [key: string]: string | undefined; }

interface Category {
  id: number;
  name: LocalizedValue | string[];
  description: LocalizedValue | string[];
  image: string | null;
  image_url: string | null;
  category_id: number | null;
  status: number;
  created_at: string | null;
  updated_at: string | null;
}

interface CategoriesResponse {
  current_page: number;
  data: Category[];
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

// name/description can be array or object from API
const getLocalized = (val: LocalizedValue | string[] | null, locale: string): string => {
  if (!val) return '—';
  if (Array.isArray(val)) return val[0] ?? '—';
  return (val as any)[locale] || (val as any)['en'] || Object.values(val)[0] || '—';
};

const fmt = (date: string | null) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

type StatusFilter = 'all' | 'active' | 'inactive';

export default function CategoriesPage() {
  const locale   = useLocale();
  const router   = useRouter();
  const t        = useTranslations('admin');
  const tForm    = useTranslations('admin.form');

  const [page,         setPage]         = useState(1);
  const [confirmRow,   setConfirmRow]   = useState<Category | null>(null);
  const [viewId,       setViewId]       = useState<number | null>(null);
  const [activeMap,    setActiveMap]    = useState<Record<number, boolean>>({});

  const apiParams: { page: number } = { page };

  const { data, isLoading, isFetching, refetch } = useApiGet(
    categoriesAdmin.getCategories,
    locale,
    apiParams,
  );

  const { execute: deleteCategory } = useApiAction(categoriesAdmin.deleteCategory, { successMsg: tForm('successDelete') });
  const { execute: toggleStatus }   = useApiAction(categoriesAdmin.changeCategoryStatus, { successMsg: tForm('successDelete') });

  const response = data as CategoriesResponse | null;
  const rows: Category[] = Array.isArray(data) ? data.filter(Boolean) : (data?.data ?? []);
  const totalPages       = response?.last_page ?? 1;
  const totalItems       = response?.total     ?? rows.length;

  const rowsWithActive = rows.map((r) => ({
    ...r,
    active: r.id in activeMap ? activeMap[r.id] : r.status === 1,
  }));

  const filteredRows = rowsWithActive;

  const columns: TableColumn<typeof rowsWithActive[0]>[] = [
    {
      key: 'name',
      header: t('table.name'),
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
          {row.image_url ? (
    <Image
      src={row.image_url}
      alt="Category Icon"
      width={32}  // 32px تعادل w-8
      height={32} // 32px تعادل h-8
      className="w-full h-full object-cover"
    />
  ) : (
    <Tag className="w-4 h-4 text-primary" strokeWidth={1.75} />
  )}
          </div>
          <span className="font-medium text-foreground text-sm">{getLocalized(val as any, locale)}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: t('table.description'),
      render: (val) => (
        <span className="text-muted-foreground text-sm line-clamp-1">{getLocalized(val as any, locale)}</span>
      ),
    },
    {
      key: 'status',
      header: t('table.status'),
      render: (_, row) => {
        const active = row.active;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            active
              ? 'bg-emerald-50 text-primary ring-1 ring-primary'
              : 'bg-red-50 text-red-600 ring-1 ring-red-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-primary' : 'bg-red-500'}`} />
            {active ? t('table.active') : t('table.inactive')}
          </span>
        );
      },
    },
    // {
    //   key: 'category_id',
    //   header: 'Parent',
    //   render: (val, row: any) => {
    //     if (!val) return <span className="text-muted-foreground text-sm">—</span>;
        
    //     // Try to get name from API relationships if they exist
    //     const parentNameFromApi = row.parent?.name || row.category?.name;
    //     if (parentNameFromApi) {
    //        return <span className="text-primary font-medium text-sm text-center bg-primary/10 px-2 py-1 rounded-md">{getLocalized(parentNameFromApi, locale)}</span>;
    //     }

    //     // Try to find it in the current page rows
    //     const parentInRows = rows.find(c => c.id === val);
    //     if (parentInRows) {
    //        return <span className="text-primary font-medium text-sm text-center bg-primary/10 px-2 py-1 rounded-md">{getLocalized(parentInRows.name as any, locale)}</span>;
    //     }
        
    //     // Fallback to ID if not found
    //     return <span className="text-muted-foreground text-sm font-medium">#{val}</span>;
    //   },
    // },
    {
      key: 'created_at',
      header: t('table.created'),
      render: (val) => <span className="text-muted-foreground text-sm">{fmt(val as string)}</span>,
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
        </div>
        <TableSkeleton rows={8} cols={4} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          title={t('pages.categories.total')}
          value={totalItems}
          icon={Tag}
          iconBgColor="bg-primary/10"
          iconColor="text-primary-600"
        />
        <StatsCard 
          title={t('table.showingResults', { start: '', end: '', total: '' }).split(' ')[0]}
          value={`${response?.from ?? 0} - ${response?.to ?? 0}`}
          icon={Tag}
          iconBgColor="bg-emerald-50"
          iconColor="text-primary"
        />
        <StatsCard 
          title={t('table.total')}
          value={totalPages}
          icon={Tag}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />
      </div>

      {/* Table */}
      <ReusableTable
        title={t('pages.categories.title')}
        subtitle={t('pages.categories.subtitle')}
        titleAdd={t('pages.categories.addTitle')}
        onAddClick={() => router.push(`/${locale}${ROUTES.dashboard.categoryAdd}`)}
        onEdit={(row) => router.push(`/${locale}${ROUTES.dashboard.categoryEdit(row.id)}`)}
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
        onDelete={(row) => setConfirmRow(row as Category)}
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
            const res = await categoriesAdmin.getCategory(viewId, locale);
            const c   = res.data;
            const nameEn = getLocalized(c.name, 'en');
            const nameAr = getLocalized(c.name, 'ar');
            const descEn = getLocalized(c.description, 'en');
            const descAr = getLocalized(c.description, 'ar');
            return {
              title: t('pages.categories.details'),
              avatar: {
                src: c.image_url,
                fallback: nameEn?.charAt(0).toUpperCase() ?? '?',
              },
              subtitle: {
                label: c.status === 1 ? t('table.active') : t('table.inactive'),
                badge: true,
              },
              fields: [
                { icon: <TagIcon    className="w-4 h-4" />, label: tForm('nameEn'),        value: nameEn },
                { icon: <TagIcon    className="w-4 h-4" />, label: tForm('nameAr'),        value: nameAr },
                { icon: <TagIcon    className="w-4 h-4" />, label: tForm('descEn'), value: descEn },
                { icon: <TagIcon    className="w-4 h-4" />, label: tForm('descAr'), value: descAr },
                // { icon: <TagIcon    className="w-4 h-4" />, label: 'Parent ID',        value: c.category_id ?? '—' },
                { icon: <Calendar   className="w-4 h-4" />, label: t('table.created'), value: fmt(c.created_at) },
                { icon: <Calendar   className="w-4 h-4" />, label: t('table.lastUpdated'), value: fmt(c.updated_at) },
              ],
            };
          }}
        />
      )}

      {confirmRow && (
        <ConfirmDelete
          title={t('pages.categories.delete')}
          description={t('pages.categories.deleteConfirm', { name: getLocalized(confirmRow.name as any, locale) })}
          onConfirm={async () => {
            await deleteCategory(confirmRow.id);
            setConfirmRow(null);
            refetch();
          }}
          onCancel={() => setConfirmRow(null)}
        />
      )}
    </div>
  );
}
