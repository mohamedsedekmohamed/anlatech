'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export default function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const t = useTranslations('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Message */}
      {error && (
        <div className="p-3 md:p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-start">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-500/90">{error}</p>
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">
          {t('email')}
        </label>
        <div className="relative">
          <Mail className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="w-full bg-background border border-border hover:border-[#d1d1d1] focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl ps-10 pe-4 py-3 text-foreground placeholder-[#a1a1a1] text-sm outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">
          {t('password')}
        </label>
        <div className="relative">
          <Lock className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('passwordPlaceholder')}
            className="w-full bg-background border border-border hover:border-[#d1d1d1] focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl ps-10 pe-11 py-3 text-foreground placeholder-[#a1a1a1] text-sm outline-none transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Forgot password */}
      {/* <div className="flex justify-end">
        <button
          type="button"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          {t('forgotPassword')}
        </button>
      </div> */}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full relative overflow-hidden rounded-xl py-3.5 px-4 font-semibold text-sm text-white bg-primary hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-primary/20 transition-all duration-200 active:scale-[0.98] mt-2"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {t('loading')}
          </span>
        ) : (
          t('submit')
        )}
      </button>
    </form>
  );
}
