'use client';

// Mock login (client component)
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Icons } from '@/components/Icons';
import Link from 'next/link';

function LoginForm() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/products';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting login...");
      console.log("Supabase URL present:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);

      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("SignIn result:", signInError ? "Error" : "Success", signInError);

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      console.log("Login successful! Redirecting to:", redirectTo);

      // Force hard redirect using assign (most reliable)
      setTimeout(() => {
        window.location.assign(redirectTo);
      }, 500);
    } catch (err: unknown) {
      console.error('Unexpected error:', err);
      setError("An unexpected error occurred. Check console.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E5E5] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Welcome to Luc<span className="text-[#007AFF]">Carts</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Choose one of the option to go
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent sm:text-sm bg-white shadow-sm"
                placeholder="E-mail"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent sm:text-sm bg-white shadow-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Social Logins */}
          <div className="space-y-4">
            <div className="relative flex items-center justify-center">
              <span className="bg-[#E5E5E5] px-2 text-sm text-gray-500">Or continue with</span>
            </div>

            <div className="flex justify-center gap-4">
              {/* Google */}
              <button type="button" className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center border border-gray-100">
                <Icons.Google className="w-6 h-6 text-[#4285F4]" />
              </button>

              {/* Meta / Facebook */}
              <button type="button" className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center border border-gray-100">
                <Icons.Meta className="w-6 h-6 text-[#0062E0]" />
              </button>

              {/* Apple */}
              <button type="button" className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center border border-gray-100">
                <Icons.Apple className="w-6 h-6 text-black" />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-base font-semibold text-white bg-[#007AFF] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors"
          >
            {isLoading ? 'Processing...' : 'Log in'}
          </button>

          {/* Link to Signup */}
          <div className="text-center mt-4">
            <Link href="/signup" className="text-sm text-gray-500 hover:text-[#007AFF]">
              Don&apos;t have an account? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
