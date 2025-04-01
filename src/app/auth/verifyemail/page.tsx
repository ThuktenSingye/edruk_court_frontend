
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CheckEmailPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
            <p className="mb-6">We've sent a verification link to your email. Please check your inbox and click on the link to confirm your account.</p>
            <button
                onClick={() => router.push('/auth/login')}
                className="bg-primary-light text-white px-6 py-2 rounded-lg hover:bg-primary-normal"
            >
                Go to Login
            </button>
        </div>
    );
}
