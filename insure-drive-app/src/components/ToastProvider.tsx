'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#0d0b1e',
          color: '#e2e8f0',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          fontSize: '0.875rem',
          maxWidth: '380px',
          padding: '14px 18px',
          backdropFilter: 'blur(20px)',
        },
        success: {
          iconTheme: { primary: '#34d399', secondary: '#030014' },
          style: {
            borderColor: 'rgba(52,211,153,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(52,211,153,0.15)',
          },
        },
        error: {
          iconTheme: { primary: '#f87171', secondary: '#030014' },
          style: {
            borderColor: 'rgba(248,113,113,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(248,113,113,0.15)',
          },
        },
        loading: {
          iconTheme: { primary: '#818cf8', secondary: '#030014' },
          style: {
            borderColor: 'rgba(129,140,248,0.2)',
          },
        },
      }}
    />
  );
}
