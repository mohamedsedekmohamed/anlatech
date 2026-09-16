'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { categoriesAdmin } from '@/services/categories';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';

const getVal = (val: any, key: string): string => {
  if (!val) return '';
  if (Array.isArray(val)) return val[0] ?? '';
  return val[key] ?? val['en'] ?? '';
};

export default function AddCategoryPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin.pages.categories');
  const tForm = useTranslations('admin.form');

  const { execute: addCategory } = useApiAction(categoriesAdmin.addCategory, {
    showSuccessToast: true,
    successMsg: tForm('successAdd'),
  });

  const fields: Field[] = [
    {
      name: 'name_en',
      label: tForm('nameEn'),
      type: 'text',
      required: true,
      section: t('details'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'name_ar',
      label: tForm('nameAr'),
      type: 'text',
      required: true,
      section: t('details'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'instagram',
      label: 'Link (Instagram)',
      type: 'text',
      required: true,
      section: t('details'),
      sectionOrder: 1,
      sidebar: false,
      fullWidth: true,
    },
    {
      name: 'description_en',
      label: tForm('descEn'),
      type: 'textarea',
      required: true,
      section: t('details'),
      sectionOrder: 2,
      sidebar: false,
      fullWidth: true,
    },
    {
      name: 'description_ar',
      label: tForm('descAr'),
      type: 'textarea',
      required: true,
      section: t('details'),
      sectionOrder: 2,
      sidebar: false,
      fullWidth: true,
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
    // --- 1. حقل الصورة الرئيسية (image - Single File) ---
    {
      name: 'image',
      label: tForm('uploadImage') || 'Main Image',
      type: 'custom',
      required: true,
      section: tForm('uploadImage') || 'Media',
      sectionOrder: 2,
      sidebar: true,
      fullWidth: true,
      render: ({ value, onChange }) => {
        const file: File | null = value instanceof File ? value : null;
        return (
          <div className="flex flex-col gap-2">
            <div className="relative border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors flex items-center justify-center bg-background">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onChange(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Upload size={20} />
                <span className="text-xs font-medium">
                  {tForm('uploadImage') || 'Upload Main Image'}
                </span>
              </div>
            </div>
            {file && (
              <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border group">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Main Image Preview"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onChange(null)}
                    className="absolute top-1 right-1 bg-card/80 p-0.5 rounded text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    // --- 2. حقل الصور المتعددة (images - Multiple Files) ---
   // --- 2. حقل الصور المتعددة (images - Maximum 3 Files) ---
    {
      name: 'images',
      label: 'Additional Images (Max 3)',
      type: 'custom',
      section: tForm('uploadImage') || 'Media',
      sectionOrder: 2,
      sidebar: true,
      fullWidth: true,
      render: ({ value, onChange }) => {
        const files: File[] = Array.isArray(value) ? value : [];
        const isMaxReached = files.length >= 3;

        return (
          <div className="flex flex-col gap-2">
            {/* منطقة اختيار الصور - تختفي أو تتعطل لما نوصل لـ 3 صور */}
            {!isMaxReached && (
              <div className="relative border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors flex items-center justify-center bg-background">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files);
                      // دمج الصور القديمة والجديدة وأخذ أول 3 صور فقط كحد أقصى
                      onChange([...files, ...newFiles].slice(0, 3));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload size={20} />
                  <span className="text-xs font-medium">
                    Upload Additional Images ({files.length}/3)
                  </span>
                </div>
              </div>
            )}

            {/* رسالة تنبيه عند الوصول للحد الأقصى */}
            {isMaxReached && (
              <div className="text-xs text-center text-muted-foreground bg-muted/50 py-2 rounded-lg border border-border">
                You have reached the limit of 3 images.
              </div>
            )}

            {/* عرض الصور المختارة */}
            {files.length > 0 && (
              <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border group"
                  >
                    <Image
                      src={URL.createObjectURL(f)}
                      alt={`Preview ${i}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-card/80 p-0.5 rounded text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const handleSave = async (data: Record<string, any>) => {
    const formData = new FormData();

    formData.append('name[en]',        data.name_en        ?? '');
    formData.append('name[ar]',        data.name_ar        ?? '');
    formData.append('description[en]', data.description_en ?? '');
    formData.append('description[ar]', data.description_ar ?? '');
    formData.append('instagram',       data.instagram      ?? '');

    if (data.status !== undefined && data.status !== '') {
      formData.append('status', data.status ? '1' : '0');
    }

    // إرسال الصورة الرئيسية تحت الـ Key: image
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    // إرسال الصور الإضافية تحت الـ Key: images[]
    if (Array.isArray(data.images)) {
      data.images.forEach((file: File) => {
        formData.append('images[]', file);
      });
    }

    const result = await addCategory(formData);
    if (result.success) router.back();
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