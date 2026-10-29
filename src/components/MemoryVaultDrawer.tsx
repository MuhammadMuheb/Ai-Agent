import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  FolderLock,
  Sparkles,
  Check,
  Brain,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MemoryItem } from '../types/index.ts';
import { soundFX } from '../utils/soundEffects.ts';

interface MemoryVaultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  memories: MemoryItem[];
  onAddMemory: (category: 'boss' | 'mama' | 'projects' | 'habits', title: string, detail: string) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryVaultDrawer: React.FC<MemoryVaultDrawerProps> = ({
  isOpen,
  onClose,
  memories,
  onAddMemory,
  onDeleteMemory,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'boss' | 'mama' | 'projects' | 'habits'>('habits');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDetail.trim()) return;

    soundFX.playSuccess();
    onAddMemory(selectedCategory, newTitle.trim(), newDetail.trim());
    setNewTitle('');
    setNewDetail('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-[#080d16] border-l border-cyan-500/30 p-5 sm:p-6 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
              <FolderLock className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Memory &amp; Desk Vault
              </h3>
              <p className="text-[10px] font-mono text-slate-400">
                User-controlled memory (Screen par clutter nahi banta)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#111e30] hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explain Rule */}
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 mb-4 text-xs text-slate-300 leading-relaxed font-sans">
          <span className="font-semibold text-cyan-300">Clean Canvas Rule:</span> Tamam preferences aur custom desk items yahan mehfooz rehte hain. Main screen par koi pre-added kachra nahi aayega. Aap bol kar ya likh kar naya item add kar sakte hain.
        </div>

        {/* Add New Item Button / Form */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mb-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500 hover:to-blue-600 hover:text-black border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Naya Memory / Desk Note Add Karein</span>
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="p-3.5 rounded-xl bg-[#0e1726] border border-cyan-500/40 mb-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-cyan-300 uppercase font-bold">New Item</span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title (e.g. Boss ki requirement / Meeting link)..."
              className="w-full px-3 py-1.5 rounded-lg bg-[#070c14] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />

            <textarea
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)}
              placeholder="Details jo AI ko yaad rakhni chahiye..."
              rows={2}
              className="w-full px-3 py-1.5 rounded-lg bg-[#070c14] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="bg-[#070c14] border border-slate-700 text-slate-300 text-[11px] rounded px-2 py-1 focus:outline-none"
              >
                <option value="habits">Habits &amp; Routine</option>
                <option value="projects">Projects &amp; Tools</option>
                <option value="boss">Boss Requirements</option>
                <option value="mama">Family / Mama</option>
              </select>

              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Memory Items List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {memories.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">
              Abhi koi custom memory add nahi ki gayi.
            </div>
          ) : (
            memories.map((mem) => (
              <div
                key={mem.id}
                className="p-3 rounded-xl bg-[#0c1422] border border-slate-800 hover:border-cyan-500/30 transition flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/20">
                      {mem.category}
                    </span>
                    <h5 className="text-xs font-bold text-white mt-1.5">{mem.title}</h5>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{mem.detail}</p>
                  </div>
                  <button
                    onClick={() => {
                      soundFX.playAlert();
                      onDeleteMemory(mem.id);
                    }}
                    className="p-1.5 rounded-md hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 transition cursor-pointer shrink-0 opacity-70 group-hover:opacity-100"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
