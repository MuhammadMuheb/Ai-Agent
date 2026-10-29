import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  Copy,
  Check,
  Globe,
  CheckSquare,
  Zap,
  ArrowRight,
  Plus,
  Compass,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { ParticleOrb } from './ParticleOrb.tsx';
import { OrbState, ChatMessage, WebConnector, ExecutiveTask } from '../types/index.ts';
import { soundFX } from '../utils/soundEffects.ts';

interface AIAgentAppScreenProps {
  orbState: OrbState;
  onOrbStateChange: (state: OrbState) => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onSpeakText: (text: string) => void;
  onNavigate: (tab: any) => void;
  connectorCount: number;
  taskCount: number;
  onAddQuickWebsite: (url: string) => void;
  onAddQuickTask: (title: string) => void;
}

export const AIAgentAppScreen: React.FC<AIAgentAppScreenProps> = ({
  orbState,
  onOrbStateChange,
  messages,
  isLoading,
  onSendMessage,
  onSpeakText,
  onNavigate,
  connectorCount,
  taskCount,
  onAddQuickWebsite,
  onAddQuickTask,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [transcriptNotice, setTranscriptNotice] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const isStartingRef = useRef(false);

  // Latest messages
  const lastAssistantMessage = messages.filter((m) => m.role === 'assistant').pop();
  const lastUserMessage = messages.filter((m) => m.role === 'user').pop();

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundFX.playSuccess();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setInputText('');
  };

  // Safe Speech Recognition
  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
    isStartingRef.current = false;
    onOrbStateChange('idle');
  };

  const toggleSpeech = async () => {
    if (isRecording) {
      stopRecording();
      const spoken = transcriptRef.current.trim();
      if (spoken) {
        handleSend(spoken);
      }
      return;
    }

    if (isStartingRef.current) return;
    isStartingRef.current = true;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTranscriptNotice('Speech recognition is not supported in this browser.');
      setTimeout(() => setTranscriptNotice(null), 3000);
      isStartingRef.current = false;
      return;
    }

    if (navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        setTranscriptNotice('Microphone blocked. Please grant microphone permission.');
        setTimeout(() => setTranscriptNotice(null), 4000);
        isStartingRef.current = false;
        return;
      }
    }

    try {
      soundFX.playWakeChime();
      transcriptRef.current = '';
      setTranscriptNotice('Listening... Speak now...');
      onOrbStateChange('listening');

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Works for Roman Urdu & Hindi phonetics

      recognition.onstart = () => {
        setIsRecording(true);
        isStartingRef.current = false;
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + ' ';
        }
        currentText = currentText.trim();
        transcriptRef.current = currentText;
        setInputText(currentText);
      };

      recognition.onerror = () => {
        stopRecording();
      };

      recognition.onend = () => {
        setIsRecording(false);
        isStartingRef.current = false;
        onOrbStateChange('idle');
        const spoken = transcriptRef.current.trim();
        if (spoken) {
          handleSend(spoken);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      stopRecording();
    }
  };

  const smartSuggestions = [
    { label: '🌐 Add Website to Hub', cmd: 'add website figma.com' },
    { label: '🎯 Add Life Priority', cmd: 'add task Finalize client pitch deck' },
    { label: '⚡ Run Morning Routine', cmd: 'run morning briefing' },
    { label: '🔍 Research AI Agents', cmd: 'Conduct deep research on multi-agent architectures' },
  ];

  return (
    <div className="flex-1 h-full w-full max-w-xl mx-auto flex flex-col justify-between overflow-hidden px-4 py-3 sm:py-5 animate-fadeIn select-none">
      {/* Top Header Card (Dribbble Health Agent Style) */}
      <div className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-4 shadow-xl shadow-black/20 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white tracking-tight">Muhib AI</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400">
                Personal Executive AI Companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('web-hub')}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-sky-300 font-medium transition cursor-pointer"
            >
              {connectorCount} Portals
            </button>
            <button
              onClick={() => onNavigate('life-ops')}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-emerald-300 font-medium transition cursor-pointer"
            >
              {taskCount} Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Center Stage: Luminous 3D Particle Orb (Interactive Agent Core) */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-2 relative">
        {/* Soft Ambient Radial Halo */}
        <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-sky-500/10 via-indigo-500/10 to-teal-500/10 blur-3xl pointer-events-none" />

        {/* 3D Particle Canvas */}
        <div
          onClick={toggleSpeech}
          className="relative cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 group"
          title="Click to talk with your AI Agent"
        >
          <ParticleOrb state={orbState} />
          
          {/* Subtle Ring Hover Pulse */}
          <div className="absolute inset-0 rounded-full border border-sky-400/20 group-hover:border-sky-400/50 transition-all pointer-events-none" />
        </div>

        {/* Status Prompt Under Orb */}
        <div className="text-center mt-1 space-y-1">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 tracking-wide flex items-center justify-center gap-1.5">
            {orbState === 'listening' && (
              <span className="text-emerald-300 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Listening to you...
              </span>
            )}
            {orbState === 'thinking' && (
              <span className="text-amber-300 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Thinking &amp; synthesizing...
              </span>
            )}
            {orbState === 'speaking' && (
              <span className="text-sky-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                Speaking to you...
              </span>
            )}
            {orbState === 'idle' && (
              <span className="text-slate-300">
                Tap orb or mic to speak in English or Roman Urdu
              </span>
            )}
          </p>

          {transcriptNotice && (
            <p className="text-[11px] text-sky-300 font-medium animate-fadeIn">
              {transcriptNotice}
            </p>
          )}
        </div>
      </div>

      {/* Floating Dialogue Card (Last Response) */}
      {lastAssistantMessage && (
        <div className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-4 shadow-xl shadow-black/20 mb-3 shrink-0 animate-fadeIn">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
              Agent Response
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSpeakText(lastAssistantMessage.content)}
                className="p-1 rounded-lg hover:bg-white/10 text-sky-300 text-xs transition cursor-pointer"
                title="Play Audio"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleCopy(lastAssistantMessage.id, lastAssistantMessage.content)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 text-xs transition cursor-pointer"
                title="Copy Text"
              >
                {copiedId === lastAssistantMessage.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans line-clamp-3">
            {lastAssistantMessage.content}
          </p>
        </div>
      )}

      {/* Smart Quick Action Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none shrink-0">
        {smartSuggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s.cmd)}
            className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Bottom Command Pill (Imran Jakir Dribbble App Bar) */}
      <div className="rounded-full bg-[#131d33]/90 backdrop-blur-xl border border-white/15 p-1.5 pl-4 shadow-2xl flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Speak or type: 'add website notion.so', 'remind me to workout'..."
          className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
          disabled={isLoading}
        />

        {/* Voice Trigger */}
        <button
          type="button"
          onClick={toggleSpeech}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            isRecording
              ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40'
              : 'bg-white/10 hover:bg-white/20 text-sky-300 hover:text-white border border-white/10'
          }`}
          title={isRecording ? 'Click to stop' : 'Click to speak'}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Send Action */}
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isLoading}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white flex items-center justify-center transition disabled:opacity-20 cursor-pointer shrink-0 shadow-md shadow-blue-500/25"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
