import React, { useState } from 'react';
import { X, Brain, UserCheck, Wrench, Settings as SettingsIcon, Plus, Trash2, Check, Sparkles, Sliders } from 'lucide-react';
import { ActiveModal, MemoryItem } from '../types/index.ts';

interface ModulesModalProps {
  initialTab: 'memory' | 'character' | 'skills' | 'settings';
  memories: MemoryItem[];
  onAddMemory: (category: 'boss' | 'mama' | 'projects' | 'habits', title: string, detail: string) => void;
  onDeleteMemory: (id: string) => void;
  onClose: () => void;
}

export const ModulesModal: React.FC<ModulesModalProps> = ({
  initialTab,
  memories,
  onAddMemory,
  onDeleteMemory,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'memory' | 'character' | 'skills' | 'settings'>(initialTab);

  // Character state
  const [agentName, setAgentName] = useState('Muhib AI');
  const [wakeWord, setWakeWord] = useState('Muhib');
  const [selectedLanguage, setSelectedLanguage] = useState<'Roman Urdu' | 'English' | 'Urdu'>('Roman Urdu');
  const [toneFriendly, setToneFriendly] = useState(80);
  const [responseLength, setResponseLength] = useState(40);
  const [autoMorningPlan, setAutoMorningPlan] = useState(true);

  // Skills state
  const [skills, setSkills] = useState([
    { id: 's1', name: 'Boss ke message samajhna', enabled: true, level: 'safe' },
    { id: 's2', name: 'Voice message sunna (Transcribe)', enabled: true, level: 'safe' },
    { id: 's3', name: 'Plant Care & Vision Diagnostics (Gemini Pro)', enabled: true, level: 'safe' },
    { id: 's4', name: 'Website banwana (Claude/Gemini Ready Prompt)', enabled: true, level: 'safe' },
    { id: 's5', name: 'YouTube & Break Ideas', enabled: true, level: 'safe' },
    { id: 's6', name: 'Files sambhalna (Allowed folders)', enabled: true, level: 'approval' },
    { id: 's7', name: 'Browser control (Playwright sandboxed)', enabled: false, level: 'restricted' },
  ]);

  // Memory form
  const [showAddMem, setShowAddMem] = useState(false);
  const [memCat, setMemCat] = useState<'boss' | 'mama' | 'projects' | 'habits'>('boss');
  const [memTitle, setMemTitle] = useState('');
  const [memDetail, setMemDetail] = useState('');

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memTitle.trim() || !memDetail.trim()) return;
    onAddMemory(memCat, memTitle.trim(), memDetail.trim());
    setMemTitle('');
    setMemDetail('');
    setShowAddMem(false);
  };

  const toggleSkill = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="sci-border bg-[#050b12] border-cyan-500/40 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_30px_rgba(39,215,230,0.2)]">
        {/* Modal Top Navigation */}
        <div className="px-4 py-3 border-b border-cyan-500/20 bg-[#081522] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#27d7e6]" />
            <h2 className="font-mono text-sm font-bold text-white tracking-wider">
              SCREEN 3: MEMORY, CHARACTER &amp; SKILLS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-cyan-950/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-cyan-500/20 bg-[#061019] px-4 gap-2">
          <button
            onClick={() => setActiveTab('memory')}
            className={`font-mono text-xs py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'memory'
                ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            MEMORY (YAADDASHT)
          </button>

          <button
            onClick={() => setActiveTab('character')}
            className={`font-mono text-xs py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'character'
                ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            CHARACTER (SHAKHSIYAT)
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`font-mono text-xs py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'skills'
                ? 'border-emerald-400 text-emerald-300 font-bold bg-emerald-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            SKILLS (HUNAR)
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`font-mono text-xs py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-300 font-bold bg-amber-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5 text-amber-400" />
            SETTINGS
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* 1. MEMORY TAB */}
          {activeTab === 'memory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-sm font-bold text-cyan-300">
                    AGENT KI YAADDASHT (PERSISTENT MEMORY)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Muhib AI har chat se pehle ye facts zehen mein rakhta hai taake boss aur mama ki baten kabhi na bhoole.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMem(!showAddMem)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Nayi Yaad
                </button>
              </div>

              {/* Add Memory Form */}
              {showAddMem && (
                <form
                  onSubmit={handleCreateMemory}
                  className="p-3 bg-[#0d2235] rounded-xl border border-cyan-500/40 space-y-2.5"
                >
                  <div className="flex gap-2">
                    <select
                      value={memCat}
                      onChange={(e: any) => setMemCat(e.target.value)}
                      className="bg-black/50 text-xs font-mono text-cyan-300 border border-cyan-500/30 rounded px-2 py-1"
                    >
                      <option value="boss">Boss</option>
                      <option value="mama">Mama</option>
                      <option value="projects">Projects</option>
                      <option value="habits">Meri Aadatein</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Title (e.g. Sir Imran ki timing)"
                      value={memTitle}
                      onChange={(e) => setMemTitle(e.target.value)}
                      className="flex-1 text-xs bg-black/50 border border-cyan-500/30 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Tafseelat (e.g. Dark design aur concise jawab pasand hai...)"
                    value={memDetail}
                    onChange={(e) => setMemDetail(e.target.value)}
                    className="w-full text-xs bg-black/50 border border-cyan-500/30 rounded p-2 text-white font-sans"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMem(false)}
                      className="text-xs font-mono px-3 py-1 text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="text-xs font-mono px-3 py-1 rounded bg-cyan-500 text-black font-bold"
                    >
                      Save Yaad
                    </button>
                  </div>
                </form>
              )}

              {/* Memory Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3 bg-[#0a1826] rounded-xl border border-cyan-500/20 hover:border-cyan-400/40 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold text-cyan-300 uppercase">
                          {mem.title}
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 uppercase">
                          {mem.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {mem.detail}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{mem.updatedAt}</span>
                      <button
                        onClick={() => onDeleteMemory(mem.id)}
                        className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Mitao
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. CHARACTER TAB */}
          {activeTab === 'character' && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <h3 className="font-mono text-sm font-bold text-cyan-300 mb-1">
                  SHAKHSIYAT AUR GUFTEGU KA ANDAAZ
                </h3>
                <p className="text-xs text-slate-400">
                  Yahan agent ka andaaz, bolchal aur zubaan customize karein.
                </p>
              </div>

              <div className="space-y-4 bg-[#091826] p-4 rounded-xl border border-cyan-500/25">
                <div>
                  <label className="block text-xs font-mono text-cyan-300 mb-1 font-semibold">
                    Agent Ka Naam:
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full text-xs bg-black/40 border border-cyan-500/30 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyan-300 mb-1 font-semibold">
                    Wake Word (Bulaane Ka Naam):
                  </label>
                  <input
                    type="text"
                    value={wakeWord}
                    onChange={(e) => setWakeWord(e.target.value)}
                    className="w-full text-xs bg-black/40 border border-cyan-500/30 rounded-lg p-2 text-white font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    Tumhe "{wakeWord}" bulane par jaagta hai.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyan-300 mb-1 font-semibold">
                    Zubaan (Language):
                  </label>
                  <div className="flex gap-2">
                    {(['Roman Urdu', 'English', 'Urdu'] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setSelectedLanguage(lang)}
                        className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition ${
                          selectedLanguage === lang
                            ? 'bg-cyan-500 text-black font-bold border-cyan-400'
                            : 'bg-black/40 text-slate-300 border-cyan-500/30 hover:border-cyan-400'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-cyan-300 mb-1">
                    <span>Andaaz: Dostana ({toneFriendly}%)</span>
                    <span>Seedha &amp; Professional</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={toneFriendly}
                    onChange={(e) => setToneFriendly(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-cyan-300 mb-1">
                    <span>Jawab Ki Lambai: Mukhtasir ({responseLength}%)</span>
                    <span>Tafseeli</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={responseLength}
                    onChange={(e) => setResponseLength(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20">
                  <div>
                    <span className="text-xs font-mono text-white font-bold block">
                      Roz Subah: "Aaj ka plan" khud bataye
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Subah pehla login karne par audio briefing sunayega
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoMorningPlan(!autoMorningPlan)}
                    className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
                      autoMorningPlan ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-mono text-sm font-bold text-emerald-300 mb-1">
                  HUNAR &amp; SKILLS REGISTRY
                </h3>
                <p className="text-xs text-slate-400">
                  Agent sirf unhi skills ko chalayega jo yahan ON hain. Khatarnaak skills ke liye approval zaroori hai.
                </p>
              </div>

              <div className="space-y-2.5">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 bg-[#0a1826] rounded-xl border border-cyan-500/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          skill.enabled ? 'bg-emerald-400 shadow-[0_0_6px_#2ee59d]' : 'bg-slate-600'
                        }`}
                      />
                      <div>
                        <span className="font-mono text-xs font-bold text-white block">
                          {skill.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Level: {skill.level === 'safe' ? 'Hara (Safe)' : skill.level === 'approval' ? 'Peela (Approval)' : 'Laal (Restricted)'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSkill(skill.id)}
                      className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border transition ${
                        skill.enabled
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {skill.enabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SETTINGS & ROUTINE MEMORY VAULT */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-3xl">
              <div>
                <h3 className="font-mono text-sm font-bold text-amber-300">
                  SETTINGS &amp; AGENT LONG-TERM MEMORY VAULT
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Home screen ko saaf rakhte hue, Muhib AI yeh tamam routines, rules aur permissions apne zehen mein mehfooz rakhta hai.
                </p>
              </div>

              {/* Stored Daily Plan & Tasks in Agent Memory */}
              <div className="bg-[#091826] p-4 rounded-xl border border-cyan-500/25 space-y-2.5">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#27d7e6]" />
                    <h4 className="font-mono text-xs font-bold text-cyan-300 uppercase">
                      STORED ROUTINE: AAJ KA PLAN &amp; TASKS
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Agent Remembers
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                  <div className="p-2 rounded bg-black/40 border border-cyan-500/10 flex items-start gap-2">
                    <span className="text-cyan-400">10:30 AM</span>
                    <span>Boss ka message review &amp; reply draft</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-cyan-500/10 flex items-start gap-2">
                    <span className="text-cyan-400">01:30 PM</span>
                    <span>Website redesign &amp; dark theme styling</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-cyan-500/10 flex items-start gap-2">
                    <span className="text-cyan-400">05:00 PM</span>
                    <span>Boss update final delivery slot</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-cyan-500/10 flex items-start gap-2">
                    <span className="text-cyan-400">06:00 PM</span>
                    <span>Monstera &amp; balcony plants ko paani check</span>
                  </div>
                </div>
              </div>

              {/* Fresh Hone Ke Ideas Protocol */}
              <div className="bg-[#091826] p-4 rounded-xl border border-amber-500/25 space-y-2.5">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                    <h4 className="font-mono text-xs font-bold text-amber-300 uppercase">
                      FRESH HONE KE IDEAS &amp; WELLNESS PROTOCOL
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                    Background Agent Reminders
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Agent har 45 minute ke deep work focus sprint ke baad Muhib ko aahista se break ka mashwara deta hai:
                </p>
                <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                  <p className="p-1.5 rounded bg-black/40 border border-amber-500/10">☕ 5 minute stretch aur garam chai break.</p>
                  <p className="p-1.5 rounded bg-black/40 border border-amber-500/10">🌿 Balcony ke plants ki taraf 2 minute nazar daal kar aankhon ko aaram dein.</p>
                  <p className="p-1.5 rounded bg-black/40 border border-amber-500/10">🎵 Lofi soundscapes sun kar fresh dimagh se agla code sprint shuru karein.</p>
                </div>
              </div>

              {/* People & Communication Rules */}
              <div className="bg-[#091826] p-4 rounded-xl border border-purple-500/25 space-y-2.5">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_#a855f7]" />
                    <h4 className="font-mono text-xs font-bold text-purple-300 uppercase">
                      PEOPLE &amp; COMMUNICATION RULES
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                    Active Rules
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-slate-300">
                  <div className="p-2.5 rounded bg-black/40 border border-purple-500/10">
                    <span className="font-mono font-bold text-purple-300 block mb-1">Boss (Sir Imran):</span>
                    Hamesha professional Roman Urdu, dark theme preference, updates shaam 6:00 PM se pehle. Baghair approval koi message send nahi hoga.
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-purple-500/10">
                    <span className="font-mono font-bold text-purple-300 block mb-1">Mama Jan:</span>
                    Roz shaam call ka intezaar hota hai. Voice note aur warm Roman Urdu replies ko top priority di jaye.
                  </div>
                </div>
              </div>

              {/* Desktop Access Permissions & System Config */}
              <div className="bg-[#081827] p-4 rounded-xl border border-cyan-500/30 space-y-3">
                <h4 className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  DESKTOP &amp; CLOUD ACCESS PERMISSIONS
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded bg-black/50 border border-emerald-500/30 text-emerald-300">
                    <span>WhatsApp Access</span>
                    <span className="block text-[10px] text-emerald-400 font-bold mt-1">✓ GRANTED</span>
                  </div>
                  <div className="p-2 rounded bg-black/50 border border-cyan-500/30 text-cyan-300">
                    <span>Google Suite</span>
                    <span className="block text-[10px] text-cyan-400 font-bold mt-1">✓ GRANTED</span>
                  </div>
                  <div className="p-2 rounded bg-black/50 border border-purple-500/30 text-purple-300">
                    <span>Research Engine</span>
                    <span className="block text-[10px] text-purple-400 font-bold mt-1">✓ GRANTED</span>
                  </div>
                  <div className="p-2 rounded bg-black/50 border border-amber-500/30 text-amber-300">
                    <span>Desktop Protocol</span>
                    <span className="block text-[10px] text-amber-400 font-bold mt-1">✓ UNLOCKED</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-cyan-500/10">
                  <button
                    onClick={() => {
                      const data = {
                        memories,
                        agentName,
                        wakeWord,
                        exportedAt: new Date().toISOString(),
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: 'application/json',
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `muhib_ai_memory_vault_${Date.now()}.json`;
                      a.click();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    Export Memory Vault (JSON)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
