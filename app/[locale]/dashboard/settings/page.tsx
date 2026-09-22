'use client';

import AddPage, { Field } from '@/components/shared/AddPage';
import { useRouter } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { settingsAdmin } from '@/services/settings'; 
import { useLocale, useTranslations } from 'next-intl';
import MapPicker from '@/components/shared/MapPicker';

const getVal = (val: any, key: string): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val[0] ?? '';
  return val[key] ?? '';
};

export default function EditSettingsPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin.pages.settings');
  const tForm = useTranslations('admin.form');

  // 1️⃣ جلب بيانات الإعدادات الحالية من السيرفر
  const { data: settingsResponse, isLoading: fetchingSettings } = useApiGet(
    settingsAdmin.getSettings,
    locale
  );
  const settingsData = settingsResponse?.data || settingsResponse;

  // 2️⃣ أكشن تحديث وحفظ البيانات
  const { execute: updateSettings, isLoading: isSaving } = useApiAction(settingsAdmin.updateSettings, {
    showSuccessToast: true,
    successMsg: tForm('successUpdate'),
  });

  // 3️⃣ تعريف الـ Fields متوافقة تماماً مع الـ Schema والـ Initial Data
  const fields: Field[] = [
    // ─── Basic Branding ───
    {
      name: 'brand_name_en',
      label: tForm('nameEn'),
      type: 'text',
      required: true,
      section: t('sections.branding'),
      sectionOrder: 1,
    },
    {
      name: 'brand_name_ar',
      label: tForm('nameAr'),
      type: 'text',
      required: true,
      section: t('sections.branding'),
      sectionOrder: 1,
    },
    {
      name: 'name_1_en',
      label: tForm('nameEn'), // اسم 1 إنجليزي
      type: 'text',
      required: false,
      section: t('sections.name'),
      sectionOrder: 2,
    },
    {
      name: 'name_1_ar',
      label: tForm('nameAr'), // اسم 1 عربي
      type: 'text',
      required: false,
      section: t('sections.name'),
      sectionOrder: 2,
    },
    {
      name: 'name_2_en',
      label: tForm('nameEn'), // اسم 2 إنجليزي
      type: 'text',
      required: false,
      section: t('sections.name_1'),
      sectionOrder: 3,
    },
    {
      name: 'name_2_ar',
      label: tForm('nameAr'), // اسم 2 عربي
      type: 'text',
      required: false,
      section: t('sections.name_1'),
      sectionOrder: 3,
    },

    {
      name: 'logo',
      label: t('logo'),
      type: 'file',
      required: false,
      section: t('sections.branding'),
      sectionOrder: 1,
    },
    {
      name: 'logo1',
      label: t('logo2'),
      type: 'file',
      required: false,
      section: t('sections.branding'),
      sectionOrder: 1,
    },

    // ─── Currency Settings ───
    {
      name: 'currency_en',
      label: t('currencyEn'),
      type: 'text',
      required: true,
      section: t('sections.currency'),
      sectionOrder: 4,
    },
    {
      name: 'currency_ar',
      label: t('currencyAr'),
      type: 'text',
      required: true,
      section: t('sections.currency'),
      sectionOrder: 4,
    },
    
    // ─── Contact Information ───
    {
      name: 'phone',
      label: t('phone'),
      type: 'text',
      required: true,
      section: t('sections.contact'),
      sectionOrder: 5,
    },
    {
      name: 'wattsapp',
      label: t('whatsapp'),
      type: 'text',
      required: true,
      section: t('sections.contact'),
      sectionOrder: 5,
    },
    {
      name: 'email',
      label: t('email'),
      type: 'text',
      required: true,
      section: t('sections.contact'),
      sectionOrder: 5,
    },
    {
      name: 'address',
      label: t('address'),
      type: 'text',
      required: true,
      section: t('sections.contact'),
      sectionOrder: 5,
    },

    // ─── Location Settings ───
    {
      name: 'location_map',
      label: t('map'),
      type: 'custom',
      fullWidth: true,
      customValidator: (value, formData) => {
        if (!formData.lat || !formData.lng) return t('mapRequired');
        return null;
      },
      section: t('sections.location'),
      sectionOrder: 6,
      render: ({ formData, setFormData }) => (
        <MapPicker 
          lat={formData.lat} 
          lng={formData.lng} 
          address={formData.address}
          onChange={(lat, lng) => {
            setFormData(prev => ({ ...prev, lat, lng }));
          }} 
          onAddressFetch={(address) => {
            setFormData(prev => ({ ...prev, address }));
          }}
        />
      )
    },

    // ─── Social Media Links ───
    {
      name: 'facebook',
      label: t('facebook'),
      type: 'text',
      required: true,
      section: t('sections.social'),
      sectionOrder: 7,
    },
    {
      name: 'insta',
      label: t('insta'),
      type: 'text',
      required: true,
      section: t('sections.social'),
      sectionOrder: 7,
    },
    {
      name: 'tiktok',
      label: t('tiktok'),
      type: 'text',
      required: true,
      section: t('sections.social'),
      sectionOrder: 7,
    },

    // ─── Apps & Metrics ───
    {
      name: 'ios_app',
      label: t('ios'),
      type: 'text',
      required: true,
      section: t('sections.apps'),
      sectionOrder: 8,
    },
    {
      name: 'android_app',
      label: t('android'),
      type: 'text',
      required: true,
      section: t('sections.apps'),
      sectionOrder: 8,
    },
    {
      name: 'min_order',
      label: t('minOrder'),
      type: 'number',
      required: true,
      section: t('sections.apps'),
      sectionOrder: 8,
    },
  ];

  // 4️⃣ معالجة البيانات وتحويلها لـ FormData متوافق مع الـ Backend Schema تماماً
  const handleSave = async (data: Record<string, any>) => {
    const formData = new FormData();

    if (data.phone) formData.append('phone', data.phone);
    if (data.wattsapp) formData.append('wattsapp', data.wattsapp);
    if (data.email) formData.append('email', data.email);
    if (data.address) formData.append('address', data.address);
    if (data.lat) formData.append('lat', String(data.lat));
    if (data.lng) formData.append('lng', String(data.lng));
    if (data.facebook) formData.append('facebook', data.facebook);
    if (data.insta) formData.append('insta', data.insta);
    if (data.tiktok) formData.append('tiktok', data.tiktok);
    if (data.ios_app) formData.append('ios_app', data.ios_app);
    if (data.android_app) formData.append('android_app', data.android_app);
    if (data.min_order !== undefined) formData.append('min_order', String(data.min_order));
    
    // Objects mapping (براند ونيم والعملة)
    if (data.brand_name_en) formData.append('brand_name[en]', data.brand_name_en);
    if (data.brand_name_ar) formData.append('brand_name[ar]', data.brand_name_ar);
    
    if (data.name_1_en) formData.append('name_1[en]', data.name_1_en);
    if (data.name_1_ar) formData.append('name_1[ar]', data.name_1_ar);
    
    if (data.name_2_en) formData.append('name_2[en]', data.name_2_en);
    if (data.name_2_ar) formData.append('name_2[ar]', data.name_2_ar);

    if (data.currency_en) formData.append('currency[en]', data.currency_en);
    if (data.currency_ar) formData.append('currency[ar]', data.currency_ar);

    // معالجة اللوجو الأول واللوجو الثاني بصيغة Binary Files
    if (data.logo && typeof data.logo !== 'string') {
      formData.append('logo', data.logo); 
    } else if (data.logo === "") {
      formData.append('logo', ''); 
    }

    if (data.logo1 && typeof data.logo1 !== 'string') {
      formData.append('logo1', data.logo1); 
    } else if (data.logo1 === "") {
      formData.append('logo1', ''); 
    }

    // استدعاء ميثود التعديل
    await updateSettings(locale, formData);
  };

  return (
    <AddPage
      title={t('title')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isSaving={fetchingSettings || isSaving}
      // 5️⃣ تعبئة الحقول تلقائياً بالاعتماد على أسماء الـ Fields الصحيحة وحماية الـ null
      initialData={settingsData ? {
        brand_name_en: getVal(settingsData.brand_name, 'en'),
        brand_name_ar: getVal(settingsData.brand_name, 'ar'),
        currency_en: getVal(settingsData.currency, 'en') || (settingsData.currency_en ?? ''),
        currency_ar: getVal(settingsData.currency, 'ar') || (settingsData.currency_ar ?? ''),
        phone: settingsData.phone ?? '',
        wattsapp: settingsData.wattsapp ?? '',
        email: settingsData.email ?? '',
        address: settingsData.address ?? '',
        lat: settingsData.lat ?? '',
        lng: settingsData.lng ?? '',
        facebook: settingsData.facebook ?? '',
        insta: settingsData.insta ?? '',
        tiktok: settingsData.tiktok ?? '',
        ios_app: settingsData.ios_app ?? '',
        android_app: settingsData.android_app ?? '',
        min_order: settingsData.min_order ?? '',
        logo: settingsData.logo_url ?? '',
        logo1: settingsData.logo_url1 ?? '',
        name_1_en: getVal(settingsData.name_1, 'en'),
        name_1_ar: getVal(settingsData.name_1, 'ar'),
        name_2_en: getVal(settingsData.name_2, 'en'),
        name_2_ar: getVal(settingsData.name_2, 'ar'),
      } : undefined}
    />
  );
}