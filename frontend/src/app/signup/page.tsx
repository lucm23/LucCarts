'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Icons } from '@/components/Icons';
import Link from 'next/link';

export default function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/products';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const supabase = createClient();

            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (signUpError) {
                setError(signUpError.message);
                setIsLoading(false);
                return;
            }

            // If auto-confirm is enabled in Supabase (default for dev often), user gets signed in.
            // If email confirm is on, we should tell them to check email.
            // For now, assume auto-confirm or check if we got a session.
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                console.log("Signup successful! Redirecting...");
                setTimeout(() => {
                    window.location.assign(redirectTo);
                }, 500);
            } else {
                // Email confirmation required case
                setError("Account created! Please check your email to verify.");
                setIsLoading(false);
            }

        } catch (err: any) {
            console.error("Unexpected error:", err);
            setError("An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#E5E5E5] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-black">
                        Create Account
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Sign up to start shopping on Luc<span className="text-[#007AFF]">Carts</span>
                    </p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className={`p-3 rounded-lg text-sm text-center ${error.includes('check your email') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent sm:text-sm bg-white shadow-sm"
                                placeholder="Full Name"
                            />
                        </div>
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
                        <div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent sm:text-sm bg-white shadow-sm"
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-base font-semibold text-white bg-[#007AFF] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    {/* Back to Login */}
                    <div className="text-center mt-4">
                        <Link href="/login" className="text-sm text-gray-500 hover:text-[#007AFF]">
                            Already have an account? Log in
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
}
