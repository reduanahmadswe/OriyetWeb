'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { loginUser } from '@/store/slices/auth.slice';
import axios from 'axios';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setError('Google authentication was cancelled or failed');
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      try {
        // Exchange authorization code for tokens via backend
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/google/callback`,
          {
            code,
            redirectUri: `${window.location.origin}/auth/google/callback`,
          }
        );

        const { user, accessToken, refreshToken } = response.data;

        // Store tokens and user data
        await dispatch(loginUser({ accessToken, refreshToken, user }));

        // Get the stored redirect URL or default to dashboard
        const redirectUrl = sessionStorage.getItem('oauth_redirect') || '/dashboard';
        sessionStorage.removeItem('oauth_redirect');
        sessionStorage.removeItem('oauth_type');

        // Redirect based on user role
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push(redirectUrl);
        }
      } catch (err: any) {
        console.error('Google callback error:', err);
        setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Signing you in...</h2>
            <p className="text-gray-600">Please wait while we complete your authentication</p>
          </>
        )}
      </div>
    </div>
  );
}
