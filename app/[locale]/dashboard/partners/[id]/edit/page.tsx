'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter, useParams } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { partnersAdmin } from '@/services/partners'; // تأكد من مسار الـ service الصحيح للشركاء
import { useLocale, useTranslations } from 'next-intl';

export default function EditPartnerPage() {
  const router = useRouter();
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  // جلب بيانات الشريك الفردي لملء الاستمارة تلقائياً
  const { data: responseData, isLoading: fetching } = useApiGet(
    partnersAdmin.getonePartners,
    id,
    locale
  );

  const partner = responseData?.data ?? responseData;

  const t = useTranslations('admin.pages.partners'); // استخدام الترجمات الخاصة بالشركاء
  const tForm = useTranslations('admin.form');

  // استدعاء دالة تحديث الشريك
  const { execute: updatePartner } = useApiAction(partnersAdmin.updatePartners, {
    showSuccessToast: true,
    successMsg: tForm('successEdit') || 'Partner updated successfully',
  });

  // الحقول المتوافقة مع الشركاء
  const fields: Field[] = [
    {
      name: 'name',
      label: tForm('name') || 'Name',
      type: 'text',
      required: true,
      requiredMessage: (tForm('name') || 'Name') + ' ' + tForm('required'),
      section: t('tabs.general') || 'General Information',
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'switch',
      defaultValue: 1,
      section: tForm('settings') || 'Settings',
      sectionOrder: 2,
      sidebar: true,
      fullWidth: true,
    },
    {
      name: 'image',
      label: tForm('uploadImage'),
      type: 'file',
      required: false, // غير إلزامي أثناء التعديل
      defaultValue: partner?.image_url ?? '',
      section: t('tabs.media') || 'Media',
      sectionOrder: 1,
      sidebar: true,
      fullWidth: true,
    },
  ];

  // معالجة البيانات وتحويلها إلى FormData عند الحفظ
  const handleSave = async (data: Record<string, any>) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === 'image') {
        if (data[key] instanceof File) {
          formData.append('image', data[key]);
        }
      } else if (key === 'name') {
        formData.append('name', data[key]); // إرسال الاسم كـ string مباشر
      } else if (key === 'status') {
        formData.append('status', data[key] ? '1' : '0');
      } else if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const result = await updatePartner(id, formData);
    
    if (result?.success ) {
      router.back();
    }
  };

  return (
    <AddPage
      title={t('editTitle') || 'Edit Partner'}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isSaving={fetching}
      initialData={
        partner
          ? {
              name: partner.name ?? '', // سحب الاسم المباشر
              status: partner.status ?? 1,
              image: partner.image_url ?? '',
            }
          : undefined
      }
    />
  );
}