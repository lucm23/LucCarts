'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('customer');
    const [message, setMessage] = useState<string | null>(null);

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        async function getProfile() {
            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/login');
                    return;
                }

                setEmail(user.email || '');

                const { data, error } = await supabase
                    .from('profiles')
                    .select('full_name, role')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    // PGRST116 means no rows returned - this is OK for new users
                    if (error.code === 'PGRST116') {
                        console.log('No profile found yet - will be created on first update');
                        // Set default values
                        setFullName('');
                        setRole('customer');
                    } else {
                        console.error('Error loading profile:', error);
                        throw error;
                    }
                } else if (data) {
                    setFullName(data.full_name || '');
                    setRole(data.role || 'customer');
                }
            } catch (error) {
                console.error('Error loading user data!', error);
            } finally {
                setLoading(false);
            }
        }

        getProfile();
    }, [router, supabase]);

    async function updateProfile() {
        try {
            setLoading(true);
            setMessage(null);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('No user');

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: fullName,
                    email: user.email,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating the data!', error);
            setMessage('Error updating profile.');
        } finally {
            setLoading(false);
        }
    }

    async function handleSignOut() {
        try {
            await supabase.auth.signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
                {/* Header with User Name */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Icons.User className="w-6 h-6 text-[#007AFF]" />
                            Profile Settings
                        </h1>
                        <span className="px-3 py-1 bg-blue-100 text-[#007AFF] text-xs font-semibold rounded-full uppercase tracking-wide">
                            {role}
                        </span>
                    </div>
                    {fullName && (
                        <p className="text-gray-600 text-sm ml-8">
                            Welcome, <span className="font-semibold">{fullName}</span>
                        </p>
                    )}
                </div>

                <div className="space-y-6">
                    {message && (
                        <div className={`p-4 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="text"
                            value={email}
                            disabled
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#007AFF] focus:border-[#007AFF] sm:text-sm"
                            placeholder="Your Name"
                        />
                    </div>

                    <div className="flex justify-between pt-4">
                        <button
                            onClick={handleSignOut}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Sign Out
                        </button>
                        <button
                            onClick={updateProfile}
                            disabled={loading}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#007AFF] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Update Profile'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
