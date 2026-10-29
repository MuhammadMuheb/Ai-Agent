import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Settings,
  Plus,
  SlidersHorizontal,
  Sparkles,
  ArrowUp,
  ExternalLink,
  Mic,
  Video,
  X,
  Check,
  CheckSquare,
  Globe,
  Layers,
  Zap,
  BookOpen,
  Database,
  Edit3,
  Stethoscope,
  Volume2,
  Copy,
  RotateCcw,
  Box,
  Sun,
  Moon
} from 'lucide-react';
import { ThreeAgentScene } from './ThreeAgentScene.tsx';
import { ParticleOrb } from './ParticleOrb.tsx';
import { OrbState, ChatMessage, WebConnector, ExecutiveTask, LifeWorkflow, NavigationTab } from '../types/index.ts';
import { soundFX } from '../utils/soundEffects.ts';

interface DribbbleAgentAppProps {
  orbState: OrbState;
  onOrbStateChange: (state: OrbState) => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onSpeakText: (text: string) => void;
  onNavigate: (tab: NavigationTab) => void;
  connectors: WebConnector[];
  tasks: ExecutiveTask[];
  workflows: LifeWorkflow[];
  onOpenVault: () => void;
  onRunWorkflow: (workflow: LifeWorkflow) => Promise<void>;
  onAddTask: (task: ExecutiveTask) => void;
  onAddConnector: (connector: WebConnector) => void;
}

export const DribbbleAgentApp: React.FC<DribbbleAgentAppProps> = ({
  orbState,
  onOrbStateChange,
  messages,
  isLoading,
  onSendMessage,
  onSpeakText,
  onNavigate,
  connectors,
  tasks,
  workflows,
  onOpenVault,
  onRunWorkflow,
  onAddTask,
  onAddConnector,
}) => {
  // Screen mode: 'home' | 'sources' | 'voice'
  const [screenMode, setScreenMode] = useState<'home' | 'sources' | 'voice'>('home');
  // Visual Core Mode: 'threejs' (Three.js 3D Holographic Core) | 'canvas' (2D Iridescent Orb)
  const [visualCore, setVisualCore] = useState<'threejs' | 'canvas'>('threejs');
  // Theme: 'dark' (Executive Command Center matching user screenshot) | 'daylight' (Dribbble pastel)
  const [themeMode, setThemeMode] = useState<'dark' | 'daylight'>('dark');

  // Sources Sheet Toggles
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [connectorsEnabled, setConnectorsEnabled] = useState(true);

  // Input & Voice State
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptNotice, setTranscriptNotice] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const isStartingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setInputText('');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Safe Speech Recognition for Voice Mode
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

  const toggleVoiceMode = async () => {
    if (isRecording) {
      stopRecording();
      const spoken = transcriptRef.current.trim();
      if (spoken) {
        handleSend(spoken);
        setScreenMode('home');
      }
      return;
    }

    if (isStartingRef.current) return;
    isStartingRef.current = true;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTranscriptNotice('Speech recognition not supported in this browser.');
      setTimeout(() => setTranscriptNotice(null), 3000);
      isStartingRef.current = false;
      return;
    }

    if (navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        setTranscriptNotice('Microphone blocked. Please grant permission.');
        setTimeout(() => setTranscriptNotice(null), 4000);
        isStartingRef.current = false;
        return;
      }
    }

    try {
      soundFX.playWakeChime();
      transcriptRef.current = '';
      setTranscriptNotice('Listening... Speak whenever you are ready.');
      onOrbStateChange('listening');
      setScreenMode('voice');

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

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
          setScreenMode('home');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      stopRecording();
    }
  };

  // Suggestion Pills matching Dribbble Shot
  const suggestionPillsRow1 = [
    { label: 'Executive Meeting Minutes', cmd: 'Draft executive meeting minutes and follow-up directives' },
    { label: 'Autonomous Missions', cmd: 'Initialize Autonomous Agent Console mission dispatch' },
    { label: 'Web Hub (5,000+)', cmd: 'Audit registered cloud connectors in universal hub' },
  ];

  const suggestionPillsRow2 = [
    { label: 'Case Review', cmd: 'Review current strategic case and priority risks' },
    { label: 'Discharge Planning', cmd: 'Execute daily life and schedule discharge planning' },
    { label: 'Life Operations', cmd: 'Show my pending high-priority tasks and daily routines' },
    { label: 'Deep Research', cmd: 'Synthesize market intelligence and competitive data' },
  ];

  const isDark = themeMode === 'dark';
  const showHeroOrb = messages.length <= 1;

  return (
    <div
      className={`w-full h-full flex flex-col justify-between font-sans overflow-hidden transition-colors duration-300 relative select-none ${
        isDark
          ? 'bg-[#0c121e]/40 text-slate-100'
          : 'bg-gradient-to-br from-[#fdf0ea] via-[#f5f2fc] via-[#edf3fd] to-[#dce8fb] text-slate-800'
      }`}
    >
      {/* ========================================================================= */}
      {/* SCREEN 3: LIVE IMMERSIVE VOICE SCREEN ("Speak whenever you're ready...") */}
      {/* ========================================================================= */}
      {screenMode === 'voice' ? (
        <div className="flex-1 flex flex-col justify-between max-w-xl w-full mx-auto p-6 sm:p-8 animate-fadeIn relative z-10">
          {/* Top Bar: Drug Info / AI Assistant, Close */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Live Voice Stream
              </span>
            </div>
            <div className="text-center">
              <span className={`text-base font-bold block leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Drug Info &amp; Executive Voice
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                AI Assistant &bull; Three.js Reactive
              </span>
            </div>
            <button
              onClick={() => setScreenMode('home')}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer border ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  : 'bg-white/80 hover:bg-white border-white/70 text-slate-700 shadow-sm'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Central 3D Three.js Scene / Orb & Waveform */}
          <div className="flex flex-col items-center justify-center my-auto space-y-6">
            <div className="relative">
              <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-sky-400/20 via-purple-400/20 to-blue-400/20 blur-3xl absolute inset-0 -z-10 animate-pulse" />
              {visualCore === 'threejs' ? (
                <ThreeAgentScene state={orbState} size={280} onOrbClick={toggleVoiceMode} />
              ) : (
                <ParticleOrb state={orbState} onClick={toggleVoiceMode} />
              )}
            </div>

            {/* Animated Audio Waveform */}
            <div className="flex items-center gap-1.5 text-sky-400 h-7">
              <span className="w-1.5 h-3.5 bg-sky-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-6 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.1s]" />
              <span className="w-1.5 h-7 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-5 bg-sky-400 rounded-full animate-bounce [animation-delay:0.3s]" />
              <span className="w-1.5 h-2.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>

            {/* Voice Prompt Headline */}
            <div className="text-center px-4 space-y-1">
              <h2 className={`text-2xl sm:text-[30px] font-normal leading-snug tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                Speak <strong className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-950'}`}>whenever you're ready,</strong>
              </h2>
              <p className={`text-2xl sm:text-[30px] font-normal tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                I'm <strong className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-950'}`}>listening now.</strong>
              </p>
              {inputText && (
                <p className={`text-xs mt-3 font-semibold px-4 py-2 rounded-full inline-block shadow-sm ${
                  isDark ? 'bg-indigo-950/80 text-sky-300 border border-indigo-500/30' : 'bg-white/85 text-indigo-700'
                }`}>
                  "{inputText}"
                </p>
              )}
              {transcriptNotice && (
                <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{transcriptNotice}</p>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between px-8 pb-4">
            <button
              onClick={() => setScreenMode('home')}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer border ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/10 text-slate-300 hover:text-white'
                  : 'bg-white/80 hover:bg-white border-white/60 text-slate-700 shadow-sm'
              }`}
              title="Switch to Chat"
            >
              <Video className="w-5 h-5" />
            </button>

            {/* Glowing Purple Microphone Button with Ripple Waves */}
            <button
              onClick={toggleVoiceMode}
              className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-sky-500 text-white flex items-center justify-center shadow-xl shadow-purple-500/40 hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <span className="absolute inset-0 rounded-full border-4 border-purple-400/40 animate-ping pointer-events-none" />
              <Mic className="w-8 h-8 fill-current" />
            </button>

            <button
              onClick={() => setScreenMode('home')}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer border ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/10 text-slate-300 hover:text-white'
                  : 'bg-white/80 hover:bg-white border-white/60 text-slate-700 shadow-sm'
              }`}
              title="Cancel Voice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* SCREEN 1: MAIN ASSISTANT (Three.js 3D Spatial Agent + Conversation)       */
        /* ========================================================================= */
        <div className="flex-1 flex flex-col justify-between max-w-4xl w-full mx-auto p-4 sm:p-6 pb-3 relative z-10 overflow-hidden">
          
          {/* Sub-Header: Mode Switchers (Three.js 3D Scene / Theme Toggle) */}
          <div className="flex items-center justify-between pt-1 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                AI Executive Agent
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Three.js 3D WebGL
              </span>
            </div>

            {/* Quick Core & Theme Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setVisualCore((prev) => (prev === 'threejs' ? 'canvas' : 'threejs'))}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                  visualCore === 'threejs'
                    ? 'bg-blue-600/30 text-sky-300 border-blue-500/40 shadow-sm'
                    : isDark ? 'bg-white/5 text-slate-400 border-white/10' : 'bg-white/80 text-slate-600 border-slate-300'
                }`}
                title="Toggle Three.js 3D Scene"
              >
                <Box className="w-3.5 h-3.5" />
                <span>{visualCore === 'threejs' ? 'Three.js 3D' : '2D Orb'}</span>
              </button>

              <button
                onClick={() => setThemeMode((prev) => (prev === 'dark' ? 'daylight' : 'dark'))}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    : 'bg-white/80 hover:bg-white text-slate-700 border-slate-300 shadow-sm'
                }`}
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            </div>
          </div>

          {/* Center Stage: Hero with Three.js 3D Sphere or Conversation Stream */}
          <div className="flex-1 overflow-y-auto py-3 px-1 space-y-4 scrollbar-none flex flex-col">
            {showHeroOrb ? (
              /* Hero View with 3D Three.js Spatial Model */
              <div className="my-auto flex flex-col items-center justify-center text-center space-y-4 py-2">
                <div>
                  <h1 className={`text-3xl sm:text-[38px] font-normal leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Hello there, <strong className={`font-extrabold ${isDark ? 'text-sky-300' : 'text-slate-950'}`}>Muheb!</strong>
                  </h1>
                  <p className={`text-3xl sm:text-[38px] font-normal tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    How <strong className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-950'}`}>can I help</strong> you?
                  </p>
                </div>

                {/* Central Three.js 3D Sphere or Particle Orb */}
                <div className="relative py-2 flex items-center justify-center">
                  <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-sky-400/20 via-indigo-500/20 to-purple-500/20 blur-3xl absolute inset-0 -z-10 animate-pulse" />
                  {visualCore === 'threejs' ? (
                    <ThreeAgentScene state={orbState} size={290} onOrbClick={toggleVoiceMode} />
                  ) : (
                    <ParticleOrb state={orbState} onClick={toggleVoiceMode} />
                  )}
                </div>

                {/* Suggestion Pills in TWO Staggered Rows matching Dribbble Shot */}
                <div className="w-full max-w-xl space-y-2 pt-1">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {suggestionPillsRow1.map((pill, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(pill.cmd)}
                        className={`px-4 py-2 rounded-full border text-xs font-semibold transition cursor-pointer ${
                          isDark
                            ? 'bg-[#141d2e]/90 hover:bg-blue-950/80 text-slate-200 hover:text-white border-white/10 hover:border-blue-500/40 shadow-sm'
                            : 'bg-white/85 hover:bg-white text-slate-700 hover:text-indigo-600 border-white/80 shadow-sm'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {suggestionPillsRow2.map((pill, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(pill.cmd)}
                        className={`px-4 py-2 rounded-full border text-xs font-semibold transition cursor-pointer ${
                          isDark
                            ? 'bg-[#141d2e]/90 hover:bg-blue-950/80 text-slate-200 hover:text-white border-white/10 hover:border-blue-500/40 shadow-sm'
                            : 'bg-white/85 hover:bg-white text-slate-700 hover:text-indigo-600 border-white/80 shadow-sm'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Active Chat Conversation Stream */
              <div className="space-y-4 max-w-2xl mx-auto w-full pt-2">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fadeIn`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] px-4.5 py-3 rounded-3xl shadow-sm text-sm ${
                          isUser
                            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-br-sm'
                            : isDark
                            ? 'bg-[#141d2e]/90 backdrop-blur-xl border border-white/10 text-slate-100 rounded-bl-sm shadow-md'
                            : 'bg-white/95 backdrop-blur-xl border border-white/80 text-slate-800 rounded-bl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                        {!isUser && (
                          <div className={`flex items-center justify-between gap-3 mt-2.5 pt-2 border-t text-[11px] ${
                            isDark ? 'border-white/10 text-slate-400' : 'border-slate-100 text-slate-400'
                          }`}>
                            <span>{msg.timestamp}</span>
                            <div className="flex items-center gap-2.5">
                              <button
                                onClick={() => onSpeakText(msg.content)}
                                className="hover:text-sky-400 transition cursor-pointer"
                                title="Read aloud"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => copyToClipboard(msg.content, msg.id)}
                                className="hover:text-sky-400 transition cursor-pointer"
                                title="Copy"
                              >
                                {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className={`flex items-center gap-2 p-3 rounded-2xl w-fit shadow-sm ${
                    isDark ? 'bg-[#141d2e] border border-white/10 text-slate-300' : 'bg-white/80 text-slate-600'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                    <span className="text-xs font-medium">Muhib AI Executive Engine is processing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Floating Input Capsule Container (Exact Dribbble Style) */}
          <div className="shrink-0 max-w-2xl w-full mx-auto space-y-2 mt-2">
            <div className={`rounded-[30px] p-3.5 border shadow-xl space-y-2.5 transition-colors ${
              isDark
                ? 'bg-[#121a2c]/95 backdrop-blur-2xl border-white/10 shadow-black/30'
                : 'bg-white/95 backdrop-blur-2xl border-white/90 shadow-slate-900/5'
            }`}>
              {/* Input row with mini glowing orb */}
              <div className="flex items-center gap-3 px-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 shrink-0 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Muhib a question, dispatch mission, or query 5,000+ Hub..."
                  className={`w-full bg-transparent text-sm focus:outline-none ${
                    isDark ? 'text-white placeholder-slate-400' : 'text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Bottom Capsule Control Row */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const url = prompt('Enter website URL to add to 5,000+ Hub (e.g. figma.com):');
                      if (url) {
                        let cleanUrl = url.trim();
                        if (!cleanUrl.startsWith('http')) cleanUrl = `https://${cleanUrl}`;
                        const name = cleanUrl.replace(/^https?:\/\//, '').split('.')[0];
                        onAddConnector({
                          id: `conn-${Date.now()}`,
                          name: name.charAt(0).toUpperCase() + name.slice(1),
                          url: cleanUrl,
                          category: 'Custom',
                          description: 'Added via quick action.',
                          tags: ['custom'],
                          isFavorite: true,
                          addedAt: new Date().toISOString().split('T')[0],
                          status: 'active',
                          lastPingMs: 32,
                        });
                        soundFX.playSuccess();
                      }
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/20 text-slate-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                    title="Add Website to 5,000+ Hub"
                  >
                    <Plus className="w-4 h-4 stroke-[2.2]" />
                  </button>

                  {/* Sources Button */}
                  <button
                    onClick={() => setScreenMode('sources')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/20 text-slate-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400 stroke-[2.2]" />
                    <span>Sources</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Voice Waveform Button */}
                  <button
                    onClick={() => toggleVoiceMode()}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/20 text-sky-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title="Live Voice Mode"
                  >
                    <div className="flex items-center gap-0.5">
                      <span className="w-0.5 h-3 bg-current rounded-full" />
                      <span className="w-0.5 h-4 bg-current rounded-full" />
                      <span className="w-0.5 h-2.5 bg-current rounded-full" />
                    </div>
                  </button>

                  {/* Circular Send Arrow */}
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputText.trim() || isLoading}
                    className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 disabled:opacity-30 text-white flex items-center justify-center shadow-md shadow-blue-600/30 hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Floating Pill Switcher matching Dribbble Shot */}
            <div className="flex items-center justify-center gap-2.5 pt-1">
              <div className="bg-slate-950 text-white px-3.5 py-1.5 rounded-full flex items-center gap-2.5 shadow-lg border border-white/10">
                <button
                  onClick={() => toggleVoiceMode()}
                  className="flex items-center gap-1 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Voice Mode"
                >
                  <div className="flex items-center gap-0.5">
                    <span className="w-0.5 h-3 bg-white rounded-full" />
                    <span className="w-0.5 h-4 bg-white rounded-full" />
                    <span className="w-0.5 h-2.5 bg-white rounded-full" />
                  </div>
                </button>
                <span className="w-px h-3.5 bg-slate-700" />
                <button
                  onClick={() => onNavigate('agentic-mission')}
                  className="p-0.5 text-sky-300 hover:text-white transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                  title="Autonomous Missions"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Missions</span>
                </button>
              </div>

              {/* Purple Circle Action Button */}
              <button
                onClick={() => {
                  const taskTitle = prompt('Add priority task:');
                  if (taskTitle) {
                    onAddTask({
                      id: `t-${Date.now()}`,
                      title: taskTitle,
                      priority: 'high',
                      category: 'work',
                      completed: false,
                      dueDate: 'Today',
                      subtasks: [],
                    });
                    soundFX.playSuccess();
                  }
                }}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 hover:scale-105 active:scale-95 transition cursor-pointer"
                title="Quick Add Task"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: SOURCES BOTTOM SHEET (Sliding Modal Sheet)                       */}
      {/* ========================================================================= */}
      {screenMode === 'sources' && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-40 flex items-end justify-center animate-fadeIn">
          <div className={`w-full max-w-lg rounded-t-[38px] shadow-2xl p-6 sm:p-7 space-y-4 border-t animate-fadeIn ${
            isDark
              ? 'bg-[#121a2c]/95 backdrop-blur-2xl border-white/10 text-white'
              : 'bg-white/95 backdrop-blur-2xl border-white/80 text-slate-800'
          }`}>
            {/* Sheet Handle & Header */}
            <div className="w-12 h-1.5 bg-indigo-500/80 rounded-full mx-auto" />
            <div className="flex items-center justify-between pt-1">
              <h3 className="text-lg font-bold">Sources &amp; Connectors</h3>
              <button
                onClick={() => setScreenMode('home')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                  isDark ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Purple Gradient Banner Item */}
            <button
              onClick={() => {
                setScreenMode('home');
                onNavigate('web-hub');
              }}
              className={`w-full p-4 rounded-2xl border flex items-center justify-between text-left transition cursor-pointer group shadow-sm ${
                isDark
                  ? 'bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border-blue-500/30 hover:border-blue-500/60'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-100 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-sm">
                  i
                </div>
                <div>
                  <h4 className="text-xs font-bold">
                    Go to web to enable source control.
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Manage {connectors.length} connected websites catalog (5,000+ support)
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-sky-400 group-hover:scale-110 transition" />
            </button>

            {/* Options List */}
            <div className="space-y-3 pt-1">
              {/* Web Search */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-white/10 text-sky-400' : 'bg-white text-slate-600 shadow-sm'
                  }`}>
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold">Web search</h5>
                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Include public and general sources.</p>
                  </div>
                </div>
                <button
                  onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    webSearchEnabled ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      webSearchEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Universal Web Connectors */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-white/10 text-sky-400' : 'bg-white text-slate-600 shadow-sm'
                  }`}>
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold">Universal Web Connectors</h5>
                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Use registered websites ({connectors.length} active).</p>
                  </div>
                </div>
                <button
                  onClick={() => setConnectorsEnabled(!connectorsEnabled)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    connectorsEnabled ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      connectorsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* My library */}
              <button
                onClick={() => {
                  setScreenMode('home');
                  onNavigate('life-ops');
                }}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-white/10 text-sky-400' : 'bg-white text-slate-600 shadow-sm'
                  }`}>
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold">My library &amp; life tasks</h5>
                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tasks.length} active priorities</p>
                  </div>
                </div>
                <Zap className="w-4 h-4 text-sky-400" />
              </button>

              {/* Partner sources / Memory Vault */}
              <button
                onClick={() => {
                  setScreenMode('home');
                  onOpenVault();
                }}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-white/10 text-sky-400' : 'bg-white text-slate-600 shadow-sm'
                  }`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold">Memory Vault &amp; Boundaries</h5>
                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Executive Rules and Context</p>
                  </div>
                </div>
                <Zap className="w-4 h-4 text-sky-400" />
              </button>
            </div>

            <button
              onClick={() => setScreenMode('home')}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs mt-2 shadow-md shadow-blue-600/30 hover:opacity-90 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
