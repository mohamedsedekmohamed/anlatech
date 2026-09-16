'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter, useParams } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { categoriesAdmin } from '@/services/categories';
import { subCategoriesAdmin } from '@/services/subCategories';
import { useLocale, useTranslations } from 'next-intl';

const getVal = (val: any, key: string): string => {
  if (!val) return '';
  if (Array.isArray(val)) return val[0] ?? '';
  return val[key] ?? val['en'] ?? '';
};

export default function EditSubCategoryPage() {
  const router = useRouter();
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  const { data: subCategory, isLoading: fetching } = useApiGet(
    subCategoriesAdmin.getSubCategory,
    id
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

  const t = useTranslations('admin.pages.subcategories');
  const tForm = useTranslations('admin.form');

  const { execute: updateSubCategory } = useApiAction(
    subCategoriesAdmin.updateSubCategory,
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
      defaultValue: 1,
      section: tForm('settings') || 'Settings',
      sectionOrder: 1,
      sidebar: true,
      fullWidth: true,
    },
    {
      name: 'image',
      label: tForm('uploadImage'),
      type: 'file',
      required: false,
      defaultValue: subCategory?.image_url ?? '',
      section: tForm('uploadImage'),
      sectionOrder: 2,
      sidebar: true,
      fullWidth: true,
    },
  ];

  const handleSave = async (data: Record<string, any>) => {
    const formData = new FormData();

    if (data.name_en)
      formData.append('name[en]', data.name_en);

    if (data.name_ar)
      formData.append('name[ar]', data.name_ar);

    if (data.description_en)
      formData.append('description[en]', data.description_en);

    if (data.description_ar)
      formData.append('description[ar]', data.description_ar);

    if (data.category_id)
      formData.append('category_id', String(data.category_id));

    formData.append(
      'status',
      data.status ? '1' : '0'
    );

    if (data.image instanceof File)
      formData.append('image', data.image);

    const result = await updateSubCategory(id, formData);

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
        subCategory
          ? {
              name_en: getVal(subCategory.name, 'en'),
              name_ar: getVal(subCategory.name, 'ar'),
              description_en: getVal(subCategory.description, 'en'),
              description_ar: getVal(subCategory.description, 'ar'),
              category_id: subCategory.category_id ?? '',
              image: subCategory.image_url ?? '',
              status: subCategory.status === 1 ? 1 : 0,
            }
          : undefined
      }
    />
  );
}