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
import { partnersAdmin } from '@/services/partners'; // تأكد من المسار الصحيح لخدمات الـ partners

import ROUTES from '@/core/manager/route.manager';
import Image from 'next/image';
import {
  Eye,
  Image as ImageIcon,
  Layers,
  Calendar,
} from 'lucide-react';

// 1. تحديث الـ Interface ليتطابق مع الـ API الخاص بالـ Partners
interface Partner {
  id: number;
  name: string; // هنا عبارة عن string وليس object
  image: string;
  image_url: string;
  status: number;
  created_at: string;
  updated_at: string;
}

interface PartnersResponse {
  current_page: number;
  data: Partner[];
  from: number;
  to: number;
  total: number;
  last_page: number;
}

export default function PartnersPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');

  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState<number | null>(null);
  const [confirmDeleteRow, setConfirmDeleteRow] = useState<Partner | null>(null);

  // جلب بيانات الشركاء
  const { data, isLoading, isFetching, refetch } = useApiGet(
    partnersAdmin.getPartners,
    locale,
    { page }
  );

  // تفعيل وتغيير حالة الشريك
  const { execute: updateStatus } = useApiAction(
    partnersAdmin.statusPartners, // استخدام الدالة الصحيحة من الـ service
    {
      successMsg: tForm('successUpdate') || 'Status updated successfully', 
    }
  );

  // حذف شريك
  const { execute: deletePartner } = useApiAction(
    partnersAdmin.deletePartners,
    {
      successMsg: tForm('successDelete'),
    }
  );

  // استخراج البيانات وتجهيزها للجدول
  const response: PartnersResponse | null = data?.data ?? null; // الـ API يرجع البيانات بداخل كائن data مباشر
  const rows = response?.data ?? [];
  const totalPages = response?.last_page ?? 1;
  const totalItems = response?.total ?? 0;

  // 2. إعداد الأعمدة بما يتناسب مع الشركاء
  const columns: TableColumn<Partner>[] = [
    {
      key: 'name',
      header: t('table.name'),
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
            <Image
              src={row.image_url}
              alt={row.name || "Partner Image"}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="font-medium text-sm">
              {row.name} {/* طباعة الاسم مباشرة لأنه string */}
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
      {/* الـ Stats أو الكروت العلوية */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">
              {t('pages.partners.total') || 'Total Partners'}
            </p>
            <p className="text-2xl font-bold">{totalItems}</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Eye className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">
              {t('table.showingResults', { start: '', end: '', total: '' }).split(' ')}
            </p>
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

      {/* جدول عرض البيانات المشترك */}
      <ReusableTable<Partner>
        title={t('pages.partners.title') || 'Partners'}
        subtitle={t('pages.partners.subtitle') || 'Manage your partners'}
        titleAdd={t('pages.partners.addTitle') || 'Add Partner'}
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
          // تمرير id والحالة كـ boolean للـ API الخاص بك
          const result = await updateStatus(row.id, nextStatus === 1);
          if (result?.success ) {
            refetch();
          }
        }}
        onAddClick={() =>
          router.push(`/${locale}${ROUTES.dashboard.addPartner || '/dashboard/partners/add'}`)
        }
        onEdit={(row) =>
          router.push(`/${locale}${ROUTES.dashboard.partnerEdit?.(row.id) || `/dashboard/partners/edit/${row.id}`}`)
        }
        
        onDelete={(row) => setConfirmDeleteRow(row)}
      />

      {/* المودال الخاص بعرض بيانات الشريك التفصيلية */}
      {viewId && (
        <ViewModal
          onClose={() => setViewId(null)}
          fetchConfig={async () => {
            const res = await partnersAdmin.getonePartners(viewId, locale);
            const partner = res.data.data ?? res.data;

            return {
              title: t('pages.partners.viewTitle') || 'Partner Details',
              avatar: {
                src: partner.image_url,
                fallback: 'P',
              },
              fields: [
                {
                  icon: <ImageIcon className="w-4 h-4" />,
                  label: tForm('name') || 'Name',
                  value: partner.name,
                },
                {
                  icon: <Calendar className="w-4 h-4" />,
                  label: t('table.created'),
                  value: new Date(partner.created_at).toLocaleDateString('en-GB'),
                },
              ],
            };
          }}
        />
      )}

      {/* مودال تأكيد الحذف */}
      {confirmDeleteRow && (
        <ConfirmDelete
          title={t('pages.partners.delete') || 'Delete Partner'}
          description={t('pages.partners.deleteConfirm', { name: confirmDeleteRow.name })}
          onCancel={() => setConfirmDeleteRow(null)}
          onConfirm={async () => {
            await deletePartner(confirmDeleteRow.id);
            setConfirmDeleteRow(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}