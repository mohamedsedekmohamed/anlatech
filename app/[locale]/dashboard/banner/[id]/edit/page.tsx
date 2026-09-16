'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter, useParams } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { bannersAdmin } from '@/services/banner';
import { useLocale, useTranslations } from 'next-intl';

export default function EditBannerPage() {
  const router = useRouter();
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  const { data: responseData, isLoading: fetching } = useApiGet(
    bannersAdmin.getBanner,
    id,
    locale
  );

  const banner = responseData?.data ?? responseData;

  const t = useTranslations('admin.pages.banners');
  const tForm = useTranslations('admin.form');

  const { execute: updateBanner } = useApiAction(bannersAdmin.updateBanner, {
    showSuccessToast: true,
    successMsg: tForm('successEdit'),
  });

  const fields: Field[] = [
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
    {
      name: 'description_ar',
      label: tForm('descAr'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('descAr') + ' ' + tForm('required'),
      section: t('tabs.general'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'description_en',
      label: tForm('descEn'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('descEn') + ' ' + tForm('required'),
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
      required: false, 
      defaultValue: banner?.image_url ?? '',
      section: t('tabs.media'),
      sectionOrder: 1,
      sidebar: true,
      fullWidth: true,
    },
  ];

  const handleSave = async (data: Record<string, any>) => {
    const formData = new FormData();

    

    Object.keys(data).forEach((key) => {
      if (key === 'image') {
        if (data[key] instanceof File) {
          formData.append('image', data[key]);
        }
      } else if (key === 'name_ar') {
        formData.append('name[ar]', data[key]);
      } else if (key === 'name_en') {
        formData.append('name[en]', data[key]);
      } else if (key === 'description_ar') {
        formData.append('description[ar]', data[key]);
      } else if (key === 'description_en') {
        formData.append('description[en]', data[key]);
      } else if (key === 'status') {
        formData.append('status', data[key] ? '1' : '0');
      } else if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const result = await updateBanner(id, formData);
    
    if (result.success) {
      router.back();
    }
  };

  return (
    <AddPage
      title={t('editTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isSaving={fetching}
      initialData={
        banner
          ? {
              name_ar: banner.name?.ar ?? '',
              name_en: banner.name?.en ?? '',
              description_ar: banner.description?.ar ?? '',
              description_en: banner.description?.en ?? '',
              status: banner.status ?? 1,
              image: banner.image_url ?? '',
            }
          : undefined
      }
    />
  );
}