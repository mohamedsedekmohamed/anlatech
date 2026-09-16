'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApi';
import { partnersAdmin } from '@/services/partners'; // تأكد من مسار الـ service الصحيح
import { useTranslations } from 'next-intl';

export default function AddPartnerPage() {
  const router = useRouter();
  const t = useTranslations('admin.pages.partners'); // تغيير المسار لـ partners
  const tForm = useTranslations('admin.form');

  // استدعاء دالة إضافة شريك من الـ Service
  const { execute: addPartner } = useApiAction(
    partnersAdmin.addPartners,
    {
      showSuccessToast: true,
      successMsg: tForm('successAdd') || 'Partner added successfully',
    }
  );

  // إعداد الحقول المطلوبة بناءً على الـ API الخاص بالشركاء
  const fields: Field[] = [
    {
      name: 'name', // حقل مباشر للشركاء
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
      required: true,
      requiredMessage: tForm('uploadImage') + ' ' + tForm('required'),
      section: t('tabs.media') || 'Media',
      sectionOrder: 1,
      sidebar: true,
      fullWidth: true,
    },
  ];

  // دالة الحفظ وإرسال الـ FormData للـ API
  const handleSave = async (data: Record<string, any>) => {
    const formData = new FormData();

    // إرسال الاسم كـ string مباشر
    formData.append('name', data.name);

    // الـ API يتوقع الحالة إما true/false أو 1/0 (قمت بتحويلها بناءً على الـ switch)
    formData.append('status', data.status ? '1' : '0');

    // إرفاق الصورة كـ Binary
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const result = await addPartner(formData);

    // في حال النجاح يتم العودة للصفحة السابقة (الجدول)
    if (result?.success ) {
      router.back();
    }
  };

  return (
    <AddPage
      title={t('addTitle') || 'Add New Partner'}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}