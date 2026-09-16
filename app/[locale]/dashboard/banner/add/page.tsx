'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApi';
import { bannersAdmin } from '@/services/banner';
import { useTranslations } from 'next-intl';

export default function AddBannerPage() {
  const router = useRouter();
  const t = useTranslations('admin.pages.banners');
  const tForm = useTranslations('admin.form');

  const { execute: addBanner } = useApiAction(
    bannersAdmin.addBanner,
    {
      showSuccessToast: true,
      successMsg: tForm('successAdd'),
    }
  );

  const fields: Field[] = [
    {
      name: 'name.en',
      label: tForm('nameEn'),
      type: 'text',
      required: true,
      requiredMessage: tForm('nameEn') + ' ' + tForm('required'),
      section: t('tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },

    {
      name: 'name.ar',
      label: tForm('nameAr'),
      type: 'text',
      required: true,
      requiredMessage: tForm('nameAr') + ' ' + tForm('required'),
      section: t('tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },

    {
      name: 'description.en',
      label: tForm('descEn'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('descEn') + ' ' + tForm('required'),
      section: t('tabs.general'),
      sectionOrder: 2,
      sidebar: false,
    },

    {
      name: 'description.ar',
      label: tForm('descAr'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('descAr') + ' ' + tForm('required'),
      section: t('tabs.general'),
      sectionOrder: 2,
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
      section: t('tabs.media'),
      sectionOrder: 1,
      sidebar: true,
      fullWidth: true,
    },
  ];

  const handleSave = async (
    data: Record<string, any>
  ) => {
    const formData = new FormData();

    formData.append('name[en]', data['name.en']);
    formData.append('name[ar]', data['name.ar']);

    formData.append(
      'description[en]',
      data['description.en']
    );

    formData.append(
      'description[ar]',
      data['description.ar']
    );

    formData.append(
      'status',
      data.status ? '1' : '0'
    );

    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const result = await addBanner(formData);

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