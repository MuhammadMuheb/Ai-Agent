import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, FileCode, ArrowRight, RefreshCw } from 'lucide-react';
import { soundFX } from '../utils/soundEffects.ts';

interface WebsiteBriefModalProps {
  onClose: () => void;
  onLogAction: (action: string, status: 'approved' | 'sent' | 'read' | 'pending' | 'denied', details?: string) => void;
}

export const WebsiteBriefModal: React.FC<WebsiteBriefModalProps> = ({
  onClose,
  onLogAction,
}) => {
  const [sourceMessage, setSourceMessage] = useState(
    'Website ka design aaj shaam 6 baje tak bhej do. Dark theme aur professional style hona chahiye. Kisi colour ki zaroorat ho to bata dena.'
  );
  const [clientName, setClientName] = useState('Sir Imran (Boss)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);

  const [briefMarkdown, setBriefMarkdown] = useState(`# Website Project Brief & Technical Specification

**Client:** Sir Imran (Boss)  
**Target Deadline:** Aaj Shaam 6:00 PM  
**Primary Aesthetic:** Dark Sci-Fi / Professional Modern  
**Color Palette:** Background #05080c, Cyan #27d7e6, Emerald #2ee59d, Amber #f5b83d  
**Core Technologies:** React + Vite, Tailwind CSS, Express, TypeScript

### 1. Key Pages & Layout
- **Landing / Home Dashboard:** Hero section with animated particle sphere, top bar brand navigation, clean typography.
- **Services & Modules:** 4 distinct interactive service cards with hover state feedback and status indicators.
- **Workflow & Audit Log:** Transparent action stream showing operational history and client approvals.

### 2. Design Constraints
- Zero-pill discipline on buttons (subtle 8-14px rounded corners).
- High-contrast readability with monospace headings.
- Mobile and desktop responsive layout (columns stack on narrow viewports).

### 3. Immediate Clarifications Needed
1. Kya client ka apna logo aur typography guidelines available hain?
2. Kaunsi 3 primary call-to-actions (CTAs) hero section mein zaroori hain?`);

  const [readyPrompt, setReadyPrompt] = useState(`You are a world-class senior frontend architect.
Build a modern, professional web application based on the following client requirements:
Client: Sir Imran (Boss)
Aesthetic: Dark sci-fi dashboard theme (#05080c background, #27d7e6 cyan neon accents, #2ee59d emerald highlights, monospace headers).
Tech Stack: React 19 + TypeScript, Tailwind CSS, Vite.
Key Requirements:
1. 3-column layout on desktop, collapsing to stacked cards on mobile.
2. Top navigation bar with branding, live status, and action buttons.
3. Interactive UI elements with subtle glowing borders and smooth hover states.
4. Clean, modular component architecture with TypeScript interfaces.
Please generate the complete, production-ready code with no placeholders.`);

  const handleGenerateBrief = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `You are Muhib AI brief maker. Client: "${clientName}". Message: "${sourceMessage}".
Create:
1. A structured Markdown brief.md with Project Title, Pages, Style & Colors, Tech Stack, and 2 Clarification Questions.
2. A ready-to-paste prompt for Claude/Gemini.
Output in JSON:
{
  "brief": "markdown text...",
  "prompt": "ready prompt text..."
}`,
            },
          ],
          model: 'gemini-3.5-flash',
        }),
      });

      const data = await res.json();
      try {
        const parsed = JSON.parse(data.reply);
        if (parsed.brief) setBriefMarkdown(parsed.brief);
        if (parsed.prompt) setReadyPrompt(parsed.prompt);
      } catch {
        // use raw text
        setBriefMarkdown(data.reply);
      }
      onLogAction('Website brief aur prompt create kiya gaya', 'approved', `Client: ${clientName}`);
      soundFX.playSuccess();
    } catch {
      // Keep current template
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string, type: 'prompt' | 'brief') => {
    await navigator.clipboard.writeText(text);
    soundFX.playSuccess();
    if (type === 'prompt') {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2000);
    }
    onLogAction(
      type === 'prompt' ? 'Claude/Gemini ready prompt copy kiya' : 'Brief.md copy kiya',
      'approved'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="sci-border bg-[#050b12] border-cyan-500/40 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_30px_rgba(39,215,230,0.2)]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-cyan-500/20 bg-[#081522] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#27d7e6]" />
            <h2 className="font-mono text-sm font-bold text-white tracking-wider">
              DIN 34: WEBSITE BRIEF &amp; READY-TO-PASTE PROMPT GENERATOR
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-cyan-950/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Inputs Section */}
          <div className="p-3.5 bg-[#0a1725] rounded-xl border border-cyan-500/20 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-cyan-300 font-semibold mb-1">
                  Client / Boss Ka Naam:
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full text-xs font-mono bg-black/40 border border-cyan-500/30 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleGenerateBrief}
                  disabled={isGenerating}
                  className="w-full text-xs font-mono font-bold py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Brief Ban Raha Hai...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Naya Brief &amp; Prompt Banao
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-300 font-semibold mb-1">
                Boss / Client Ka Message:
              </label>
              <textarea
                rows={2}
                value={sourceMessage}
                onChange={(e) => setSourceMessage(e.target.value)}
                className="w-full text-xs bg-black/40 border border-cyan-500/30 rounded-lg p-2 text-white font-sans focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Generated Ready-to-paste Prompt */}
          <div className="bg-[#081827] p-3.5 rounded-xl border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                CLAUDE / GEMINI KE LIYE READY-TO-PASTE PROMPT:
              </span>
              <button
                onClick={() => handleCopy(readyPrompt, 'prompt')}
                className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/40 transition flex items-center gap-1.5"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedPrompt ? 'Copied!' : 'Ek Click Par Copy Karo'}
              </button>
            </div>
            <pre className="text-xs font-mono bg-black/50 p-3 rounded-lg border border-cyan-500/20 text-slate-200 whitespace-pre-wrap max-h-40 overflow-y-auto">
              {readyPrompt}
            </pre>
          </div>

          {/* brief.md Preview */}
          <div className="bg-[#0a1622] p-3.5 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-300">
                BRIEF.MD SPECIFICATION:
              </span>
              <button
                onClick={() => handleCopy(briefMarkdown, 'brief')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1"
              >
                {copiedBrief ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedBrief ? 'Copied' : 'Copy brief.md'}
              </button>
            </div>
            <pre className="text-xs font-mono bg-black/40 p-3 rounded-lg border border-cyan-500/10 text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {briefMarkdown}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
