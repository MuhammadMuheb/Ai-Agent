import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Leaf,
  FileText,
  Radio,
  Clock,
  Check,
  Globe,
  Play,
  Square,
  AlertCircle
} from 'lucide-react';
import { ActiveTab, ChatMessage, OrbState, PlantCareResult } from '../types/index.ts';
import { PlantCareVision } from './PlantCareVision.tsx';
import { soundFX } from '../utils/soundEffects.ts';

interface RightColumnProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, imageBase64?: string, model?: string) => Promise<void>;
  isLoading: boolean;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  orbState: OrbState;
  onOrbStateChange: (state: OrbState) => void;
  voiceAudioMuted: boolean;
  onSpeakText: (text: string) => void;
  onStopSpeech: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onSetMicActive?: (active: boolean) => void;
}

export const RightColumn: React.FC<RightColumnProps> = ({
  messages,
  onSendMessage,
  isLoading,
  activeTab,
  onTabChange,
  orbState,
  onOrbStateChange,
  voiceAudioMuted,
  onSpeakText,
  onStopSpeech,
  selectedModel,
  onModelChange,
  onSetMicActive,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechLanguage, setSpeechLanguage] = useState<'ur-PK' | 'hi-IN' | 'en-US'>('hi-IN');
  const [micError, setMicError] = useState<string | null>(null);
  const [autoListenAfterReply, setAutoListenAfterReply] = useState(false);

  const [notes, setNotes] = useState<string[]>([
    'Boss website review: shaam 6:00 baje se pehle.',
    'Monstera plant: Mitti sukhne par hi pani dein.',
    'Mama ko dahi aur medicines lana yaad rakhna.',
  ]);
  const [newNote, setNewNote] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const silenceTimerRef = useRef<any>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, speechTranscript]);

  // Clean speech text
  const stopRecordingInternal = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
    onSetMicActive?.(false);
    onOrbStateChange('idle');
  };

  // Robust Speech Recognition setup
  const startSpeechRecognition = async () => {
    setMicError(null);
    transcriptRef.current = '';
    setSpeechTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError('Aapke browser mein Speech Recognition support nahi hai. Google Chrome use karein.');
      return;
    }

    try {
      // Prompt microphone permissions explicitly
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      // Tell parent to pause wake word so no audio conflicts
      onSetMicActive?.(true);

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLanguage;

      recognition.onstart = () => {
        setIsRecording(true);
        onOrbStateChange('listening');
        soundFX.playWakeChime();
      };

      recognition.onresult = (event: any) => {
        let fullText = '';
        for (let i = 0; i < event.results.length; i++) {
          fullText += event.results[i][0].transcript + ' ';
        }
        fullText = fullText.trim();
        transcriptRef.current = fullText;
        setSpeechTranscript(fullText);
        setInputText(fullText);

        // Reset silence timer on every spoken word (auto-send after 2 seconds of silence)
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (transcriptRef.current.trim().length > 1) {
            handleVoiceSend(transcriptRef.current.trim());
          }
        }, 2200);
      };

      recognition.onerror = (e: any) => {
        console.warn('SpeechRecognition error:', e.error);
        if (e.error === 'not-allowed') {
          setMicError('Microphone ki permission nahi mili. Browser mein mic allow karein.');
        } else if (e.error === 'no-speech') {
          // just silence, don't crash
        } else {
          setMicError(`Mic notice: ${e.error}`);
        }
        stopRecordingInternal();
      };

      recognition.onend = () => {
        setIsRecording(false);
        onSetMicActive?.(false);
        onOrbStateChange('idle');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Mic access error:', err);
      setMicError('Microphone access blocked. Browser address bar se mic allow karein.');
      stopRecordingInternal();
    }
  };

  const toggleSpeechRecognition = () => {
    soundFX.playWakeChime();
    if (isRecording) {
      const pending = transcriptRef.current.trim();
      stopRecordingInternal();
      if (pending) {
        handleVoiceSend(pending);
      }
    } else {
      startSpeechRecognition();
    }
  };

  // Directly send transcribed voice input to chat
  const handleVoiceSend = async (spokenText: string) => {
    stopRecordingInternal();
    const textToSend = spokenText || transcriptRef.current.trim() || inputText.trim();
    if (!textToSend && !attachedImage) return;

    transcriptRef.current = '';
    setSpeechTranscript('');
    setInputText('');
    const currentImg = attachedImage || undefined;
    setAttachedImage(null);

    soundFX.playSuccess();
    await onSendMessage(textToSend, currentImg, selectedModel);
  };

  const handleSendSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim() || speechTranscript.trim();
    if (!textToSend && !attachedImage) return;

    stopRecordingInternal();
    setInputText('');
    setSpeechTranscript('');
    transcriptRef.current = '';
    const currentImg = attachedImage || undefined;
    setAttachedImage(null);

    await onSendMessage(textToSend, currentImg, selectedModel);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([newNote.trim(), ...notes]);
    setNewNote('');
  };

  // Last assistant and user messages for Voice Tab
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');

  return (
    <div className="sci-border bg-[#091522]/90 flex flex-col h-full overflow-hidden">
      {/* Top Tabs Bar */}
      <div className="border-b border-cyan-500/20 px-3 py-2 flex items-center justify-between bg-[#07111b]">
        <div className="flex space-x-1">
          <button
            onClick={() => onTabChange('voice')}
            className={`font-mono text-xs px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'voice'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_8px_rgba(39,215,230,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            VOICE MODE
          </button>

          <button
            onClick={() => onTabChange('agent')}
            className={`font-mono text-xs px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'agent'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            AGENT CHAT
          </button>

          <button
            onClick={() => onTabChange('notes')}
            className={`font-mono text-xs px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            NOTES
          </button>

          <button
            onClick={() => onTabChange('plant')}
            className={`font-mono text-xs px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'plant'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            PLANT CARE
          </button>
        </div>

        {/* Model & Language Controls */}
        <div className="flex items-center gap-1.5">
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="bg-[#0b1c2b] text-[10px] font-mono text-cyan-300 border border-cyan-500/30 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
            title="Gemini AI Model Selector"
          >
            <option value="gemini-3.8-flash">Gemini 3.8 Flash</option>
            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro</option>
            <option value="gemini-3.1-flash-lite">Gemini 3.1 Lite</option>
          </select>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col p-3">
        {activeTab === 'plant' ? (
          <PlantCareVision
            onSendToChat={(analysis, img) => {
              onTabChange('agent');
              onSendMessage(
                `Plant check result: ${analysis.commonName}. Care guidelines shamil karein.`,
                img
              );
            }}
            onAnalysisStart={() => onOrbStateChange('thinking')}
            onAnalysisEnd={() => onOrbStateChange('idle')}
          />
        ) : activeTab === 'notes' ? (
          <div className="flex flex-col h-full space-y-3">
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Naya note likhein..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 text-xs bg-[#0c1a27] border border-cyan-500/30 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none font-mono"
              />
              <button
                type="submit"
                className="text-xs font-mono font-bold px-3 py-2 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 transition"
              >
                Add
              </button>
            </form>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {notes.map((note, index) => (
                <div
                  key={index}
                  className="p-2.5 rounded-lg bg-[#0c1d2d] border border-cyan-500/20 text-xs text-slate-200 font-sans flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <p className="flex-1">{note}</p>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'voice' ? (
          /* =======================================================
             REAL-TIME INTERACTIVE VOICE ASSISTANT MODE
             ======================================================= */
          <div className="flex flex-col h-full justify-between p-2 space-y-3 overflow-y-auto">
            {/* Top Control Bar for Voice */}
            <div className="bg-[#0b1c2b] p-2.5 rounded-xl border border-cyan-500/25 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-mono text-cyan-300">Zubaan:</span>
                <select
                  value={speechLanguage}
                  onChange={(e: any) => setSpeechLanguage(e.target.value)}
                  className="bg-black/50 text-[10px] font-mono text-cyan-300 border border-cyan-500/30 rounded px-1.5 py-0.5 focus:outline-none"
                >
                  <option value="hi-IN">Roman Urdu / Hindi (Recommended)</option>
                  <option value="ur-PK">Urdu (Pakistan)</option>
                  <option value="en-US">English (US)</option>
                </select>
              </div>

              {/* Quick Test Voice Button */}
              <button
                onClick={() =>
                  onSpeakText('Assalam o alaikum Muhib! Awaaz bilkul theek kaam kar rahi hai. Boliye mein aap ki kya madad kar sakta hoon?')
                }
                className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded flex items-center gap-1 transition"
                title="Awaaz Test Karein"
              >
                <Volume2 className="w-3 h-3" />
                Awaaz Test
              </button>
            </div>

            {/* Mic Error Notice if any */}
            {micError && (
              <div className="p-2.5 bg-rose-950/70 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{micError}</span>
              </div>
            )}

            {/* Conversation Voice Cards Display */}
            <div className="flex-1 flex flex-col justify-center items-center space-y-4 my-2">
              {/* Central Pulsating Voice Orb / Mic Circle */}
              <div className="relative flex items-center justify-center">
                {isRecording && (
                  <div className="absolute w-28 h-28 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
                )}
                <button
                  onClick={toggleSpeechRecognition}
                  className={`w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center transition-all shadow-[0_0_30px_rgba(39,215,230,0.3)] ${
                    isRecording
                      ? 'bg-rose-950/90 border-rose-400 text-rose-300 shadow-[0_0_35px_#ff4d5e]'
                      : 'bg-[#0a2235] border-cyan-400 hover:border-cyan-300 text-cyan-300 hover:scale-105'
                  }`}
                  title={isRecording ? 'Ruko aur Bhejo' : 'Boliye (Tap to Speak)'}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-8 h-8 text-rose-400 mb-1" />
                      <span className="text-[10px] font-mono font-bold tracking-wider">STOP</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-8 h-8 text-cyan-400 mb-1 animate-pulse" />
                      <span className="text-[10px] font-mono font-bold tracking-wider">BOLIYE</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status and Instructions */}
              <div className="text-center max-w-sm">
                <h4 className="font-mono text-sm font-bold text-white mb-1">
                  {isRecording ? 'SUN RAHA HOON (LISTENING)...' : 'MIC DABAYEIN AUR BOLIYE'}
                </h4>
                <p className="text-xs text-slate-300 font-sans">
                  {isRecording
                    ? 'Boliye, aapki aawaz live likhi ja rahi hai. Khamosh hone par auto-send hoga.'
                    : 'Button daba kar Roman Urdu ya English mein boliye. Muhib AI aawaz mein jawab dega.'}
                </p>
              </div>

              {/* Live Audio Waveform animation while recording */}
              {isRecording && (
                <div className="flex items-center gap-1 h-6">
                  {[6, 14, 22, 10, 18, 24, 12, 20, 8, 16, 22, 10].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-emerald-400 rounded-full animate-pulse"
                      style={{
                        height: `${h}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Live Speech Transcript Box */}
              {speechTranscript && (
                <div className="w-full bg-[#071725] p-3 rounded-xl border border-cyan-400/50 shadow-md">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                    ● AAP KI AAWAZ (LIVE TRANSCRIPT):
                  </span>
                  <p className="text-xs text-white font-mono italic">
                    "{speechTranscript}"
                  </p>
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={() => handleVoiceSend(speechTranscript)}
                      className="text-xs font-mono font-bold px-3 py-1 rounded bg-cyan-500 text-black hover:bg-cyan-400 transition flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Abhi Bhejo
                    </button>
                  </div>
                </div>
              )}

              {/* Last Question & Answer Preview */}
              {!isRecording && lastAssistantMsg && (
                <div className="w-full bg-[#0a1827] p-3 rounded-xl border border-cyan-500/20 text-left space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Bot className="w-3.5 h-3.5" />
                      AAKHRI JAWAB (MUHIB AI):
                    </span>
                    <button
                      onClick={() => onSpeakText(lastAssistantMsg.content)}
                      className="text-cyan-400 hover:text-cyan-200 flex items-center gap-1 font-mono"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      Dobara Sunno
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 font-sans line-clamp-3">
                    {lastAssistantMsg.content}
                  </p>
                </div>
              )}

              {/* Quick Voice Command Presets */}
              <div className="w-full space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  ⚡ QUICK VOICE COMMANDS (TAP TO DISPATCH):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    'Sir Imran ko message reply draft karo',
                    'Super Deep Research model chalao',
                    'Mama Jan ko WhatsApp update bhej do',
                    'Aaj ka plan aur tasks sunao'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleVoiceSend(preset)}
                      className="p-2 rounded-lg bg-black/40 hover:bg-cyan-950/60 border border-cyan-500/20 hover:border-cyan-400/50 text-left text-xs font-mono text-cyan-200 transition flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate">"{preset}"</span>
                      <Play className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* =======================================================
             AGENT CONVERSATIONAL CHAT MODE
             ======================================================= */
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-xl p-3 text-xs leading-relaxed transition ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-white rounded-br-none shadow-[0_0_10px_rgba(39,215,230,0.1)]'
                      : 'bg-[#0d2030] border border-cyan-500/25 text-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1 border-b border-cyan-500/15 pb-1">
                    <span className="font-mono text-[10px] font-bold uppercase flex items-center gap-1">
                      {msg.role === 'user' ? (
                        <>
                          <User className="w-3 h-3 text-cyan-300" />
                          <span>Muhib (You)</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-emerald-400" />
                          <span className="text-cyan-300">Muhib AI</span>
                          {msg.model && (
                            <span className="text-[9px] text-slate-400 font-mono">
                              [{msg.model.split('-').slice(1).join('-')}]
                            </span>
                          )}
                        </>
                      )}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.image && (
                    <div className="my-2 rounded-lg overflow-hidden border border-cyan-500/30 max-h-48">
                      <img
                        src={msg.image}
                        alt="Uploaded Plant/Visual"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-sans text-xs">
                    {msg.content}
                  </div>

                  {/* Audio speak trigger for AI message */}
                  {msg.role === 'assistant' && (
                    <div className="mt-2 pt-1.5 border-t border-cyan-500/10 flex items-center justify-between">
                      <button
                        onClick={() => onSpeakText(msg.content)}
                        className="text-[10px] font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1 transition"
                        title="Sunno (Text to Speech)"
                      >
                        <Volume2 className="w-3 h-3 text-cyan-400" />
                        Sunno (Audio)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 p-2 bg-[#0c1a27] rounded-lg border border-amber-500/30 w-fit">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Muhib AI soch raha hai...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Attached Image Preview */}
      {attachedImage && (
        <div className="px-3 pt-2 bg-[#08131e] border-t border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={attachedImage}
              alt="Attached preview"
              className="w-10 h-10 object-cover rounded border border-cyan-500/40"
            />
            <span className="text-[11px] font-mono text-cyan-300">
              Photo shamil ki gayi hai
            </span>
          </div>
          <button
            onClick={() => setAttachedImage(null)}
            className="text-xs text-rose-400 hover:text-rose-300 font-mono"
          >
            Hatao
          </button>
        </div>
      )}

      {/* Quick Dictation & Speech Chips */}
      <div className="px-3 py-1 bg-[#061019] border-t border-cyan-500/10 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono text-slate-400">
        <span className="text-cyan-400 shrink-0">Boliye:</span>
        {[
          'Boss ko message',
          'AI Agent research',
          'WhatsApp kholo',
          'Awaaz test'
        ].map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              if (chip === 'Awaaz test') {
                onSpeakText('Assalam o alaikum Muhib! Awaaz bilkul theek kaam kar rahi hai.');
              } else {
                handleVoiceSend(chip);
              }
            }}
            className="shrink-0 px-2 py-0.5 rounded bg-black/40 hover:bg-cyan-950/60 border border-cyan-500/20 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Bottom Input Area */}
      <div className="p-2.5 border-t border-cyan-500/20 bg-[#061019]">
        <form onSubmit={handleSendSubmit} className="flex items-center gap-2">
          {/* Attach Image button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg bg-[#0d2133] hover:bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 transition"
            title="Photo ya Plant tasveer upload karein"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder={isRecording ? 'Aap bol rahe hain...' : 'Yahan likho ya bolo...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className={`flex-1 bg-[#0a1724] border rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition font-sans ${
              isRecording
                ? 'border-emerald-400 shadow-[0_0_8px_rgba(46,229,157,0.3)]'
                : 'border-cyan-500/30 focus:border-cyan-400'
            }`}
          />

          {/* Mic Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-2 rounded-lg border transition ${
              isRecording
                ? 'bg-rose-500 text-black border-rose-400 shadow-[0_0_12px_#ff4d5e] animate-pulse'
                : 'bg-[#0d2133] hover:bg-cyan-950 text-cyan-400 border-cyan-500/30'
            }`}
            title={isRecording ? 'Ruko aur bhejo' : 'Awaaz se bolo (Mic)'}
          >
            {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || (!inputText.trim() && !speechTranscript.trim() && !attachedImage)}
            className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black transition shadow-[0_0_10px_rgba(39,215,230,0.3)] font-bold"
            title="Bhejo (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
