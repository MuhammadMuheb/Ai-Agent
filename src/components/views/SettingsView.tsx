import React, { useState } from 'react';
import { Sliders, Volume2, ShieldCheck, History, Radio, Check, Globe, RefreshCw, Cpu } from 'lucide-react';
import { Card } from '../ui/Card.tsx';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { ActionLog, WebConnector } from '../../types/index.ts';

interface SettingsViewProps {
  logs: ActionLog[];
  connectors: WebConnector[];
  voiceAudioMuted: boolean;
  onToggleMute: () => void;
  onClearLogs: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  logs,
  connectors,
  voiceAudioMuted,
  onToggleMute,
  onClearLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'safety' | 'voice' | 'logs' | 'connectors'>('safety');

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1c2a38] pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-[#e6edf3]">Settings & Safety Guardrails</h2>
          <p className="text-xs text-[#8b9bab]">
            Audit logs, voice output preferences, aur tool security settings.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-[#0b1118] border border-[#1c2a38] rounded-lg p-1 gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'safety'
                ? 'bg-[#27d7e6] text-[#05080c] font-semibold'
                : 'text-[#8b9bab] hover:text-[#e6edf3]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Safety Rules
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'voice'
                ? 'bg-[#27d7e6] text-[#05080c] font-semibold'
                : 'text-[#8b9bab] hover:text-[#e6edf3]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            Voice & Awaaz
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-[#27d7e6] text-[#05080c] font-semibold'
                : 'text-[#8b9bab] hover:text-[#e6edf3]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Audit Logs ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('connectors')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'connectors'
                ? 'bg-[#27d7e6] text-[#05080c] font-semibold'
                : 'text-[#8b9bab] hover:text-[#e6edf3]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Connectors
          </button>
        </div>
      </div>

      {/* 1. Safety Guardrails Configuration */}
      {activeTab === 'safety' && (
        <div className="space-y-4">
          <Card className="space-y-4">
            <h3 className="text-base font-semibold text-[#e6edf3]">Approval Workflow & Guardrails</h3>
            <p className="text-xs text-[#8b9bab] leading-relaxed">
              Blueprint ke asool ke mutabiq khatarnak actions (Laal darja) hamesha ApprovalSheet par rukte hain. User ki manzoori ke baghair koi external packet nahi jata.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 bg-[#111a24] rounded-lg border border-[#1c2a38]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#e6edf3]">Laal Darja: BHEJ DO / BADLO / CANCEL Gate</span>
                    <Badge variant="laal" size="sm">ACTIVE</Badge>
                  </div>
                  <p className="text-xs text-[#8b9bab] mt-0.5">
                    Har external message ya deletion par bottom sheet show karein.
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-[#2ee59d]" />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#111a24] rounded-lg border border-[#1c2a38]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#e6edf3]">Siyah Darja: Permanent Financial & Secret Guard</span>
                    <Badge variant="neutral" size="sm">LOCKED</Badge>
                  </div>
                  <p className="text-xs text-[#8b9bab] mt-0.5">
                    Passkeys, payments, aur system files ka access code level par band hai.
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-[#2ee59d]" />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#111a24] rounded-lg border border-[#1c2a38]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#e6edf3]">Audit Trail Recording</span>
                    <Badge variant="cyan" size="sm">IMMUTABLE</Badge>
                  </div>
                  <p className="text-xs text-[#8b9bab] mt-0.5">
                    Har action disk par `agent_db.json` mein persist hota hai.
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-[#2ee59d]" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 2. Voice & Awaaz Settings */}
      {activeTab === 'voice' && (
        <div className="space-y-4">
          <Card className="space-y-4">
            <h3 className="text-base font-semibold text-[#e6edf3]">Voice (Kaan aur Zubaan) Preferences</h3>
            <p className="text-xs text-[#8b9bab]">
              Muhib AI ki aawaz aur microphone speech recognition settings.
            </p>

            <div className="flex items-center justify-between p-4 bg-[#111a24] rounded-lg border border-[#1c2a38]">
              <div>
                <span className="text-sm font-medium text-[#e6edf3]">Speech Audio Output (TTS)</span>
                <p className="text-xs text-[#8b9bab] mt-0.5">
                  Agent har jawab ko Roman Urdu mein bol kar sunaye ga.
                </p>
              </div>
              <Button
                variant={voiceAudioMuted ? 'secondary' : 'primary'}
                size="sm"
                onClick={onToggleMute}
              >
                {voiceAudioMuted ? 'Muted (Awaaz Band)' : 'Active (Bol raha hai)'}
              </Button>
            </div>

            <div className="p-4 bg-[#111a24] rounded-lg border border-[#1c2a38] space-y-2">
              <span className="text-sm font-medium text-[#e6edf3]">Preferred Neural Voice</span>
              <p className="text-xs text-[#8b9bab]">
                High fidelity Gemini Voice Engine: Kore / Natural Voice.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="cyan">Kore (Balanced Neural)</Badge>
                <Badge variant="neutral">Browser Speech Fallback</Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 3. Action Audit Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#e6edf3]">Action Audit Trail</h3>
              <p className="text-xs text-[#8b9bab]">
                Blueprint 5.4: Har kaam ka record (kya, kab, kyun, nateeja).
              </p>
            </div>
            <button
              onClick={onClearLogs}
              className="text-xs text-[#8b9bab] hover:text-[#ff4d5e] cursor-pointer"
            >
              Clear Logs
            </button>
          </div>

          <div className="space-y-2">
            {logs.length === 0 ? (
              <p className="text-xs text-[#8b9bab] py-8 text-center">Koi action log nahi hai.</p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-[#0b1118] border border-[#1c2a38] rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#e6edf3]">{log.action}</span>
                      <Badge
                        variant={
                          log.status === 'approved'
                            ? 'hara'
                            : log.status === 'denied'
                            ? 'laal'
                            : 'peela'
                        }
                        size="sm"
                      >
                        {log.status.toUpperCase()}
                      </Badge>
                    </div>
                    {log.details && (
                      <p className="text-xs text-[#8b9bab]">{log.details}</p>
                    )}
                  </div>
                  <span className="text-xs font-mono text-[#8b9bab] shrink-0">
                    {log.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. Connectors */}
      {activeTab === 'connectors' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-[#e6edf3]">Connected Tools & Services</h3>
            <p className="text-xs text-[#8b9bab]">
              Agent ke paas integrated tools ki list.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {connectors.slice(0, 9).map((conn) => (
              <Card key={conn.id} className="flex flex-col justify-between gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-[#e6edf3]">{conn.name}</span>
                    <Badge variant="hara" size="sm">CONNECTED</Badge>
                  </div>
                  <p className="text-xs text-[#8b9bab] line-clamp-2">{conn.description}</p>
                </div>
                <div className="text-[10px] font-mono text-[#8b9bab] pt-2 border-t border-[#1c2a38]">
                  Ping: {conn.lastPingMs || 30}ms
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
