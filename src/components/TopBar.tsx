import React from 'react';
import { Volume2, VolumeX, Mic, MicOff, MessageSquareText, Shield, Sparkles, Bot } from 'lucide-react';

interface TopBarProps {
  wakeWordActive: boolean;
  onToggleWakeWord: () => void;
  voiceAudioMuted: boolean;
  onToggleVoiceMute: () => void;
  onOpenModal: (modal: any) => void;
  onOpenFeedback: () => void;
  onTestVoice?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  wakeWordActive,
  onToggleWakeWord,
  voiceAudioMuted,
  onToggleVoiceMute,
  onOpenModal,
  onOpenFeedback,
  onTestVoice,
}) => {
  return (
    <header className="h-14 border-b border-cyan-500/20 bg-[#05080c]/90 backdrop-blur-md px-4 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Left Actions */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#27d7e6] shadow-[0_0_8px_#27d7e6] animate-pulse" />
          <h1 className="font-mono font-bold tracking-wider text-lg text-white flex items-center gap-1.5">
            MUHIB AI
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
              v1.0 Sci-Fi
            </span>
          </h1>
        </div>

        <button
          onClick={() => onOpenModal('morning-briefing')}
          className="text-xs font-mono text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/40 px-2.5 py-1 rounded transition border border-transparent hover:border-amber-500/30 flex items-center gap-1"
          title="Subah ki briefing aur reminders"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Briefing</span>
        </button>

        <button
          onClick={() => onOpenModal('website-brief')}
          className="text-xs font-mono text-cyan-400/90 hover:text-cyan-300 hover:bg-cyan-950/40 px-2.5 py-1 rounded transition border border-transparent hover:border-cyan-500/30 flex items-center gap-1"
          title="Website Brief & Ready-to-paste prompt generator"
        >
          <MessageSquareText className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Website Brief</span>
        </button>

        <button
          onClick={() => onOpenModal('file-sandbox')}
          className="text-xs font-mono text-blue-400/90 hover:text-blue-300 hover:bg-blue-950/40 px-2.5 py-1 rounded transition border border-transparent hover:border-blue-500/30 flex items-center gap-1"
          title="Allowed folders & Files Sandbox"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Files</span>
        </button>

        <button
          onClick={() => onOpenModal('access-logs')}
          className="text-xs font-mono text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-950/40 px-2.5 py-1 rounded transition border border-transparent hover:border-emerald-500/30 flex items-center gap-1"
          title="Access permissions & action logs"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logs</span>
        </button>

        <button
          onClick={() => onOpenModal('mcp')}
          className="text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 px-2.5 py-1 rounded transition border border-emerald-500/40 flex items-center gap-1 shadow-[0_0_8px_rgba(46,229,157,0.2)]"
          title="Model Context Protocol (MCP) Server & Tool Explorer"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-bold">MCP SERVER</span>
        </button>

        <button
          onClick={() => onOpenModal('agent-framework')}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 px-2.5 py-1 rounded transition border border-cyan-500/40 flex items-center gap-1 shadow-[0_0_8px_rgba(39,215,230,0.2)]"
          title="Multi-Agent Autonomous Framework (ReAct Swarm)"
        >
          <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold">AGENT FRAMEWORK</span>
        </button>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Wake Word Indicator & Toggle */}
        <button
          onClick={onToggleWakeWord}
          className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md border transition-all ${
            wakeWordActive
              ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30 shadow-[0_0_8px_rgba(46,229,157,0.2)]'
              : 'text-slate-400 border-slate-700 bg-slate-900/40 hover:text-slate-200'
          }`}
          title="Wake word: 'Muhib' bolne par agent jaag jayega"
        >
          {wakeWordActive ? <Mic className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> : <MicOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">'Muhib' Wake:</span>
          <span>{wakeWordActive ? 'ON' : 'OFF'}</span>
        </button>

        {/* TTS Speech Mute Toggle */}
        <button
          onClick={onToggleVoiceMute}
          className={`p-1.5 rounded-md border transition ${
            voiceAudioMuted
              ? 'text-amber-400 border-amber-500/30 bg-amber-950/20'
              : 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/30'
          }`}
          title={voiceAudioMuted ? 'Awaaz Mute hai (Click to Unmute)' : 'Awaaz On hai (Click to Mute)'}
        >
          {voiceAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Quick Voice Test Button */}
        {onTestVoice && (
          <button
            onClick={onTestVoice}
            className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 px-2 py-1 rounded transition"
            title="Awaaz Test Karein"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test Awaaz</span>
          </button>
        )}

        {/* Theme badge */}
        <div className="hidden md:flex items-center gap-1 text-xs font-mono text-cyan-300/80 px-2 py-1 rounded border border-cyan-500/20 bg-[#09141f]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Dark Sci-Fi</span>
        </div>

        {/* Profile Pill */}
        <div
          onClick={() => onOpenModal('character')}
          className="flex items-center space-x-2 bg-[#091522] border border-cyan-500/30 hover:border-cyan-400/60 rounded-full px-2.5 py-1 cursor-pointer transition"
          title="Muhammad Muheb Riaz (Click to edit character & settings)"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-[11px] font-bold text-black font-mono">
            MR
          </div>
          <span className="text-xs font-mono text-slate-200 hidden sm:inline">Muhib</span>
        </div>
      </div>
    </header>
  );
};
