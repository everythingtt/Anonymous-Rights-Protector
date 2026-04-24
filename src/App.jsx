import React, { useState, useEffect } from 'react';
import { Shield, Lock, Terminal, Activity, Users, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { io } from 'socket.io-client';

import banner from './assets/anonymous-banner.jpg';
import emblem from './assets/anonymous-emblem.png';

function App() {
  const [status, setStatus] = useState('Offline');
  const [stats, setStats] = useState({
    protected: 0,
    blocked: 0,
    proxied: 0,
    users: 0
  });
  const [logs, setLogs] = useState([]);
  const [publicUrl, setPublicUrl] = useState(null);

  useEffect(() => {
    // Check if we have a public URL in the logs or from a known source
    // For now, we connect to the current origin, which Nginx or Ngrok will handle
    const socket = io(window.location.origin, {
      path: '/socket.io/'
    });

    socket.on('connect', () => {
      setStatus('Online');
      addLog({ time: new Date().toLocaleTimeString(), msg: 'Connected to Security Engine', type: 'success' });
    });

    socket.on('disconnect', () => {
      setStatus('Offline');
      addLog({ time: new Date().toLocaleTimeString(), msg: 'Lost connection to Security Engine', type: 'danger' });
    });

    socket.on('stats', (newStats) => {
      setStats(newStats);
    });

    socket.on('log', (log) => {
      addLog(log);
      // Extract Ngrok URL from logs if it appears
      if (log.msg.includes('Dashboard API is public:')) {
        const url = log.msg.split('public: ')[1];
        setPublicUrl(url);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const addLog = (log) => {
    setLogs(prev => [log, ...prev].slice(0, 50));
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center">
      {/* Hero Banner */}
      <div className="w-full h-48 md:h-64 overflow-hidden relative border-b border-green-900/30">
        <img src={banner} alt="Anonymous Banner" className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <img src={emblem} alt="Emblem" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-[0_0_15px_rgba(0,255,0,0.5)]" />
        </div>
      </div>

      <div className="w-full max-w-6xl p-4 md:p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 border-b border-green-900/30 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Shield className="text-green-500 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter uppercase text-green-500">Anonymous Rights Protector</h1>
              <p className="text-xs text-green-500/60 uppercase tracking-widest">Privacy & Security First</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-xs font-bold uppercase ${status === 'Online' ? 'text-green-500' : 'text-red-500'}`}>{status}</span>
            </div>
            {publicUrl && (
              <div className="flex items-center gap-2 text-[10px] text-green-500/40 uppercase tracking-tighter">
                <LinkIcon size={10} />
                Public Endpoint Active
              </div>
            )}
          </div>
        </header>

        <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Section */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <StatCard icon={<Shield />} label="Messages Protected" value={stats.protected} color="green" />
            <StatCard icon={<Lock />} label="Privacy Proxied" value={stats.proxied} color="blue" />
            <StatCard icon={<AlertTriangle />} label="Malicious Blocked" value={stats.blocked} color="red" />
            <StatCard icon={<Users />} label="Active Users" value={stats.users} color="purple" />
          </div>

          {/* Terminal/Logs */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 h-[400px] flex flex-col shadow-2xl shadow-green-500/5">
            <div className="flex items-center gap-2 mb-4 text-zinc-500 text-xs uppercase font-bold tracking-widest">
              <Terminal size={14} />
              Live Security Feed
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 text-xs scrollbar-hide">
              {logs.length > 0 ? logs.map((log, i) => (
                <LogEntry key={i} time={log.time} msg={log.msg} type={log.type} />
              )) : (
                <div className="text-zinc-700 animate-pulse italic">Awaiting public secure tunnel...</div>
              )}
            </div>
          </div>

          {/* Action Panel */}
          <div className="md:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mt-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase">
              <Activity className="text-green-500" />
              Active Protections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ProtectionToggle label="NSFW/CSAM Filter" active={true} />
              <ProtectionToggle label="Phishing Shield" active={true} />
              <ProtectionToggle label="Webhook Proxy" active={true} />
              <ProtectionToggle label="AI Context Analysis" active={true} />
            </div>
          </div>
        </main>

        <footer className="w-full max-w-6xl mt-12 text-center text-zinc-600 text-[10px] uppercase tracking-widest pb-8">
          Built for User Freedom • No Logs Kept • End-to-End Encryption
        </footer>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    green: 'text-green-500 bg-green-500/5 border-green-500/10',
    blue: 'text-blue-500 bg-blue-500/5 border-blue-500/10',
    red: 'text-red-500 bg-red-500/5 border-red-500/10',
    purple: 'text-purple-500 bg-purple-500/5 border-purple-500/10',
  };

  return (
    <div className={`p-6 rounded-xl border ${colors[color]} flex flex-col justify-between h-32 transition-all hover:scale-[1.02] shadow-lg shadow-black`}>
      <div className="flex justify-between items-start">
        <div className="opacity-80">{icon}</div>
        <span className="text-3xl font-black">{value}</span>
      </div>
      <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">{label}</span>
    </div>
  );
}

function LogEntry({ time, msg, type }) {
  const colors = {
    info: 'text-zinc-500',
    warning: 'text-yellow-500',
    success: 'text-green-500',
    danger: 'text-red-500',
  };
  return (
    <div className="flex gap-3 font-mono leading-tight">
      <span className="text-zinc-700">[{time}]</span>
      <span className={`${colors[type]} break-all`}>{msg}</span>
    </div>
  );
}

function ProtectionToggle({ label, active }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-zinc-800/50">
      <span className="text-xs text-zinc-400 font-bold uppercase">{label}</span>
      <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-green-600' : 'bg-zinc-800'}`}>
        <div className={`absolute top-1 left-1 w-2 h-2 rounded-full bg-white transition-transform ${active ? 'translate-x-4' : ''}`} />
      </div>
    </div>
  );
}

export default App;
