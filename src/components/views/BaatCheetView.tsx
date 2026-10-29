import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Maximize2, Minimize2, Trash2, Sparkles, Bot } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { ThreeRobotStudio } from '../ThreeRobotStudio.tsx';
import { ChatMessage, OrbState } from '../../types/index.ts';

interface BaatCheetViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  orbState: OrbState;
  onOrbStateChange: (state: OrbState) => void;
  onSpeakText: (text: string) => void;
  voiceAudioMuted: boolean;
  onToggleMute: () => void;
  onClearChat: () => void;
}

export const BaatCheetView: React.FC<BaatCheetViewProps> = ({
  messages,
  isLoading,
  onSendMessage,
  orbState,
  onOrbStateChange,
  onSpeakText,
  voiceAudioMuted,
  onToggleMute,
  onClearChat,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [fullscreenRobot, setFullscreenRobot] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  // Web Speech Recognition
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Browser does not support Speech Recognition. Please use Chrome/Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      onOrbStateChange('idle');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ur-PK'; // Roman Urdu/Urdu friendly
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        onOrbStateChange('listening');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        onOrbStateChange('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
        onOrbStateChange('idle');
      };

      recognition.start();
    } catch {
      setIsListening(false);
      onOrbStateChange('idle');
    }
  };

  const quickChips = [
    'Sir Imran ko update draft karo',
    'Aaj ka plan check karo',
    'Workspace files dikhao',
    'Plant care guide batao',
  ];

  return (
    <div className="flex-1 h-full flex flex-col md:flex-row overflow-hidden relative bg-[#05080c]">
      {/* Robot Canvas Area (Split or Fullscreen) */}
      <div
        className={`relative transition-all duration-300 flex flex-col items-center justify-center bg-[#070b10] border-b md:border-b-0 md:border-r border-[#1c2a38] ${
          fullscreenRobot ? 'w-full h-full absolute inset-0 z-40' : 'w-full md:w-5/12 h-64 md:h-full'
        }`}
      >
        {/* 3D Futuristic Metallic Robot Studio */}
        <div className="w-full h-full relative">
          <ThreeRobotStudio state={orbState} />
        </div>

        {/* Floating Controls over 3D Canvas */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <Badge variant="cyan" size="sm">
            <Bot className="w-3 h-3 mr-1" />
            MUHIB 3D COMPANION
          </Badge>
          <Badge variant={orbState === 'idle' ? 'hara' : 'peela'} size="sm">
            {orbState.toUpperCase()}
          </Badge>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button
            onClick={onToggleMute}
            className="w-8 h-8 rounded-lg bg-[#0b1118]/80 border border-[#1c2a38] text-[#8b9bab] hover:text-[#27d7e6] flex items-center justify-center transition-colors cursor-pointer"
            title={voiceAudioMuted ? 'Unmute voice' : 'Mute voice'}
          >
            {voiceAudioMuted ? <VolumeX className="w-4 h-4 text-[#ff4d5e]" /> : <Volume2 className="w-4 h-4 text-[#2ee59d]" />}
          </button>
          <button
            onClick={() => setFullscreenRobot(!fullscreenRobot)}
            className="w-8 h-8 rounded-lg bg-[#0b1118]/80 border border-[#1c2a38] text-[#8b9bab] hover:text-[#27d7e6] flex items-center justify-center transition-colors cursor-pointer"
            title={fullscreenRobot ? 'Exit Studio Fullscreen' : 'Studio Fullscreen'}
          >
            {fullscreenRobot ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Chat Timeline & Input Dock */}
      {(!fullscreenRobot || window.innerWidth > 768) && (
        <div className="flex-1 h-full flex flex-col justify-between overflow-hidden relative z-10 bg-[#05080c]">
          {/* Header Bar */}
          <div className="px-5 py-3 border-b border-[#1c2a38] flex items-center justify-between bg-[#0b1118]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2ee59d]" />
              <div>
                <h3 className="text-sm font-semibold text-[#e6edf3]">Baat-cheet (Roman Urdu Chat)</h3>
                <p className="text-[10px] text-[#8b9bab]">24/7 Desktop AI Assistant • Zero Clutter</p>
              </div>
            </div>
            <button
              onClick={onClearChat}
              className="text-[#8b9bab] hover:text-[#ff4d5e] p-1.5 rounded-lg hover:bg-[#111a24] text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Session clear karein"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-mono text-[#8b9bab]">
                      {isAssistant ? 'MUHIB AI' : 'MUHEB'} • {msg.timestamp}
                    </span>
                  </div>
                  <div
                    className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-[#0b1118] border border-[#1c2a38] text-[#e6edf3] shadow-md'
                        : 'bg-[#27d7e6] text-[#05080c] font-medium shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {isAssistant && (
                      <div className="flex items-center justify-end mt-2 pt-2 border-t border-[#1c2a38]/60">
                        <button
                          onClick={() => onSpeakText(msg.content)}
                          className="text-[10px] text-[#8b9bab] hover:text-[#27d7e6] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          Bol kar sunao
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex flex-col items-start animate-in fade-in">
                <span className="text-[10px] font-mono text-[#8b9bab] mb-1 px-1">MUHIB AI • SOCH RAHA HAI...</span>
                <div className="bg-[#0b1118] border border-[#27d7e6]/40 rounded-2xl px-4 py-3 text-xs text-[#27d7e6] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-[#27d7e6]" />
                  <span>Jee Muheb bhai, sochnay ke baad jawab generate ho raha hai...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2 border-t border-[#1c2a38] flex items-center gap-2 overflow-x-auto bg-[#080d13]">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(chip)}
                className="text-[11px] bg-[#111a24] text-[#8b9bab] hover:text-[#27d7e6] hover:border-[#27d7e6]/50 border border-[#1c2a38] px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Dock */}
          <form
            onSubmit={handleSubmit}
            className="p-3 md:p-4 bg-[#0b1118] border-t border-[#1c2a38] flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                isListening
                  ? 'bg-[#ff4d5e] text-white animate-pulse'
                  : 'bg-[#111a24] text-[#8b9bab] hover:text-[#27d7e6] border border-[#1c2a38]'
              }`}
              title={isListening ? 'Stop listening' : 'Speak via Mic'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Muheb bhai yahan likhein (Roman Urdu ya English)..."
              disabled={isLoading}
              className="flex-1 bg-[#111a24] border border-[#1c2a38] rounded-lg px-4 py-2 text-sm text-[#e6edf3] placeholder-[#8b9bab] focus:outline-none focus:border-[#27d7e6] transition-colors"
            />

            <Button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              variant="primary"
              className="px-4"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline ml-1.5">Bhejo</span>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
