import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, FileText } from 'lucide-react';

interface Product {
  id: number | string;
  name: string;
  description?: string;
  image?: string;
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
  return (
    <Link
      href={`/${locale}/catalog/${product.id}`}
      className="group relative flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 transition-all duration-400"
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-background overflow-hidden">
        {product.image && product.image.trim() !== '' ? (
          <Image
            src={product.image}
            alt={product.name || 'Product'}
            fill
            className="object-cover p-5 group-hover:scale-105 transition-transform duration-600 ease-out"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-background">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">No Image</span>
          </div>
        )}
        
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

        {/* {product.description && (
          <p className="text-xs md:text-sm text-[#a1a1a1] line-clamp-2 mt-1 mb-3 grow leading-relaxed">
            {product.description}
          </p>
        )} */}
      </div>
    </Link>
  );
}
