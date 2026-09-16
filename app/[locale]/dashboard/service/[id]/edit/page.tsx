'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter, useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { servicesAdmin } from '@/services/service'; // عدّل المسار لو مختلف

export default function EditServicePage() {
  const router = useRouter();
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  // Fetch service
  const { data: service, isLoading: fetching } = useApiGet(
    servicesAdmin.getService,
    id
  );

  const t = useTranslations('admin.pages.services');
  const tForm = useTranslations('admin.form');

  const { execute: updateService } = useApiAction(
    servicesAdmin.updateService,
    {
      showSuccessToast: true,
      successMsg: tForm('successEdit'),
    }
  );

  const fields: Field[] = [
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
    {
      name: 'icon',
      label: tForm('uploadImage'),
      type: 'file',
      required: false,
      section: t('tabs.media'),
      sectionOrder: 3,
      sidebar: true,
      fullWidth: true,
      defaultValue: service?.icon_url ?? '',
    },
  ];

  const handleSave = async (data: Record<string, any>) => {
    const formData = new FormData();

    // map nested structure
    formData.append('name[en]', data.name_en);
    formData.append('name[ar]', data.name_ar);
    formData.append('description[en]', data.description_en);
    formData.append('description[ar]', data.description_ar);

    if (data.icon instanceof File) {
      formData.append('icon', data.icon);
    }

    const result = await updateService(id, formData);

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
        service
          ? {
              name_en: service.name?.en ?? '',
              name_ar: service.name?.ar ?? '',
              description_en: service.description?.en ?? '',
              description_ar: service.description?.ar ?? '',
              icon: service.icon_url ?? '',
            }
          : undefined
      }
    />
  );
}