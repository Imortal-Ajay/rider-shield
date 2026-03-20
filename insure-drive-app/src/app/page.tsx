'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  CloudRain, ThermometerSun, Wind, ShieldCheck, MapPin, 
  TrendingDown, CheckCircle2, ChevronRight, Activity, Zap
} from 'lucide-react';

// Types
type Zone = 'Anna Nagar' | 'T Nagar' | 'Velachery' | 'Marina Beach' | 'Tambaram';
type TriggerType = 'rain' | 'heat' | 'pollution';

interface ZoneData {
  riskModifier: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  stats: { avgLoss: string; claims: number };
}

const ZONES: Record<Zone, ZoneData> = {
  'Anna Nagar': { riskModifier: -10, riskLevel: 'Low', stats: { avgLoss: '₹150/day', claims: 124 } },
  'T Nagar': { riskModifier: 0, riskLevel: 'Medium', stats: { avgLoss: '₹250/day', claims: 432 } },
  'Velachery': { riskModifier: 15, riskLevel: 'High', stats: { avgLoss: '₹350/day', claims: 856 } },
  'Marina Beach': { riskModifier: 25, riskLevel: 'Severe', stats: { avgLoss: '₹400/day', claims: 1045 } },
  'Tambaram': { riskModifier: -5, riskLevel: 'Low', stats: { avgLoss: '₹180/day', claims: 210 } },
};

const TRIGGERS = {
  rain: { icon: CloudRain, title: 'Torrential Rain', threshold: '>20mm/hr', source: 'OpenWeather API', payout: '4hrs wage', color: 'text-sky-400', accent: 'bg-sky-500/10' },
  heat: { icon: ThermometerSun, title: 'Heatwave', threshold: '>40°C', source: 'Hyperlocal Temp', payout: '6hrs wage', color: 'text-orange-400', accent: 'bg-orange-500/10' },
  pollution: { icon: Wind, title: 'Toxic Smog', threshold: 'AQI > 300', source: 'Urban Sensors', payout: '3hrs wage', color: 'text-fuchsia-400', accent: 'bg-fuchsia-500/10' },
};

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function RiderDashboard() {
  const [selectedZone, setSelectedZone] = useState<Zone>('Velachery');
  const [basePremium] = useState(49);
  const [simulating, setSimulating] = useState<TriggerType | null>(null);
  const [activeClaim, setActiveClaim] = useState<TriggerType | null>(null);
  const [walletBalance, setWalletBalance] = useState(1240);

  const currentZoneData = ZONES[selectedZone];
  const dynamicPremium = Math.round(basePremium * (1 + currentZoneData.riskModifier / 100));

  const simulateTrigger = (type: TriggerType) => {
    if (simulating || activeClaim) return;
    setSimulating(type);
    
    setTimeout(() => {
      setSimulating(null);
      setActiveClaim(type);
      setTimeout(() => {
        const payoutAmounts = { rain: 400, heat: 600, pollution: 300 };
        setWalletBalance(prev => prev + payoutAmounts[type]);
      }, 1200);
    }, 2000);
  };

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'Low': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.1)]';
      case 'Medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.1)]';
      case 'High': return 'text-rose-400 border-rose-500/30 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
      case 'Severe': return 'text-red-500 border-red-500/50 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse';
      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
    }
  };

  return (
    <>
      {/* Absolute Background Blobs */}
      <div className="blob bg-indigo-500/20 w-96 h-96 top-0 left-0"></div>
      <div className="blob bg-fuchsia-500/20 w-80 h-80 bottom-0 right-0" style={{ animationDelay: '-10s' }}></div>
      <div className="blob bg-sky-500/10 w-96 h-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

      <motion.div 
        className="min-h-screen p-4 md:p-10 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-7xl space-y-8 z-10 relative">
          
          {/* Header */}
          <motion.header 
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-card p-6 md:px-10 rounded-[2.5rem]"
          >
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 group-hover:opacity-70 transition-opacity rounded-full"></div>
                <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center backdrop-blur-xl">
                  <ShieldCheck className="w-8 h-8 text-indigo-300 drop-shadow-[0_0_10px_rgba(165,180,252,0.5)]" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                  Insure Drive<span className="text-indigo-500">.</span>
                </h1>
                <p className="text-slate-400 text-sm mt-1 flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  Live Policy • ID: SW-8842
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="glass-panel px-8 py-4 rounded-3xl text-right border-t-white/10 border-l-white/10 flex-col md:flex-row flex justify-between md:items-center w-full shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <p className="text-xs text-indigo-200/60 font-semibold uppercase tracking-widest mr-8">Secure Vault</p>
                <div className="flex items-center gap-2 relative">
                  <span className="text-emerald-400 font-mono text-xl">₹</span>
                  <motion.p 
                    key={walletBalance}
                    initial={{ y: -20, opacity: 0, scale: 1.1 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    className="text-3xl font-bold font-mono text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  >
                    {walletBalance.toLocaleString()}
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.header>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Column: AI Pricing & Zone */}
            <motion.div variants={itemVariants} className="xl:col-span-4 space-y-8">
              <div className="glass-card rounded-[2.5rem] p-8 relative group hover:border-indigo-500/30 transition-colors duration-500">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none"></div>
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <h2 className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Risk Engine
                  </h2>
                  <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="space-y-3">
                    <label className="text-xs text-slate-400/80 font-medium tracking-wide uppercase">Operational Sector</label>
                    <div className="relative">
                      <select 
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value as Zone)}
                        className="w-full bg-[#0a0710]/80 backdrop-blur-3xl border border-white/10 rounded-2xl px-5 py-4 text-white font-medium outline-none focus:border-indigo-500/50 transition-colors appearance-none shadow-inner cursor-pointer"
                      >
                        {Object.keys(ZONES).map(zone => (
                          <option key={zone} value={zone} className="bg-[#0f0b1a]">{zone} — Chennai</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0a0710]/50 border border-white/[0.03] rounded-2xl p-5 backdrop-blur-xl">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3">AI Prediction</p>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border backdrop-blur-md ${getRiskColor(currentZoneData.riskLevel)}`}>
                        {currentZoneData.riskLevel}
                      </span>
                    </div>
                    <div className="bg-[#0a0710]/50 border border-white/[0.03] rounded-2xl p-5 backdrop-blur-xl">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3">Historic Loss</p>
                      <p className="text-xl font-semibold text-white tracking-tight">{currentZoneData.stats.avgLoss}</p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/[0.05]">
                    <p className="text-[10px] text-indigo-300/80 uppercase tracking-widest mb-3 text-center">Smart Contract Premium</p>
                    <div className="flex items-end justify-center gap-1 mb-2">
                      <span className="text-2xl text-slate-400 font-light mb-1">₹</span>
                      <h3 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-100 to-indigo-400 drop-shadow-[0_0_30px_rgba(99,102,241,0.2)] tracking-tighter">
                        {dynamicPremium}
                      </h3>
                      <span className="text-slate-500 font-medium mb-2 ml-1">/ wk</span>
                    </div>
                    <div className="flex justify-center h-6">
                      {currentZoneData.riskModifier !== 0 && (
                        <motion.span 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`text-xs font-semibold px-2 py-1 rounded-md bg-black/40 border ${currentZoneData.riskModifier > 0 ? 'text-rose-400 border-rose-500/20' : 'text-emerald-400 border-emerald-500/20'}`}
                        >
                          {currentZoneData.riskModifier > 0 ? '+' : ''}{currentZoneData.riskModifier}% area variance
                        </motion.span>
                      )}
                    </div>
                  </div>

                  <button className="relative w-full overflow-hidden rounded-2xl p-[1px] group active:scale-[0.98] transition-all duration-300">
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-70 group-hover:opacity-100 transition-opacity"></span>
                    <div className="relative bg-[#0d0918] group-hover:bg-transparent transition-colors px-6 py-4 rounded-2xl flex items-center justify-center gap-2">
                       <ShieldCheck className="w-5 h-5 text-indigo-200" />
                       <span className="text-white font-bold tracking-wide">Seal Smart Contract</span>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Parametric Triggers */}
            <motion.div variants={itemVariants} className="xl:col-span-8 flex flex-col gap-8">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(Object.entries(TRIGGERS) as [TriggerType, typeof TRIGGERS['rain']][]).map(([key, data]) => {
                  const isSimulating = simulating === key;
                  const isClaimed = activeClaim === key;
                  
                  return (
                    <div key={key} className={`glass-card rounded-[2.5rem] p-6 flex flex-col relative group transition-all duration-500 ${isClaimed ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(52,211,153,0.15)] bg-emerald-900/10' : 'hover:border-white/20'}`}>
                      
                      {/* Active Status Overlay */}
                      <AnimatePresence>
                        {(isSimulating || isClaimed) && (
                          <motion.div 
                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 backdrop-blur-2xl bg-[#030014]/80 flex flex-col items-center justify-center text-center p-6 border border-white/10 rounded-[2.5rem]"
                          >
                            {isSimulating ? (
                              <>
                                <div className="relative w-16 h-16 mb-6">
                                  <div className={`absolute inset-0 rounded-full border-4 ${data.color.replace('text-', 'border-')}/20`}></div>
                                  <div className={`absolute inset-0 rounded-full border-4 ${data.color.replace('text-', 'border-')} border-t-transparent animate-spin duration-1000`}></div>
                                  <data.icon className={`absolute inset-0 m-auto w-6 h-6 ${data.color} animate-pulse`} />
                                </div>
                                <h4 className="font-bold text-white tracking-wide mb-2 uppercase text-xs">Querying Oracle</h4>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-[80%]">Fetching real-time data from {data.source}...</p>
                              </>
                            ) : (
                              <motion.div 
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="flex flex-col items-center w-full"
                              >
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-5 border border-emerald-500/30 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                                  <CheckCircle2 className="w-8 h-8 text-emerald-400 drop-shadow-lg" />
                                </div>
                                <h4 className="font-bold text-white mb-2 text-lg">Payout Sent</h4>
                                <p className="text-xs font-mono text-emerald-300/80 mb-6 bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20">Tx: 0x8f...4e2a</p>
                                <button 
                                  onClick={() => setActiveClaim(null)}
                                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors border border-white/10"
                                >
                                  Close
                                </button>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl ${data.accent} border border-white/5 flex items-center justify-center shadow-inner`}>
                          <data.icon className={`w-7 h-7 ${data.color} drop-shadow-[0_0_10px_currentColor]`} />
                        </div>
                        <div className="bg-[#0a0710]/80 border border-white/5 px-3 py-1.5 rounded-lg">
                           <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block text-center">Trigger</span>
                           <span className={`text-sm font-bold ${data.color}`}>{data.threshold}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{data.title}</h3>
                      <p className="text-xs text-slate-400 mb-8">{data.source}</p>
                      
                      <div className="mt-auto space-y-4 pt-6 relative">
                        {/* Divisline */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        
                        <div className="flex justify-between items-center bg-[#0a0710]/50 rounded-xl p-3 border border-white/[0.03]">
                          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Compensation</span>
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.1)]">{data.payout}</span>
                        </div>
                        
                        <button 
                          onClick={() => simulateTrigger(key)}
                          disabled={!!simulating || !!activeClaim}
                          className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20`}
                        >
                          Inject Weather Event <Zap className="w-4 h-4 text-amber-300" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Immutable Ledger / Logs */}
              <div className="glass-card rounded-[2.5rem] p-8 flex-1 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-purple-400" /> Immutable Event Ledger
                  </h3>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,1)]"></div>
                </div>

                <div className="space-y-4 font-mono text-xs overflow-y-auto pr-2 custom-scrollbar flex-1 relative z-10">
                  <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors">
                    <span className="text-slate-500 whitespace-nowrap mt-0.5">12:04:32.405</span>
                    <span className="text-indigo-400 font-bold w-20 shrink-0">[SYSTEM]</span>
                    <span className="text-slate-300 leading-relaxed">Identity authenticated SW-8842. Connection secured via end-to-end encryption.</span>
                  </motion.div>
                  
                  <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay: 0.1}} className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-colors">
                    <span className="text-slate-500 whitespace-nowrap mt-0.5">08:15:00.122</span>
                    <span className="text-emerald-400 font-bold w-20 shrink-0">[LEDGER]</span>
                    <span className="text-slate-300 leading-relaxed">Weekly premium successfully deducted. Smart contract active and tracking metrics for {selectedZone}.</span>
                  </motion.div>

                  <AnimatePresence>
                    {activeClaim && (
                      <motion.div 
                        initial={{ opacity: 0, x: -20, height: 0 }} 
                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                        className="flex items-start gap-4 p-3 rounded-xl bg-rose-500/5 border border-rose-500/20"
                      >
                        <span className="text-slate-400 whitespace-nowrap mt-0.5">Just now</span>
                        <span className="text-rose-400 font-bold w-20 shrink-0 shadow-rose-500/20 drop-shadow-md">[ORACLE]</span>
                        <div className="flex flex-col gap-1">
                           <span className="text-emerald-300 font-medium tracking-wide">SMART CONTRACT EXECUTED</span>
                           <span className="text-slate-300">Parametric conditions met on block 498112. Funds transferred instantly into secure vault.</span>
                        </div>
                      </motion.div> 
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Background grid for log */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)_0_0,linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)_0_0] bg-[size:20px_20px] pointer-events-none opacity-50 z-0"></div>
              </div>
              
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
