import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-md flex flex-col items-center justify-center min-h-[100dvh]">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="w-20 h-20 border-2 border-primary/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
        {/* Inner spinning ring */}
        <div className="w-20 h-20 border-t-2 border-l-2 border-primary rounded-full animate-spin absolute inset-0"></div>
        {/* Center pulse */}
        <div className="w-8 h-8 bg-primary/20 rounded-full absolute animate-pulse"></div>
      </div>
    </div>
  );
}
