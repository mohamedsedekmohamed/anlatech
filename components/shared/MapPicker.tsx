'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const MapPickerCore = dynamic(() => import('./MapPickerCore'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-background border border-border rounded-xl flex items-center justify-center text-muted-foreground">
      <div className="animate-pulse flex items-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>Loading Map...</span>
      </div>
    </div>
  )
}); 

interface MapPickerProps {
  lat: string | null;
  lng: string | null;
  address?: string | null;
  onChange: (lat: string, lng: string) => void;
  onAddressFetch?: (address: string) => void;
}

export default function MapPicker(props: MapPickerProps) {
  return <MapPickerCore {...props} />;
}
