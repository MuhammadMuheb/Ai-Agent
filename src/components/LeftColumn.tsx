import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Mail,
  Calendar,
  Send,
  ExternalLink,
  Laptop,
  Terminal,
  Code,
  Globe,
  Share2,
  Sparkles,
  Check,
  Phone,
  Play,
  Volume2,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects.ts';

interface LeftColumnProps {
  onQuickDispatch?: (text: string) => void;
  onOpenModal?: (modal: any) => void;
  onSpeakText?: (text: string) => void;
}

export const LeftColumn: React.FC<LeftColumnProps> = ({
  onQuickDispatch,
  onOpenModal,
  onSpeakText,
}) => {
  // Natural Language Action Dispatcher
  const [commandInput, setCommandInput] = useState('');
  const [dispatchedAction, setDispatchedAction] = useState<{
    type: 'whatsapp' | 'google' | 'gmail' | 'calendar' | 'app';
    label: string;
    targetUrl: string;
    details: string;
  } | null>(null);

  // WhatsApp Quick Sender State
  const [selectedContact, setSelectedContact] = useState<'boss' | 'mama' | 'team' | 'custom'>('boss');
  const [customPhone, setCustomPhone] = useState('');
  const [waMessage, setWaMessage] = useState('Assalam o alaikum Sir, project status aur design update tayyar hai.');
  const [copied, setCopied] = useState(false);

  // Google Search State
  const [googleQuery, setGoogleQuery] = useState('Latest AI Agent benchmarks 2026');

  // Contact list mapping
  const contacts = {
    boss: { name: 'Boss (Sir Imran)', phone: '+923001234567', defaultMsg: 'Assalam o alaikum Sir, design shaam 6:00 baje deliver ho jaye ga.' },
    mama: { name: 'Mama Jan', phone: '+923009876543', defaultMsg: 'Assalam o alaikum Mama, mein theek hoon, thodi der mein ghar aata hoon.' },
    team: { name: 'Dev Team Lead', phone: '+923214567890', defaultMsg: 'Bhai, PR check kar lo aur staging deployment verify kar do.' },
    custom: { name: 'Naya Number', phone: customPhone, defaultMsg: '' },
  };

  // Natural Language Interpreter: parses user intent into instant desktop action
  const handleParseAndExecuteCommand = (overrideText?: string) => {
    const text = (overrideText || commandInput).trim().toLowerCase();
    if (!text) return;

    soundFX.playWakeChime();

    // 1. WhatsApp Intent Detection
    if (text.includes('whatsapp') || text.includes('message') || text.includes('msg')) {
      let phone = '';
      let msg = text;

      if (text.includes('boss') || text.includes('sir')) {
        phone = contacts.boss.phone;
        msg = 'Assalam o alaikum Sir, update tayyar hai.';
      } else if (text.includes('mama') || text.includes('ammi') || text.includes('papa')) {
        phone = contacts.mama.phone;
        msg = 'Assalam o alaikum, mein theek hoon!';
      }

      // Extract quoted or tail message
      const quoteMatch = text.match(/["'](.*?)["']/);
      if (quoteMatch && quoteMatch[1]) {
        msg = quoteMatch[1];
      }

      const encodedMsg = encodeURIComponent(msg);
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const waWebUrl = cleanPhone
        ? `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`
        : `https://web.whatsapp.com/send?text=${encodedMsg}`;

      setDispatchedAction({
        type: 'whatsapp',
        label: `WhatsApp Message -> ${cleanPhone || 'Contact'}`,
        targetUrl: waWebUrl,
        details: `Message: "${msg}"`,
      });
      return;
    }

    // 2. Google Search Intent
    if (text.includes('search') || text.includes('google') || text.includes('dhoondo')) {
      const query = text.replace(/search|google|karo|dhoondo|for|about/gi, '').trim();
      const targetUrl = `https://www.google.com/search?q=${encodeURIComponent(query || text)}`;
      setDispatchedAction({
        type: 'google',
        label: `Google Search -> "${query || text}"`,
        targetUrl,
        details: `Opening real Google search results`,
      });
      return;
    }

    // 3. Gmail Compose Intent
    if (text.includes('mail') || text.includes('email') || text.includes('khat')) {
      const targetUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent('Project Update')}&body=${encodeURIComponent(text)}`;
      setDispatchedAction({
        type: 'gmail',
        label: `Gmail Compose`,
        targetUrl,
        details: `Drafting new email with pre-filled content`,
      });
      return;
    }

    // 4. Default Search Fallback
    const targetUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
    setDispatchedAction({
      type: 'google',
      label: `Web Search -> "${text}"`,
      targetUrl,
      details: 'Instant web access',
    });
  };

  // Direct WhatsApp Launchers
  const openWhatsAppWeb = (phoneNum: string, text: string) => {
    soundFX.playSuccess();
    const cleanPhone = phoneNum.replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`
      : `https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const openWhatsAppDesktop = (phoneNum: string, text: string) => {
    soundFX.playSuccess();
    const cleanPhone = phoneNum.replace(/[^0-9]/g, '');
    const protocolUrl = cleanPhone
      ? `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`
      : `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.location.href = protocolUrl;
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    soundFX.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* 1. NATURAL LANGUAGE COMMAND DISPATCHER */}
      <div className="sci-border p-3 bg-gradient-to-br from-[#071625] via-[#091b2e] to-[#071625] border-cyan-500/40">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#27d7e6] animate-pulse" />
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
              DESKTOP ACCESS &amp; COMMAND HUB
            </h2>
          </div>
          <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
            SYSTEM ROOT ACTIVE
          </span>
        </div>

        <p className="text-[11px] text-slate-300 font-sans mb-2">
          Kuch bhi bolo ya likho — WhatsApp, Google, Gmail ya laptop ke apps foran operate honge:
        </p>

        <div className="flex gap-1.5 mb-2">
          <input
            type="text"
            placeholder="e.g. 'Boss ko WhatsApp par status update bhejo'..."
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleParseAndExecuteCommand();
            }}
            className="flex-1 text-xs bg-black/50 border border-cyan-500/30 focus:border-cyan-400 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500 font-sans focus:outline-none"
          />
          <button
            onClick={() => handleParseAndExecuteCommand()}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition flex items-center gap-1 shrink-0 shadow-[0_0_10px_rgba(39,215,230,0.3)]"
          >
            <Send className="w-3 h-3" />
            Bolo
          </button>
        </div>

        {/* Dispatched Action Preview Box */}
        {dispatchedAction && (
          <div className="p-2 bg-[#0b2438] rounded-lg border border-cyan-400/50 space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-cyan-200">
                {dispatchedAction.label}
              </span>
              <span className="text-[9px] font-mono text-emerald-400">READY</span>
            </div>
            <p className="text-[11px] text-slate-300 italic">
              {dispatchedAction.details}
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setDispatchedAction(null)}
                className="text-[10px] font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  soundFX.playSuccess();
                  window.open(dispatchedAction.targetUrl, '_blank');
                  setDispatchedAction(null);
                }}
                className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-emerald-500 text-black hover:bg-emerald-400 flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                FORAN KHOLO (EXECUTE)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. WHATSAPP ACCESS CONTROL */}
      <div className="sci-border p-3 bg-[#081523] border-emerald-500/30 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-300">
                WHATSAPP FULL ACCESS BRIDGE
              </h3>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Web + App Ready
            </span>
          </div>

          {/* Contact Quick Buttons */}
          <div className="grid grid-cols-3 gap-1.5 mb-2.5">
            <button
              onClick={() => {
                setSelectedContact('boss');
                setWaMessage(contacts.boss.defaultMsg);
              }}
              className={`p-1.5 rounded text-[11px] font-mono text-left transition border ${
                selectedContact === 'boss'
                  ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 font-bold'
                  : 'bg-black/40 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Boss (Sir Imran)
            </button>
            <button
              onClick={() => {
                setSelectedContact('mama');
                setWaMessage(contacts.mama.defaultMsg);
              }}
              className={`p-1.5 rounded text-[11px] font-mono text-left transition border ${
                selectedContact === 'mama'
                  ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 font-bold'
                  : 'bg-black/40 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Mama Jan
            </button>
            <button
              onClick={() => {
                setSelectedContact('team');
                setWaMessage(contacts.team.defaultMsg);
              }}
              className={`p-1.5 rounded text-[11px] font-mono text-left transition border ${
                selectedContact === 'team'
                  ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 font-bold'
                  : 'bg-black/40 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Dev Team
            </button>
          </div>

          {/* Target Phone Indicator */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5 px-1">
            <span>Target Number:</span>
            <span className="text-emerald-300 font-bold">
              {contacts[selectedContact]?.phone || 'Direct Web Dispatch'}
            </span>
          </div>

          {/* Message Area */}
          <textarea
            rows={3}
            value={waMessage}
            onChange={(e) => setWaMessage(e.target.value)}
            placeholder="WhatsApp message yahan type karein..."
            className="w-full text-xs bg-black/60 border border-emerald-500/30 rounded-lg p-2 text-white font-sans focus:outline-none focus:border-emerald-400 mb-2 resize-none"
          />
        </div>

        {/* WhatsApp Action Buttons */}
        <div className="space-y-1.5 pt-1">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => openWhatsAppWeb(contacts[selectedContact]?.phone, waMessage)}
              className="py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-[0_0_10px_rgba(46,229,157,0.2)]"
            >
              <ExternalLink className="w-3 h-3" />
              WhatsApp Web
            </button>

            <button
              onClick={() => openWhatsAppDesktop(contacts[selectedContact]?.phone, waMessage)}
              className="py-1.5 px-2 rounded-lg bg-[#0e3124] hover:bg-[#144734] border border-emerald-500/40 text-emerald-200 font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Laptop className="w-3 h-3 text-emerald-400" />
              Desktop App
            </button>
          </div>

          <button
            onClick={() => handleCopyText(waMessage)}
            className="w-full py-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : null}
            <span>{copied ? 'Message Copied!' : 'Copy Text for Manual Paste'}</span>
          </button>
        </div>
      </div>

      {/* 3. GOOGLE COMPLETE SUITE ACCESS */}
      <div className="sci-border p-3 bg-[#081523] border-cyan-500/30 space-y-2">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5">
          <div className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
              GOOGLE SUITE DIRECT ACCESS
            </h3>
          </div>
          <span className="text-[9px] font-mono text-cyan-400">1-CLICK</span>
        </div>

        {/* Google Search Bar */}
        <div className="flex gap-1.5">
          <input
            type="text"
            value={googleQuery}
            onChange={(e) => setGoogleQuery(e.target.value)}
            placeholder="Google Search query..."
            className="flex-1 text-xs bg-black/50 border border-cyan-500/20 rounded px-2 py-1 text-white font-sans focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => {
              soundFX.playSuccess();
              window.open(`https://www.google.com/search?q=${encodeURIComponent(googleQuery)}`, '_blank');
            }}
            className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black font-mono text-xs font-bold transition flex items-center gap-1"
          >
            <Search className="w-3 h-3" />
            Search
          </button>
        </div>

        {/* Google Suite Fast Launchers */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded bg-black/40 border border-cyan-500/20 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition flex flex-col items-center gap-1 group"
          >
            <Mail className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition" />
            <span className="text-[10px] font-mono">Gmail</span>
          </a>

          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded bg-black/40 border border-cyan-500/20 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition flex flex-col items-center gap-1 group"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition" />
            <span className="text-[10px] font-mono">Calendar</span>
          </a>

          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded bg-black/40 border border-cyan-500/20 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition flex flex-col items-center gap-1 group"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
            <span className="text-[10px] font-mono">Drive</span>
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded bg-black/40 border border-cyan-500/20 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition flex flex-col items-center gap-1 group"
          >
            <Play className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition" />
            <span className="text-[10px] font-mono">YouTube</span>
          </a>
        </div>
      </div>

      {/* 4. LAPTOP OS & CODE LAUNCHERS */}
      <div className="sci-border p-2.5 bg-[#081523] border-cyan-500/20 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 text-[11px]">Desktop Protocol:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              window.location.href = 'vscode://';
            }}
            className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300 hover:bg-blue-600 hover:text-white transition text-[10px]"
            title="Launch VS Code on this laptop"
          >
            VS Code
          </button>
          <button
            onClick={() => {
              window.location.href = 'cursor://';
            }}
            className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:bg-purple-600 hover:text-white transition text-[10px]"
            title="Launch Cursor IDE on this laptop"
          >
            Cursor
          </button>
          <button
            onClick={() => onOpenModal?.('settings')}
            className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 hover:bg-amber-600 hover:text-black transition text-[10px]"
          >
            Vault →
          </button>
        </div>
      </div>
    </div>
  );
};
