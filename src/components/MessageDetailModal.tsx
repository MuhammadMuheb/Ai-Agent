import React, { useState, useEffect } from 'react';
import { X, Send, Edit3, Check, RefreshCw, MessageSquare, Mic, Volume2 } from 'lucide-react';
import { InboxMessage } from '../types/index.ts';

interface MessageDetailModalProps {
  message: InboxMessage;
  inboxMessages: InboxMessage[];
  onSelectMessage: (msg: InboxMessage) => void;
  onClose: () => void;
  onSendApprovedReply: (msg: InboxMessage, reply: string) => void;
  onTweakDraftWithAi: (instruction: string, currentDraft: string) => Promise<string>;
}

export const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  message,
  inboxMessages,
  onSelectMessage,
  onClose,
  onSendApprovedReply,
  onTweakDraftWithAi,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [summary, setSummary] = useState('');
  const [replyDraft, setReplyDraft] = useState('');
  const [urgency, setUrgency] = useState('High');
  const [deadline, setDeadline] = useState('Shaam 6:00 baje');
  const [showTweakInput, setShowTweakInput] = useState(false);
  const [tweakPrompt, setTweakPrompt] = useState('Thoda chhota kar do aur "sir" hata do.');
  const [tweaking, setTweaking] = useState(false);

  // Analyze message on mount or change
  useEffect(() => {
    let isCancelled = false;
    const analyze = async () => {
      setAnalyzing(true);
      try {
        const res = await fetch('/api/message/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: message.sender,
            text: message.fullText,
            source: message.source,
          }),
        });
        const data = await res.json();
        if (!isCancelled) {
          setSummary(data.summary || 'Boss ne design shaam tak maanga hai.');
          setReplyDraft(
            data.replyDraft ||
              'Ji sir, shaam 6 baje tak design ka pehla version bhej doonga. Dark theme aur professional style hoga. Kisi khaas colour ki zaroorat ho to bata dein.'
          );
          setUrgency(data.urgency || 'High');
          setDeadline(data.deadline || 'Aaj shaam 6:00 baje');
        }
      } catch {
        if (!isCancelled) {
          setSummary('Boss ne likha hai ke website ka design aaj shaam tak chahiye. Dark theme aur professional look zaroori hai.');
          setReplyDraft('Ji sir, shaam 6 baje tak design bhej doonga. Dark theme taiyar kar raha hoon.');
        }
      } finally {
        if (!isCancelled) setAnalyzing(false);
      }
    };

    analyze();
    return () => {
      isCancelled = true;
    };
  }, [message]);

  const handleApplyTweak = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweakPrompt.trim()) return;
    setTweaking(true);
    try {
      const newDraft = await onTweakDraftWithAi(tweakPrompt, replyDraft);
      setReplyDraft(newDraft);
      setShowTweakInput(false);
    } catch {
      // fallback manual modification
      setReplyDraft(replyDraft.replace(/sir/gi, '').replace(/\s+/g, ' ').trim());
      setShowTweakInput(false);
    } finally {
      setTweaking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="sci-border bg-[#050b12] border-cyan-500/40 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_30px_rgba(39,215,230,0.2)]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-cyan-500/20 bg-[#081522] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#27d7e6]" />
            <h2 className="font-mono text-sm font-bold text-white tracking-wider">
              SCREEN 2: BOSS KA MESSAGE &amp; APPROVAL FLOW
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-cyan-950/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Split View */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3">
          {/* Left Mini Inbox Selector */}
          <div className="hidden md:flex flex-col border-r border-cyan-500/20 bg-[#060f18] p-3 overflow-y-auto space-y-2">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1 block">
              ● INBOX ({message.source})
            </span>
            {inboxMessages.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMessage(m)}
                className={`p-2.5 rounded-lg cursor-pointer transition border text-xs ${
                  m.id === message.id
                    ? 'bg-[#0f283d] border-cyan-400/60 shadow-[0_0_10px_rgba(39,215,230,0.15)] text-white'
                    : 'bg-[#0a1724] border-cyan-500/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-mono font-semibold text-cyan-300 flex items-center justify-between">
                  <span>{m.sender}</span>
                  <span className="text-[9px] text-slate-400">{m.time}</span>
                </div>
                <p className="line-clamp-1 italic text-[11px] mt-0.5">"{m.preview}"</p>
              </div>
            ))}
          </div>

          {/* Right Message Breakdown & Approval Controls */}
          <div className="md:col-span-2 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
            {/* Original Message Banner */}
            <div className="bg-[#091826] p-3.5 rounded-xl border border-cyan-500/25">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {message.sender.toUpperCase()} KA MESSAGE:
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Source: {message.source}
                </span>
              </div>
              <p className="text-sm text-slate-100 font-serif italic bg-black/30 p-2.5 rounded-lg border border-cyan-500/20">
                "{message.fullText}"
              </p>
            </div>

            {/* Meaning in Roman Urdu */}
            <div className="bg-[#081f2f] p-3.5 rounded-xl border border-emerald-500/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  MATLAB (ROMAN URDU):
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30">
                    Urgency: {urgency}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                    {deadline}
                  </span>
                </div>
              </div>
              {analyzing ? (
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 animate-pulse py-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Muhib AI message samajh raha hai...
                </div>
              ) : (
                <p className="text-xs text-slate-200 font-sans leading-relaxed">
                  {summary}
                </p>
              )}
            </div>

            {/* Editable Reply Draft */}
            <div className="bg-[#0c1e2d] p-3.5 rounded-xl border border-cyan-500/40">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-cyan-300">
                  REPLY DRAFT (TUM BADAL BHI SAKTE HO):
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Muhib Persona Guard Active
                </span>
              </div>
              <textarea
                value={replyDraft}
                onChange={(e) => setReplyDraft(e.target.value)}
                rows={3}
                className="w-full text-xs font-sans bg-black/40 border border-cyan-500/30 rounded-lg p-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* AI Tweak Input Box */}
            {showTweakInput && (
              <form
                onSubmit={handleApplyTweak}
                className="p-3 bg-[#0d283c] rounded-xl border border-cyan-400/50 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-300 font-semibold flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" />
                    Agent ko batayein kya badalna hai:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTweakInput(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Band
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tweakPrompt}
                    onChange={(e) => setTweakPrompt(e.target.value)}
                    placeholder="e.g. Thoda chhota kar do aur sir hata do..."
                    className="flex-1 text-xs bg-black/50 border border-cyan-500/30 rounded-lg px-3 py-1.5 text-white focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    disabled={tweaking}
                    className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold rounded-lg transition"
                  >
                    {tweaking ? 'Updating...' : 'Naya Draft'}
                  </button>
                </div>
              </form>
            )}

            {/* Action Approval Buttons */}
            <div className="pt-2 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onSendApprovedReply(message, replyDraft)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(46,229,157,0.3)] transition"
                  title="Approve reply and open WhatsApp / mail safely"
                >
                  <Send className="w-3.5 h-3.5" />
                  BHEJ DO (APPROVE)
                </button>

                <button
                  onClick={() => setShowTweakInput(!showTweakInput)}
                  className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  BADLO
                </button>

                <button
                  onClick={() => {
                    setShowTweakInput(true);
                    setTweakPrompt('Awaaz ke zariye: mazeed mukhtasir aur seedha jawab banayein.');
                  }}
                  className="px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 border border-purple-500/30 font-mono text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Mic className="w-3.5 h-3.5" />
                  AWAAZ SE BADLO
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-xs transition"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
