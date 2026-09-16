'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { categoriesAdmin } from '@/services/categories';
import { productsAdmin } from '@/services/products';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState, useEffect, use } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import Image from 'next/image';
const getVal = (val: any, key: string): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val[0] ?? '';
  return val[key] ?? val['en'] ?? '';
};

export default function EditProductPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin.pages.products');
  const tForm = useTranslations('admin.form');
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [initialData, setInitialData] = useState<any>(null);
  const [existingGallery, setExistingGallery] = useState<any[]>([]);
  const [galleryDeleteIds, setGalleryDeleteIds] = useState<number[]>([]);
  const [existingVariations, setExistingVariations] = useState<any[]>([]);
  const [optionDeleteIds, setOptionDeleteIds] = useState<number[]>([]);

  // Fetch product data
  const { data: productData, isLoading: isLoadingProduct } = useApiGet(
    productsAdmin.getProduct,
    id,
    locale
  );

  const { execute: updateProduct } = useApiAction(productsAdmin.updateProduct, {
    showSuccessToast: true,
    successMsg: tForm('successEdit'),
  });
const { data: parentCategoriesList } = useApiGet(
  categoriesAdmin.getSubCategories,
  locale
);

const { data: allSubCategories } = useApiGet(
  categoriesAdmin.getSubCategoriesList,
  locale
);
  // Step 1: Fetch all parent categories (sub_list)
  const parentOptions = Array.isArray(parentCategoriesList)
    ? parentCategoriesList.map((c: any) => ({
      value: c.id,
      label: getVal(c.name, locale === 'ar' ? 'ar' : 'en'),
    }))
    : [];

  // Step 2: Fetch all sub-categories flat list and filter by selected parent
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  const subCategoryOptions = Array.isArray(allSubCategories)
    ? allSubCategories
      .filter((c: any) => !selectedParentId || c.category_id === selectedParentId)
      .map((c: any) => ({
        value: c.id,
        label: getVal(c.name, locale === 'ar' ? 'ar' : 'en'),
      }))
    : [];

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (productData && !isDataLoaded) {
      const p = productData;

  setSelectedParentId(p.category?.category_id ?? null);

      setInitialData({
        name_en: getVal(p.name, 'en'),
        name_ar: getVal(p.name, 'ar'),
        description_en: getVal(p.description, 'en'),
        description_ar: getVal(p.description, 'ar'),
        pdf: p.pdf || null,
        pdf_url: p.pdf_url || null,
        status: p.status,
        parent_category_id:p.category.category_id,
        category_id: p.category.id,
        image_url: p.image_url,
      });

      if (p.gallery && Array.isArray(p.gallery)) {
        setExistingGallery(p.gallery);
      }

      if (p.variations && Array.isArray(p.variations)) {
        setExistingVariations(p.variations);
      }

      setIsDataLoaded(true);
    }
  }, [productData, isDataLoaded, allSubCategories]);

  if (isLoadingProduct || !initialData) return (
    <div className="p-6">
      <TableSkeleton rows={8} cols={2} />
    </div>
  );

  const fields: Field[] = [
    { name: 'name_en', label: tForm('nameEn'), type: 'text', required: true, section: t('tabs.general'), sectionOrder: 1, fullWidth: false, defaultValue: initialData.name_en },
    { name: 'name_ar', label: tForm('nameAr'), type: 'text', required: true, section: t('tabs.general'), sectionOrder: 1, fullWidth: false, defaultValue: initialData.name_ar },
    { name: 'description_en', label: tForm('descEn'), type: 'textarea', required: true, section: t('tabs.general'), sectionOrder: 1, fullWidth: true, defaultValue: initialData.description_en },
    { name: 'description_ar', label: tForm('descAr'), type: 'textarea', required: true, section: t('tabs.general'), sectionOrder: 1, fullWidth: true, defaultValue: initialData.description_ar },
   
    {
      name: 'parent_category_id',
      label: t('placeholderParent') || 'Parent Category',
      type: 'select',
      required: false,
      section: t('tabs.pricing'),
      sectionOrder: 2,
      options: parentOptions,
      defaultValue: initialData.parent_category_id,
      placeholder: t('placeholderParent') || 'Select parent category...',
      onChange: (value, setFormData) => {
        const parentId = value ? Number(value) : null;
        setSelectedParentId(parentId);
setFormData((prev) => ({
  ...prev,
  category_id: '',
}));      },
    },
    {
      name: 'category_id',
      label: t('placeholderCategory') || 'Sub Category',
      type: 'select',
      required: true,
      section: t('tabs.pricing'),
      sectionOrder: 2,
      options: subCategoryOptions,
      defaultValue: initialData.category_id,
      placeholder: selectedParentId
        ? t('placeholderCategory') || 'Select sub-category...'
        : t('placeholderSelectParentFirst') || 'Select parent first...',
    },

    // --- Sidebar Settings ---
    { name: 'status', label: 'Status', type: 'switch', defaultValue: initialData.status === 1 || initialData.status === true || initialData.status === '1', section: tForm('settings') || 'Settings', sectionOrder: 1, sidebar: true, fullWidth: true },
     { name: 'pdf', label: tForm('uploadPdf'), 
      type: 'pdf', required: false, section: t('tabs.media'),
       sectionOrder: 3, sidebar: true, fullWidth: true,
       defaultValue: initialData.pdf_url || '' },

    {
      name: 'image',
      label: tForm('uploadImage'),
      type: 'custom',
      section: t('tabs.media'),
      sectionOrder: 2,
      sidebar: true,
      fullWidth: true,
      render: ({ onChange }) => (
        <div className="space-y-3">
          {initialData.image_url && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
              <Image
                src={initialData.image_url}
                alt="Current Image"
                fill // يملأ الأب الذي يحتوي على aspect-video
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* غطاء النص عند الوقوف بالماوس */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10">
                <span className="text-white text-sm font-medium">CurrentImage</span>
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
          <p className="text-xs text-muted-foreground">Upload a new image to replace the current one. Leave empty to keep existing.</p>
        </div>
      )
    },

    // --- Custom Fields: Gallery & Variations ---
    {
      name: 'gallery_add',
      label: t('galleryTitle'),
      type: 'custom',
      section: t('tabs.media'),
      sidebar: true,
      sectionOrder: 2,
      fullWidth: true,
      render: ({ value, onChange }) => {
        const newFiles: File[] = value || [];

        const removeExisting = (imgId: number) => {
          setExistingGallery(prev => prev.filter(g => g.id !== imgId));
          setGalleryDeleteIds(prev => [...prev, imgId]);
        };

        return (
          <div className="flex flex-col gap-2">
            <div className="relative border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors flex items-center justify-center bg-background">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    onChange([...newFiles, ...Array.from(e.target.files)]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Upload size={20} />
                <span className="text-xs font-medium">{tForm('uploadImage')}</span>
              </div>
            </div>

            {/* Display Existing Gallery */}
            {existingGallery.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Existing Images</p>
                <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                  {existingGallery.map((img) => (
                    <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border group">
                      <Image
                        src={img.image_url || img.image}
                        alt="Gallery Image"
                        width={64}  // 64px تعادل w-16
                        height={64} // 64px تعادل h-16
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

            {/* Display New Files */}
            {newFiles.length > 0 && (
              <div className="space-y-1 mt-2">
                <p className="text-xs text-muted-foreground font-medium">New Images</p>
                <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                  {newFiles.map((f, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border group">
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
      }
    },
    {
      name: 'variations',
      label: t('variationsTitle'),
      type: 'custom',
      section: t('tabs.variations'),
      sectionOrder: 3,
      fullWidth: true,
      defaultValue: existingVariations, // seed with existing
      render: ({ value, onChange }) => {
        // value shape: Array<{ id?: number, delete?: boolean, name: {en, ar}, options: Array<{ name: {en, ar}, price: string }> }>
        const variations = value || [];

        const addVariation = () => {
          onChange([...variations, { name: { en: '', ar: '' }, options: [{ name: { en: '', ar: '' }, price: '' }] }]);
        };

        const updateVariation = (index: number, key: string, lang: string, val: string) => {
          const newVars = [...variations];
          newVars[index].name[lang] = val;
          onChange(newVars);
        };

        const addOption = (index: number) => {
          const newVars = [...variations];
          if (!newVars[index].options) newVars[index].options = [];
          newVars[index].options.push({ name: { en: '', ar: '' }, price: '' });
          onChange(newVars);
        };

        const updateOption = (vIndex: number, oIndex: number, field: string, lang: string | null, val: string) => {
          const newVars = [...variations];
          if (field === 'name' && lang) {
            newVars[vIndex].options[oIndex].name[lang] = val;
          }
          onChange(newVars);
        };

        const removeOption = (vIndex: number, oIndex: number) => {
          const newVars = [...variations];
          const opt = newVars[vIndex].options[oIndex];
          if (opt.id) {
            setOptionDeleteIds(prev => [...prev, opt.id]);
          }
          newVars[vIndex].options.splice(oIndex, 1);
          onChange(newVars);
        };

        const removeVariation = (index: number) => {
          const newVars = [...variations];
          // If it has an ID, mark it for deletion instead of removing from array so we can send `delete: true`
          if (newVars[index].id) {
            newVars[index].delete = true;
          } else {
            newVars.splice(index, 1);
          }
          onChange(newVars);
        };

        const activeVariations = variations.map((v: any, index: number) => ({ ...v, originalIndex: index })).filter((v: any) => !v.delete);

        return (
          <div className="space-y-4">
            {activeVariations.map((v: any) => (
              <div key={v.originalIndex} className="p-4 border border-border rounded-xl bg-background relative">
                <button
                  type="button"
                  onClick={() => removeVariation(v.originalIndex)}
                  className="absolute top-2 ltr:right-2 rtl:left-2 text-red-400 hover:text-red-600 p-1"
                >
                  <X size={16} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t('variationNameEn') || 'Variation Name (EN)'}</label>
                    <input
                      type="text"
                      value={v.name?.en || ''}
                      onChange={(e) => updateVariation(v.originalIndex, 'name', 'en', e.target.value)}
                      placeholder={t('placeholderSizeEn') || "e.g. Size"}
                      className="w-full p-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t('variationNameAr') || 'Variation Name (AR)'}</label>
                    <input
                      type="text"
                      value={v.name?.ar || ''}
                      onChange={(e) => updateVariation(v.originalIndex, 'name', 'ar', e.target.value)}
                      placeholder={t('placeholderSizeAr') || "e.g. المقاس"}
                      className="w-full p-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 mt-4 pt-4 border-t border-border">
                  <label className="text-xs font-semibold text-muted-foreground block">{t('options') || 'Options'}</label>
                  {(v.options || []).map((opt: any, oIndex: number) => (
                    <div key={oIndex} className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-card p-2 border border-border rounded-lg">
                      <input
                        type="text"
                        value={opt.name?.en || ''}
                        onChange={(e) => updateOption(v.originalIndex, oIndex, 'name', 'en', e.target.value)}
                        placeholder={t('optionEn') || 'Option (EN)'}
                        className="flex-1 min-w-[100px] p-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
                      />
                      <input
                        type="text"
                        value={opt.name?.ar || ''}
                        onChange={(e) => updateOption(v.originalIndex, oIndex, 'name', 'ar', e.target.value)}
                        placeholder={t('optionAr') || 'Option (AR)'}
                        className="flex-1 min-w-[100px] p-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
                      />
                    
                      <button
                        type="button"
                        onClick={() => removeOption(v.originalIndex, oIndex)}
                        className="p-2 text-muted-foreground hover:text-red-500 bg-background border border-border rounded-lg shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(v.originalIndex)}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1 mt-2"
                  >
                    <Plus size={12} /> {t('addOption') || 'Add Option'}
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariation}
              className="w-full py-3 border-2 border-dashed border-border text-muted-foreground rounded-xl hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus size={16} /> {t('addVariation') || 'Add Variation'}
            </button>
          </div>
        );
      }
    }
  ];

  const handleSave = async (data: Record<string, any>) => {
    const formData = new FormData();

    // Standard Fields
    formData.append('name[en]', data.name_en ?? '');
    formData.append('name[ar]', data.name_ar ?? '');
    formData.append('description[en]', data.description_en ?? '');
    formData.append('description[ar]', data.description_ar ?? '');

    if (data.category_id) formData.append('category_id', String(data.category_id));

    

    if (data.status !== undefined && data.status !== '')
      formData.append('status', data.status ? '1' : '0');

    if (data.image instanceof File)
      formData.append('image', data.image);

    if (data.pdf instanceof File)
      formData.append('pdf', data.pdf);

    // DEBUG: Log the FormData being sent to the API
    console.log("PAYLOAD GOING TO API:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // 1. Update Core Product
    const result = await updateProduct(id, formData);

    console.log("BACKEND RESPONSE AFTER SAVE:", result);

    if (!result.success) return;

    // 2. Orchestrate Sub-Resources
    const promises: Promise<any>[] = [];

    // Gallery Deletes
    if (galleryDeleteIds.length > 0) {
      galleryDeleteIds.forEach(delId => promises.push(productsAdmin.deleteGalleryImage(delId)));
    }

    // Gallery Adds
    if (Array.isArray(data.gallery_add) && data.gallery_add.length > 0) {
      const gForm = new FormData();
      data.gallery_add.forEach((file: File) => gForm.append('images[]', file));
      promises.push(productsAdmin.addGallery(id, gForm));
    }

    // Option Deletes
    if (optionDeleteIds.length > 0) {
      optionDeleteIds.forEach(optId => promises.push(productsAdmin.deleteOption(optId)));
    }

    // Variation Deletes
    const deletedVars = (data.variations || []).filter((v: any) => v.delete && v.id);
    deletedVars.forEach((v: any) => promises.push(productsAdmin.deleteVariation(v.id)));

    await Promise.allSettled(promises);

    // Variation & Option Adds (Sequential due to dependencies)
    const activeVars = (data.variations || []).filter((v: any) => !v.delete);

    for (const v of activeVars) {
      if (!v.id) {
        // New Variation
        try {
          const vRes = await productsAdmin.addVariation(id, { name: v.name });
          const newVarId = vRes.data?.id ?? vRes.data?.data?.id;
          if (newVarId && Array.isArray(v.options)) {
            for (const opt of v.options) {
              await productsAdmin.addOption(newVarId, { name: opt.name, price: Number(opt.price || 0) });
            }
          }
        } catch (error) {
          console.error("Failed to add variation:", error);
        }
      } else {
        // Existing Variation - Add new options
        if (Array.isArray(v.options)) {
          for (const opt of v.options) {
            if (!opt.id && opt.name?.en?.trim()) {
              try {
                await productsAdmin.addOption(v.id, { name: opt.name, price: Number(opt.price || 0) });
              } catch (error) {
                console.error("Failed to add option:", error);
              }
            }
          }
        }
      }
    }

    router.back();
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
