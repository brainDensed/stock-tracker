"use client"
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/axios';
import { CheckCircle, CircleAlert, Loader2 } from 'lucide-react';

// This is the Verify component that handles email verification
const VerifyComponent = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('Invalid verification link.');
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    setIsVerifying(true);
    try {
      const response = await api.get(`/verify-email?token=${token}`);

      if (response.status === 200) {
        setStatus('Email verified successfully!');
      } else {
        setStatus(`Verification failed: ${response.data?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      setStatus('An unexpected error occurred during verification.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>
          Email Verification
        </h1>

        {isVerifying && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '4px solid #e0e0e0',
                borderTopColor: '#007bff',
                animation: 'spin 1s linear infinite',
                marginBottom: '10px',
              }}
            />
            <Loader2 size={24} className="animate-spin" style={{ marginBottom: '10px', color: '#007bff' }} />
            <p style={{ color: '#777', fontSize: '16px' }}>Verifying your email...</p>
          </div>
        )}

        {status === 'Email verified successfully!' && (
          <div
            style={{
              backgroundColor: '#e6ffe6',
              padding: '15px',
              borderRadius: '4px',
              border: '1px solid #b3e6b3',
              color: '#2e7d32',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CheckCircle color="#2e7d32" size={20} />
            <p style={{ margin: 0, fontSize: '16px' }}>{status}</p>
          </div>
        )}

        {status && status !== 'Email verified successfully!' && !isVerifying && (
          <div
            style={{
              backgroundColor: '#ffebee',
              padding: '15px',
              borderRadius: '4px',
              border: '1px solid #ef9a9a',
              color: '#d32f2f',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CircleAlert color="#d32f2f" size={20} />
            <p style={{ margin: 0, fontSize: '16px' }}>Error: {status}</p>
          </div>
        )}

        {!status && !isVerifying && (
          <p style={{ color: '#777', fontSize: '16px' }}>
            Please wait while we verify your email.
          </p>
        )}
      </div>
    </div>
  );
};

// This is where we wrap the component with Suspense boundary
const Verify = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <VerifyComponent />
  </Suspense>
);

export default Verify;
