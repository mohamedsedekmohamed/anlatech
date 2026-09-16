'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import { productsAdmin } from '@/services/products';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import { useState } from 'react';
import { Package, Eye, Calendar, DollarSign, Tag } from 'lucide-react';
import ROUTES from '@/core/manager/route.manager';
import ConfirmDelete from '@/components/shared/ConfirmDelete';
import ViewModal from '@/components/shared/ViewModal';
import { StatCardSkeleton, TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import Image from 'next/image';
import StatsCard from '@/components/dashboard/StatsCard';
interface LocalizedValue { en?: string; ar?: string; [key: string]: string | undefined; }

interface Product {
  id: number;
  name: LocalizedValue | string[];
  description: LocalizedValue | string[];
  category: { id: number; name: string } | null;
  image: string | null;
  image_url: string | null;
  price: string;
  discount: string;
  discount_from: string | null;
  discount_to: string | null;
  final_price: string;
  is_discounted: string;
  status: number;
  created_at: string | null;
  updated_at: string | null;
}

interface ProductsResponse {
  current_page: number;
  data: Product[];
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

const getLocalized = (val: LocalizedValue | string[] | string | null, locale: string): string => {
  if (!val) return '—';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val[0] ?? '—';
  return (val as any)[locale] || (val as any)['en'] || Object.values(val)[0] || '—';
};

const fmt = (date: string | null) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

type StatusFilter = 'all' | 'active' | 'inactive';

export default function ProductsPage() {
  const locale   = useLocale();
  const router   = useRouter();
  const t        = useTranslations('admin');
  const tForm    = useTranslations('admin.form');

  const [page,         setPage]         = useState(1);
  const [confirmRow,   setConfirmRow]   = useState<Product | null>(null);
  const [viewId,       setViewId]       = useState<number | null>(null);
  const [activeMap,    setActiveMap]    = useState<Record<number, boolean>>({});

  const apiParams: { page: number } = { page };

  const { data, isLoading, error, isFetching, refetch } = useApiGet(
    productsAdmin.getProducts,
    locale,
    apiParams,
  );

  const { execute: deleteProduct } = useApiAction(productsAdmin.deleteProduct, { successMsg: tForm('successDelete') });
  const { execute: toggleStatus }  = useApiAction(productsAdmin.changeProductStatus, { successMsg: tForm('successDelete') });

  // Handle both paginated response (fallback) or flat array (new backend behavior)
  const rows: Product[] = Array.isArray(data) ? data.filter(Boolean) : (data?.data ?? []);
  const totalItems      = rows.length;

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
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-border">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden relative">
  {(row.image || row.image_url) ? (
    <Image
      src={(row.image || row.image_url) as string}
      alt="Product"
      width={32}
      height={32}
      className="w-full h-full object-cover"
    />
  ) : (
    <Package className="w-5 h-5 text-primary" strokeWidth={1.5} />
  )}
</div>
          </div>
            <span className="font-medium text-foreground text-sm line-clamp-1">{getLocalized(val as any, locale)}</span>
        
        </div>
      ),
    },
   
    {
      key: 'category',
      header: t('pages.categories.titleAdd'),
      render: (_, row) => (
        <span className="text-muted-foreground text-sm">{row.category?.name || '—'}</span>
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
              ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
              : 'bg-red-50 text-red-600 ring-1 ring-red-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {active ? t('table.active') : t('table.inactive')}
          </span>
        );
      },
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

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {t('table.empty')}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          title={t('pages.products.total')}
          value={totalItems}
          icon={Package}
          iconBgColor="bg-primary/10"
          iconColor="text-primary-600"
        />
        <StatsCard 
          title={t('table.showingResults', { start: '', end: '', total: '' }).split(' ')[0]}
          value={`${totalItems > 0 ? 1 : 0} - ${totalItems}`}
          icon={Package}
          iconBgColor="bg-emerald-50"
          iconColor="text-primary"
        />
        <StatsCard 
          title={t('table.total')}
          value={1}
          icon={Package}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />
      </div>

      {/* Table */}
      <ReusableTable
        title={t('pages.products.title')}
        subtitle={t('pages.products.subtitle')}
        titleAdd={t('pages.products.addTitle')}
        onAddClick={() => router.push(`/${locale}${ROUTES.dashboard.productAdd}`)}
        onEdit={(row) => router.push(`/${locale}${ROUTES.dashboard.productEdit(row.id)}`)}
        columns={columns}
        data={filteredRows}
        isLoading={isFetching}
        isServerSide={true}
        serverTotalPages={(data as any)?.last_page || 1}
        serverTotalItems={(data as any)?.total || filteredRows.length}
        serverCurrentPage={page}
        onServerPageChange={(newPage) => setPage(newPage)}
        hasSearch={false}
        showStatusInActions
        statusKey="active"
        onToggleStatus={async (row) => {
          const newActive = !row.active;
          setActiveMap((prev) => ({ ...prev, [row.id]: newActive }));
          const res = await toggleStatus(row.id, newActive);
          if (!res?.success) {
            setActiveMap((prev) => ({ ...prev, [row.id]: row.active ?? true }));
          }
        }}
        onDelete={(row) => setConfirmRow(row as Product)}
        extraActions={(row) => (
          <button
            onClick={() => setViewId(row.id)}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-[10px] hover:bg-black/5 transition-colors"
            title="View"
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
            const res = await productsAdmin.getProduct(viewId, locale);
            const p   = res.data;
            const nameEn = getLocalized(p.name, 'en');
            const nameAr = getLocalized(p.name, 'ar');
            return {
              title: t('pages.products.titleAdd'),
              avatar: {
                src: p.image_url,
                fallback: nameEn?.charAt(0).toUpperCase() ?? 'P',
              },
              subtitle: {
                label: p.status === 1 ? t('table.active') : t('table.inactive'),
                badge: true,
              },
              fields: [
                { icon: <Tag        className="w-4 h-4" />, label: tForm('nameEn'),        value: nameEn },
                { icon: <Tag        className="w-4 h-4" />, label: tForm('nameAr'),        value: nameAr },
                { icon: <Tag        className="w-4 h-4" />, label: tForm('descEn'),        value: getLocalized(p.description, 'en') },
                { icon: <Tag        className="w-4 h-4" />, label: tForm('descAr'),        value: getLocalized(p.description, 'ar') },
                { icon: <Tag        className="w-4 h-4" />, label: t('pages.categories.titleAdd'),         value: getLocalized(p.category?.name, locale) },
                ...(p.variations?.map((v: any, i: number) => ({
                  icon: <Package className="w-4 h-4" />, 
                  label: `Variation: ${getLocalized(v.name, locale)}`,
                  value: v.options?.map((o: any) => getLocalized(o.name, locale)).join(' | ') || t('table.empty')
                })) || []),
                { icon: <Calendar   className="w-4 h-4" />, label: t('table.created'),       value: fmt(p.created_at) },
                { icon: <Calendar   className="w-4 h-4" />, label: t('table.updated'),       value: fmt(p.updated_at) },
              ],
              gallery: p.gallery || [],
            };
          }}
        />
      )}

      {confirmRow && (
        <ConfirmDelete
          title={t('pages.products.delete')}
          description={t('pages.products.deleteConfirm', { name: getLocalized(confirmRow.name as any, locale) })}
          onConfirm={async () => {
            await deleteProduct(confirmRow.id);
            setConfirmRow(null);
            refetch();
          }}
          onCancel={() => setConfirmRow(null)}
        />
      )}
    </div>
  );
}
