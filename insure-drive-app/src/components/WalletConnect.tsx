'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Cloud, Thermometer, Wind, ChevronRight, AlertCircle } from 'lucide-react';

interface WalletConnectProps {
  onConnect: () => void;
  isConnecting: boolean;
  error: string | null;
}

const features = [
  { icon: Cloud,        title: 'Rain Protection',  desc: 'Triggered when rainfall exceeds 20mm/hr',        color: 'text-sky-400',     bg: 'bg-sky-500/10',     border: 'border-sky-500/20' },
  { icon: Thermometer,  title: 'Heat Shield',       desc: 'Activated during heatwaves above 40°C',          color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/20' },
  { icon: Wind,         title: 'Smog Coverage',     desc: 'Protection when AQI exceeds danger thresholds',  color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20' },
];

const stats = [
  { value: '847+', label: 'Riders Protected' },
  { value: '₹2.4L', label: 'Payouts Processed' },
  { value: '99.2%', label: 'Uptime' },
];

export function WalletConnect({ onConnect, isConnecting, error }: WalletConnectProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="blob bg-indigo-500/20 w-[500px] h-[500px] top-[-10%] left-[-10%]" />
      <div className="blob bg-fuchsia-500/20 w-96 h-96 bottom-[-5%] right-[-5%]" style={{ animationDelay: '-10s' }} />
      <div className="blob bg-sky-500/10 w-80 h-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '-5s' }} />

      <motion.div
        className="w-full max-w-4xl z-10 space-y-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live on Sepolia Testnet
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-40 rounded-full" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-indigo-300 drop-shadow-[0_0_15px_rgba(165,180,252,0.8)]" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-400">
              Insure Drive
            </span>
            <span className="text-indigo-500">.</span>
          </motion.h1>

          <motion.p
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            AI-powered parametric insurance for delivery riders.
            <br className="hidden md:block" />
            <span className="text-slate-300 font-medium">Real-time weather data → automatic payouts via smart contract.</span>
          </motion.p>
        </div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {stats.map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-5 text-center">
              <p className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-300">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className={`glass-card rounded-2xl p-6 border ${f.border} hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className={`w-12 h-12 rounded-2xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {error && (
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm max-w-sm text-center">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            id="connect-wallet-btn"
            onClick={onConnect}
            disabled={isConnecting}
            className="relative group overflow-hidden rounded-2xl p-[1.5px] active:scale-[0.97] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#08051a] group-hover:bg-transparent transition-colors px-10 py-5 rounded-2xl flex items-center gap-3">
              {isConnecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-white font-bold text-lg">Connecting...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-indigo-200" />
                  <span className="text-white font-bold text-lg">Connect MetaMask</span>
                  <ChevronRight className="w-5 h-5 text-indigo-200 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>

          <p className="text-xs text-slate-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Sepolia testnet · No real ETH required · Open source
          </p>
        </motion.div>

        {/* Flow diagram */}
        <motion.div
          className="glass-card rounded-2xl px-8 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-4 text-center font-semibold">How It Works</p>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            {['Connect Wallet', 'Enroll Rider', 'Fetch Weather', 'Trigger Event', 'Claim Payout'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                    {i + 1}
                  </div>
                  <span className="text-[10px] text-slate-400 text-center whitespace-nowrap">{step}</span>
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 mb-4" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
