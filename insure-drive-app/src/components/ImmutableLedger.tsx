'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown } from 'lucide-react';

export interface LogEntry {
  id: string;
  time: string;
  tag: string;
  tagColor: string;
  message: string;
  highlight?: boolean;
}

interface ImmutableLedgerProps {
  logs: LogEntry[];
}

export function ImmutableLedger({ logs }: ImmutableLedgerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  return (
    <motion.div
      className="glass-card rounded-[2rem] p-7 flex flex-col relative overflow-hidden h-full min-h-[280px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40 z-0" />

      <div className="flex justify-between items-center mb-5 border-b border-white/[0.05] pb-4 relative z-10">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-purple-400" /> Immutable Event Ledger
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,1)]" />
          <span className="text-[10px] text-emerald-400 font-semibold">LIVE</span>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs overflow-y-auto pr-1 flex-1 relative z-10 custom-scrollbar">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                log.highlight
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-white/[0.02] border-white/[0.03] hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-slate-500 whitespace-nowrap mt-0.5 shrink-0">{log.time}</span>
              <span className={`font-bold w-20 shrink-0 ${log.tagColor}`}>{log.tag}</span>
              <span className="text-slate-300 leading-relaxed">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </motion.div>
  );
}
