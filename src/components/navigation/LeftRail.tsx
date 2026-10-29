import React from 'react';
import { Home, MessageSquare, CheckSquare, Brain, Settings, Command } from 'lucide-react';
import { NavigationTab } from '../../types/index.ts';

interface LeftRailProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenCommandPalette: () => void;
  pendingApprovalsCount: number;
}

export const LeftRail: React.FC<LeftRailProps> = ({
  currentTab,
  onTabChange,
  onOpenCommandPalette,
  pendingApprovalsCount,
}) => {
  const navItems = [
    {
      id: 'aaj' as NavigationTab,
      label: 'Aaj',
      icon: Home,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    {
      id: 'baat-cheet' as NavigationTab,
      label: 'Baat-cheet',
      icon: MessageSquare,
    },
    {
      id: 'kaam' as NavigationTab,
      label: 'Kaam',
      icon: CheckSquare,
    },
    {
      id: 'yaadasht' as NavigationTab,
      label: 'Yaadasht',
      icon: Brain,
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-16 h-full bg-[#0b1118] border-r border-[#1c2a38] flex flex-col items-center py-4 justify-between z-30 select-none">
      {/* App Branding / Logo */}
      <div className="flex flex-col items-center gap-6">
        <div
          onClick={() => onTabChange('aaj')}
          className="w-10 h-10 rounded-xl bg-[#111a24] border border-[#27d7e6]/40 flex items-center justify-center text-[#27d7e6] font-bold text-sm shadow-[0_0_12px_rgba(39,215,230,0.2)] cursor-pointer hover:border-[#27d7e6] transition-all"
          title="Muhib AI Desktop"
        >
          M
        </div>

        {/* 5 Navigation Icons */}
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative group w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#27d7e6]/15 text-[#27d7e6] border border-[#27d7e6]/40 shadow-[0_0_12px_rgba(39,215,230,0.25)]'
                    : 'text-[#8b9bab] hover:text-[#e6edf3] hover:bg-[#111a24]'
                }`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5 transition-transform group-hover:scale-105" />

                {/* Badge indicator if pending */}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff4d5e] text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}

                {/* Tooltip on hover */}
                <div className="absolute left-14 px-2.5 py-1 bg-[#111a24] border border-[#1c2a38] text-[#e6edf3] text-xs font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-lg z-50">
                  {item.label}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Quick Tools */}
      <div className="flex flex-col items-center gap-3">
        {/* Ctrl+K trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="w-10 h-10 rounded-lg text-[#8b9bab] hover:text-[#27d7e6] hover:bg-[#111a24] flex items-center justify-center cursor-pointer transition-colors group relative"
          title="Command Palette (Ctrl + K)"
        >
          <Command className="w-4 h-4" />
          <div className="absolute left-14 px-2 py-1 bg-[#111a24] border border-[#1c2a38] text-[#e6edf3] text-[10px] font-mono rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
            Ctrl + K
          </div>
        </button>

        {/* Live Status Indicator */}
        <div
          className="w-2.5 h-2.5 rounded-full bg-[#2ee59d] shadow-[0_0_8px_rgba(46,229,157,0.7)]"
          title="Agent Active & Connected"
        />
      </div>
    </aside>
  );
};
