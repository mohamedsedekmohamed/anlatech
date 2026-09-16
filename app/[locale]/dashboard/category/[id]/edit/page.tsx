'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter, useParams } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { categoriesAdmin } from '@/services/categories';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import Image from 'next/image';

const getVal = (val: any, key: string): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val[0] ?? '';
  return val[key] ?? val['en'] ?? '';
};

export default function EditCategoryPage() {
  const router = useRouter();
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  const t = useTranslations('admin.pages.categories');
  const tForm = useTranslations('admin.form');

  const [initialData, setInitialData] = useState<any>(null);
  const [existingGallery, setExistingGallery] = useState<any[]>([]);
  const [galleryDeleteIds, setGalleryDeleteIds] = useState<number[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Fetch category data
  const { data: category, isLoading: fetching } = useApiGet(
    categoriesAdmin.getCategory,
    id,
    locale,
  );

  const { execute: updateCategory } = useApiAction(categoriesAdmin.updateCategory, {
    showSuccessToast: true,
    successMsg: tForm('successEdit'),
  });

  useEffect(() => {
    if (category && !isDataLoaded) {
      setInitialData({
        name_en: getVal(category.name, 'en'),
        name_ar: getVal(category.name, 'ar'),
        description_en: getVal(category.description, 'en'),
        description_ar: getVal(category.description, 'ar'),
        instagram: category.instagram ?? '',
        image_url: category.image_url ?? '',
        status: category.status === 1 || category.status === true || category.status === '1' ? 1 : 0,
      });

      if (category.images && Array.isArray(category.images)) {
        setExistingGallery(category.images);
      } else if (category.gallery && Array.isArray(category.gallery)) {
        setExistingGallery(category.gallery);
      }

      setIsDataLoaded(true);
    }
  }, [category, isDataLoaded]);

  if (fetching || !initialData) {
    return (
      <div className="p-6">
        <TableSkeleton rows={8} cols={2} />
      </div>
    );
  }

  const fields: Field[] = [
    {
      name: 'name_en',
      label: tForm('nameEn'),
      type: 'text',
      required: true,
      section: t('details'),
      sectionOrder: 1,
      sidebar: false,
      defaultValue: initialData.name_en,
    },
    {
      name: 'name_ar',
      label: tForm('nameAr'),
      type: 'text',
      required: true,
      section: t('details'),
      sectionOrder: 1,
      sidebar: false,
      defaultValue: initialData.name_ar,
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
      defaultValue: initialData.description_en,
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
      defaultValue: initialData.description_ar,
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
      defaultValue: initialData.instagram,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'switch',
      defaultValue: initialData.status === 1,
      section: tForm('settings') || 'Settings',
      sectionOrder: 1,
      sidebar: true,
      fullWidth: true,
    },
    // --- 1. الصورة الرئيسية ---
    {
      name: 'image',
      label: tForm('uploadImage') || 'Main Image',
      type: 'custom',
      section: tForm('uploadImage') || 'Media',
      sectionOrder: 2,
      sidebar: true,
      fullWidth: true,
      render: ({ onChange }) => (
        <div className="space-y-3">
          {initialData.image_url && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
              <Image
                src={initialData.image_url}
                alt="Current Main Image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10">
                <span className="text-white text-sm font-medium">Current Image</span>
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onChange(e.target.files[0]);
              }
            }}
            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          <p className="text-xs text-muted-foreground">
            Upload a new image to replace the current one. Leave empty to keep existing.
          </p>
        </div>
      ),
    },
    // --- 2. صور المعرض (إضافة وحذف) ---
  // --- 2. صور المعرض (إضافة وحذف - كحد أقصى 3 صور للمجموع) ---
    {
      name: 'images',
      label: 'Additional Images (Max 3)',
      type: 'custom',
      section: tForm('uploadImage') || 'Media',
      sidebar: true,
      sectionOrder: 2,
      fullWidth: true,
      render: ({ value, onChange }) => {
        const newFiles: File[] = value || [];

        // حساب العدد الإجمالي للصور (القديمة الموجودة + الجديدة المرفوعة)
        const totalImagesCount = existingGallery.length + newFiles.length;
        const isMaxReached = totalImagesCount >= 3;
        const remainingSlots = Math.max(0, 3 - existingGallery.length);

        const removeExisting = (imgId: number) => {
          setExistingGallery((prev) => prev.filter((g) => g.id !== imgId));
          setGalleryDeleteIds((prev) => [...prev, imgId]);
        };

        return (
          <div className="flex flex-col gap-2">
            {/* منطقة اختيار الصور - تختفي لما يوصل المجموع لـ 3 صور */}
            {!isMaxReached && (
              <div className="relative border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors flex items-center justify-center bg-background">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      const addedFiles = Array.from(e.target.files);
                      // دمج الصور الجديدة بحيث المجموع مع القديم لا يتخطى 3
                      onChange([...newFiles, ...addedFiles].slice(0, remainingSlots));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload size={20} />
                  <span className="text-xs font-medium">
                    Upload Additional Images ({totalImagesCount}/3)
                  </span>
                </div>
              </div>
            )}

            {/* رسالة تنبيه عند الوصول للحد الأقصى */}
            {isMaxReached && (
              <div className="text-xs text-center text-muted-foreground bg-muted/50 py-2 rounded-lg border border-border">
                You have reached the limit of 3 images ({existingGallery.length} existing, {newFiles.length} new).
              </div>
            )}

            {/* عرض الصور القديمة الموجودة */}
            {existingGallery.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Existing Images</p>
                <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                  {existingGallery.map((img) => (
                    <div
                      key={img.id}
                      className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border group"
                    >
                      <Image
                        src={img.image_url || img.image}
                        alt="Gallery Image"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExisting(img.id)}
                        className="absolute top-1 right-1 bg-card/80 p-0.5 rounded text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="Delete image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* عرض الصور الجديدة المرفوعة قبل الحفظ */}
            {newFiles.length > 0 && (
              <div className="space-y-1 mt-2">
                <p className="text-xs text-muted-foreground font-medium">New Images</p>
                <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                  {newFiles.map((f, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border group"
                    >
                      <Image
                        src={URL.createObjectURL(f)}
                        alt="Preview"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => onChange(newFiles.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-card/80 p-0.5 rounded text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const handleSave = async (data: Record<string, any>) => {
    const formData = new FormData();

    // 1. البيانات الأساسية
    if (data.name_en)        formData.append('name[en]',        data.name_en);
    if (data.name_ar)        formData.append('name[ar]',        data.name_ar);
    if (data.description_en) formData.append('description[en]', data.description_en);
    if (data.description_ar) formData.append('description[ar]', data.description_ar);
    formData.append('instagram', data.instagram ?? '');

    if (data.status !== undefined && data.status !== '') {
      formData.append('status', data.status ? '1' : '0');
    }

    // 2. الصورة الرئيسية
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

  if (galleryDeleteIds.length > 0) {
      galleryDeleteIds.forEach((delId, index) => {
        // ضفنا [] عشان الباك إند يقراه كـ Array
        formData.append(`deleted_images_ids[${index}]`, String(delId));
      });
    }
    // 4. إرسال الصور الجديدة المضافة (images[])
    if (Array.isArray(data.images) && data.images.length > 0) {
      data.images.forEach((file: File) => {
        formData.append('images[]', file);
      });
    }

    // DEBUG
    console.log("PAYLOAD GOING TO API:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // إرسال الريكوست بالكامل مرة واحدة
    const result = await updateCategory(id, formData);
    if (result.success) router.back();
  };

  return (
    <AddPage
      title={t('editTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isEdit={true}
    />
  );
}