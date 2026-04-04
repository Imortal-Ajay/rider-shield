'use client';

import { motion } from 'framer-motion';
import { BarChart3, Clock, TrendingUp, Layers } from 'lucide-react';
import type { RiderData } from '@/hooks/useContract';

interface CoverageCardProps {
  riderData: RiderData | null;
  dynamicPremium: number;
}

function CoverageBar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const remaining = total - used;
  const color = pct < 50 ? '#34d399' : pct < 80 ? '#fbbf24' : '#f87171';

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>{used}h used</span>
        <span>{remaining > 0 ? remaining : 0}h remaining</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <p className="text-[10px] text-slate-500 text-right">{pct.toFixed(0)}% utilized</p>
    </div>
  );
}

export function CoverageCard({ riderData, dynamicPremium }: CoverageCardProps) {
  const isEnrolled = riderData?.isEnrolled ?? false;
  const coverageHours = riderData?.coverageHours ?? 0;
  const maxHours = 40; // MAX_WEEKLY_HOURS constant from contract
  const totalClaimed = riderData?.totalClaimed ?? '0';
  const weeklyPremium = riderData?.weeklyPremium;

  const displayPremium = weeklyPremium && parseFloat(weeklyPremium) > 0
    ? `${parseFloat(weeklyPremium).toFixed(4)} ETH`
    : `₹${dynamicPremium} / wk`;

  return (
    <motion.div
      className="glass-card rounded-[2rem] p-7 space-y-6 hover:border-indigo-500/20 transition-colors duration-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Coverage Status
        </h2>
        {isEnrolled && (
          <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] px-2 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        )}
      </div>

      {/* Premium */}
      <div className="text-center py-4 border-y border-white/[0.05]">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Weekly Premium</p>
        <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-100 to-indigo-400 tracking-tight">
          {displayPremium}
        </p>
        <p className="text-[10px] text-slate-500 mt-1">Smart contract rate</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0a0710]/50 border border-white/[0.03] rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Coverage</p>
            <p className="font-bold text-white text-lg">{isEnrolled ? `${maxHours}h` : '—'}</p>
          </div>
        </div>
        <div className="bg-[#0a0710]/50 border border-white/[0.03] rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Claimed</p>
            <p className="font-bold text-white text-lg">
              {isEnrolled ? `${parseFloat(totalClaimed).toFixed(4)}Ξ` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Coverage bar */}
      {isEnrolled ? (
        <div className="space-y-2">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3 h-3" /> Weekly Hour Usage
          </p>
          <CoverageBar used={maxHours - coverageHours} total={maxHours} />
        </div>
      ) : (
        <div className="text-center py-4 text-slate-500 text-xs">
          Enroll to see coverage details
        </div>
      )}
    </motion.div>
  );
}
