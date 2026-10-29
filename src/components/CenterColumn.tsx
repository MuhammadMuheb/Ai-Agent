import React from 'react';
import { ParticleOrb } from './ParticleOrb.tsx';
import { OrbState, ActiveModal } from '../types/index.ts';
import { Power, Sparkles, Brain, Wrench, UserCheck, Settings, Leaf, Cpu, Globe, MessageSquare, Terminal } from 'lucide-react';
import { soundFX } from '../utils/soundEffects.ts';

interface CenterColumnProps {
  orbState: OrbState;
  onToggleOrb: () => void;
  onEmergencyStop: () => void;
  onOpenModal: (modal: ActiveModal) => void;
  onSwitchToPlantTab: () => void;
}

export const CenterColumn: React.FC<CenterColumnProps> = ({
  orbState,
  onToggleOrb,
  onEmergencyStop,
  onOpenModal,
  onSwitchToPlantTab,
}) => {
  return (
    <div className="flex flex-col h-full gap-3 justify-between">
      {/* 4 Core Module Buttons (Top Center) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => {
            soundFX.playSuccess();
            onOpenModal('memory');
          }}
          className="sci-border sci-border-hover p-2.5 bg-[#091522] flex items-center justify-between text-left transition group"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
            <span className="font-mono text-xs font-bold text-white tracking-wide">
              MEMORY
            </span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#27d7e6]" />
        </button>

        <button
          onClick={() => {
            soundFX.playSuccess();
            onOpenModal('skills');
          }}
          className="sci-border sci-border-hover p-2.5 bg-[#091522] flex items-center justify-between text-left transition group"
        >
          <div className="flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
            <span className="font-mono text-xs font-bold text-white tracking-wide">
              SKILLS
            </span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#2ee59d]" />
        </button>

        <button
          onClick={() => {
            soundFX.playSuccess();
            onOpenModal('character');
          }}
          className="sci-border sci-border-hover p-2.5 bg-[#091522] flex items-center justify-between text-left transition group"
        >
          <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-cyan-300 group-hover:scale-110 transition" />
            <span className="font-mono text-xs font-bold text-white tracking-wide">
              CHARACTER
            </span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#27d7e6]" />
        </button>

        <button
          onClick={() => {
            soundFX.playSuccess();
            onOpenModal('settings');
          }}
          className="sci-border sci-border-hover p-2.5 bg-[#091522] flex items-center justify-between text-left transition group"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
            <span className="font-mono text-xs font-bold text-white tracking-wide">
              SETTINGS
            </span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f5b83d]" />
        </button>
      </div>

      {/* Primary Intelligence Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div
          onClick={() => {
            soundFX.playSuccess();
            onOpenModal('deep-research');
          }}
          className="sci-border p-2.5 bg-gradient-to-r from-cyan-950/50 via-purple-950/40 to-blue-950/50 flex items-center justify-between cursor-pointer hover:border-cyan-400/60 transition group shadow-[0_0_15px_rgba(39,215,230,0.15)]"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition shrink-0 animate-pulse" />
            <div>
              <span className="text-[11px] font-mono text-cyan-200 font-bold block truncate">
                DEEP RESEARCH ENGINE
              </span>
              <span className="text-[9px] font-mono text-purple-300">
                ChatGPT + Claude + Gemini
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-900/60 px-2 py-1 rounded border border-cyan-400/40 shrink-0 font-bold group-hover:bg-cyan-500 group-hover:text-black transition">
            Research →
          </span>
        </div>

        <div
          onClick={() => {
            soundFX.playSuccess();
            onOpenModal('agent-framework');
          }}
          className="sci-border p-2.5 bg-gradient-to-r from-emerald-950/50 via-cyan-950/30 to-emerald-950/50 flex items-center justify-between cursor-pointer hover:border-emerald-400/60 transition group"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Cpu className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition shrink-0" />
            <div>
              <span className="text-[11px] font-mono text-emerald-200 font-bold block truncate">
                AUTONOMOUS SWARM
              </span>
              <span className="text-[9px] font-mono text-emerald-400">
                ReAct Multi-Agent Core
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-300 bg-emerald-900/60 px-2 py-1 rounded border border-emerald-500/40 shrink-0 font-bold group-hover:bg-emerald-500 group-hover:text-black transition">
            Launch →
          </span>
        </div>
      </div>

      {/* Center 3D Interactive Orb with Audio Trigger */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
        <ParticleOrb state={orbState} onClick={onToggleOrb} />

        {/* Emergency Stop Button */}
        <button
          onClick={onEmergencyStop}
          className="mt-2 font-mono text-xs font-bold uppercase tracking-wider text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/50 hover:border-rose-400 rounded-lg px-6 py-2 transition shadow-[0_0_12px_rgba(255,77,94,0.2)] flex items-center gap-2 cursor-pointer"
        >
          <Power className="w-3.5 h-3.5 text-rose-400" />
          BAND KARO (EMERGENCY STOP)
        </button>
      </div>

      {/* Clean System Integrity & Real-Time Access Monitor */}
      <div className="sci-border p-3.5 bg-[#091522]/90 flex flex-col gap-2.5">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#2ee59d] animate-pulse" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
              SYSTEM CONNECTIVITY &amp; ACCESS BRIDGES
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
            ALL SYSTEMS ARMED
          </span>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
          <div className="p-2 rounded bg-black/40 border border-emerald-500/20 flex flex-col items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-slate-300">WhatsApp Bridge</span>
            <span className="text-[9px] text-emerald-400 font-bold">Connected</span>
          </div>

          <div className="p-2 rounded bg-black/40 border border-cyan-500/20 flex flex-col items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-slate-300">Google Suite</span>
            <span className="text-[9px] text-cyan-400 font-bold">1-Click Live</span>
          </div>

          <div className="p-2 rounded bg-black/40 border border-purple-500/20 flex flex-col items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] text-slate-300">Tri-Model Engine</span>
            <span className="text-[9px] text-purple-400 font-bold">Operational</span>
          </div>

          <div className="p-2 rounded bg-black/40 border border-amber-500/20 flex flex-col items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-slate-300">Desktop Protocol</span>
            <span className="text-[9px] text-amber-400 font-bold">Unlocked</span>
          </div>
        </div>

        {/* Quick Launch Deep Research Button */}
        <button
          onClick={() => {
            soundFX.playSuccess();
            onOpenModal('deep-research');
          }}
          className="w-full text-xs font-mono font-bold py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-purple-600/20 hover:from-cyan-500 hover:to-blue-600 hover:text-black text-cyan-200 border border-cyan-400/40 transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(39,215,230,0.1)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Super Deep Research Modal Kholo (ChatGPT + Claude + Gemini)</span>
        </button>
      </div>
    </div>
  );
};
