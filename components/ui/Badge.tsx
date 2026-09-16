import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  outline?: boolean;
}

export default function Badge({ children, variant = 'neutral', className = '', outline = false }: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors';
  
  const variants = {
    success: outline ? 'text-primary border border-primary bg-emerald-50/50' : 'bg-emerald-50 text-primary',
    danger: outline ? 'text-red-600 border border-red-200 bg-red-50/50' : 'bg-red-50 text-red-700',
    warning: outline ? 'text-amber-600 border border-amber-200 bg-amber-50/50' : 'bg-amber-50 text-amber-700',
    info: outline ? 'text-blue-600 border border-blue-200 bg-blue-50/50' : 'bg-blue-50 text-blue-700',
    neutral: outline ? 'text-muted-foreground border border-border bg-muted/50' : 'bg-muted text-foreground',
    primary: outline ? 'text-primary border border-primary/20 bg-primary/5' : 'bg-primary/10 text-primary',
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
