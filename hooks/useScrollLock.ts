"use client";
import { useEffect } from "react";

export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Lock scroll
    document.body.style.overflow = "hidden";

    return () => {
      // Restore scroll when unmounted or unlocked
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]);
}
