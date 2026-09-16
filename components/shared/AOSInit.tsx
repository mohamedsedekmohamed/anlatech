'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: false, // تعيينها إلى false ليتم التفعيل على الهواتف
      duration: 700,
      easing: 'ease-out-cubic',
    });
  }, []);

  return null;
}
//