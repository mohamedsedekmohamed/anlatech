'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApi';
import { servicesAdmin } from '@/services/service';
import { useTranslations } from 'next-intl';

export default function AddServicePage() {
  const router = useRouter();
  const t = useTranslations('admin.pages.services');
  const tForm = useTranslations('admin.form');

  const { execute: addService } = useApiAction(
    servicesAdmin.addService,
    {
      showSuccessToast: true,
      successMsg: tForm('successAdd'),
    }
  );

  const fields: Field[] = [
    // ───── Name EN ─────
    {
      name: 'name_en',
      label: tForm('nameEn'),
      type: 'text',
      required: true,
      requiredMessage: tForm('nameEn') + ' ' + tForm('required'),
      section: t('tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },

    // ───── Name AR ─────
    {
      name: 'name_ar',
      label: tForm('nameAr'),
      type: 'text',
      required: true,
      requiredMessage: tForm('nameAr') + ' ' + tForm('required'),
      section: t('tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },

    // ───── Description EN ─────
    {
      name: 'description_en',
      label: tForm('descEn'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('descEn') + ' ' + tForm('required'),
      section: t('tabs.general'),
      sectionOrder: 2,
      sidebar: false,
      fullWidth: true,
    },

    // ───── Description AR ─────
    {
      name: 'description_ar',
      label: tForm('descAr'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('descAr') + ' ' + tForm('required'),
      section: t('tabs.general'),
      sectionOrder: 2,
      sidebar: false,
      fullWidth: true,
    },

    // ───── Icon ─────
    {
      name: 'icon',
      label: tForm('uploadImage'),
      type: 'file',
      required: true,
      requiredMessage: tForm('uploadImage') + ' ' + tForm('required'),
      section: t('tabs.media'),
      sectionOrder: 3,
      sidebar: true,
      fullWidth: true,
    },
  ];

  const handleSave = async (data: Record<string, any>) => {
    const formData = new FormData();

    // build nested API structure
    formData.append('name[en]', data.name_en);
    formData.append('name[ar]', data.name_ar);
    formData.append('description[en]', data.description_en);
    formData.append('description[ar]', data.description_ar);

    if (data.icon instanceof File) {
      formData.append('icon', data.icon);
    }

    const result = await addService(formData);

    if (result.success) {
      router.back();
    }
  };

  return (
    <AddPage
      title={t('addTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}