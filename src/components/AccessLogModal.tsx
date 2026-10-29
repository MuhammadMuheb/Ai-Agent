import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, Clock, AlertTriangle, Send } from 'lucide-react';
import { ActionLog } from '../types/index.ts';

interface AccessLogModalProps {
  logs: ActionLog[];
  onClose: () => void;
  onSimulateApproval: (approved: boolean) => void;
}

export const AccessLogModal: React.FC<AccessLogModalProps> = ({
  logs,
  onClose,
  onSimulateApproval,
}) => {
  const [accessSettings, setAccessSettings] = useState([
    { id: 'a1', label: 'Messages padhna', enabled: true, color: 'emerald' },
    { id: 'a2', label: 'Message bhejna (Poochh kar approval)', enabled: true, color: 'cyan' },
    { id: 'a3', label: 'Plant & Vision Diagnostics', enabled: true, color: 'emerald' },
    { id: 'a4', label: 'Files kholna (Allowed folders)', enabled: true, color: 'cyan' },
    { id: 'a5', label: 'Files delete karna', enabled: false, color: 'rose' },
    { id: 'a6', label: 'Browser chalana (Playwright)', enabled: false, color: 'rose' },
    { id: 'a7', label: 'Paisa / payment transactions', enabled: false, color: 'rose' },
  ]);

  const [showApprovalPrompt, setShowApprovalPrompt] = useState(true);

  const toggleAccess = (id: string) => {
    setAccessSettings((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
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
              SCREEN 4: ACCESS &amp; APPROVAL AUDIT LOG
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-cyan-950/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left: ACCESS PERMISSIONS */}
          <div className="p-4 border-r border-cyan-500/20 bg-[#061019] overflow-y-auto space-y-4">
            <div>
              <h3 className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
                ACCESS (KAHAN TAK JA SAKTA HAI)
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Khatarnaak kaam ke liye hamesha tumhari 'haan' zaroori hai. Delete, browser aur payment shuru mein band rahenge.
              </p>
            </div>

            <div className="space-y-2">
              {accessSettings.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-[#0a1725] border border-cyan-500/15 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.enabled
                          ? item.color === 'emerald'
                            ? 'bg-emerald-400'
                            : 'bg-cyan-400'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span className="text-xs font-mono text-slate-200">{item.label}</span>
                  </div>
                  <button
                    onClick={() => toggleAccess(item.id)}
                    className={`w-9 h-5 rounded-full p-0.5 transition flex items-center ${
                      item.enabled ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              ))}
            </div>

            {/* Approval Demo Banner */}
            {showApprovalPrompt && (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 shadow-[0_0_15px_rgba(245,184,61,0.2)]">
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  POOCHNA ZAROORI HAI:
                </div>
                <p className="text-xs text-slate-200 mb-2 italic">
                  Agent boss ko ye message bhejna chahta hai:
                  <span className="block text-amber-200 font-mono text-[11px] mt-1 bg-black/40 p-1.5 rounded">
                    "Ji sir, 6 baje tak website design bhej doonga."
                  </span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onSimulateApproval(true);
                      setShowApprovalPrompt(false);
                    }}
                    className="text-xs font-mono px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    HAAN! BHEJO
                  </button>
                  <button
                    onClick={() => {
                      onSimulateApproval(false);
                      setShowApprovalPrompt(false);
                    }}
                    className="text-xs font-mono px-3 py-1 rounded bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-500/40"
                  >
                    NAHI (ROK DO)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: ACTION AUDIT LOGS */}
          <div className="p-4 bg-[#081421] overflow-y-auto flex flex-col space-y-3">
            <div>
              <h3 className="font-mono text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                KAAM KI TAREEKH (AUDIT LOGS)
              </h3>
              <p className="text-[11px] text-slate-400">
                Agent ke har action ka mukammal record yahan mehfooz hota hai.
              </p>
            </div>

            <div className="space-y-2 flex-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-[#0b1c2b] border border-cyan-500/20 text-xs font-mono flex items-start justify-between"
                >
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-white font-semibold">{log.action}</div>
                      {log.details && (
                        <div className="text-[10px] text-slate-400">{log.details}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] text-slate-400">{log.time}</span>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                        log.status === 'approved' || log.status === 'sent'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : log.status === 'denied'
                          ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                          : 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
