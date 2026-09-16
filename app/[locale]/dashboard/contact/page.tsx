'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useApiGet } from '@/hooks/useApi';
import { contactAdmin } from '@/services/contact';
import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import { StatCardSkeleton, TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { Mail, Clock } from 'lucide-react';

interface Contact {
  id: number;
  f_name: string;
  l_name: string;
  phone: string;
  email: string;
  title: string;
  content: string;
  status: number;
  created_at: string;
}

type TabType = 'messages' | 'history';

export default function ContactPage() {
  const [tab, setTab] = useState<TabType>('messages');
  const [page, setPage] = useState(1);
  const [localRows, setLocalRows] = useState<Contact[]>([]);
  const t = useTranslations('admin.pages.contact');
  const tForm = useTranslations('admin.form');
  const tGlobal = useTranslations('admin');

  const apiCall =
    tab === 'messages'
      ? contactAdmin.getContact
      : contactAdmin.gethistory;

  const { data, isLoading, isFetching, refetch } = useApiGet(
    apiCall,
    
  );

  // ✅ correct API parsing
  const response = data?.data ?? data ?? null;
  const rows: Contact[] = response?.data ?? [];
  const totalPages = response?.last_page ?? 1;
  const totalItems = response?.total ?? 0;

  // sync API -> local state
  useEffect(() => {
    setLocalRows(response?.data ?? []);
  }, [response?.data]);

  const columns: TableColumn<Contact>[] = [
    {
      key: 'f_name',
      header: tForm('nameEn').replace(' (English)', '').replace(' (EN)', '').replace(' (انجليزي)', '').replace(' (Ar)', ''),
      render: (_, row) => (
        <div className="flex flex-col">
          <p className="font-medium text-sm text-foreground">
            {row.f_name} {row.l_name}
          </p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: t('phone'),
    },
    {
      key: 'title',
      header: t('title'),
      render: (val) => (
        <p className="text-sm text-foreground max-w-[200px] truncate">
          {val}
        </p>
      ),
    },
    {
      key: 'content',
      header: t('message')
      
      
    },
    {
      key: 'status',
      header: tGlobal('table.status'),
      render: (val) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            val === 1
              ? 'bg-emerald-50 text-primary'
              : 'bg-red-50 text-red-600'
          }`}
        >
          {val === 1 ? t('read') : t('unread')}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: tGlobal('table.created'),
      render: (val) =>
        new Date(val).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <TableSkeleton rows={8} cols={4} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => {
            setTab('messages');
            setPage(1);
          }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            tab === 'messages'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
          }`}
        >
          <Mail className="inline w-4 h-4 mr-1 ml-1" />
          {t('tabs.messages')}
        </button>

        <button
          onClick={() => {
            setTab('history');
            setPage(1);
          }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            tab === 'history'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
          }`}
        >
          <Clock className="inline w-4 h-4 mr-1 ml-1" />
          {t('tabs.history')}
        </button>
      </div>

      {/* Table */}
      <ReusableTable<Contact>
        title={tab === 'messages' ? t('tabs.messages') : t('tabs.history')}
        subtitle={t('subtitle')}
        columns={columns}
        data={localRows}
        isLoading={isFetching}
        isServerSide
        serverCurrentPage={page}
        serverTotalPages={totalPages}
        serverTotalItems={totalItems}
        onServerPageChange={setPage}
        hasSearch={false}
        extraActions={(row) =>
  row.status === 0 ? (
    <button
      onClick={async () => {
        await contactAdmin.getread(row.id);
        refetch();
      }}
      className="w-[32px] h-[32px] flex items-center justify-center rounded-[10px] hover:bg-black/5 transition-colors"
      title={t('markAsRead')}
    >
      <Mail className="w-[16px] h-[16px] text-muted-foreground" />
    </button>
  ) : null
}
      />
    </div>
  );
}