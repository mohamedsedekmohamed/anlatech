'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApi';
import { adminsAdmin } from '@/services/admins';
import { useTranslations } from 'next-intl';

export default function AddAdminPage() {
  const router = useRouter();
  const t = useTranslations('admin');

  const { execute: addAdmin } = useApiAction(adminsAdmin.addAdmin, {
    showSuccessToast: true,
    successMsg: t('form.addAdminSuccess'),
  });

  const fields: Field[] = [
    {
      name: 'name',
      label: t('table.name'),
      type: 'text',
      required: true,
      requiredMessage: t('form.nameRequired'),
      section: t('form.personalInfo'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'email',
      label: t('table.email'),
      type: 'email',
      required: true,
      requiredMessage: t('form.emailRequired'),
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
      patternMessage: t('form.invalidEmail'),
      section: t('form.accountInfo'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'phone',
      label: t('table.phone'),
      type: 'text',
      required: true,
      requiredMessage: t('form.phoneRequired'),
      pattern: /^[0-9]{7,15}$/, 
      patternMessage: t('form.invalidPhone'),
      section: t('form.accountInfo'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'password',
      label: t('form.password'),
      type: 'password',
      required: true,
      requiredMessage: t('form.passwordRequired'),
      pattern: /^.{8,}$/, 
      patternMessage: t('form.passwordLength'),
      section: t('form.accountInfo'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'image',
      label: t('form.image'),
      type: 'file',
      required: false,
      section: t('form.profileImage'),
      sectionOrder: 1,
      sidebar: true,
      fullWidth: true,
    },
  ];

  const handleSave = async (data: Record<string, any>) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'image' && data[key] instanceof File) {
        formData.append('image', data[key]);
      } else if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const result = await addAdmin(formData);
    if (result.success) {
      router.back();
    }
  };

  return (
    <AddPage
      title={t('pages.admins.addTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}
