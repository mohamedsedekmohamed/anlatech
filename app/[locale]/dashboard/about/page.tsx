'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { aboutAdmin } from '@/services/about';
import { useLocale, useTranslations } from 'next-intl';

const getVal = (val: any, key: string): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val[key] ?? val['en'] ?? '';
};

export default function EditAboutPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin.pages.about');
  const tForm = useTranslations('admin.form');

  // GET ABOUT
  const { data: aboutData, isLoading: fetching } = useApiGet(
    aboutAdmin.getAbout
  );

  // UPDATE ABOUT
  const { execute: updateAbout } = useApiAction(
    aboutAdmin.updateOAbout,
    {
      showSuccessToast: true,
      successMsg: tForm('successUpdate'),
    }
  );

  const fields: Field[] = [
    {
      name: 'title_en',
      label: tForm('titleEn'),
      type: 'text',
      required: true,
      requiredMessage: tForm('titleEn') + ' ' + tForm('required'),
      section: t('tabs.general'),
      sectionOrder: 1,
    },
    {
      name: 'title_ar',
      label: tForm('titleAr'),
      type: 'text',
      required: true,
      requiredMessage: tForm('titleAr') + ' ' + tForm('required'),
      section: t('tabs.general'),
      sectionOrder: 1,
    },
    {
      name: 'content_en',
      label: tForm('descEn'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('descEn') + ' ' + tForm('required'),
      section: t('tabs.general'),
      sectionOrder: 1,
      fullWidth: true,
    },
    {
      name: 'content_ar',
      label: tForm('descAr'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('descAr') + ' ' + tForm('required'),
      section: t('tabs.general'),
      sectionOrder: 1,
      fullWidth: true,
    },
    {
      name: 'image',
      label: tForm('uploadImage'),
      type: 'file',
      section: t('tabs.media'),
      sectionOrder: 2,
      fullWidth: true,
    },
  ];

  const handleSave = async (data: Record<string, any>) => {
    const formData = new FormData();

    formData.append('title[en]', data.title_en || '');
    formData.append('title[ar]', data.title_ar || '');
    formData.append('content[en]', data.content_en || '');
    formData.append('content[ar]', data.content_ar || '');

    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const result = await updateAbout(formData);

    if (result.success) {
      
    }
  };

  return (
    <AddPage
      title={t('title')}
      showCancel={false}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isEdit
      isSaving={fetching}
      initialData={
        aboutData
          ? {
              title_en: getVal(aboutData.title, 'en'),
              title_ar: getVal(aboutData.title, 'ar'),
              content_en: getVal(aboutData.content, 'en'),
              content_ar: getVal(aboutData.content, 'ar'),
              image: aboutData.image_url, // 👈 مهم عشان preview في AddPage لو بيدعمه
            }
          : undefined
      }
    />
  );
}