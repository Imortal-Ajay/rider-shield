'use client';

import { motion } from 'framer-motion';
import { User, MapPin, Star, ChevronDown, Loader2, ShieldCheck, ShieldOff } from 'lucide-react';
import { ZONES, type Zone, ZONE_RISK } from '@/lib/contract';
import type { RiderData } from '@/hooks/useContract';
import { clsx } from 'clsx';

interface RiderOverviewCardProps {
  address: string;
  riderData: RiderData | null;
  selectedZone: Zone;
  onZoneChange: (zone: Zone) => void;
  onEnroll: () => void;
  isEnrolling: boolean;
  ethBalance: string;
}

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function TrustBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
    score >= 50 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
    'text-rose-400 border-rose-500/30 bg-rose-500/10';

  const label =
    score >= 80 ? 'Excellent' :
    score >= 60 ? 'Good' :
    score >= 40 ? 'Fair' : 'Poor';

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${color}`}>
      <Star className="w-3 h-3 fill-current" />
      {score}/100 · {label}
    </div>
  );
}

export function RiderOverviewCard({
  address,
  riderData,
  selectedZone,
  onZoneChange,
  onEnroll,
  isEnrolling,
  ethBalance,
}: RiderOverviewCardProps) {
  const risk = ZONE_RISK[selectedZone];
  const isEnrolled = riderData?.isEnrolled ?? false;

  const riskColor =
    risk.level === 'Low'    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
    risk.level === 'Medium' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
    risk.level === 'High'   ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' :
    'text-red-500 border-red-500/50 bg-red-500/20 animate-pulse';

  return (
    <motion.div
      className="glass-card rounded-[2rem] p-7 space-y-6 hover:border-indigo-500/20 transition-colors duration-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Status banner */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
          <User className="w-4 h-4" /> Rider Profile
        </h2>
        <div className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border',
          isEnrolled
            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
            : 'text-slate-400 border-slate-500/20 bg-slate-500/10'
        )}>
          {isEnrolled ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
          {isEnrolled ? 'Active Policy' : 'Not Enrolled'}
        </div>
      </div>

      {/* Wallet */}
      <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 space-y-1">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Wallet Address</p>
        <p className="font-mono text-white font-semibold text-sm tracking-wide">{truncate(address)}</p>
        <p className="text-[10px] text-slate-400">{ethBalance} ETH · Sepolia</p>
      </div>

      {/* Zone selector */}
      <div className="space-y-2">
        <label className="text-[10px] text-slate-400 uppercase tracking-widest font-medium flex items-center gap-1.5">
          <MapPin className="w-3 h-3" /> Operational Sector
        </label>
        <div className="relative">
          <select
            id="zone-selector"
            value={selectedZone}
            onChange={(e) => onZoneChange(e.target.value as Zone)}
            disabled={isEnrolled}
            className="w-full bg-[#0a0710]/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium outline-none focus:border-indigo-500/40 transition-colors appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {ZONES.map((z) => (
              <option key={z} value={z} className="bg-[#0f0b1a]">
                {z} — Chennai
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {isEnrolled && (
          <p className="text-[10px] text-slate-500">Zone locked after enrollment</p>
        )}
      </div>

      {/* Risk & Trust */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0a0710]/50 border border-white/[0.03] rounded-xl p-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Zone Risk</p>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${riskColor}`}>
            {risk.level}
          </span>
        </div>
        <div className="bg-[#0a0710]/50 border border-white/[0.03] rounded-xl p-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Trust Score</p>
          {riderData?.isEnrolled ? (
            <TrustBadge score={riderData.trustScore} />
          ) : (
            <span className="text-slate-500 text-xs">—</span>
          )}
        </div>
      </div>

      {/* Enroll button (soft gate) */}
      {!isEnrolled && (
        <button
          id="enroll-rider-btn"
          onClick={onEnroll}
          disabled={isEnrolling}
          className="relative w-full overflow-hidden rounded-2xl p-[1px] group active:scale-[0.98] transition-all duration-300 disabled:opacity-70"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-[#0d0918] group-hover:bg-transparent transition-colors px-4 py-3.5 rounded-2xl flex items-center justify-center gap-2">
            {isEnrolling ? (
              <><Loader2 className="w-4 h-4 animate-spin text-indigo-200" /><span className="text-white font-bold text-sm">Enrolling...</span></>
            ) : (
              <><ShieldCheck className="w-4 h-4 text-indigo-200" /><span className="text-white font-bold text-sm">Enroll Rider · 0.01 ETH</span></>
            )}
          </div>
        </button>
      )}

      {isEnrolled && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-emerald-300">Policy Active</p>
            <p className="text-[10px] text-slate-400">Smart contract protection running</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
