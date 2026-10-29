import React, { useState, useEffect, useRef } from 'react';
import { Search, Home, MessageSquare, CheckSquare, Brain, Settings, Plus, Play, StopCircle, ArrowRight } from 'lucide-react';
import { NavigationTab } from '../../types/index.ts';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onQuickAction: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onQuickAction,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onQuickAction('open-palette');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onQuickAction]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'tab-aaj',
      icon: Home,
      label: 'Aaj (Home) par jao',
      category: 'Navigation',
      action: () => {
        onNavigate('aaj');
        onClose();
      },
    },
    {
      id: 'tab-baat',
      icon: MessageSquare,
      label: 'Baat-cheet (Agent Chat & Robot)',
      category: 'Navigation',
      action: () => {
        onNavigate('baat-cheet');
        onClose();
      },
    },
    {
      id: 'tab-kaam',
      icon: CheckSquare,
      label: 'Kaam (Tasks, Missions, Plant Vision)',
      category: 'Navigation',
      action: () => {
        onNavigate('kaam');
        onClose();
      },
    },
    {
      id: 'tab-yaadasht',
      icon: Brain,
      label: 'Yaadasht (Memory Vault & Files)',
      category: 'Navigation',
      action: () => {
        onNavigate('yaadasht');
        onClose();
      },
    },
    {
      id: 'tab-settings',
      icon: Settings,
      label: 'Settings (Safety, Voice, Logs)',
      category: 'Navigation',
      action: () => {
        onNavigate('settings');
        onClose();
      },
    },
    {
      id: 'act-new-task',
      icon: Plus,
      label: 'Naya task add karo',
      category: 'Actions',
      action: () => {
        onQuickAction('new-task');
        onClose();
      },
    },
    {
      id: 'act-stop',
      icon: StopCircle,
      label: 'Agent ko foran roko (Emergency Stop)',
      category: 'Actions',
      action: () => {
        onQuickAction('stop-agent');
        onClose();
      },
    },
  ];

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#0b1118] border border-[#1c2a38] rounded-xl shadow-2xl overflow-hidden flex flex-col text-[#e6edf3]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-[#1c2a38] gap-3">
          <Search className="w-5 h-5 text-[#27d7e6]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type 'naya task', 'yaadasht', ya search karein..."
            className="flex-1 bg-transparent text-sm text-[#e6edf3] placeholder-[#8b9bab] focus:outline-none"
          />
          <kbd className="text-[10px] bg-[#111a24] text-[#8b9bab] px-2 py-0.5 rounded border border-[#1c2a38] font-mono">
            ESC
          </kbd>
        </div>

        {/* List of Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#8b9bab]">
              Koi command nahi mili.
            </div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs md:text-sm text-[#e6edf3] hover:bg-[#111a24] hover:text-[#27d7e6] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#8b9bab] group-hover:text-[#27d7e6]" />
                    <span>{cmd.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8b9bab] uppercase">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
