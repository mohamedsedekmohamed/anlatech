import type { Metadata } from "next";
import { Poppins, IBM_Plex_Sans_Arabic } from "next/font/google";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";
import AOSInit from "@/components/shared/AOSInit";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  let title = "Store";
  let logo1 = "/favicon.ico";
  let logo2 = "";

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://anlatech.mazoom.online/api';
    const res = await fetch(`${baseUrl}/user/footer?local=${locale}`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data?.data) {
      title = data.data.brand_name || title;
      if (data.data.logo_url) {
        logo1 = data.data.logo_url;
      }
      if (data.data.logo_url1) {
        logo2 = data.data.logo_url1;
      }
    }
  } catch (error) {
    console.warn("Failed to fetch metadata settings from API, using default metadata.");
  }

  const description = locale === 'ar'
    ? 'اكتشف أفضل حلول المنازل الذكية، الإضاءة الفاخرة، الصنابير العصرية، والأدوات الصحية الراقية. تسوق أفضل منتجات أتمتة المنزل والتشطيبات.'
    : 'Discover the best Smart Home solutions, Luxury Lighting, modern Faucets, and premium Sanitaryware. Shop top quality home automation and fixtures.';

  const ogImages = [];
  if (logo1 !== "/favicon.ico") ogImages.push({ url: logo1, alt: title });
  if (logo2) ogImages.push({ url: logo2, alt: title });
  if (ogImages.length === 0) ogImages.push({ url: "/favicon.ico", alt: title });

  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
    keywords: [
      "Smart Home", "Lighting", "Faucets", "Sanitaryware", "Home Automation",
      "منازل ذكية", "إضاءة", "صنابير", "أدوات صحية", "تشطيبات", "سمارت هوم"
    ],
    authors: [{ name: title }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      siteName: title,
      images: ogImages,
      locale: locale === 'ar' ? 'ar_AR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map(img => img.url),
    },
    icons: {
      icon: logo1,
      shortcut: logo1,
      apple: logo1,
    }
  };
}
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${locale === "ar" ? ibmArabic.className : poppins.className} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AOSInit />
          <Toaster position="top-center" />
          {children}
          <FloatingWhatsApp />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
