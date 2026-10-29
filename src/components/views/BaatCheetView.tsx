import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Trash2,
  Sparkles,
  Bot,
  Globe,
  Code,
  Download,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Image as ImageIcon,
  ZoomIn,
  X,
  ExternalLink,
} from 'lucide-react';
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTabMap, setActiveTabMap] = useState<Record<string, 'preview' | 'code'>>({});
  const [viewportMap, setViewportMap] = useState<Record<string, 'desktop' | 'mobile'>>({});
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string; prompt: string } | null>(null);
  const [fullPreviewCode, setFullPreviewCode] = useState<{ code: string; title: string } | null>(null);

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

  // Copy code helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Download HTML file helper
  const handleDownloadHtml = (code: string, title: string) => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'website'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      recognition.lang = 'ur-PK';
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
    '🌐 Portfolio Website bana ke do',
    '🎨 Cyberpunk AI Robot picture design karo',
    '🔍 AI Desktop Agent deep research',
    '💼 Sir Imran (Boss) ko review update draft karo',
    '🍽️ Gourmet Restaurant Landing Page banao',
    '💡 Naya AI Business Idea batao',
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
      {(!fullscreenRobot || (typeof window !== 'undefined' && window.innerWidth > 768)) && (
        <div className="flex-1 h-full flex flex-col justify-between overflow-hidden relative z-10 bg-[#05080c]">
          {/* Header Bar */}
          <div className="px-5 py-3 border-b border-[#1c2a38] flex items-center justify-between bg-[#0b1118]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2ee59d] animate-pulse" />
              <div>
                <h3 className="text-sm font-semibold text-[#e6edf3] flex items-center gap-2">
                  <span>Baat-cheet (Multimodal Roman Urdu Agent)</span>
                  <Badge variant="cyan" size="sm">GOOGLE GEMINI CORE</Badge>
                </h3>
                <p className="text-[10px] text-[#8b9bab]">
                  Dynamic Chat • Live Website Builder • High-Res Image Generation • Deep Research
                </p>
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
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              const currentTab = activeTabMap[msg.id] || 'preview';
              const currentViewport = viewportMap[msg.id] || 'desktop';

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
                    className={`max-w-[95%] md:max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-[#0b1118] border border-[#1c2a38] text-[#e6edf3] shadow-md space-y-4'
                        : 'bg-[#27d7e6] text-[#05080c] font-medium shadow-sm'
                    }`}
                  >
                    {/* Message Body */}
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                    {/* Generated AI Image Display */}
                    {isAssistant && msg.generatedImage && (
                      <div className="mt-3 p-3 rounded-xl bg-[#070b10] border border-[#27d7e6]/30 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-[#27d7e6] flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" />
                            {msg.generatedImage.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setZoomImage(msg.generatedImage!)}
                              className="text-[11px] text-[#8b9bab] hover:text-[#27d7e6] flex items-center gap-1 bg-[#111a24] px-2 py-1 rounded border border-[#1c2a38] cursor-pointer"
                            >
                              <ZoomIn className="w-3 h-3" />
                              Bara Karein
                            </button>
                            <a
                              href={msg.generatedImage.url}
                              target="_blank"
                              rel="noreferrer"
                              download="muhib_ai_generated_image.jpg"
                              className="text-[11px] text-[#2ee59d] hover:underline flex items-center gap-1 bg-[#111a24] px-2 py-1 rounded border border-[#1c2a38]"
                            >
                              <Download className="w-3 h-3" />
                              Save HD
                            </a>
                          </div>
                        </div>

                        <div
                          className="relative rounded-lg overflow-hidden border border-[#1c2a38] group cursor-pointer max-h-80 bg-black/40 flex items-center justify-center"
                          onClick={() => setZoomImage(msg.generatedImage!)}
                        >
                          <img
                            src={msg.generatedImage.url}
                            alt={msg.generatedImage.title}
                            className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-3 py-1.5 rounded-lg bg-[#0b1118]/90 text-white text-xs font-medium border border-[#27d7e6]/50 flex items-center gap-1.5">
                              <ZoomIn className="w-3.5 h-3.5 text-[#27d7e6]" /> Click to Zoom
                            </span>
                          </div>
                        </div>

                        <p className="text-[10px] text-[#8b9bab] mt-2 font-mono">
                          Prompt: &ldquo;{msg.generatedImage.prompt}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Generated Live Website Sandbox Card */}
                    {isAssistant && msg.generatedCode && (
                      <div className="mt-3 rounded-xl bg-[#070b10] border border-[#27d7e6]/40 shadow-xl overflow-hidden">
                        {/* Sandbox Header */}
                        <div className="p-3 bg-[#0b1118] border-b border-[#1c2a38] flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#27d7e6] animate-pulse" />
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-[#27d7e6]" />
                              {msg.generatedCode.title || 'Live Website Sandbox'}
                            </span>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-2">
                            {/* Tab Switcher */}
                            <div className="flex items-center bg-[#111a24] p-0.5 rounded-lg border border-[#1c2a38]">
                              <button
                                onClick={() =>
                                  setActiveTabMap((prev) => ({ ...prev, [msg.id]: 'preview' }))
                                }
                                className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition-all cursor-pointer flex items-center gap-1 ${
                                  currentTab === 'preview'
                                    ? 'bg-[#27d7e6] text-[#05080c] font-bold shadow-sm'
                                    : 'text-[#8b9bab] hover:text-white'
                                }`}
                              >
                                <Globe className="w-3 h-3" />
                                Live Preview
                              </button>
                              <button
                                onClick={() =>
                                  setActiveTabMap((prev) => ({ ...prev, [msg.id]: 'code' }))
                                }
                                className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition-all cursor-pointer flex items-center gap-1 ${
                                  currentTab === 'code'
                                    ? 'bg-[#27d7e6] text-[#05080c] font-bold shadow-sm'
                                    : 'text-[#8b9bab] hover:text-white'
                                }`}
                              >
                                <Code className="w-3 h-3" />
                                HTML Code
                              </button>
                            </div>

                            {/* Viewport switch (when on preview) */}
                            {currentTab === 'preview' && (
                              <div className="hidden sm:flex items-center bg-[#111a24] p-0.5 rounded-lg border border-[#1c2a38]">
                                <button
                                  onClick={() =>
                                    setViewportMap((prev) => ({ ...prev, [msg.id]: 'desktop' }))
                                  }
                                  className={`p-1 text-xs rounded transition-colors ${
                                    currentViewport === 'desktop'
                                      ? 'text-[#27d7e6] bg-[#070b10]'
                                      : 'text-[#8b9bab] hover:text-white'
                                  }`}
                                  title="Desktop View (100%)"
                                >
                                  <Monitor className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() =>
                                    setViewportMap((prev) => ({ ...prev, [msg.id]: 'mobile' }))
                                  }
                                  className={`p-1 text-xs rounded transition-colors ${
                                    currentViewport === 'mobile'
                                      ? 'text-[#27d7e6] bg-[#070b10]'
                                      : 'text-[#8b9bab] hover:text-white'
                                  }`}
                                  title="Mobile View (375px)"
                                >
                                  <Smartphone className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            {/* Fullscreen Preview button */}
                            <button
                              onClick={() =>
                                setFullPreviewCode({
                                  code: msg.generatedCode!.code,
                                  title: msg.generatedCode!.title || 'Website Preview',
                                })
                              }
                              className="p-1.5 rounded-lg bg-[#111a24] border border-[#1c2a38] text-[#8b9bab] hover:text-[#27d7e6] transition-colors cursor-pointer"
                              title="Bari Screen par Chalao"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Copy Code */}
                            <button
                              onClick={() => handleCopy(msg.generatedCode!.code, `code-${msg.id}`)}
                              className="text-[11px] bg-[#111a24] hover:bg-[#182330] border border-[#1c2a38] text-[#8b9bab] hover:text-white px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                              title="Code Copy karein"
                            >
                              {copiedId === `code-${msg.id}` ? (
                                <Check className="w-3 h-3 text-[#2ee59d]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copy</span>
                            </button>

                            {/* Download File */}
                            <button
                              onClick={() =>
                                handleDownloadHtml(
                                  msg.generatedCode!.code,
                                  msg.generatedCode!.title || 'website'
                                )
                              }
                              className="text-[11px] bg-[#2ee59d]/15 hover:bg-[#2ee59d]/25 border border-[#2ee59d]/40 text-[#2ee59d] px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                              title="HTML File Download karein"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>

                        {/* Sandbox Body: Preview Frame or Code Viewer */}
                        {currentTab === 'preview' ? (
                          <div className="bg-[#05080c] p-2 flex items-center justify-center min-h-[380px]">
                            <div
                              className={`transition-all duration-300 rounded-lg overflow-hidden border border-[#1c2a38] bg-white shadow-2xl ${
                                currentViewport === 'mobile'
                                  ? 'w-[375px] h-[520px]'
                                  : 'w-full h-[450px]'
                              }`}
                            >
                              <iframe
                                title="Website Sandbox Preview"
                                srcDoc={msg.generatedCode.code}
                                sandbox="allow-scripts allow-modals allow-forms"
                                className="w-full h-full border-0"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="max-h-96 overflow-y-auto p-4 bg-[#05080c] font-mono text-xs text-[#27d7e6] border-t border-[#1c2a38] leading-relaxed select-all">
                            <pre className="whitespace-pre-wrap">{msg.generatedCode.code}</pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Assistant Footer Action */}
                    {isAssistant && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1c2a38]/60">
                        <span className="text-[10px] text-[#8b9bab] font-mono">
                          Model: {msg.model || 'gemini-3.8-flash'}
                        </span>
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
                <span className="text-[10px] font-mono text-[#8b9bab] mb-1 px-1">
                  MUHIB AI • REALTIME COMPUTATION...
                </span>
                <div className="bg-[#0b1118] border border-[#27d7e6]/50 rounded-2xl px-5 py-3 text-xs text-[#27d7e6] flex items-center gap-2 shadow-lg shadow-[#27d7e6]/10">
                  <Sparkles className="w-4 h-4 animate-spin text-[#27d7e6]" />
                  <span>Jee Muheb bhai, Gemini AI engine se live content tayyar ho raha hai...</span>
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
                className="text-[11px] bg-[#111a24] text-[#8b9bab] hover:text-[#27d7e6] hover:border-[#27d7e6]/50 border border-[#1c2a38] px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
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
              title={isListening ? 'Stop listening' : 'Voice command (Roman Urdu)'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Muheb bhai yahan hukum likhein (e.g. Website banao, Picture design karo, ya Baat cheet karein)..."
              disabled={isLoading}
              className="flex-1 bg-[#111a24] border border-[#1c2a38] rounded-lg px-4 py-2.5 text-sm text-[#e6edf3] placeholder-[#8b9bab] focus:outline-none focus:border-[#27d7e6] transition-colors"
            />

            <Button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              variant="primary"
              className="px-5 py-2.5 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Bhejo</span>
            </Button>
          </form>
        </div>
      )}

      {/* Fullscreen Website Preview Modal */}
      {fullPreviewCode && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c2a38]">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#2ee59d]" />
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#27d7e6]" />
                {fullPreviewCode.title} (Fullscreen Sandbox)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadHtml(fullPreviewCode.code, fullPreviewCode.title)}
                className="bg-[#2ee59d]/15 hover:bg-[#2ee59d]/25 border border-[#2ee59d]/50 text-[#2ee59d] text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download HTML
              </button>
              <button
                onClick={() => setFullPreviewCode(null)}
                className="p-1.5 rounded-lg bg-[#111a24] border border-[#1c2a38] text-[#8b9bab] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 mt-3 bg-white rounded-xl overflow-hidden border border-[#1c2a38] shadow-2xl">
            <iframe
              title="Fullscreen Preview"
              srcDoc={fullPreviewCode.code}
              sandbox="allow-scripts allow-modals allow-forms"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in cursor-pointer"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="max-w-4xl w-full max-h-[90vh] bg-[#0b1118] border border-[#27d7e6]/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#1c2a38] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{zoomImage.title}</h3>
                <p className="text-[11px] text-[#8b9bab] font-mono mt-0.5">{zoomImage.prompt}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={zoomImage.url}
                  target="_blank"
                  rel="noreferrer"
                  download="muhib_ai_art.jpg"
                  className="bg-[#2ee59d]/15 hover:bg-[#2ee59d]/25 border border-[#2ee59d]/50 text-[#2ee59d] text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save HD Image
                </a>
                <button
                  onClick={() => setZoomImage(null)}
                  className="p-1.5 rounded-lg bg-[#111a24] text-[#8b9bab] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/60">
              <img
                src={zoomImage.url}
                alt={zoomImage.title}
                className="max-h-[70vh] w-auto rounded-lg shadow-2xl object-contain border border-[#1c2a38]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
