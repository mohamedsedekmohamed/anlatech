'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { categoriesAdmin } from '@/services/categories';
import { subCategoriesAdmin } from '@/services/subCategories';
import { useLocale, useTranslations } from 'next-intl';

const getVal = (val: any, key: string): string => {
  if (!val) return '';
  if (Array.isArray(val)) return val[0] ?? '';
  return val[key] ?? val['en'] ?? '';
};

export default function AddSubCategoryPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin.pages.subcategories');
  const tForm = useTranslations('admin.form');

  const { execute: addSubCategory } = useApiAction(
    subCategoriesAdmin.addSubCategory,
    {
      showSuccessToast: true,
      successMsg: tForm('successAdd'),
    }
  );

  const { data: categoriesList } = useApiGet(
    categoriesAdmin.getSubCategories,
    locale
  );

  const categoryOptions = Array.isArray(categoriesList)
    ? categoriesList.map((item: any) => ({
        value: item.id,
        label: getVal(item.name, locale === 'ar' ? 'ar' : 'en'),
      }))
    : [];

  const fields: Field[] = [
    {
      name: 'name_en',
      label: tForm('nameEn'),
      type: 'text',
      required: true,
      section: t('details'),
      sectionOrder: 1,
    },
    {
      name: 'name_ar',
      label: tForm('nameAr'),
      type: 'text',
      required: true,
      section: t('details'),
      sectionOrder: 1,
    },
    {
      name: 'description_en',
      label: tForm('descEn'),
      type: 'textarea',
      required: true,
      section: t('details'),
      sectionOrder: 2,
      fullWidth: true,
    },
    {
      name: 'description_ar',
      label: tForm('descAr'),
      type: 'textarea',
      required: true,
      section: t('details'),
      sectionOrder: 2,
      fullWidth: true,
    },
    {
      name: 'category_id',
      label: t('titleAdd'),
      type: 'select',
      required: true,
      options: categoryOptions,
      section: t('details'),
      sectionOrder: 3,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'switch',
      defaultValue: true,
      section: tForm('settings') || 'Settings',
      sectionOrder: 1,
      sidebar: true,
      fullWidth: true,
    },
    {
      name: 'image',
      label: tForm('uploadImage'),
      type: 'file',
      section: tForm('uploadImage'),
      sectionOrder: 2,
      sidebar: true,
      fullWidth: true,
    },
  ];

  const handleSave = async (data: Record<string, any>) => {
    const formData = new FormData();

    formData.append('name[en]', data.name_en ?? '');
    formData.append('name[ar]', data.name_ar ?? '');

    formData.append('description[en]', data.description_en ?? '');
    formData.append('description[ar]', data.description_ar ?? '');

    formData.append('category_id', String(data.category_id));

    formData.append(
      'status',
      data.status ? '1' : '0'
    );

    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const result = await addSubCategory(formData);

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