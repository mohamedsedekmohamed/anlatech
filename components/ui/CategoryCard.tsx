'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { resolveImageUrl, DEFAULT_IMAGES } from '@/utils/imageHelper';

interface Category {
  id: number | string;
  name: string;
  description?: string;
  image?: string;
  image_url?: string;
}

interface CategoryCardProps {
  category: Category;
  locale: string;
  variant?: 'primary' | 'sub';
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CategoryCard({ category, locale, variant = 'primary', isSelected = false, onClick }: CategoryCardProps) {
  const isPrimary = variant === 'primary';
  const initialSrc = resolveImageUrl(category.image_url || category.image, 'category');
  const [imgSrc, setImgSrc] = useState(initialSrc);

  if (!isPrimary) {
    const cardContent = (
      <div className={`group relative flex flex-col p-4 rounded-3xl border transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'bg-primary border-primary shadow-lg shadow-primary/25'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1'
      }`}>
        {!isSelected && (
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}

        <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 shrink-0 p-2 flex items-center justify-center transition-colors duration-300 ${isSelected ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
          <Image
            src={imgSrc}
            alt={category.name || 'Category'}
            fill
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-110 drop-shadow-lg"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
            onError={() => setImgSrc(DEFAULT_IMAGES.category)}
          />
        </div>

        <div className="flex flex-col text-center flex-1">
          <h4 className={`font-bold text-sm md:text-base leading-snug transition-colors min-h-[2.5rem] flex items-center justify-center ${
            isSelected ? 'text-white' : 'text-white group-hover:text-primary'
          }`}>
            <span className="line-clamp-2">{category.name}</span>
          </h4>
          {category.description && (
            <p className={`text-xs mt-2 line-clamp-2 ${isSelected ? 'text-white/70' : 'text-white/50'}`}>
              {category.description}
            </p>
          )}
        </div>
      </div>
    );

    const href = `/${locale}/companies/${category.id}?name=${encodeURIComponent(category.name)}${category.description ? `&desc=${encodeURIComponent(category.description)}` : ''}`;
    
    if (onClick) {
      return <button onClick={onClick} className="w-full text-left outline-none">{cardContent}</button>;
    }
    return <Link href={href}>{cardContent}</Link>;
  }

  // Primary variant
  const primaryContent = (
    <div className={`group flex flex-col items-center text-center outline-none transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}>
      <div className={`relative w-full aspect-square mb-3 rounded-full bg-white border-2 shadow-sm overflow-hidden transition-all duration-300 p-2 flex items-center justify-center ${
        isSelected
          ? 'border-primary shadow-lg -translate-y-2'
          : 'border-transparent group-hover:border-primary/50 group-hover:shadow-md group-hover:-translate-y-1'
      }`}>
        <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-50">
          <Image
            src={imgSrc}
            alt={category.name || 'Category'}
            fill
            className={`object-cover transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
            onError={() => setImgSrc(DEFAULT_IMAGES.category)}
          />
        </div>
        {isSelected && (
          <div className="absolute inset-0 rounded-full ring-2 ring-primary ring-offset-2 pointer-events-none" />
        )}
      </div>

      <div className="min-h-[2.5rem] flex items-start justify-center w-full">
        <h3 className={`font-bold text-sm md:text-base transition-colors line-clamp-2 ${
          isSelected ? 'text-primary' : 'text-white group-hover:text-primary'
        }`}>
          {category.name}
        </h3>
      </div>
    </div>
  );

  const href = `/${locale}/companies/${category.id}?name=${encodeURIComponent(category.name)}${category.description ? `&desc=${encodeURIComponent(category.description)}` : ''}`;

  if (onClick) {
    return <button onClick={onClick} className="w-full text-left outline-none">{primaryContent}</button>;
  }
  return <Link href={href}>{primaryContent}</Link>;
}
