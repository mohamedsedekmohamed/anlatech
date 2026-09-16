import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  iconBgColor = 'bg-primary/10', 
  iconColor = 'text-primary' 
}: StatsCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
          {title}
        </span>
        <span className="text-2xl font-black text-foreground leading-none">
          {value}
        </span>
      </div>
    </div>
  );
}
