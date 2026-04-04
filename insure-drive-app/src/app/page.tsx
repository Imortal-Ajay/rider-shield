'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { WalletConnect } from '@/components/WalletConnect';

export default function HomePage() {
  const router = useRouter();
  const { isConnected, isConnecting, connect, error } = useWallet();

  // Redirect to dashboard when wallet connects
  useEffect(() => {
    if (isConnected) {
      router.replace('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <WalletConnect
      onConnect={connect}
      isConnecting={isConnecting}
      error={error}
    />
  );
}
