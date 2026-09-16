"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import ROUTES from '@/core/manager/route.manager';


const Page = () => {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    router.replace(`/${locale}${ROUTES.dashboard.admin}`);
  }, [router, locale]);

  return null;
};

export default Page;