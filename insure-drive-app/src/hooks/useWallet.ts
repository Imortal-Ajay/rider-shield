'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner, Eip1193Provider } from 'ethers';
import toast from 'react-hot-toast';

const SEPOLIA_CHAIN_ID = BigInt(11155111);
const SEPOLIA_HEX = '0xaa36a7';

export interface WalletState {
  address: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  chainId: bigint | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
  ethBalance: string;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export function useWallet(): WalletState {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [ethBalance, setEthBalance] = useState('0.00');
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!address;
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  const updateBalance = useCallback(async (prov: BrowserProvider, addr: string) => {
    try {
      const bal = await prov.getBalance(addr);
      setEthBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
    } catch {
      setEthBalance('0.00');
    }
  }, []);

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask not installed. Please install MetaMask to continue.');
      toast.error('MetaMask not found. Please install it first.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request accounts
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (!accounts || accounts.length === 0) throw new Error('No accounts found');

      const browserProvider = new ethers.BrowserProvider(window.ethereum as unknown as Eip1193Provider);
      const network = await browserProvider.getNetwork();

      // Switch to Sepolia if needed
      if (network.chainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_HEX }],
          });
        } catch (switchErr: unknown) {
          const err = switchErr as { code?: number };
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: SEPOLIA_HEX,
                chainName: 'Sepolia Testnet',
                nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              }],
            });
          } else {
            throw new Error('Please switch to Sepolia network in MetaMask');
          }
        }
        // Re-create provider after network switch
        const freshProvider = new ethers.BrowserProvider(window.ethereum as unknown as Eip1193Provider);
        const freshNetwork = await freshProvider.getNetwork();
        const freshSigner = await freshProvider.getSigner();
        setProvider(freshProvider);
        setSigner(freshSigner);
        setAddress(accounts[0]);
        setChainId(freshNetwork.chainId);
        await updateBalance(freshProvider, accounts[0]);
        toast.success('Wallet connected on Sepolia!');
        return;
      }

      const signerInstance = await browserProvider.getSigner();
      setProvider(browserProvider);
      setSigner(signerInstance);
      setAddress(accounts[0]);
      setChainId(network.chainId);
      await updateBalance(browserProvider, accounts[0]);
      toast.success('Wallet connected!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      toast.error(message);
    } finally {
      setIsConnecting(false);
    }
  }, [updateBalance]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setEthBalance('0.00');
    toast('Wallet disconnected', { icon: '👋' });
  }, []);

  // Auto-connect if previously connected & listen for account/chain changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accs = accounts as string[];
      if (accs.length === 0) {
        disconnect();
      } else {
        setAddress(accs[0]);
        if (provider) updateBalance(provider, accs[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Silently check if already connected
    (window.ethereum.request({ method: 'eth_accounts' }) as Promise<string[]>)
      .then((accounts) => {
        if (accounts && accounts.length > 0) {
          connect();
        }
      })
      .catch(() => {});

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [connect, disconnect, provider, updateBalance]);

  return {
    address,
    provider,
    signer,
    chainId,
    isConnected,
    isCorrectNetwork,
    isConnecting,
    ethBalance,
    error,
    connect,
    disconnect,
  };
}
