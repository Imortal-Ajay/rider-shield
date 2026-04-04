'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Thermometer, Wind, RefreshCw, AlertTriangle, CheckCircle, Wifi } from 'lucide-react';

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  rain: number;
  description: string;
  icon: string;
  windSpeed: number;
  riskFlags: string[];
  timestamp: number;
}

interface AqiData {
  aqi: number;
  aqiLevel: number;
  category: string;
  pm25: number;
  riskFlags: string[];
  timestamp: number;
}

interface WeatherCardProps {
  onRiskDetected: (flags: string[]) => void;
}

function StatBox({ icon: Icon, label, value, sub, color, glow }: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
  glow: string;
}) {
  return (
    <div className={`bg-[#0a0710]/60 border border-white/[0.04] rounded-2xl p-4 relative group hover:border-white/10 transition-colors`}>
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${glow}`} />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">{label}</span>
        </div>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {sub && <p className="text-[10px] text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export function WeatherCard({ onRiskDetected }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aqi, setAqi] = useState<AqiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [wRes, aqiRes] = await Promise.all([
        fetch('/api/weather'),
        fetch('/api/aqi'),
      ]);

      const [wData, aqiData] = await Promise.all([
        wRes.json(),
        aqiRes.json(),
      ]);

      if (wData.error) throw new Error(wData.error);
      if (aqiData.error) throw new Error(aqiData.error);

      setWeather(wData);
      setAqi(aqiData);
      setLastUpdated(new Date());

      const allFlags = [
        ...(wData.riskFlags ?? []),
        ...(aqiData.riskFlags ?? []),
      ];
      if (allFlags.length > 0) onRiskDetected(allFlags);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [onRiskDetected]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const allRiskFlags = [
    ...(weather?.riskFlags ?? []),
    ...(aqi?.riskFlags ?? []),
  ];
  const hasRisk = allRiskFlags.length > 0;

  const aqiColor =
    (aqi?.aqiLevel ?? 0) <= 1 ? 'text-emerald-400' :
    (aqi?.aqiLevel ?? 0) <= 2 ? 'text-yellow-400' :
    (aqi?.aqiLevel ?? 0) <= 3 ? 'text-orange-400' :
    'text-rose-400';

  const aqiGlow =
    (aqi?.aqiLevel ?? 0) <= 1 ? 'bg-emerald-500/5' :
    (aqi?.aqiLevel ?? 0) <= 2 ? 'bg-yellow-500/5' :
    'bg-rose-500/5';

  return (
    <motion.div
      className="glass-card rounded-[2rem] p-7 space-y-5 hover:border-sky-500/20 transition-colors duration-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-sky-300 uppercase tracking-widest flex items-center gap-2">
          <Wifi className="w-4 h-4" /> Live Weather · Chennai
        </h2>
        <button
          onClick={() => fetchData()}
          disabled={loading}
          className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.07] flex items-center justify-center transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Status badge */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" exit={{ opacity: 0 }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] w-fit">
            <div className="w-3 h-3 border-2 border-slate-500/30 border-t-slate-400 rounded-full animate-spin" />
            <span className="text-xs text-slate-400">Fetching real-time data...</span>
          </motion.div>
        ) : hasRisk ? (
          <motion.div
            key="risk"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 w-fit"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="text-xs text-rose-300 font-semibold">
              Risk Detected: {allRiskFlags.join(' · ')}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="normal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 w-fit"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-300 font-semibold">All Clear — Normal Conditions</span>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Stats grid */}
      {weather && (
        <div className="grid grid-cols-2 gap-3">
          <StatBox
            icon={Thermometer}
            label="Temperature"
            value={`${weather.temp}°C`}
            sub={`Feels like ${weather.feelsLike}°C`}
            color={weather.temp > 40 ? 'text-rose-400' : weather.temp > 35 ? 'text-orange-400' : 'text-sky-300'}
            glow={weather.temp > 40 ? 'bg-rose-500/5' : 'bg-sky-500/5'}
          />
          <StatBox
            icon={CloudRain}
            label="Rainfall"
            value={`${weather.rain.toFixed(1)} mm/h`}
            sub={weather.rain > 20 ? '⚠️ Heavy rain' : 'Normal'}
            color={weather.rain > 20 ? 'text-sky-400' : 'text-slate-300'}
            glow={weather.rain > 20 ? 'bg-sky-500/5' : ''}
          />
          {aqi && (
            <StatBox
              icon={Wind}
              label="Air Quality"
              value={`${aqi.aqi}`}
              sub={aqi.category}
              color={aqiColor}
              glow={aqiGlow}
            />
          )}
          <StatBox
            icon={CloudRain}
            label="Humidity"
            value={`${weather.humidity}%`}
            sub={`Wind ${weather.windSpeed} m/s`}
            color="text-indigo-300"
            glow="bg-indigo-500/5"
          />
        </div>
      )}

      {/* Thresholds reference */}
      <div className="pt-1 border-t border-white/[0.05] space-y-1.5">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Trigger Thresholds</p>
        <div className="flex gap-3 flex-wrap">
          {[
            { label: 'Rain', threshold: '>20 mm/h', triggered: (weather?.rain ?? 0) > 20 },
            { label: 'Heat', threshold: '>40°C', triggered: (weather?.temp ?? 0) > 40 },
            { label: 'AQI', threshold: '>150', triggered: (aqi?.aqi ?? 0) > 150 },
          ].map(({ label, threshold, triggered }) => (
            <div key={label} className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md border ${triggered ? 'text-rose-300 border-rose-500/30 bg-rose-500/10' : 'text-slate-500 border-white/[0.04]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${triggered ? 'bg-rose-400 animate-pulse' : 'bg-slate-600'}`} />
              {label} {threshold}
            </div>
          ))}
        </div>
      </div>

      {lastUpdated && (
        <p className="text-[10px] text-slate-600">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </motion.div>
  );
}
