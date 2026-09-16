import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';

// ─── 1. Hook for GET Requests (Auto Execute) ────────────────────────
// في الغالب مش بنظهر Toast للنجاح في الـ GET عشان متزعجش المستخدم، لكن بنظهر Toast للخطأ
export function useApiGet<T extends (...args: any[]) => Promise<any>>(
  apiFunction: T,
  ...args: Parameters<T> 
) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isFirstLoad = useRef(true);
  const t = useTranslations("common");

  const execute = useCallback(async () => {
    setIsFetching(true);
    if (isFirstLoad.current) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const response = await apiFunction(...args);
      const responseData = response?.data !== undefined ? response.data : response;
      setData(responseData);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || t("fetchError");
      setError(errorMessage);
      toast.error(errorMessage); 
    } finally {
      setIsLoading(false);
      setIsFetching(false);
      isFirstLoad.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFunction, JSON.stringify(args)]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, isLoading, isFetching, error, refetch: execute };
}

// ─── Options Interface لطلبات الـ Action ────────────────────────
interface ActionOptions {
  showSuccessToast?: boolean; // الافتراضي: true
  showErrorToast?: boolean;   // الافتراضي: true
  successMsg?: string;        // لو عايز رسالة مخصصة غير اللي جاية من السيرفر
}

// ─── 2. Hook for POST/PUT/DELETE Requests (Manual Execute) ──────────
export function useApiAction<T extends (...args: any[]) => Promise<any>>(
  apiFunction: T,
  options: ActionOptions = {}
) {
  const {
    showSuccessToast = true,
    showErrorToast = true,
    successMsg,
  } = options;

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const t = useTranslations("common");

  const execute = async (...args: Parameters<T>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFunction(...args);
      const responseData =
        response?.data !== undefined ? response.data : response;

      setData(responseData);

      if (showSuccessToast) {
        toast.success(successMsg || responseData?.message || t("operationSuccessful"));
      }

      return {
        success: true,
        data: responseData,
      };
    } catch (err: any) {
      const responseData = err?.response?.data;
      const responseErrors = responseData?.errors || {};

      // تجميع كل الأخطاء من الـ errors object
      const allErrors: string[] = (
        Object.values(responseErrors) as any[]
      )
        .flat()
        .filter(Boolean);

      const errorMessage =
        responseData?.message ||
        allErrors[0] ||
        err.message ||
        t("unexpectedError");

      setError(responseErrors);

      if (showErrorToast) {
        if (allErrors.length > 0) {
          allErrors.forEach((msg: string) => {
            toast.error(msg);
          });
        } else {
          toast.error(errorMessage);
        }
      }

      return {
        success: false,
        error: responseErrors,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, data, isLoading, error };
}
