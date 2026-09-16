'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { categoriesAdmin } from '@/services/categories';
import { productsAdmin } from '@/services/products';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import Image from 'next/image';
const getVal = (val: any, key: string): string => {
  if (!val) return '';
  if (Array.isArray(val)) return val[0] ?? '';
  return val[key] ?? val['en'] ?? '';
};

export default function AddProductPage() {
  const router = useRouter(); 
  const locale = useLocale();
  const t = useTranslations('admin.pages.products');
  const tForm = useTranslations('admin.form');

  const { execute: addProduct } = useApiAction(productsAdmin.addProduct, {
    showSuccessToast: true,
    successMsg: tForm('successAdd'),
  });

  // Step 1: parent categories — /list returns items WITHOUT category_id (the parents)
  const { data: parentCategoriesList } = useApiGet(categoriesAdmin.getSubCategories, locale);
  const parentOptions = Array.isArray(parentCategoriesList)
    ? parentCategoriesList.map((c: any) => ({
        value: c.id,
        label: getVal(c.name, locale === 'ar' ? 'ar' : 'en'),
      }))
    : [];

  // Step 2: sub-categories — /sub_list returns items WITH category_id → filter by selected parent
  const { data: allSubCategories } = useApiGet(categoriesAdmin.getSubCategoriesList, locale);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  const subCategoryOptions = Array.isArray(allSubCategories)
    ? allSubCategories
        .filter((c: any) => !selectedParentId || c.category_id === selectedParentId)
        .map((c: any) => ({
          value: c.id,
          label: getVal(c.name, locale === 'ar' ? 'ar' : 'en'),
        }))
    : [];

  const fields: Field[] = [
    // --- Product Info ---
    // Parent category selector (not sent to API — used only to filter sub-categories)
    {
      name: 'parent_category_id',
      label: t('placeholderParent') || 'Parent Category',
      type: 'select',
      required: false,
      section: t('tabs.general'),
      sectionOrder: 2,
      options: parentOptions,
      placeholder: t('placeholderParent') || 'Select parent category...',
      onChange: (value, setFormData) => {
        const parentId = value ? Number(value) : null;
        setSelectedParentId(parentId);
        // Reset sub-category when parent changes
        setFormData((prev) => ({ ...prev, category_id: '' }));
      },
    },
    // Sub-category selector (this is what gets sent to the API as category_id)
    // Only visible after a parent category is selected
    {
      name: 'category_id',
      label: t('placeholderCategory') || 'Sub Category',
      type: 'select',
      required: true,
      section: t('tabs.general'),
      sectionOrder: 2,
      options: subCategoryOptions,
      placeholder: t('placeholderCategory') || 'Select sub-category...',
      hidden: (formData) => !formData.parent_category_id,
    },
    { name: 'name_en', label: tForm('nameEn'), type: 'text', required: true, section: t('tabs.general'), sectionOrder: 1, fullWidth: false },
    { name: 'name_ar', label: tForm('nameAr'), type: 'text', required: true, section: t('tabs.general'), sectionOrder: 1, fullWidth: false },
    { name: 'description_en', label: tForm('descEn'), type: 'textarea', required: true, section: t('tabs.general'), sectionOrder: 1, fullWidth: true },
    { name: 'description_ar', label: tForm('descAr'), type: 'textarea', required: true, section: t('tabs.general'), sectionOrder: 1, fullWidth: true },
    
  
    // --- Sidebar Settings ---
    { name: 'status', label: 'Status', type: 'switch', defaultValue: 1, section: tForm('settings') || 'Settings', sectionOrder: 1, sidebar: true, fullWidth: true },
    { name: 'image', label: tForm('uploadImage'), type: 'file', required: false, section: t('tabs.media'), sectionOrder: 2, sidebar: true, fullWidth: true },
    { name: 'pdf', label: tForm('uploadPdf'), type: 'pdf', required: false, section: t('tabs.media'), sectionOrder: 3, sidebar: true, fullWidth: true },

    // --- Custom Fields: Gallery & Variations ---
    {
      name: 'gallery',
      label: t('galleryTitle'),
      type: 'custom',
      section: t('tabs.media'),
      sidebar: true,
      sectionOrder: 2,
      fullWidth: true,
      render: ({ value, onChange }) => {
        const files: File[] = value || [];
        return (
          <div className="flex flex-col gap-2">
            <div className="relative border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors flex items-center justify-center bg-background">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    onChange([...files, ...Array.from(e.target.files)]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Upload size={20} />
                <span className="text-xs font-medium">{tForm('uploadImage')}</span>
              </div>
            </div>
            {files.length > 0 && (
              <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                {files.map((f, i) => (
  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border group">
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
      }
    },
    {
      name: 'variations',
      label: t('variationsTitle'),
      type: 'custom',
      section: t('tabs.variations'),
      sectionOrder: 3,
      fullWidth: true,
      render: ({ value, onChange }) => {
        // value shape: Array<{ name: {en, ar}, options: Array<{ name: {en, ar}, price: string }> }>
        const variations = value || [];

        const addVariation = () => {
          onChange([...variations, { name: { en: '', ar: '' }, options: [{ name: { en: '', ar: '' } }] }]);
        };

        const updateVariation = (index: number, key: string, lang: string, val: string) => {
          const newVars = [...variations];
          newVars[index].name[lang] = val;
          onChange(newVars);
        };

        const addOption = (index: number) => {
          const newVars = [...variations];
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
          newVars[vIndex].options.splice(oIndex, 1);
          onChange(newVars);
        };

        const removeVariation = (index: number) => {
          const newVars = [...variations];
          newVars.splice(index, 1);
          onChange(newVars);
        };

        return (
          <div className="space-y-4">
            {variations.map((v: any, vIndex: number) => (
              <div key={vIndex} className="p-4 border border-border rounded-xl bg-background relative">
                <button
                  type="button"
                  onClick={() => removeVariation(vIndex)}
                  className="absolute top-2 ltr:right-2 rtl:left-2 text-red-400 hover:text-red-600 p-1"
                >
                  <X size={16} />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t('variationNameEn') || 'Variation Name (EN)'}</label>
                    <input
                      type="text"
                      value={v.name.en}
                      onChange={(e) => updateVariation(vIndex, 'name', 'en', e.target.value)}
                      placeholder={t('placeholderSizeEn') || "e.g. Size"}
                      className="w-full p-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t('variationNameAr') || 'Variation Name (AR)'}</label>
                    <input
                      type="text"
                      value={v.name.ar}
                      onChange={(e) => updateVariation(vIndex, 'name', 'ar', e.target.value)}
                      placeholder={t('placeholderSizeAr') || "e.g. المقاس"}
                      className="w-full p-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 mt-4 pt-4 border-t border-border">
                  <label className="text-xs font-semibold text-muted-foreground block">{t('options') || 'Options'}</label>
                  {v.options.map((opt: any, oIndex: number) => (
                    <div key={oIndex} className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-card p-2 border border-border rounded-lg">
                      <input
                        type="text"
                        value={opt.name.en}
                        onChange={(e) => updateOption(vIndex, oIndex, 'name', 'en', e.target.value)}
                        placeholder={t('optionEn') || 'Option (EN)'}
                        className="flex-1 min-w-[100px] p-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
                      />
                      <input
                        type="text"
                        value={opt.name.ar}
                        onChange={(e) => updateOption(vIndex, oIndex, 'name', 'ar', e.target.value)}
                        placeholder={t('optionAr') || 'Option (AR)'}
                        className="flex-1 min-w-[100px] p-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
                      />
                      {/* <input
                        type="number"
                        value={opt.price}
                        onChange={(e) => updateOption(vIndex, oIndex, 'price', null, e.target.value)}
                        placeholder={t('additionalPrice') || 'Additional Price'}
                        className="flex-1 min-w-[100px] p-2 text-sm rounded-lg border border-border focus:border-primary outline-none"
                      /> */}
                      <button
                        type="button"
                        onClick={() => removeOption(vIndex, oIndex)}
                        className="p-2 text-muted-foreground hover:text-red-500 bg-background border border-border rounded-lg shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(vIndex)}
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
    formData.append('name[en]',        data.name_en        ?? '');
    formData.append('name[ar]',        data.name_ar        ?? '');
    formData.append('description[en]', data.description_en ?? '');
    formData.append('description[ar]', data.description_ar ?? '');
    if (data.pdf) formData.append('pdf', data.pdf);
    if (data.category_id) formData.append('category_id', String(data.category_id));
    
    // if (data.price !== undefined && data.price !== null && data.price !== '') {
    //   formData.append('price', String(data.price));
    // }
    
    // if (data.discount !== undefined && data.discount !== null && data.discount !== '') {
    //   formData.append('discount', String(Number(data.discount)));
    // } else {
    //   formData.append('discount', '0');
     
    // }

    // if (data.discount_from) {
    //   const fromStr = data.discount_from.includes(':') ? data.discount_from : `${data.discount_from} 00:00:00`;
    //   formData.append('discount_from', fromStr);
    // }
    // if (data.discount_to) {
    //   const toStr = data.discount_to.includes(':') ? data.discount_to : `${data.discount_to} 23:59:59`;
    //   formData.append('discount_to', toStr);
    // }
    
    if (data.status !== undefined && data.status !== '')
      formData.append('status', data.status ? '1' : '0');

    if (data.image instanceof File)
      formData.append('image', data.image);

    console.log("PAYLOAD GOING TO API:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Gallery Files
    if (Array.isArray(data.gallery)) {
      data.gallery.forEach((file: File) => {
        formData.append('gallery[]', file);
      });
    }

    // Variations (Indexed Array for PHP/Laravel Backend)
    if (Array.isArray(data.variations)) {
      data.variations.forEach((v: any, index: number) => {
        formData.append(`variations[${index}][name][en]`, v.name?.en || '');
        formData.append(`variations[${index}][name][ar]`, v.name?.ar || '');
        if (Array.isArray(v.options)) {
          v.options.forEach((opt: any, optIndex: number) => {
            formData.append(`variations[${index}][options][${optIndex}][name][en]`, opt.name?.en || '');
            formData.append(`variations[${index}][options][${optIndex}][name][ar]`, opt.name?.ar || '');
            // formData.append(`variations[${index}][options][${optIndex}][price]`, String(opt.price || 0));
          });
        }
      });
    }

    const result = await addProduct(formData);
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
