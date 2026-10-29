import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  MessageSquare,
  Globe2,
  StopCircle,
  Radio,
  Paperclip,
  Check
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects.ts';

interface VoicePromptDockProps {
  onSendMessage: (text: string) => void;
  onExecuteResearch: (topic: string) => void;
  activeMode: 'research' | 'chat';
  onModeChange: (mode: 'research' | 'chat') => void;
  isLoading: boolean;
  onOrbStateChange?: (state: 'idle' | 'listening' | 'thinking' | 'speaking') => void;
}

export const VoicePromptDock: React.FC<VoicePromptDockProps> = ({
  onSendMessage,
  onExecuteResearch,
  activeMode,
  onModeChange,
  isLoading,
  onOrbStateChange,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptNotice, setTranscriptNotice] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');

  const [micBlockedNotice, setMicBlockedNotice] = useState<string | null>(null);
  const isStartingRef = useRef(false);

  // Clean stop
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
    onOrbStateChange?.('idle');
  };

  // Safe SpeechRecognition with iframe microphone permission activation
  const toggleSpeechRecognition = async () => {
    if (isRecording) {
      stopRecording();
      const spoken = transcriptRef.current.trim();
      if (spoken) {
        handleFinalSubmit(spoken);
      }
      return;
    }

    if (isStartingRef.current) return;
    isStartingRef.current = true;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTranscriptNotice('Browser speech recognition support nahi karta. Chrome ya Edge use karein.');
      setTimeout(() => setTranscriptNotice(null), 3500);
      isStartingRef.current = false;
      return;
    }

    // Explicitly request media permission to trigger browser prompt in iframe if needed
    if (navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Close tracks immediately so Web Speech API has full access to the microphone
        stream.getTracks().forEach((track) => track.stop());
        setMicBlockedNotice(null);
      } catch (mediaErr: any) {
        console.warn('Microphone permission check:', mediaErr);
        if (
          mediaErr.name === 'NotAllowedError' ||
          mediaErr.name === 'PermissionDeniedError' ||
          mediaErr.message?.includes('denied')
        ) {
          setMicBlockedNotice(
            'Microphone Blocked: Browser ke address bar mein Lock 🔒 icon par click karein aur Microphone ko "Allow" karke page reload karein.'
          );
          isStartingRef.current = false;
          return;
        }
      }
    }

    try {
      soundFX.playWakeChime();
      transcriptRef.current = '';
      setTranscriptNotice('Sun raha hoon... Boliye...');

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Optimal for Roman Urdu & Hindi phonetics

      recognition.onstart = () => {
        setIsRecording(true);
        isStartingRef.current = false;
        onOrbStateChange?.('listening');
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

      recognition.onerror = (e: any) => {
        console.warn('SpeechRecognition error handled:', e.error);
        isStartingRef.current = false;
        if (e.error === 'not-allowed') {
          setMicBlockedNotice(
            'Microphone Blocked: Browser URL bar mein 🔒 icon par click karke Microphone "Allow" karein aur page reload karein.'
          );
        } else if (e.error === 'no-speech') {
          setTranscriptNotice('Kuch aawaz sunai nahi di.');
          setTimeout(() => setTranscriptNotice(null), 2500);
        }
        setIsRecording(false);
        onOrbStateChange?.('idle');
      };

      recognition.onend = () => {
        setIsRecording(false);
        isStartingRef.current = false;
        onOrbStateChange?.('idle');
        const finalSpoken = transcriptRef.current.trim();
        if (finalSpoken) {
          setTranscriptNotice('Speech captured! Ready to send.');
          setTimeout(() => setTranscriptNotice(null), 2000);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Recognition init error:', err);
      setIsRecording(false);
      isStartingRef.current = false;
      onOrbStateChange?.('idle');
    }
  };

  const handleFinalSubmit = (textOverride?: string) => {
    const textToSend = (textOverride !== undefined ? textOverride : inputText).trim();
    if (!textToSend || isLoading) return;

    soundFX.playSuccess();
    setInputText('');
    transcriptRef.current = '';
    setTranscriptNotice(null);

    if (activeMode === 'research') {
      onExecuteResearch(textToSend);
    } else {
      onSendMessage(textToSend);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-gradient-to-t from-[#05080c] via-[#05080c]/95 to-transparent pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        {/* Real-time Voice Notice */}
        {transcriptNotice && (
          <div className="mb-2 flex items-center justify-center">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(39,215,230,0.25)] flex items-center gap-2 animate-pulse">
              <Radio className="w-3 h-3 text-cyan-400" />
              <span>{transcriptNotice}</span>
            </span>
          </div>
        )}

        {/* Input Bar */}
        <div className="rounded-xl bg-[#0e1422]/95 backdrop-blur-md border border-slate-700/80 p-2 shadow-2xl flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#141b2d] rounded-lg p-0.5 border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => onModeChange('chat')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                activeMode === 'chat'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Assistant</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('research')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                activeMode === 'research'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Deep Research</span>
            </button>
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleFinalSubmit();
              }
            }}
            placeholder={
              activeMode === 'research'
                ? 'Enter research topic or thesis for strategic evaluation...'
                : 'Type a directive or click mic to speak (English or Roman Urdu)...'
            }
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />

          {/* Voice Microphone Toggle Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition cursor-pointer shrink-0 ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-[#141c2e] hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title={isRecording ? 'Click to finish speaking' : 'Click to speak via Microphone'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Submit Button */}
          <button
            type="button"
            onClick={() => handleFinalSubmit()}
            disabled={!inputText.trim() || isLoading}
            className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition disabled:opacity-30 disabled:hover:bg-blue-600 disabled:cursor-not-allowed shadow-sm shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
