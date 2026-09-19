'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { resolveImageUrl, DEFAULT_IMAGES } from '@/utils/imageHelper';

interface Product {
  id: number | string;
  name: string;
  description?: string;
  image?: string;
  image_url?: string;
  price?: string | number;
  final_price?: string | number;
  discount?: string | number;
  pdf?: string | null;
}

interface ProductCardProps {
  product: Product;
  locale: string;
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const initialSrc = resolveImageUrl(product.image_url || product.image, 'product');
  const [imgSrc, setImgSrc] = useState(initialSrc);

  return (
    <Link
      href={`/${locale}/catalog/${product.id}`}
      className="group relative flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 transition-all duration-400"
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-background overflow-hidden">
        <Image
          src={imgSrc}
          alt={product.name || 'Product'}
          fill
          className="object-cover p-5 group-hover:scale-105 transition-transform duration-600 ease-out"
          sizes="(max-width: 768px) 50vw, 25vw"
          onError={() => setImgSrc(DEFAULT_IMAGES.product)}
        />
        
        {/* PDF Link Overlay */}
        {product.pdf && product.pdf.trim() !== '' && (
          <div 
            className="absolute top-3 right-3 z-10"
            onClick={(e) => e.preventDefault()}
          >
            <a 
              href={product.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-background/80 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md hover:scale-110"
              title="View PDF"
            >
              <FileText className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-base md:text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-snug">
          {product.name}
        </h3>
        {product.price && (
          <p className="text-sm font-semibold text-primary mt-1">
            ${product.price}
          </p>
        )}
      </div>
    </Link>
  );
}
