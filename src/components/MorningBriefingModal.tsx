import React, { useState } from 'react';
import { X, Volume2, VolumeX, Sparkles, CheckCircle2, Clock, AlertTriangle, Play, Pause } from 'lucide-react';
import { TaskItem, InboxMessage } from '../types/index.ts';

interface MorningBriefingModalProps {
  tasks: TaskItem[];
  inboxMessages: InboxMessage[];
  onClose: () => void;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
}

export const MorningBriefingModal: React.FC<MorningBriefingModalProps> = ({
  tasks,
  inboxMessages,
  onClose,
  onSpeak,
  onStopSpeak,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const pendingMessages = inboxMessages.filter((m) => m.unread);

  const briefingScript = `Assalam o alaikum Muhib! Subah bakhair.
Aaj ka plan aur zaroori updates yeh hain:
Aap ke paas kul ${pendingTasks.length} pending tasks hain, jin mein sab se ahem 10:30 baje Boss ko website ka update dena hai.
Boss Sir Imran ka message pending hai jinki deadline shaam 6:00 baje tak hai.
Mama ko dopehar do baje call karna aur shaam 6 baje plants mein paani aur dhoop check karna mat bhooliye ga.
Chai break har 45 minute ke baad zaroor lein. Din bohot accha guzray ga!`;

  const handleToggleVoice = () => {
    if (isPlaying) {
      onStopSpeak();
      setIsPlaying(false);
    } else {
      onSpeak(briefingScript);
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="sci-border bg-[#050b12] border-cyan-500/40 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_30px_rgba(39,215,230,0.2)]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-cyan-500/20 bg-[#081522] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#27d7e6]" />
            <h2 className="font-mono text-sm font-bold text-white tracking-wider">
              DIN 27: SUBAH KI BRIEFING &amp; REMINDERS
            </h2>
          </div>
          <button
            onClick={() => {
              onStopSpeak();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-cyan-950/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Audio Player Action Bar */}
          <div className="bg-[#0b2030] p-4 rounded-xl border border-cyan-500/30 flex items-center justify-between">
            <div>
              <h3 className="font-mono text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                SUBAH KA AUDIO PLAN
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 font-sans">
                Muhib AI aap ke din ka poora naqsha aur reminders aawaz mein batayega.
              </p>
            </div>
            <button
              onClick={handleToggleVoice}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition shadow-md ${
                isPlaying
                  ? 'bg-rose-500 text-black hover:bg-rose-400'
                  : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_12px_rgba(39,215,230,0.3)]'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Awaaz Roko' : 'Briefing Sunno'}
            </button>
          </div>

          {/* Transcript Box */}
          <div className="bg-[#081522] p-3.5 rounded-xl border border-cyan-500/20">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-2">
              ● BRIEFING TRANSCRIPT (ROMAN URDU):
            </span>
            <p className="text-xs font-sans text-slate-200 leading-relaxed whitespace-pre-line bg-black/40 p-3 rounded-lg border border-cyan-500/10">
              {briefingScript}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#0a1827] rounded-xl border border-emerald-500/30 flex flex-col gap-1.5">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                AAJ KE PENDING TASKS ({pendingTasks.length}):
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px] font-sans">
                {pendingTasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{t.time} - {t.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-[#0a1827] rounded-xl border border-amber-500/30 flex flex-col gap-1.5">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                PENDING MESSAGES ({pendingMessages.length}):
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px] font-sans">
                {pendingMessages.map((m) => (
                  <li key={m.id} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{m.sender}: {m.preview.slice(0, 25)}...</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
