'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, LogOut, ExternalLink, Activity } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { useContract } from '@/hooks/useContract';
import { ZONE_RISK, type Zone } from '@/lib/contract';

import { RiderOverviewCard } from '@/components/RiderOverviewCard';
import { CoverageCard } from '@/components/CoverageCard';
import { WeatherCard } from '@/components/WeatherCard';
import { EventStatusCard } from '@/components/EventStatusCard';
import { ClaimCard } from '@/components/ClaimCard';
import { ImmutableLedger, type LogEntry } from '@/components/ImmutableLedger';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '';

function now() {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

function makeLog(tag: string, tagColor: string, message: string, highlight = false): LogEntry {
  return {
    id: `${Date.now()}-${Math.random()}`,
    time: now(),
    tag,
    tagColor,
    message,
    highlight,
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const wallet = useWallet();
  const contract = useContract(wallet.signer);

  const [selectedZone, setSelectedZone] = useState<Zone>('Velachery');
  const [liveRiskFlags, setLiveRiskFlags] = useState<string[]>([]);
  const [demoEventActive, setDemoEventActive] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    makeLog('[SYSTEM]', 'text-indigo-400', 'Insure Drive node initialized. Blockchain handshake complete.'),
    makeLog('[LEDGER]', 'text-emerald-400', 'Policy engine online. Monitoring Chennai operational zones.'),
  ]);

  const addLog = useCallback((tag: string, tagColor: string, message: string, highlight = false) => {
    setLogs((prev) => [...prev.slice(-30), makeLog(tag, tagColor, message, highlight)]);
  }, []);

  // Redirect to home if not connected
  useEffect(() => {
    if (!wallet.isConnecting && !wallet.isConnected) {
      router.replace('/');
    }
  }, [wallet.isConnected, wallet.isConnecting, router]);

  // Load rider and event data on connect
  useEffect(() => {
    if (wallet.address && wallet.signer) {
      contract.fetchRiderData(wallet.address);
      contract.fetchEventData(selectedZone);
      addLog('[SYSTEM]', 'text-indigo-400', `Identity authenticated ${wallet.address.slice(0, 8)}... Connection secured.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.address, wallet.signer]);

  // Refresh event data when zone changes
  useEffect(() => {
    if (wallet.signer) {
      contract.fetchEventData(selectedZone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZone]);

  // Computed values
  const zoneRisk = ZONE_RISK[selectedZone];
  const basePremium = 49;
  const dynamicPremium = Math.round(basePremium * (1 + zoneRisk.modifier / 100));

  const isEnrolled = contract.riderData?.isEnrolled ?? false;

  const displayEventData = demoEventActive && !contract.eventData?.isActive
    ? { isActive: true, payoutPerEvent: '0.002', timestamp: Date.now() / 1000 }
    : contract.eventData;

  // Handlers
  const handleEnroll = async () => {
    addLog('[LEDGER]', 'text-sky-400', `Enrollment initiated for zone: ${selectedZone}...`);
    const ok = await contract.enrollRider(selectedZone);
    if (ok) {
      addLog('[LEDGER]', 'text-emerald-400', `Weekly premium deducted. Smart contract active for ${selectedZone}.`, true);
    } else {
      addLog('[ERROR]', 'text-rose-400', 'Enrollment transaction failed or was rejected.');
    }
  };

  const handleSimulate = async (eventType: string, value: number) => {
    addLog('[ORACLE]', 'text-fuchsia-400', `Querying oracle for ${eventType} event in ${selectedZone}...`);
    const ok = await contract.triggerVoteEvent(eventType, selectedZone, value);
    if (ok) {
      addLog('[ORACLE]', 'text-rose-400', `SMART CONTRACT EXECUTED: ${eventType} conditions met. Payout available.`, true);
      setDemoEventActive(false);
    } else {
      // Demo mode fallback
      addLog('[DEMO]', 'text-amber-400', `Demo Mode: ${eventType} event simulated locally (oracle privilege required on-chain).`);
      setDemoEventActive(true);
      addLog('[ORACLE]', 'text-rose-400', `DEMO EVENT ACTIVE: ${eventType} threshold exceeded. Claim available.`, true);
    }
  };

  const handleClaim = async () => {
    if (demoEventActive && !contract.eventData?.isActive) {
      addLog('[DEMO]', 'text-amber-400', 'Demo Mode: Payout simulated. In production, ETH would transfer to your wallet.');
      setDemoEventActive(false);
      addLog('[LEDGER]', 'text-emerald-400', 'Demo claim processed. Secure vault updated.', true);
      return;
    }
    addLog('[SYSTEM]', 'text-indigo-400', 'Claim request submitted to smart contract...');
    const ok = await contract.claimPayout();
    if (ok) {
      addLog('[LEDGER]', 'text-emerald-400', `Payout transferred. Tx: ${contract.txHash?.slice(0, 12)}...`, true);
    } else {
      addLog('[ERROR]', 'text-rose-400', 'Claim transaction failed or cooldown is active.');
    }
  };

  const handleRiskDetected = useCallback((flags: string[]) => {
    setLiveRiskFlags(flags);
    flags.forEach((f) =>
      addLog('[WEATHER]', 'text-orange-400', `Live data threshold exceeded for ${f}. Trigger available.`)
    );
  }, [addLog]);

  const handleRefreshEvent = useCallback(() => {
    if (wallet.signer) contract.fetchEventData(selectedZone);
  }, [contract, selectedZone, wallet.signer]);

  if (!wallet.isConnected && !wallet.isConnecting) return null;

  return (
    <div className="min-h-screen relative">
      {/* Background blobs */}
      <div className="blob bg-indigo-500/15 w-[500px] h-[500px] top-0 left-0" />
      <div className="blob bg-fuchsia-500/15 w-80 h-80 bottom-0 right-0" style={{ animationDelay: '-10s' }} />
      <div className="blob bg-sky-500/10 w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '-5s' }} />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8 py-6 space-y-6">

        {/* ── Header ── */}
        <motion.header
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-card p-5 md:px-8 rounded-[2rem]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 rounded-full" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-indigo-300 drop-shadow-[0_0_10px_rgba(165,180,252,0.5)]" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Insure Drive<span className="text-indigo-500">.</span>
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                Live Policy · {selectedZone} · Sepolia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* ETH Balance */}
            <div className="glass-panel px-5 py-3 rounded-2xl flex-1 md:flex-none flex items-center gap-3">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Wallet Balance</p>
                <p className="text-xl font-bold font-mono text-white">{wallet.ethBalance} ETH</p>
              </div>
            </div>

            {/* Contract link */}
            <a
              href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-2xl glass-panel flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
              title="View contract on Etherscan"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>

            {/* Disconnect */}
            <button
              onClick={() => { wallet.disconnect(); router.replace('/'); }}
              className="w-11 h-11 rounded-2xl glass-panel flex items-center justify-center hover:bg-rose-500/10 hover:border-rose-500/20 transition-colors shrink-0"
              title="Disconnect wallet"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </motion.header>

        {/* ── Network warning ── */}
        {wallet.isConnected && !wallet.isCorrectNetwork && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            <Activity className="w-5 h-5 animate-pulse shrink-0" />
            <span>Wrong network. Please switch MetaMask to <strong>Sepolia Testnet</strong> and reload.</span>
          </div>
        )}

        {/* ── Row 1: Overview · Coverage · Weather ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <RiderOverviewCard
            address={wallet.address ?? ''}
            riderData={contract.riderData}
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
            onEnroll={handleEnroll}
            isEnrolling={contract.loading}
            ethBalance={wallet.ethBalance}
          />
          <CoverageCard
            riderData={contract.riderData}
            dynamicPremium={dynamicPremium}
          />
          <WeatherCard onRiskDetected={handleRiskDetected} />
        </div>

        {/* ── Row 2: Event Status (wide) ── */}
        <EventStatusCard
          eventData={displayEventData ?? null}
          selectedZone={selectedZone}
          isEnrolled={isEnrolled}
          isLoading={contract.loading}
          liveRiskFlags={liveRiskFlags}
          onSimulate={handleSimulate}
          onLiveDetect={handleSimulate}
          onRefreshEvent={handleRefreshEvent}
        />

        {/* ── Row 3: Claim · Ledger ── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-2">
            <ClaimCard
              eventData={displayEventData ?? null}
              isEnrolled={isEnrolled}
              isLoading={contract.loading}
              txHash={contract.txHash}
              onClaim={handleClaim}
            />
          </div>
          <div className="xl:col-span-3">
            <ImmutableLedger logs={logs} />
          </div>
        </div>

      </div>
    </div>
  );
}
