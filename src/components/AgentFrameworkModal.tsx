import React, { useState, useEffect } from 'react';
import {
  X,
  Bot,
  Sparkles,
  Play,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Shield,
  MessageSquare,
  Leaf,
  Calendar,
  FileCode,
  RefreshCw,
  Copy,
  Check,
  Volume2
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects.ts';

interface AgentFrameworkModalProps {
  onClose: () => void;
  onSpeakText?: (text: string) => void;
}

export const AgentFrameworkModal: React.FC<AgentFrameworkModalProps> = ({
  onClose,
  onSpeakText,
}) => {
  const [activeTab, setActiveTab] = useState<'swarm' | 'runner' | 'pipeline'>('runner');
  const [frameworkData, setFrameworkData] = useState<any>(null);
  const [missionGoal, setMissionGoal] = useState(
    'Boss ka WhatsApp update check karo, Sir Imran ki dark theme memory read karo, aur ek polite concise draft reply banao.'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [executionTrace, setExecutionTrace] = useState<any>(null);
  const [copiedResult, setCopiedResult] = useState(false);

  useEffect(() => {
    fetch('/api/agent/framework')
      .then((res) => res.json())
      .then((data) => setFrameworkData(data))
      .catch((err) => console.error('Failed to load agent framework:', err));
  }, []);

  const sampleMissions = [
    {
      title: 'Boss Update & Reply Workflow',
      goal: 'Boss ka WhatsApp update check karo, Sir Imran ki dark theme memory read karo, aur ek polite concise draft reply banao.',
      icon: MessageSquare,
      color: 'cyan',
    },
    {
      title: 'Plant Health & Balcony Checkup',
      goal: 'Balcony ke Monstera aur Snake plant ki care review karo, pani ka schedule check karo aur task list mein add karo.',
      icon: Leaf,
      color: 'emerald',
    },
    {
      title: 'Daily Briefing & Task Scheduling',
      goal: 'Subah ka poora briefing plan banao, pending deadlines highlight karo, aur 45 minute focus session schedule karo.',
      icon: Calendar,
      color: 'amber',
    },
    {
      title: 'Claude/Gemini Website Brief Generator',
      goal: 'Sir Imran ki website requirements par technical brief.md aur ready prompt assemble karo.',
      icon: FileCode,
      color: 'purple',
    },
  ];

  const handleRunMission = async (customGoal?: string) => {
    const goalToRun = customGoal || missionGoal;
    if (!goalToRun.trim()) return;

    setIsRunning(true);
    setExecutionTrace(null);
    soundFX.playWakeChime();

    try {
      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goalToRun }),
      });
      const data = await res.json();
      setExecutionTrace(data);
      soundFX.playSuccess();
    } catch (err: any) {
      setExecutionTrace({
        goal: goalToRun,
        error: err.message,
        finalOutput: 'Agent framework mission execution mein masla aya.',
      });
      soundFX.playAlert();
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    if (executionTrace?.finalOutput) {
      navigator.clipboard.writeText(executionTrace.finalOutput);
      setCopiedResult(true);
      soundFX.playSuccess();
      setTimeout(() => setCopiedResult(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="sci-border bg-[#050b12] border-cyan-500/40 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-[0_0_35px_rgba(39,215,230,0.25)]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-cyan-500/20 bg-[#081522] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#27d7e6] animate-pulse" />
            <h2 className="font-mono text-sm font-bold text-white tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              MUHIB AUTONOMOUS AGENT FRAMEWORK (REACT SWARM)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                v2.0 AUTONOMOUS
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-cyan-950/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-cyan-500/20 bg-[#061019] px-4 gap-2">
          <button
            onClick={() => setActiveTab('runner')}
            className={`font-mono text-xs py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'runner'
                ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            AUTONOMOUS MISSION RUNNER
          </button>

          <button
            onClick={() => setActiveTab('swarm')}
            className={`font-mono text-xs py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'swarm'
                ? 'border-emerald-400 text-emerald-300 font-bold bg-emerald-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            AGENT SWARM TOPOLOGY ({frameworkData?.agents?.length || 6})
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`font-mono text-xs py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'pipeline'
                ? 'border-amber-400 text-amber-300 font-bold bg-amber-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            REACT PIPELINE ARCHITECTURE
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'runner' && (
            <div className="space-y-4">
              {/* Mission Selection & Input */}
              <div className="bg-[#07131f] p-4 rounded-xl border border-cyan-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    AUTONOMOUS GOAL / MISSION STATEMENT:
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Muhib Core Multi-Agent Loop
                  </span>
                </div>

                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={missionGoal}
                    onChange={(e) => setMissionGoal(e.target.value)}
                    placeholder="Apna mission yahan likhein (e.g. Boss ka message check karo, draft banao aur plan mein add karo)..."
                    className="flex-1 text-xs bg-black/50 border border-cyan-500/30 rounded-lg p-2.5 text-white font-sans focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => handleRunMission()}
                    disabled={isRunning}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(39,215,230,0.3)] disabled:opacity-50 shrink-0"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Swarm Soch Raha Hai...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Launch Mission</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    ● YA TEST MISSIONS CHUNEIN:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sampleMissions.map((m, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setMissionGoal(m.goal);
                          handleRunMission(m.goal);
                        }}
                        className="text-left p-2.5 rounded-lg bg-[#0a1827] hover:bg-[#0e243a] border border-cyan-500/15 hover:border-cyan-400/40 transition flex items-center gap-2.5 group"
                      >
                        <m.icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition shrink-0" />
                        <div className="overflow-hidden">
                          <div className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 truncate">
                            {m.title}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {m.goal}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Execution Trace Waterfall */}
              {executionTrace && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      REACT MULTI-AGENT EXECUTION TRACE:
                    </span>
                    <div className="flex gap-1.5">
                      {executionTrace.subAgentsInvolved?.map((agentName: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30"
                        >
                          {agentName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sequential Steps */}
                  <div className="space-y-2.5">
                    {executionTrace.steps?.map((step: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#081726] border border-cyan-500/20 flex flex-col space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-cyan-300 font-bold flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[11px] border border-cyan-500/40">
                              {step.step || idx + 1}
                            </span>
                            Agent: <span className="text-emerald-300">{step.agent}</span>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 uppercase">
                            Action: {step.action}
                          </span>
                        </div>

                        {/* Thought */}
                        <div className="text-xs font-sans text-slate-300 bg-black/40 p-2 rounded-lg border border-cyan-500/10">
                          <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-0.5">
                            THOUGHT (SOCH):
                          </span>
                          {step.thought}
                        </div>

                        {/* Observation */}
                        {step.observation && (
                          <div className="text-xs font-sans text-emerald-200 bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/20">
                            <span className="text-[10px] font-mono font-bold text-emerald-400 block mb-0.5">
                              OBSERVATION (MUSHAHIDA):
                            </span>
                            {step.observation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Final Consolidated Output */}
                  <div className="bg-[#0b1f30] p-4 rounded-xl border border-emerald-500/40 shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        FINAL SYNTHESIS (ROMAN URDU):
                      </span>
                      <div className="flex gap-2">
                        {onSpeakText && (
                          <button
                            onClick={() => onSpeakText(executionTrace.finalOutput)}
                            className="text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30"
                          >
                            <Volume2 className="w-3 h-3" />
                            Awaaz Mein Sunno
                          </button>
                        )}
                        <button
                          onClick={handleCopy}
                          className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500 text-black hover:bg-emerald-400 transition flex items-center gap-1"
                        >
                          {copiedResult ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedResult ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-sans text-slate-100 leading-relaxed whitespace-pre-wrap">
                      {executionTrace.finalOutput}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'swarm' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {frameworkData?.agents?.map((agent: any) => (
                <div
                  key={agent.id}
                  className="p-3.5 rounded-xl bg-[#07131f] border border-cyan-500/20 hover:border-cyan-400/50 transition flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-cyan-400" />
                        {agent.name}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#2ee59d]" />
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400/90 block mb-2">
                      {agent.role}
                    </span>

                    <div className="text-[10px] font-mono text-slate-400 mb-2">
                      Model: <span className="text-slate-200">{agent.model}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">
                        Capabilities:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities?.map((cap: string, i: number) => (
                          <span
                            key={i}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-300 border border-cyan-500/20"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                    <span>Status: ACTIVE</span>
                    <span className="text-slate-500">Autonomous</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="max-w-2xl mx-auto space-y-4 py-3">
              <div className="bg-[#07131f] p-4 rounded-xl border border-cyan-500/30 space-y-3">
                <h3 className="font-mono text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  REACT AUTONOMOUS EXECUTION ENGINE
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Muhib AI ka Agent Framework ReAct (Reasoning + Acting) pattern par mabni hai. Jab aap koi goal dete hain, to Orchestrator use multi-step loop mein execute karta hai:
                </p>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#0a1826] border border-cyan-500/20 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">1</span>
                    <div>
                      <span className="text-cyan-300 font-bold">Goal Decomposition &amp; Routing:</span>
                      <p className="text-[11px] text-slate-400 font-sans">Orchestrator goal ko chhotay sub-tasks mein baantta hai.</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0a1826] border border-cyan-500/20 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">2</span>
                    <div>
                      <span className="text-amber-300 font-bold">Sub-Agent Dispatch &amp; Action:</span>
                      <p className="text-[11px] text-slate-400 font-sans">Relevant sub-agent MCP tools call karke data gather karta hai.</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0a1826] border border-cyan-500/20 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">3</span>
                    <div>
                      <span className="text-emerald-300 font-bold">Observation &amp; Safety Audit:</span>
                      <p className="text-[11px] text-slate-400 font-sans">Tool results verify hoti hain aur Security Guard permission check karta hai.</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0a1826] border border-cyan-500/20 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">4</span>
                    <div>
                      <span className="text-purple-300 font-bold">Synthesis &amp; Roman Urdu Delivery:</span>
                      <p className="text-[11px] text-slate-400 font-sans">Muhib ko final aawaz aur text summary deliver ki jaati hai.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
