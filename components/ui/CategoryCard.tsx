import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: number | string;
  name: string;
  description?: string;
  image?: string;
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

  if (!isPrimary) {
    // Sub-category variant — vertical modern card
    const cardContent = (
      <div className={`group relative flex flex-col p-4 rounded-3xl border transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'bg-primary border-primary shadow-lg shadow-primary/25'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1'
      }`}>
        {/* Subtle background accent on hover */}
        {!isSelected && (
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}

        <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 shrink-0 p-2 flex items-center justify-center transition-colors duration-300 ${isSelected ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-110 drop-shadow-lg"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-2xl font-bold ${isSelected ? 'text-white' : 'text-white/20'}`}>
              {category.name.charAt(0).toUpperCase()}
            </div>
          )}
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

    const href = `/${locale}/companies/${category.id}?name=${encodeURIComponent(category.name)}${category.description ? `&desc=${encodeURIComponent(category.description)}` : ''}${category.image ? `&img=${encodeURIComponent(category.image)}` : ''}`;
    
    if (onClick) {
      return <button onClick={onClick} className="w-full text-left outline-none">{cardContent}</button>;
    }
    return <Link href={href}>{cardContent}</Link>;
  }

  // Primary variant — Circular style (matching home section)
  const primaryContent = (
    <div className={`group flex flex-col items-center text-center outline-none transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}>
      <div className={`relative w-full aspect-square mb-3 rounded-full bg-white border-2 shadow-sm overflow-hidden transition-all duration-300 p-2 flex items-center justify-center ${
        isSelected
          ? 'border-primary shadow-lg -translate-y-2'
          : 'border-transparent group-hover:border-primary/50 group-hover:shadow-md group-hover:-translate-y-1'
      }`}>
        <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-50">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className={`object-cover transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
              {category.name.charAt(0).toUpperCase()}
            </div>
          )}
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

      {category.description && (
        <p className="text-xs text-white/50 mt-1 line-clamp-2 max-w-[90%] mx-auto">
          {category.description}
        </p>
      )}
    </div>
  );

    const href = `/${locale}/companies/${category.id}?name=${encodeURIComponent(category.name)}${category.description ? `&desc=${encodeURIComponent(category.description)}` : ''}${category.image ? `&img=${encodeURIComponent(category.image)}` : ''}`;

  if (onClick) {
    return <button onClick={onClick} className="w-full text-left outline-none">{primaryContent}</button>;
  }
  return <Link href={href}>{primaryContent}</Link>;
}
