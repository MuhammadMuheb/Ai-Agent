import React from 'react';
import {
  Sparkles,
  MessageSquare,
  Globe,
  CheckSquare,
  LayoutDashboard,
  Volume2,
  VolumeX,
  Bot,
  Database,
  Calendar
} from 'lucide-react';
import { NavigationTab } from '../types/index.ts';
import { soundFX } from '../utils/soundEffects.ts';

interface ExecutiveHeaderProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenVault: () => void;
  voiceAudioMuted: boolean;
  onToggleMute: () => void;
  vaultItemCount: number;
  connectorCount: number;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenVault,
  voiceAudioMuted,
  onToggleMute,
  vaultItemCount,
  connectorCount,
}) => {
  const navItems = [
    { id: 'chat' as NavigationTab, label: 'AI Agent', icon: Bot },
    { id: 'web-hub' as NavigationTab, label: `Web Hub (${connectorCount})`, icon: Globe },
    { id: 'life-ops' as NavigationTab, label: 'Life Ops', icon: CheckSquare },
    { id: 'agentic-mission' as NavigationTab, label: 'Autonomous Missions', icon: Sparkles },
    { id: 'research' as NavigationTab, label: 'Deep Research', icon: MessageSquare },
    { id: 'dashboard' as NavigationTab, label: 'Daily Board', icon: LayoutDashboard },
  ];

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0c121e]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-blue-500/25 shrink-0">
            M
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">
                Muhib AI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-sky-300 border border-blue-500/30">
                Executive
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:block">
              Daily Life Operations &amp; Universal Web Hub
            </span>
          </div>
        </div>

        {/* Navigation Bar */}
        {/* Navigation Bar */}
        <nav className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-[#141d2e]/80 overflow-x-auto scrollbar-none shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFX.playSuccess();
                  onTabChange(item.id);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Secondary Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Today Date Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-slate-300 font-medium">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>{todayDate}</span>
          </div>

          {/* Memory Vault Trigger */}
          <button
            onClick={() => {
              soundFX.playSuccess();
              onOpenVault();
            }}
            className="px-3 py-2 rounded-lg border border-white/10 bg-[#141d2e] hover:bg-blue-950/60 hover:border-blue-500/40 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            title="Memory Vault"
          >
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Vault</span>
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
              {vaultItemCount}
            </span>
          </button>

          {/* Voice Mute Toggle */}
          <button
            onClick={() => {
              soundFX.playSuccess();
              onToggleMute();
            }}
            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition cursor-pointer ${
              voiceAudioMuted
                ? 'bg-slate-900 text-slate-500 border-white/10'
                : 'bg-[#141d2e] text-sky-300 border-white/10 hover:border-blue-500/40 hover:bg-blue-950/60 shadow-sm'
            }`}
            title={voiceAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {voiceAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* User Profile Initials */}
          <div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-sm cursor-default"
            title="Muhammad Muheb Riaz (Executive)"
          >
            MR
          </div>
        </div>
      </div>
    </header>
  );
};
