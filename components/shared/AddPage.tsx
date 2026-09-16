"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Upload, AlertCircle, Info, ChevronDown, Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select, { MultiValue, SingleValue, StylesConfig } from "react-select";
import toast from "react-hot-toast";
import { FaPlusSquare } from "react-icons/fa";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

// --- TypeScript Interfaces ---
export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "numberdecimal"
  | "multipleSelect"
  | "datetime"
  | "time"
  | "datemin"
  | "date"
  | "select"
  | "file"
  | "pdf"
  | "textView"
  | "dynamic-list"
  | "switch"
  | "fileWithOCR"
  | "pillTags"
  | "textarea"
  | "media"
  | "phoneCode"
  | "custom";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  defaultValue?: any;
  // التحكم في الجانب والترتيب
  sidebar?: boolean;       // true = يمين | false أو undefined = يسار
  sectionOrder?: number;   // ترتيب الـ section داخل العمود
  required?: boolean;
  requiredMessage?: string;
  pattern?: RegExp;
  patternMessage?: string;
  customValidator?: (value: any, formData: Record<string, any>) => string | null;
  hidden?: (formData: Record<string, any>) => boolean;
  section?: string;
  fullWidth?: boolean;
  tooltip?: string;
  placeholder?: string;
  options?: SelectOption[];
  onChange?: (
    value: any,
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>
  ) => void;
  actionButton?: (props: {
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  }) => React.ReactNode;
  render?: (props: {
    value: any;
    onChange: (val: any) => void;
    error?: string;
    formData: Record<string, any>;
    field: Field;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  }) => React.ReactNode;
  helperText?: string;
}

interface SectionMeta {
  fields: Field[];
  order: number;
  sidebar: boolean;
}

interface AddPageProps {
  title: string;
  showCancel?: boolean;
  fields: Field[];
  onSave: (formData: Record<string, any>) => Promise<void> | void;
  onCancel: () => void;
  initialData?: Record<string, any>;
  isSaving?: boolean;
  isEdit?: boolean;
}

const AddPage: React.FC<AddPageProps> = ({
  title,
  fields,
  showCancel=true,
  onSave,
  onCancel,
  initialData,
  isSaving = false,
  isEdit = false,
}) => {
  const tForm = useTranslations('admin.form');
  const tTable = useTranslations('admin.table');

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [openPhoneDropdown, setOpenPhoneDropdown] = useState<string | null>(null);

  const [formData, setFormData] = useState<Record<string, any>>(() =>
    fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.defaultValue ?? "" }),
      {}
    )
  );

  // بناء الـ sections مع الـ metadata (sidebar + order)
  const sections = fields.reduce(
    (acc: Record<string, SectionMeta>, field) => {
      const sectionName = field.section || "General Information";
      if (!acc[sectionName]) {
        acc[sectionName] = {
          fields: [],
          order: field.sectionOrder ?? 0,
          sidebar: field.sidebar ?? false,
        };
      }
      acc[sectionName].fields.push(field);
      return acc;
    },
    {}
  );

  const mainSections = Object.entries(sections)
    .filter(([, sec]) => !sec.sidebar)
    .sort(([, a], [, b]) => a.order - b.order);

  const sidebarSections = Object.entries(sections)
    .filter(([, sec]) => sec.sidebar)
    .sort(([, a], [, b]) => a.order - b.order);

  // Dirty Check
  const isDirty =
    JSON.stringify(formData) !==
    JSON.stringify(
      initialData ||
        fields.reduce(
          (acc, field) => ({ ...acc, [field.name]: field.defaultValue ?? "" }),
          {}
        )
    );

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({ ...prev, ...initialData }));
      const newPreviews: Record<string, string> = {};
      Object.keys(initialData).forEach((key) => {
        if (
          typeof initialData[key] === "string" &&
          initialData[key].includes("http")
        ) {
          newPreviews[key] = initialData[key];
        }
      });
      setPreviews(newPreviews);
    }
  }, [JSON.stringify(initialData)]);

  // --- Validation ---
  const validateField = useCallback(
    (field: Field, value: any): string => {
      let error = "";
      if (field.required && (!value || value.toString().trim() === "")) {
        error = field.requiredMessage || tForm('required');
      } else if (value && (field.type === "number" || field.type === "numberdecimal")) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          error = tForm('invalidNumber');
        } else if (numValue < 0) {
          error = tForm('negativeNumber');
        }
      } else if (value && field.pattern && !field.pattern.test(value)) {
        error = field.patternMessage || "Invalid format";
      } else if (field.customValidator) {
        const customError = field.customValidator(value, formData);
        if (customError) error = customError;
      }
      if (
        field.required &&
        (value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0))
      ) {
        error = field.requiredMessage || tForm('required');
      }
      return error;
    },
    [formData]
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (typeof field.hidden === "function" && field.hidden(formData)) return;
      const error = validateField(field, formData[field.name]);
      if (error) newErrors[field.name] = error;
    });
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error(tForm('fillRequired'));
      return false;
    }
    
    return true;
  };

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  

  // --- Custom React-Select Styles ---
  const selectStyles: StylesConfig<SelectOption, boolean> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "var(--background)",
      borderColor: state.isFocused ? "var(--new)" : "var(--border)",
      borderRadius: "0.75rem",
      padding: "0.25rem",
      boxShadow: state.isFocused ? "0 0 0 4px rgba(123, 37, 37, 0.1)" : "none",
      "&:hover": {
        borderColor: "var(--new)"
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "0.75rem",
      overflow: "hidden",
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--new)"
        : state.isFocused
        ? "var(--muted)"
        : "transparent",
      color: state.isSelected ? "#ffffff" : "var(--foreground)",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "var(--new)",
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--foreground)",
    }),
    input: (provided) => ({
      ...provided,
      color: "var(--foreground)",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "var(--muted-foreground)",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "var(--muted)",
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "var(--foreground)",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "var(--muted-foreground)",
      ":hover": {
        backgroundColor: "var(--new)",
        color: "#ffffff",
      },
    }),
  };

  // --- Render Section ---
  const renderSection = (sectionTitle: string, sectionFields: Field[]) => (
    <div
      key={sectionTitle}
      className="bg-card rounded-xl md:rounded-2xl shadow-sm border border-border"
    >
      <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4 bg-muted/50 border-b border-border">
        <h2 className="text-base md:text-lg font-bold text-foreground">{sectionTitle}</h2>
      </div>
      <div className="p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 lg:gap-x-8 gap-y-4 md:gap-y-6 text-start">
        {sectionFields.map((field) => {
          if (typeof field.hidden === "function" && field.hidden(formData))
            return null;

          return (
            <div
              key={field.name}
              className={`flex flex-col gap-1.5 ${
                field.fullWidth ? "col-span-1 md:col-span-2 lg:col-span-3" : ""
              }`}
            >
              <label className="text-xs md:text-sm font-bold text-foreground flex items-center gap-1 justify-start">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
                {field.tooltip && (
                  <span title={field.tooltip} className="cursor-help">
                    <Info
                      size={14}
                      className="text-muted-foreground"
                    />
                  </span>
                )}
              </label>

              {["text", "email", "password"].includes(field.type) && (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] ?? ""}
                  placeholder={field.placeholder}
                  className={`p-2.5 md:p-3 text-sm md:text-base rounded-xl border bg-background/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all ${
                    errors[field.name]
                      ? "border-red-400"
                      : "border-border focus:border-primary"
                  }`}
                  onChange={handleChange}
                />
              )}

              {["number"].includes(field.type) && (
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name] ?? ""}
                  placeholder={field.placeholder}
                  className={`appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none no-spinner p-2.5 md:p-3 text-sm md:text-base rounded-xl border bg-background/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all ${
                    errors[field.name]
                      ? "border-red-400"
                      : "border-border focus:border-primary"
                  }`}
                  onKeyDown={(e) => {
                    if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={handleChange}
                />
              )}

              {["numberdecimal"].includes(field.type) && (
                <input
                  step="any"
                  type="number"
                  name={field.name}
                  value={formData[field.name] ?? ""}
                  placeholder={field.placeholder}
                  className={`appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none no-spinner p-2.5 md:p-3 text-sm md:text-base rounded-xl border bg-background/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all ${
                    errors[field.name]
                      ? "border-red-400"
                      : "border-border focus:border-primary"
                  }`}
                  onKeyDown={(e) => {
                    if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={handleChange}
                />
              )}

              {field.type === "multipleSelect" && (
                <Select
                  isMulti
                  name={field.name}
                  placeholder={field.placeholder}
                  options={field.options}
                  value={
                    Array.isArray(formData[field.name])
                      ? field.options?.filter((opt: any) =>
                          formData[field.name].includes(opt.value)
                        )
                      : []
                  }
                  onChange={(selected: MultiValue<SelectOption> | null) => {
                    const values = selected
                      ? selected.map((opt) => opt.value)
                      : [];
                    setFormData((prev) => ({ ...prev, [field.name]: values }));
                    if (errors[field.name])
                      setErrors((prev) => ({ ...prev, [field.name]: "" }));
                  }}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  styles={selectStyles}
                />
              )}
{field.type === "textarea" && (
  <textarea
    name={field.name}
    value={(formData[field.name] as string) || ""}
    placeholder={field.placeholder}
    rows={4}
    className={`p-2.5 md:p-3 text-sm md:text-base rounded-xl border bg-background/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none ${
      errors[field.name]
        ? "border-red-400"
        : "border-border focus:border-primary"
    }`}
    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;

      setFormData((prev) => ({
        ...prev,
        [field.name]: value,
      }));

      if (errors[field.name]) {
        setErrors((prev) => ({ ...prev, [field.name]: "" }));
      }
    }}
  />
)}
              {field.type === "pillTags" && (
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {field.options?.map((opt) => {
                    const isActive = Array.isArray(formData[field.name]) && formData[field.name].includes(opt.value);
                    return (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => {
                          const currentValues = Array.isArray(formData[field.name]) ? formData[field.name] : [];
                          const newValues = isActive 
                            ? currentValues.filter((v: any) => v !== opt.value)
                            : [...currentValues, opt.value];
                            
                          setFormData((prev) => ({ ...prev, [field.name]: newValues }));
                          if (errors[field.name]) setErrors((prev) => ({ ...prev, [field.name]: "" }));
                        }}
                        className={`px-3 md:px-4 py-1.5 md:py-2 border rounded-lg md:rounded-xl text-xs md:text-sm font-medium  transition-all duration-200 ${
                          isActive 
                            ? "bg-[#C9070A] border-[#C9070A] text-white" 
                            : "bg-card border-border text-muted-foreground hover:border-[#C9070A] hover:text-[#C9070A]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {field.type === "datetime" && (
                <DatePicker
                  selected={
                    formData[field.name] ? new Date(formData[field.name]) : null
                  }
                  onChange={(date: Date | null) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: date
                        ? new Date(
                            date.getTime() - date.getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .slice(0, 19)
                        : "",
                    }))
                  }
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  dateFormat="yyyy-MM-dd HH:mm"
                  minDate={new Date()}
                  placeholderText={field.placeholder || "Select date & time"}
                  className="w-full p-2.5 md:p-3 text-sm md:text-base rounded-xl border border-border bg-background/50 focus:border-one focus:ring-4 focus:ring-one/10 outline-none"
                />
              )}

              {field.type === "time" && (
                <DatePicker
                  selected={
                    formData[field.name]
                      ? new Date(`1970-01-01T${formData[field.name]}`)
                      : null
                  }
                  onChange={(date: Date | null) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: date
                        ? new Date(
                            date.getTime() - date.getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .slice(11, 19)
                        : "",
                    }))
                  }
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={5}
                  timeFormat="HH:mm"
                  dateFormat="HH:mm"
                  placeholderText={field.placeholder || "Select time"}
                  className="w-full p-2.5 md:p-3 text-sm md:text-base rounded-xl border border-border bg-background/50 focus:border-one focus:ring-4 focus:ring-one/10 outline-none"
                />
              )}

              {field.type === "datemin" && (
                <DatePicker
                  selected={
                    formData[field.name] ? new Date(formData[field.name]) : null
                  }
                  onChange={(date: Date | null) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: date ? date.toISOString() : "",
                    }))
                  }
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  placeholderText={field.placeholder}
                  className="w-full p-2.5 md:p-3 text-sm md:text-base rounded-xl border border-border bg-background/50 focus:border-one focus:ring-4 focus:ring-one/10 outline-none"
                />
              )}

{field.type === "date" && (
  <div className="relative w-full">
    <DatePicker
      // 1. عند الاستلام: قراءة التاريخ وتحويله إلى كائن Date بأمان (حتى لو جاء بشرطات يحولها لسلاش)
      selected={
        formData[field.name]
          ? new Date(String(formData[field.name]).replace(/-/g, "/"))
          : null
      }
      // 2. عند التغيير والاختيار: صياغة التاريخ يدوياً بصيغة YYYY/MM/DD وإرساله
      onChange={(date: Date | null) => {
        if (!date) {
          setFormData((prev) => ({ ...prev, [field.name]: "" }));
          return;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        // الصيغة المطلوبة تماماً بالسلاش
        const formattedDate = `${year}-${month}-${day}`;

        setFormData((prev) => ({
          ...prev,
          [field.name]: formattedDate,
        }));
      }}
      // 3. طريقة العرض للمستخدم داخل الـ Input
      dateFormat="yyyy/MM/dd" 
      placeholderText={field.placeholder}
      wrapperClassName="w-full"
      className="w-full h-[42px] md:h-[48px] rounded-xl border border-border bg-background px-3 md:px-4 ltr:pr-10 ltr:md:pr-12 rtl:pl-10 rtl:md:pl-12 text-sm md:text-base focus:border-one focus:ring-4 focus:ring-one/10 outline-none"
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
      scrollableYearDropdown
      yearDropdownItemNumber={10}
    />

    <div className="absolute inset-y-0 flex items-center pointer-events-none ltr:right-0 ltr:pr-3 ltr:md:pr-4 rtl:left-0 rtl:pl-3 rtl:md:pl-4">
      <Calendar size={16} className="md:w-[18px] md:h-[18px] text-muted-foreground" />
    </div>
  </div>
)}

              {field.type === "select" && (
                <Select
                  instanceId={field.name}
                  placeholder={field.placeholder}
                  options={field.options}
                  value={
                    field.options?.find(
                      (opt: any) =>
                        String(opt.value) === String(formData[field.name])
                    ) || null
                  }
                  onChange={(selected: any) => {
                    const selectedValue = selected ? selected.value : "";
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: selectedValue,
                    }));
                    if (errors[field.name])
                      setErrors((prev) => ({ ...prev, [field.name]: "" }));
                    if (field.onChange) {
                      field.onChange(selectedValue, setFormData);
                    }
                  }}
                  styles={selectStyles}
                />
              )}

       {field.type === "file" && (
  (() => {
    // 1. تحديد الصورة المعروضة: إما المرفوعة حديثاً أو الرابط القديم من السيرفر بعد تنظيفه
    const currentPreview = previews[field.name] || 
      (typeof field.defaultValue === "string" ? field.defaultValue.replace(/\\/g, "") : null);

    return (
      <label
        className={`relative block group border-2 border-dashed rounded-xl p-3 md:p-4 transition-all cursor-pointer ${
          currentPreview
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <input
          accept="image/png, image/jpeg, image/jpg, image/webp"
          type="file"
          onChange={(e) => handleFileChange(e, field.name)}
          className="hidden"
        />
        <div className="flex items-center gap-3 md:gap-4 text-start relative">
          {/* 2. عرض الصورة الحالية أو الأيقونة الافتراضية */}
          {currentPreview ? (
            <div className="relative inline-block">
              <img
                src={currentPreview}
                alt="preview"
                className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover ring-2 ring-white shadow-md"
              />
            </div>
          ) : (
            <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-one transition-colors">
              <Upload size={20} className="md:w-6 md:h-6" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">
              {tForm('uploadText') || "Click to upload or drag and drop"}
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground">
              {tForm('uploadHint') || "PNG, JPG up to 5MB"}
            </span>
          </div>
        </div>
      </label>
    );
  })()
)}

              {field.type === "pdf" && (
                <div
                  className={`relative group border-2 border-dashed rounded-xl p-3 md:p-4 transition-all ${
                    previews[field.name]
                      ? "border-red-500 bg-red-50"
                      : "border-border hover:border-red-300"
                  }`}
                >
                  <input
                    accept="application/pdf"
                    type="file"
                    onChange={(e) => handleFileChange(e, field.name)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center gap-3 md:gap-4 text-start">
                    {previews[field.name] ? (
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-lg flex flex-col items-center justify-center text-red-600 ring-2 ring-white shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          className="md:w-6 md:h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="text-[9px] md:text-[10px] font-bold mt-1">PDF</span>
                      </div>
                    ) : (
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-red-500 transition-colors">
                        <Upload size={20} className="md:w-6 md:h-6" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-medium text-muted-foreground">
                        {previews[field.name]
                          ? "PDF Selected Successfully"
                          : "Click to upload or drag and drop"}
                      </span>
                      <span className="text-[10px] md:text-xs text-muted-foreground">
                        PDF file up to 5MB
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {field.type === "dynamic-list" && (
                <div className="flex flex-col gap-3">
                  {(formData[field.name] || []).map(
                    (val: string, index: number) => {
                      const orderLabel = String.fromCharCode(65 + index);
                      return (
                        <div key={index} className="flex gap-2 items-center">
                          <span className="font-bold text-muted-foreground w-5 md:w-6 text-xs md:text-sm">
                            {orderLabel}-
                          </span>
                          <input
                            type="text"
                            value={val}
                            placeholder={`Enter Option ${orderLabel}`}
                            className="flex-1 p-2.5 md:p-3 text-sm md:text-base rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            onChange={(e) => {
                              const newValues = [
                                ...(formData[field.name] || []),
                              ];
                              newValues[index] = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                [field.name]: newValues,
                              }));
                            }}
                          />
                          {(formData[field.name] || []).length > 2 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newValues = (
                                  formData[field.name] || []
                                ).filter(
                                  (_: any, i: number) => i !== index
                                );
                                setFormData((prev) => ({
                                  ...prev,
                                  [field.name]: newValues,
                                }));
                              }}
                              className="p-2 md:p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <X size={18} className="md:w-5 md:h-5" />
                            </button>
                          )}
                        </div>
                      );
                    }
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: [...(prev[field.name] || []), ""],
                      }));
                    }}
                    className="flex items-center justify-center gap-2 p-2.5 md:p-3 mt-2 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-one hover:text-one hover:bg-one/5 transition-all font-medium text-sm md:text-base"
                  >
                    <FaPlusSquare size={16} className="md:w-[18px] md:h-[18px]" />
                    <span>Add Option</span>
                  </button>
                </div>
              )}

              {field.type === "switch" && (
                <div className="flex items-center rounded-lg gap-3 md:gap-4 py-2 justify-start">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: prev[field.name] ? 0 : 1,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 md:h-7 md:w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9070A] focus-visible:ring-offset-2 ${
                      formData[field.name] 
                        ? "bg-[#C9070A] shadow-lg shadow-[#C9070A]/30" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/40"
                    }`}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-4 w-4 md:h-5 md:w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-300 ease-in-out ${
                        formData[field.name]
                          ? "translate-x-5 md:translate-x-7 rtl:-translate-x-5 rtl:md:-translate-x-7"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-sm md:text-base font-semibold transition-colors duration-300 ${
                      formData[field.name] ? "text-[#C9070A]" : "text-muted-foreground"
                    }`}
                  >
                    {formData[field.name] ? tTable('active') : tTable('inactive')}
                  </span>
                </div>
              )}

          
         
              {field.type === "custom" && field.render && (
                <div className="w-full">
                  {field.render({
                    value: formData[field.name],
                    onChange: (newValue: any) => {
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: newValue,
                      }));
                      if (errors[field.name])
                        setErrors((prev) => ({ ...prev, [field.name]: "" }));
                    },
                    error: errors[field.name],
                    formData: formData,
                    field: field,
                    setFormData: setFormData,
                  })}
                  {errors[field.name] && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors[field.name]}
                    </p>
                  )}
                </div>
              )}

              {/* Helper Text & Errors */}
              {field.helperText && !errors[field.name] && (
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 justify-start">
                  <Info size={12} /> {field.helperText}
                </p>
              )}
              {errors[field.name] && field.type !== "custom" && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 justify-start mt-1.5">
                  <AlertCircle size={14} /> {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-background min-h-screen text-start">
      {/* Header */}
      <div className="mx-auto mb-4 md:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            {title}
          </h1>
        </div>
        {showCancel && (
          
        <button
          onClick={() => router.back()}
          type="button"
          className="flex items-center justify-center md:w-fit w-full gap-2 px-4 py-2.5 md:py-2 bg-card border border-border text-muted-foreground rounded-xl hover:bg-background transition-all shadow-sm"
        >
          <ArrowLeft className="rtl:-scale-x-100" size={18} />
          <span>{tForm('cancel')}</span>
        </button>
        )}
      </div>

      <form
        onSubmit={async (e) => {
          
          e.preventDefault();
          if (!validateForm()) return;
          try {
            setIsSubmitting(true);
            await onSave(formData);
          } catch (err) {
            console.error(err);
          } finally {
            setIsSubmitting(false);
          }
        }}
        className="mx-auto space-y-4 md:space-y-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start">
          {/* Main Column - يسار */}
          <div className="flex-1 w-full flex flex-col gap-4 md:gap-6">
            {mainSections.map(([sectionTitle, sec]) =>
              renderSection(sectionTitle, sec.fields)
            )}
          </div>

          {/* Sidebar Column - يمين */}
          {sidebarSections.length > 0 && (
            <div className="w-full lg:w-80 flex flex-col gap-4 md:gap-6 lg:shrink-0">
              {sidebarSections.map(([sectionTitle, sec]) =>
                renderSection(sectionTitle, sec.fields)
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3 md:gap-4 pb-8 md:pb-12 pt-4">
          
          <button
            type="submit"
            disabled={isSubmitting || isSaving}
            className="w-full md:w-auto px-8 md:px-12 py-3 md:py-3 bg-primary text-white rounded-xl font-bold shadow-xl shadow-one/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {isSubmitting || isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>{tForm('save')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPage;
