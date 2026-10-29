import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  MessageSquare,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Globe,
  CheckSquare
} from 'lucide-react';
import { ThreeRobotStudio } from './ThreeRobotStudio.tsx';
import { OrbState, ChatMessage, NavigationTab, WebConnector, ExecutiveTask } from '../types/index.ts';
import { soundFX } from '../utils/soundEffects.ts';

interface DesktopRobotViewProps {
  orbState: OrbState;
  onOrbStateChange: (state: OrbState) => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onSpeakText: (text: string) => void;
  voiceAudioMuted: boolean;
  onToggleMute: () => void;
  onNavigate: (tab: NavigationTab) => void;
  connectors: WebConnector[];
  tasks: ExecutiveTask[];
  onClearChat: () => void;
}

export const DesktopRobotView: React.FC<DesktopRobotViewProps> = ({
  orbState,
  onOrbStateChange,
  messages,
  isLoading,
  onSendMessage,
  onSpeakText,
  voiceAudioMuted,
  onToggleMute,
  onNavigate,
  connectors,
  tasks,
  onClearChat,
}) => {
  const [inputText, setInputText] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptNotice, setTranscriptNotice] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat history drawer
  useEffect(() => {
    if (historyOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, historyOpen]);

  // Last assistant reply to display on the main screen
  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setInputText('');
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Safe Voice Dictation
  const toggleVoice = async () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecording(false);
      onOrbStateChange('idle');
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setTranscriptNotice('Browser audio recognition not supported.');
      setTimeout(() => setTranscriptNotice(null), 3000);
      return;
    }

    try {
      soundFX.playWakeChime();
      onOrbStateChange('listening');
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => setIsRecording(true);
      rec.onresult = (e: any) => {
        let t = '';
        for (let i = 0; i < e.results.length; i++) {
          t += e.results[i][0].transcript;
        }
        setInputText(t);
      };
      rec.onerror = () => {
        setIsRecording(false);
        onOrbStateChange('idle');
      };
      rec.onend = () => {
        setIsRecording(false);
        onOrbStateChange('idle');
      };

      recognitionRef.current = rec;
      rec.start();
    } catch {
      setIsRecording(false);
      onOrbStateChange('idle');
    }
  };

  // Quick Roman Urdu Suggestions
  const quickSuggestions = [
    { label: 'Aaj ke zaroori kaam', cmd: 'Muheb bhai ke aaj ke zaroori priority tasks aur schedule batayein.' },
    { label: 'Website audit karo', cmd: 'Universal Web Hub ki registered websites ka status audit karein.' },
    { label: 'Market intelligence report', cmd: 'AI technology aur market intelligence ki tajzia report banayein.' },
    { label: 'Professional email likho', cmd: 'Boss ke liye ek nihayat tameezdaar aur professional follow-up email draft karein.' },
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#060a14] via-[#091122] to-[#040711] text-slate-100 select-none font-sans">
      
      {/* 1. TOP MINIMAL BAR - ZERO CLUTTER */}
      <header className="w-full px-6 py-4 flex items-center justify-between z-20 shrink-0 border-b border-white/5 bg-[#060a14]/60 backdrop-blur-md">
        {/* Brand & 24/7 Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-md shadow-sky-500/20">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">Muhib AI</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                24/7 Desktop Robot
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-400 font-medium">Online &bull; Active &bull; Ready</span>
            </div>
          </div>
        </div>

        {/* Minimal Controls */}
        <div className="flex items-center gap-2">
          {/* Chat History Toggle */}
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
            title="View Chat History"
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Conversation</span>
            <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-300 text-[10px] flex items-center justify-center font-bold">
              {messages.length}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition cursor-pointer ${
              voiceAudioMuted
                ? 'bg-slate-900 text-slate-500 border-white/10'
                : 'bg-white/5 text-sky-300 border-white/10 hover:bg-white/10'
            }`}
            title={voiceAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {voiceAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Clear Chat */}
          <button
            onClick={onClearChat}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-rose-400 flex items-center justify-center transition cursor-pointer"
            title="Start New Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Executive Tools Shortcut */}
          <button
            onClick={() => onNavigate('agentic-mission')}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-semibold text-sky-300 flex items-center gap-1.5 transition cursor-pointer"
            title="Open Autonomous Agent Console"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Console</span>
          </button>

          {/* User Badge */}
          <div
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-sm ml-1"
            title="Muhammad Muheb Riaz"
          >
            MR
          </div>
        </div>
      </header>

      {/* 2. CENTER STAGE - THE 3D ROBOT STUDIO */}
      <main className="flex-1 w-full relative flex flex-col items-center justify-center overflow-hidden">
        
        {/* Full Viewport 3D Three.js Robot */}
        <div className="absolute inset-0 z-0">
          <ThreeRobotStudio state={orbState} onRobotClick={toggleVoice} />
        </div>

        {/* Floating Active Speech Bubble (Clean & Polished) */}
        <div className="z-10 max-w-2xl w-full px-6 pointer-events-none mb-auto mt-6">
          {lastAssistantMsg ? (
            <div className="pointer-events-auto bg-[#0f172a]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/60 text-slate-100 animate-fadeIn space-y-2">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="text-xs font-bold text-sky-400 tracking-wide">Muhib AI Robot</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSpeakText(lastAssistantMsg.content)}
                    className="p-1 text-slate-400 hover:text-sky-300 transition cursor-pointer"
                    title="Read Aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => copyText(lastAssistantMsg.content, lastAssistantMsg.id)}
                    className="p-1 text-slate-400 hover:text-sky-300 transition cursor-pointer"
                    title="Copy Text"
                  >
                    {copiedId === lastAssistantMsg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-200">
                {lastAssistantMsg.content}
              </p>
            </div>
          ) : (
            <div className="pointer-events-auto bg-[#0f172a]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center shadow-xl shadow-black/40 text-slate-200 animate-fadeIn">
              <p className="text-base font-medium text-white mb-1">
                Assalam-o-Alaikum, <strong className="text-sky-400 font-bold">Muheb bhai!</strong>
              </p>
              <p className="text-xs text-slate-300">
                Main aap ka 24/7 Desktop AI Robot companion hoon. Aap Roman Urdu ya English mein jo chahein hukum karein, main fauran hal kar deta hoon.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="pointer-events-auto mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-950/80 border border-sky-500/30 text-xs text-sky-300 shadow-md">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>Muhib AI soch raha hai...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Directives */}
        <div className="z-10 w-full max-w-2xl px-6 mb-3 flex items-center justify-center gap-2 flex-wrap">
          {quickSuggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s.cmd)}
              className="px-3.5 py-1.5 rounded-full bg-[#121c32]/80 hover:bg-sky-950/90 border border-white/10 hover:border-sky-500/40 text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer shadow-sm"
            >
              {s.label}
            </button>
          ))}
        </div>
      </main>

      {/* 3. BOTTOM FLOATING MINIMAL INPUT BAR */}
      <footer className="w-full px-6 pb-6 pt-2 z-20 shrink-0 flex flex-col items-center">
        <div className="max-w-2xl w-full bg-[#0d1527]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-2 shadow-2xl shadow-black/70 flex items-center gap-2">
          
          {/* Voice Input Button */}
          <button
            onClick={toggleVoice}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer shrink-0 ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-sky-400 border border-white/10'
            }`}
            title={isRecording ? 'Listening... click to stop' : 'Click to Speak'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Clean Input Field */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Roman Urdu ya English mein baat karein... (e.g. 'Muheb bhai ke liye yeh kaam karo')"
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none px-2"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 disabled:opacity-30 text-white flex items-center justify-center shadow-md shadow-sky-500/25 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {transcriptNotice && (
          <p className="text-xs text-slate-400 mt-2">{transcriptNotice}</p>
        )}
      </footer>

      {/* 4. SLIDE-OUT CONVERSATION HISTORY DRAWER (STAYS OUT OF THE WAY) */}
      {historyOpen && (
        <div className="absolute inset-0 z-30 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md h-full bg-[#0b1220] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-fadeIn">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Conversation History</h3>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-none">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-br-sm'
                          : 'bg-[#152037] border border-white/10 text-slate-200 rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.content}</p>
                      <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 text-[10px] text-slate-400">
                        <span>{m.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => onSpeakText(m.content)}
                            className="hover:text-sky-300 transition"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Drawer Footer Tools Access */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">24/7 Desktop Companion</span>
              <button
                onClick={onClearChat}
                className="text-rose-400 hover:underline cursor-pointer"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
