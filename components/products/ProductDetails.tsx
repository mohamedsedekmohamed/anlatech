'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { productsUser } from '@/services/products';
import { useApiGet } from '@/hooks/useApi';
import { ArrowRight, ArrowLeft, ShoppingCart, FileText } from 'lucide-react';

interface ProductGallery { id: number; image: string; }
interface ProductInfo {
  id: string; name: string; description: string; image: string;
  price: string; discount: string; final_price: string;
  category: string; category_id?: number; variations: any[];
  pdf?: string | null;
}
interface ProductDetailsData { product: ProductInfo; gallery: ProductGallery[]; }
interface ProductDetailsProps { productId: string; }

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { data, isLoading, error } = useApiGet(productsUser.getProductDetails, productId, locale);

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});

  if (isLoading) {
    return (
      <div className="py-24 bg-background min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) return null;

  const productData = data?.data || data;
  const product = productData?.product;
  const gallery = productData?.gallery || [];

  if (!product) return null;

  const currentImage = activeImage || product.image;
  const fullGallery = [{ id: 0, image: product.image }, ...(gallery || [])];

  return (
    <div className="bg-background min-h-screen py-16  text-white">
      <div className="container">

        <div className="flex flex-col lg:flex-row gap-16 items-center">

          {/* Left: Gallery */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6">
            <div className="relative w-full aspect-4/5 rounded-3xl bg-card/2 border border-white/5 overflow-hidden flex items-center justify-center">
              <Image src={currentImage} alt={product.name} fill className="object-contain p-8 transition-transform duration-700 hover:scale-105" />
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {fullGallery.map((img, idx) => (
                <button key={img.id || idx} onClick={() => setActiveImage(img.image)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${currentImage === img.image ? 'border-primary' : 'border-transparent bg-card/3 hover:border-white/20'}`}>
                  <Image src={img.image} alt="thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-7/12 flex flex-col">

            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6">{product.name}</h1>

            <p className="text-neutral-400 text-lg leading-relaxed mb-10">{product.description}</p>

            {/* Variations */}
            {product.variations?.length > 0 && (
              <div className="space-y-6 pt-8 border-t border-white/5 mb-10">
                {product.variations.map((v: any) => (
                  <div key={v.id}>
                    <h3 className="font-bold mb-4 text-neutral-300">{v.name}</h3>
                    <div className="flex flex-wrap gap-3">
                      {v.options.map((opt: any) => (
                        <button key={opt.id} onClick={() => setSelectedOptions(prev => ({ ...prev, [v.id]: opt.id }))}
                          className={`px-6 py-3 rounded-xl border transition-all bg-card/2 border-white/5 hover:border-primary/50`}>
                          {opt.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PDF Button */}
            {product.pdf && product.pdf.trim() !== '' && (
              <div className="pt-4 mt-auto">
                <a 
                  href={product.pdf} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white rounded-xl font-semibold transition-all duration-300 w-fit group"
                >
                  <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{isRtl ? 'عرض التفاصيل (PDF)' : 'View Details (PDF)'}</span>
                </a>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
