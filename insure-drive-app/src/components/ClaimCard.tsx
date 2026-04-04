'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CheckCircle2, Loader2, ExternalLink, AlertTriangle, Coins } from 'lucide-react';
import type { EventData } from '@/hooks/useContract';

interface ClaimCardProps {
  eventData: EventData | null;
  isEnrolled: boolean;
  isLoading: boolean;
  txHash: string | null;
  onClaim: () => void;
}

export function ClaimCard({ eventData, isEnrolled, isLoading, txHash, onClaim }: ClaimCardProps) {
  const isActive = eventData?.isActive ?? false;
  const payout = eventData?.payoutPerEvent ?? '0';
  const payoutFormatted = parseFloat(payout).toFixed(6);
  const canClaim = isEnrolled && isActive && !isLoading;

  return (
    <motion.div
      className={`glass-card rounded-[2rem] p-7 space-y-6 transition-all duration-500 ${
        isActive ? 'border-emerald-500/30 shadow-[0_0_40px_rgba(52,211,153,0.1)]' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-2">
          <Wallet className="w-4 h-4" /> Claim Payout
        </h2>
        {isActive && (
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-[10px] text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl animate-pulse"
          >
            Claim Available
          </motion.span>
        )}
      </div>

      {/* Payout display */}
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-2 py-6"
          >
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Estimated Payout</p>
            <div className="flex items-end justify-center gap-2">
              <span className="text-3xl text-emerald-400 font-light">Ξ</span>
              <motion.p
                className="text-5xl font-extrabold font-mono text-white tracking-tight drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                key={payoutFormatted}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {payoutFormatted}
              </motion.p>
            </div>
            <p className="text-xs text-slate-400">ETH · Direct to wallet</p>
          </motion.div>
        ) : (
          <motion.div
            key="inactive"
            exit={{ opacity: 0 }}
            className="text-center py-10 space-y-3"
          >
            <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mx-auto">
              <Coins className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-sm text-slate-500 font-medium">No Active Claim</p>
            <p className="text-xs text-slate-600 max-w-[200px] mx-auto leading-relaxed">
              {!isEnrolled
                ? 'Enroll as a rider to be eligible for payouts'
                : 'Waiting for a parametric event to be triggered'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Claim button */}
      <button
        id="claim-payout-btn"
        onClick={onClaim}
        disabled={!canClaim}
        className={`relative w-full overflow-hidden rounded-2xl p-[1px] group active:scale-[0.98] transition-all duration-300 ${
          !canClaim ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className={`absolute inset-0 transition-all ${
          canClaim
            ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-80 group-hover:opacity-100'
            : 'bg-white/10'
        }`} />
        <div className={`relative transition-colors px-6 py-4 rounded-2xl flex items-center justify-center gap-2 ${
          canClaim ? 'bg-[#050f0c] group-hover:bg-transparent' : 'bg-[#0a0f0a]'
        }`}>
          {isLoading ? (
            <><Loader2 className="w-5 h-5 animate-spin text-emerald-300" /><span className="text-white font-bold">Processing...</span></>
          ) : canClaim ? (
            <><CheckCircle2 className="w-5 h-5 text-emerald-200" /><span className="text-white font-bold">Claim Now · Ξ{payoutFormatted}</span></>
          ) : (
            <span className="text-slate-500 font-semibold text-sm">
              {!isEnrolled ? 'Enrollment Required' : 'No Active Event'}
            </span>
          )}
        </div>
      </button>

      {/* Transaction hash */}
      <AnimatePresence>
        {txHash && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest mb-1">Transaction Submitted</p>
                <p className="text-xs font-mono text-slate-300 truncate max-w-[180px]">
                  {txHash.slice(0, 12)}...{txHash.slice(-8)}
                </p>
              </div>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors shrink-0 bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded-xl"
              >
                Etherscan <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isEnrolled && (
        <div className="flex items-start gap-2 text-amber-300/70 text-[10px]">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Enroll as a rider first to be eligible for parametric payouts from the smart contract.
        </div>
      )}
    </motion.div>
  );
}
