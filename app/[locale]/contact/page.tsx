'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { userHome } from '@/services/userHome';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/ui/PageHero';
import { contactuser } from '@/services/userContact';
import { useApiAction } from '@/hooks/useApi';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const { execute: addContact } = useApiAction(contactuser.postcontact, {
    showSuccessToast: true,
    successMsg: 'Contact sent successfully',
  });

  const { data: response, isLoading } = useApiGet(userHome.getFooter, locale);
  const contactData = response?.data;

  const [form, setForm] = React.useState({
    f_name: '',
    l_name: '',
    phone: '',
    email: '',
    title: '',
    content: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addContact(form);
    setForm({
      f_name: '',
      l_name: '',
      phone: '',
      email: '',
      title: '',
      content: '',
    });
  };

  if (isLoading) {
    return (
      <main className="bg-card text-foreground min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow py-24 md:py-32 animate-pulse">
          <div className="container space-y-8">
            <div className="h-12 w-48 bg-neutral-900 rounded-full mx-auto"></div>
            <div className="h-6 w-96 bg-neutral-900 rounded-full mx-auto mb-16"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="h-44 bg-neutral-900/60 rounded-[2rem]"></div>
              <div className="h-44 bg-neutral-900/60 rounded-[2rem]"></div>
              <div className="h-44 bg-neutral-900/60 rounded-[2rem]"></div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-card text-foreground min-h-screen flex flex-col relative selection:bg-primary/40 selection:text-white">
      <Navbar />

      {/* Cinematic Ambient Lighting wrapped to prevent horizontal scroll */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-[180px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[140px]" />
      </div>

      <PageHero 
        title={isRtl ? 'نحن هنا لخدمتك' : 'We are here for you'}
        subtitle={isRtl ? 'لديك استفسار أو طلب خاص؟ لا تتردد في التواصل معنا عبر قنواتنا المتاحة، وسنكون سعداء بالرد عليك في أقرب وقت.' : 'Have a question or a special request? Feel free to reach out through our available channels, and we will be happy to respond as soon as possible.'}
      />

      <div className="flex-grow relative z-10 pb-24 md:pb-36">
        <div className="container">

          {/* ── Contact Info Cards (Bento Style) ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20" dir={isRtl ? 'rtl' : 'ltr'}>

            {/* Phone Card */}
            <div data-aos="fade-up" data-aos-delay="100" className="bg-card/2 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 text-center hover:border-primary/30 hover:bg-card/[0.03] transition-all duration-500 group shadow-xl shadow-black/40">
              <div className="w-14 h-14 mx-auto bg-card/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-white/5 shadow-inner">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-wide">
                {isRtl ? 'رقم الهاتف' : 'Phone Number'}
              </h3>
              {contactData?.phone ? (
                <a href={`tel:${contactData.phone}`} className="text-neutral-400 hover:text-primary font-light transition-colors duration-300 text-base block" dir="ltr">
                  {contactData.phone}
                </a>
              ) : (
                <p className="text-neutral-400 font-light text-base" dir="ltr">+966 50 123 4567</p>
              )}
            </div>

            {/* Email Card */}
            <div data-aos="fade-up" data-aos-delay="200" className="bg-card/2 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 text-center hover:border-primary/30 hover:bg-card/[0.03] transition-all duration-500 group shadow-xl shadow-black/40">
              <div className="w-14 h-14 mx-auto bg-card/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-white/5 shadow-inner">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-wide">
                {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
              </h3>
              {contactData?.email ? (
                <a href={`mailto:${contactData.email}`} className="text-neutral-400 hover:text-primary font-light transition-colors duration-300 text-base break-all block">
                  {contactData.email}
                </a>
              ) : (
                <p className="text-neutral-400 font-light text-base">support@example.com</p>
              )}
            </div>

            {/* Location Card */}
            <div data-aos="fade-up" data-aos-delay="300" className="bg-card/2 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 text-center hover:border-primary/30 hover:bg-card/[0.03] transition-all duration-500 group shadow-xl shadow-black/40">
              <div className="w-14 h-14 mx-auto bg-card/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-white/5 shadow-inner">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-wide">
                {isRtl ? 'العنوان' : 'Location'}
              </h3>
              {contactData?.map ? (
                <a href={contactData.map} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary font-light transition-colors duration-300 text-sm sm:text-base leading-relaxed block">
                  {contactData?.address || (isRtl ? 'المملكة العربية السعودية، الرياض' : 'Saudi Arabia, Riyadh')}
                </a>
              ) : (
                <p className="text-neutral-400 font-light text-sm sm:text-base leading-relaxed">
                  {contactData?.address || (isRtl ? 'المملكة العربية السعودية، الرياض' : 'Saudi Arabia, Riyadh')}
                </p>
              )}
            </div>

          </div>

          {/* ── Contact Form (Premium Premium Layout) ── */}
          <div data-aos="fade-up" data-aos-delay="400" className="bg-card/[0.01] border border-white/5 backdrop-blur-sm rounded-[3rem] p-8 sm:p-12 max-w-4xl mx-auto shadow-2xl shadow-black/50 mb-20 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-2 tracking-tight">
              {isRtl ? 'أرسل لنا رسالة تواصل' : 'Send us a message'}
            </h2>
            <p className="text-center text-neutral-400 font-light text-sm sm:text-base mb-10">
              {isRtl ? 'سنقوم بالرد عليك في أقرب وقت ممكن' : 'We will get back to you as soon as possible'}
            </p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex flex-col gap-2">
                <input
                  name="f_name"
                  value={form.f_name}
                  onChange={handleChange}
                  placeholder={isRtl ? 'الاسم الأول' : 'First Name'}
                  className="w-full p-4 sm:p-5 bg-card/2 border border-white/10 rounded-2xl outline-none text-white text-sm placeholder-neutral-500 focus:border-primary focus:bg-card/[0.04] transition-all duration-300"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  name="l_name"
                  value={form.l_name}
                  onChange={handleChange}
                  placeholder={isRtl ? 'اسم العائلة' : 'Last Name'}
                  className="w-full p-4 sm:p-5 bg-card/2 border border-white/10 rounded-2xl outline-none text-white text-sm placeholder-neutral-500 focus:border-primary focus:bg-card/[0.04] transition-all duration-300"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={isRtl ? 'رقم الهاتف' : 'Phone'}
                  className="w-full p-4 sm:p-5 bg-card/2 border border-white/10 rounded-2xl outline-none text-white text-sm placeholder-neutral-500 focus:border-primary focus:bg-card/[0.04] transition-all duration-300"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                  className="w-full p-4 sm:p-5 bg-card/2 border border-white/10 rounded-2xl outline-none text-white text-sm placeholder-neutral-500 focus:border-primary focus:bg-card/[0.04] transition-all duration-300"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder={isRtl ? 'عنوان الرسالة' : 'Subject'}
                  className="w-full p-4 sm:p-5 bg-card/2 border border-white/10 rounded-2xl outline-none text-white text-sm placeholder-neutral-500 focus:border-primary focus:bg-card/[0.04] transition-all duration-300"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder={isRtl ? 'اكتب رسالتك هنا...' : 'Write your message...'}
                  className="w-full p-4 sm:p-5 bg-card/2 border border-white/10 rounded-2xl outline-none text-white text-sm placeholder-neutral-500 focus:border-primary focus:bg-card/[0.04] transition-all duration-300 min-h-[150px] max-h-[300px]"
                  required
                />
              </div>

              {/* Action Submit Button with high-end hover overlay */}
              <button
                type="submit"
                className="md:col-span-2 relative w-full py-5 bg-primary text-white hover:bg-primary-500 rounded-2xl font-bold text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(123,37,37,0.4)] hover:shadow-[0_6px_30px_rgba(123,37,37,0.6)] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isRtl ? 'إرسال الرسالة' : 'Send Message'}
                  <Send className="w-4 h-4" />
                </span>
              </button>

            </form>
          </div>

          {/* ── Social Media Links block ── */}
          <div data-aos="fade-up" data-aos-delay="500" className="bg-card/[0.01] border border-white/5 rounded-[3rem] p-8 sm:p-12 text-center max-w-4xl mx-auto flex flex-col items-center shadow-xl shadow-black/40" dir={isRtl ? 'rtl' : 'ltr'}>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-wide">
              {isRtl ? 'تواصل معنا عبر منصاتنا' : 'Connect with us socially'}
            </h2>
            <p className="text-neutral-400 font-light text-sm sm:text-base mb-8 max-w-xl leading-relaxed">
              {isRtl
                ? 'تابعنا على مواقع التواصل الاجتماعي ليصلك كل جديد ولتبقى على اطلاع دائم بآخر خدماتنا ومنتجاتنا.'
                : 'Follow us on social media to get the latest updates and stay informed about our latest services and products.'}
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              {contactData?.wattsapp && (
                <a href={`https://wa.me/${contactData.wattsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3.5 bg-primary/10 border border-primary/20 text-primary rounded-xl font-semibold text-sm hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              )}

              {contactData?.facebook && (
                <a href={contactData.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl font-semibold text-sm hover:bg-blue-500 hover:text-white hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300">
                  <Facebook className="w-4 h-4" />
                  Facebook
                </a>
              )}

              {contactData?.insta && (
                <a href={contactData.insta} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl font-semibold text-sm hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:text-white hover:shadow-xl hover:shadow-pink-500/20 hover:-translate-y-0.5 transition-all duration-300">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              )}

              {contactData?.tiktok && (
                <a href={contactData.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3.5 bg-card/5 border border-white/10 text-neutral-300 rounded-xl font-semibold text-sm hover:bg-card hover:text-foreground hover:-translate-y-0.5 transition-all duration-300">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                  TikTok
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}