'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { AnimatedRing } from '@/components/AnimatedRing';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#111] relative overflow-hidden px-4">
      <div className="relative z-10 ring-container">
        <AnimatedRing>
          <h2 className="text-5xl text-white font-quicksand font-light">Login</h2>
          
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}

            <div className="relative w-full">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="relative w-full py-3 px-5 bg-transparent border-2 border-white rounded-full text-xl text-white outline-none placeholder:text-white/75"
                placeholder="Email"
              />
            </div>

            <div className="relative w-full">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="relative w-full py-3 px-5 bg-transparent border-2 border-white rounded-full text-xl text-white outline-none placeholder:text-white/75"
                placeholder="Password"
              />
            </div>

            <div className="relative w-full">
              <input
                type="submit"
                value={isLoading ? 'Signing in...' : 'Sign in'}
                disabled={isLoading}
                className="w-full py-3 px-5 bg-gradient-to-r from-[#ff357a] to-[#fff172] border-none rounded-full text-xl text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="relative w-full flex items-center justify-between px-5">
              <Link href="#" className="text-white no-underline text-base hover:underline">
                Forget Password
              </Link>
              <Link href="/auth/register" className="text-white no-underline text-base hover:underline">
                Signup
              </Link>
            </div>

            {/* Back to home */}
            <div className="text-center">
              <Link href="/" className="text-sm text-white/60 hover:text-white transition">
                ← Back to home
              </Link>
            </div>
          </form>
        </AnimatedRing>
      </div>
    </main>
  );
}
