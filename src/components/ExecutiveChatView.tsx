import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Volume2,
  Copy,
  Check,
  Send,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  Globe,
  CheckSquare,
  Zap,
  RotateCcw,
  Plus
} from 'lucide-react';
import { ChatMessage } from '../types/index.ts';
import { soundFX } from '../utils/soundEffects.ts';

interface ExecutiveChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSpeakText: (text: string) => void;
  onSendMessage: (text: string) => void;
  onClearChat?: () => void;
}

export const ExecutiveChatView: React.FC<ExecutiveChatViewProps> = ({
  messages,
  isLoading,
  onSpeakText,
  onSendMessage,
  onClearChat,
}) => {
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

  const handleCopyMessage = (id: string, text: string) => {
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

  // Safe SpeechRecognition
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
  };

  const toggleSpeechRecognition = async () => {
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
      } catch (mediaErr: any) {
        setTranscriptNotice('Microphone permission blocked. Please allow mic in browser settings.');
        setTimeout(() => setTranscriptNotice(null), 4000);
        isStartingRef.current = false;
        return;
      }
    }

    try {
      soundFX.playWakeChime();
      transcriptRef.current = '';
      setTranscriptNotice('Listening... Speak now...');

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

  const actionSuggestions = [
    { label: '+ Add Website (e.g. figma.com)', cmd: 'add website figma.com' },
    { label: '+ Add Priority Task', cmd: 'add task Review product roadmap today at 4pm' },
    { label: '⚡ Run Morning Briefing', cmd: 'run morning briefing routine' },
    { label: '🔍 Research AI Agent Frameworks', cmd: 'Conduct deep research on multi-agent architectures' },
  ];

  return (
    <div className="flex-1 h-full w-full max-w-5xl mx-auto flex flex-col overflow-hidden px-4 sm:px-6 py-4">
      {/* Agent Top Status Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-sm font-bold text-xs">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Muhib AI Executive Agent</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Standing by for voice and text directives · Universal Web Hub & Life Operations
            </p>
          </div>
        </div>

        {messages.length > 2 && onClearChat && (
          <button
            onClick={onClearChat}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition text-xs flex items-center gap-1 cursor-pointer"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Messages Scrollable Area (Internal scroll only, zero window scroll) */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1 scrollbar-none">
        {messages.length <= 1 && (
          <div className="py-8 flex flex-col items-center text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/25">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Assalam-o-Alaikum, Muhammad Muheb Riaz
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Main aap ka personal executive AI agent hoon. Jo bhi kaam karwana ho, direct boliye ya likhiye — main fauran execute kar doon ga.
            </p>

            {/* Starter Suggestion Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 w-full text-left">
              {actionSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.cmd)}
                  className="p-3 rounded-xl bg-[#141d2e] hover:bg-[#1a2846] border border-white/10 hover:border-blue-500/40 text-xs font-medium text-slate-200 transition cursor-pointer flex items-center justify-between group shadow-sm"
                >
                  <span className="truncate">{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-sm text-white font-bold text-xs">
                  M
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/20'
                    : 'bg-[#141d2e] border border-white/10 text-slate-100 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {isUser ? 'You' : 'Muhib AI'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words font-sans">
                  {msg.content}
                </div>

                {!isUser && (
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
                    <button
                      onClick={() => onSpeakText(msg.content)}
                      className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-sky-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Listen</span>
                    </button>
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#1b253b] border border-white/10 flex items-center justify-center shrink-0 mt-1 text-xs font-bold text-sky-400">
                  MR
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 mt-1 animate-pulse font-bold text-xs">
              M
            </div>
            <div className="p-3.5 bg-[#141d2e] border border-white/10 rounded-2xl rounded-tl-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-300 ml-1">Executing directive...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Transcript Alert Banner */}
      {transcriptNotice && (
        <div className="py-1.5 px-3 rounded-lg bg-blue-500/15 border border-blue-500/30 text-xs text-sky-300 flex items-center justify-center mb-2 animate-fadeIn">
          {transcriptNotice}
        </div>
      )}

      {/* Docked Desktop Prompt Bar (Zero Window Scroll) */}
      <div className="pt-2 border-t border-white/10 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-[#141d2e] border-2 border-white/10 focus-within:border-blue-500 rounded-2xl p-2 shadow-lg transition-all"
        >
          {/* Voice Microphone Toggle */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer shrink-0 ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                : 'bg-white/5 hover:bg-white/10 text-sky-400 hover:text-white border border-white/10'
            }`}
            title={isRecording ? 'Click to stop speaking' : 'Click to dictate via microphone'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Talk or type: 'add website notion.so', 'remind me to call Mama at 9pm', 'research quantum AI'..."
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
            disabled={isLoading}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition disabled:opacity-30 disabled:hover:bg-blue-600 cursor-pointer shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
