'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ReusableTable, {
  TableColumn,
} from '@/components/shared/ReusableTable';

import ConfirmDelete from '@/components/shared/ConfirmDelete';
import ViewModal from '@/components/shared/ViewModal';

import {
  StatCardSkeleton,
  TableSkeleton,
} from '@/components/dashboard/DashboardSkeleton';

import {
  Eye,
  LayoutGrid,
  TrendingUp,
  FolderTree,
  Calendar,
} from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';

import { subCategoriesAdmin } from '@/services/subCategories';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import ROUTES from '@/core/manager/route.manager';
import Image from 'next/image';
const fmt = (date: string | null) => {
  if (!date) return '—';

  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
interface SubCategory {
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
  category_id: number;
  status: number;
  created_at: string;
  updated_at: string;

  parent_category: {
    id: number;
    name: {
      ar: string;
      en: string;
    };
  };
}

interface SubCategoriesResponse {
  current_page: number;
  data: SubCategory[];
  from: number;
  to: number;
  last_page: number;
  total: number;
}
export default function SubCategoriesPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');

  const columns: TableColumn<SubCategory>[] = [
    {
      key: 'name',
      header: t('table.name'),
      render: (_, row) => (
      <div className="flex items-center gap-3">
  {/* أضفنا relative عشان الـ Image (fill أو الأبعاد الثابتة) يلتزم بالـ rounded-lg */}
  <div className="w-10 h-10 rounded-lg overflow-hidden border relative shrink-0">
    <Image
      src={row.image_url}
      alt={row.name[locale as 'ar' | 'en'] || row.name.en || "Item Image"}
      width={40}  // 40px تعادل w-10
      height={40} // 40px تعادل h-10
      className="w-full h-full object-cover"
    />
  </div>

  <div>
    <p className="font-medium text-sm">{row.name[locale as 'ar' | 'en'] || row.name.en}</p>
  </div>
</div>
      ),
    },

    {
      key: 'category_id',
      header: t('pages.categories.titleAdd'),
      render: (_, row) => (
        <span className="text-sm">{row.parent_category?.name?.[locale as 'ar' | 'en'] || row.parent_category?.name?.en}</span>
      ),
    },

    {
      key: 'description',
      header: t('table.description'),
      render: (_, row) => (
        <span className="line-clamp-1 text-sm text-muted-foreground">
          {row.description?.[locale as 'ar' | 'en'] || row.description?.en}
        </span>
      ),
    },

    {
      key: 'status',
      header: t('table.status'),
      render: (value) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            value === 1
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-red-50 text-red-600'
          }`}
        >
          {value === 1 ? t('table.active') : t('table.inactive')}
        </span>
      ),
    },
  ];


  const [page, setPage] = useState(1);

  const [viewId, setViewId] = useState<number | null>(null);

  const [confirmDeleteRow, setConfirmDeleteRow] =
    useState<SubCategory | null>(null);

  const { data, isLoading, isFetching, refetch } =
    useApiGet(
      subCategoriesAdmin.getSubCategories,
      locale,
      { page }
    );

  const { execute: deleteSubCategory } =
    useApiAction(
      subCategoriesAdmin.deleteSubCategory,
      {
        successMsg: tForm('successDelete'),
      }
    );

  const { execute: toggleStatus } =
    useApiAction(
      subCategoriesAdmin.changeSubCategoryStatus,
      {
        successMsg: tForm('successDelete'),
      }
    );

  const response: SubCategoriesResponse | null =
    data ?? null;

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

        <TableSkeleton rows={8} cols={5} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          title={t('pages.subcategories.total')}
          value={totalItems}
          icon={LayoutGrid}
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
        />

        <StatsCard 
          title={t('table.showingResults', { start: '', end: '', total: '' }).split(' ')[0]}
          value={`${response?.from ?? 0} - ${response?.to ?? 0}`}
          icon={FolderTree}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />

        <StatsCard 
          title={t('table.total')}
          value={totalPages}
          icon={TrendingUp}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />
      </div>

      <ReusableTable<SubCategory>
        title={t('pages.subcategories.title')}
        subtitle={t('pages.subcategories.subtitle')}
        titleAdd={t('pages.subcategories.addTitle')}
        columns={columns}
        data={rows}
        isLoading={isFetching}
        isServerSide
        serverCurrentPage={page}
        serverTotalPages={totalPages}
        serverTotalItems={totalItems}
        onServerPageChange={setPage}
        hasSearch={false}
        showStatusInActions
        statusKey="status"
        onAddClick={() =>
          router.push(
            `/${locale}${ROUTES.dashboard.subcategoryAdd}`
          )
        }
        onEdit={(row) =>
          router.push(
            `/${locale}${ROUTES.dashboard.subcategoryEdit(row.id)}`
          )
        }
        onToggleStatus={async (row) => {
          await toggleStatus(
            row.id,
            row.status !== 1
          );

          refetch();
        }}
        onDelete={(row) =>
          setConfirmDeleteRow(row)
        }
        extraActions={(row) => (
          <button
            onClick={() => setViewId(row.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      />

      {viewId && (
        <ViewModal
          onClose={() => setViewId(null)}
          fetchConfig={async () => {
            const res =
              await subCategoriesAdmin.getSubCategory(
                viewId
              );

            const item = res.data;

            return {
              title: item.name[locale as 'ar' | 'en'] || item.name.en,

              avatar: {
                src: item.image_url,
                fallback:
                  item.name.en?.charAt(0),
              },

              fields: [
                {
                  label: tForm('nameAr'),
                  value: item.name.ar,
                },

                {
                  label: tForm('nameEn'),
                  value: item.name.en,
                },

                {
                  label: t('pages.categories.titleAdd'),
                  value:
                    item.parent_category?.name
                      ?.en,
                },

                {
                  label: tForm('descEn'),
                  value:
                    item.description?.en,
                },

                {
                  icon: (
                    <Calendar className="w-4 h-4" />
                  ),
                  label: t('table.created'),
                  value: fmt(
                    item.created_at
                  ),
                },
              ],
            };
          }}
        />
      )}

      {confirmDeleteRow && (
        <ConfirmDelete
          title={t('pages.subcategories.delete')}
          description={t('pages.subcategories.deleteConfirm', { name: confirmDeleteRow.name[locale as 'ar' | 'en'] || confirmDeleteRow.name.en })}
          onConfirm={async () => {
            await deleteSubCategory(
              confirmDeleteRow.id
            );

            setConfirmDeleteRow(null);

            refetch();
          }}
          onCancel={() =>
            setConfirmDeleteRow(null)
          }
        />
      )}
    </div>
  );
}