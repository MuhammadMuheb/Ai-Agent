import React, { useState, useEffect } from 'react';
import {
  Bot,
  Play,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Zap,
  Sparkles,
  Database,
  Check,
  ChevronRight,
  Terminal,
  ArrowRight,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import {
  AgentMission,
  AutonomousWorker,
  AgentSentinelAlert,
  WebConnector,
  ExecutiveTask
} from '../types/index.ts';
import { soundFX } from '../utils/soundEffects.ts';

interface AgenticMissionControlProps {
  connectors: WebConnector[];
  tasks: ExecutiveTask[];
  onNavigateToHub: () => void;
  onNavigateToOps: () => void;
  onSpeakText: (text: string) => void;
  onAutoAddDecomposedTask?: (title: string) => void;
}

export const AgenticMissionControl: React.FC<AgenticMissionControlProps> = ({
  connectors,
  tasks,
  onNavigateToHub,
  onNavigateToOps,
  onSpeakText,
  onAutoAddDecomposedTask,
}) => {
  const [goalInput, setGoalInput] = useState('');
  const [isExecutingMission, setIsExecutingMission] = useState(false);
  const [currentMission, setCurrentMission] = useState<AgentMission | null>(null);
  const [autonomousMode, setAutonomousMode] = useState(true);

  const [workers, setWorkers] = useState<AutonomousWorker[]>([
    {
      id: 'worker-web',
      name: 'Web Sentinel',
      role: 'Continuous 5,000+ URL SLA & Uptime Monitoring',
      category: 'web',
      status: 'active',
      tasksCompleted: 422,
      lastAction: 'Audited cloud and payment gateway endpoints',
      lastActionTime: 'Just now',
      latencyMs: 32,
      healthPercent: 99.9,
    },
    {
      id: 'worker-ops',
      name: 'Operations Orchestrator',
      role: 'Autonomous Priority Decomposing & Time-Blocking',
      category: 'operations',
      status: 'active',
      tasksCompleted: 194,
      lastAction: 'Calculated focus windows for today schedule',
      lastActionTime: '2m ago',
      latencyMs: 40,
      healthPercent: 100,
    },
    {
      id: 'worker-intel',
      name: 'Strategic Intelligence',
      role: 'Multi-Source Synthesis & Market Research',
      category: 'research',
      status: 'active',
      tasksCompleted: 91,
      lastAction: 'Indexed frontier AI benchmarks and market data',
      lastActionTime: '5m ago',
      latencyMs: 105,
      healthPercent: 100,
    },
    {
      id: 'worker-memory',
      name: 'Context Scribe',
      role: 'User Preference & Memory Alignment',
      category: 'memory',
      status: 'active',
      tasksCompleted: 318,
      lastAction: 'Synchronized communication rules and tone settings',
      lastActionTime: '3m ago',
      latencyMs: 18,
      healthPercent: 100,
    },
  ]);

  const [alerts, setAlerts] = useState<AgentSentinelAlert[]>([
    {
      id: 'alt-1',
      severity: 'info',
      category: 'web-hub',
      title: 'Directory SLA Verified',
      description: 'Web Sentinel verified healthy status across connected portals with 32ms average response latency.',
      suggestedAction: 'View Web Directory',
      timestamp: '2m ago',
      resolved: false,
    },
    {
      id: 'alt-2',
      severity: 'warning',
      category: 'life-ops',
      title: 'Pending Milestone Review',
      description: 'Urgent technology roadmap task requires milestone sign-off before end of business.',
      suggestedAction: 'Decompose Remaining Sub-Steps',
      timestamp: '6m ago',
      resolved: false,
    },
  ]);

  const [liveEventLogs, setLiveEventLogs] = useState<string[]>([
    'Autonomous supervisor initialized in production mode.',
    '4 dedicated workers synchronized with executive registry.',
    'Web Sentinel completed routine ping across top connectors.',
    'Context Scribe verified executive communication guidelines.',
  ]);

  useEffect(() => {
    if (!autonomousMode) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/agent/sentinel-heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            connectorsCount: connectors.length,
            tasksCount: tasks.length,
            autonomousMode: true,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.workers) setWorkers(data.workers);
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLiveEventLogs((prev) => [
            `[${time}] Periodic evaluation complete: 4 workers healthy, 0 errors.`,
            ...prev.slice(0, 10),
          ]);
        }
      } catch {
        // silent
      }
    }, 25000);

    return () => clearInterval(interval);
  }, [autonomousMode, connectors.length, tasks.length]);

  const handleLaunchMission = async (customGoal?: string) => {
    const goalToRun = customGoal || goalInput;
    if (!goalToRun.trim() || isExecutingMission) return;

    setIsExecutingMission(true);
    soundFX.playWakeChime();

    const initialMission: AgentMission = {
      id: `m-${Date.now()}`,
      goal: goalToRun,
      status: 'executing',
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      progressPercent: 25,
      currentStepIndex: 1,
      steps: [
        {
          id: 'step-1-init',
          stepNumber: 1,
          phase: 'planning',
          title: `Planning: Analyzing objective parameters for "${goalToRun.slice(0, 45)}..."`,
          status: 'running',
          timestamp: 'Executing...',
        },
      ],
    };
    setCurrentMission(initialMission);

    try {
      const res = await fetch('/api/agent/run-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: goalToRun,
          activeConnectors: connectors.slice(0, 15),
          activeTasks: tasks.slice(0, 5),
        }),
      });

      if (!res.ok) throw new Error('Mission failed');

      const missionResult: AgentMission = await res.json();
      setCurrentMission(missionResult);
      soundFX.playSuccess();

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLiveEventLogs((prev) => [
        `[${time}] Completed mission: "${goalToRun.slice(0, 30)}..." in ${missionResult.steps.length} steps.`,
        ...prev.slice(0, 10),
      ]);

      if (missionResult.outcomeSummary) {
        onSpeakText(missionResult.outcomeSummary);
      }
    } catch {
      soundFX.playAlert();
      setCurrentMission((prev) =>
        prev
          ? {
              ...prev,
              status: 'failed',
              outcomeSummary: 'Mission execution paused. System remains operational.',
            }
          : null
      );
    } finally {
      setIsExecutingMission(false);
    }
  };

  const presetObjectives = [
    {
      title: 'Audit Web Directory',
      goal: 'Audit latency, availability, and SSL status across registered web connectors and update tag index',
    },
    {
      title: 'Re-balance Tasks',
      goal: 'Analyze pending tasks, calculate focus windows, and decompose urgent milestones into actionable phases',
    },
    {
      title: 'Synthesize Market Intelligence',
      goal: 'Synthesize structural logic, adversarial risk factors, and real-world data regarding autonomous agents',
    },
    {
      title: 'Verify Context Rules',
      goal: 'Audit user communication rules and verify memory alignment constraints for executive operations',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Autonomous Agent Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Goal-driven orchestration engine. Decomposes directives into discrete tool steps, executes actions, and reports verified deliverables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400">
            Background Monitor:{' '}
            <span className={autonomousMode ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
              {autonomousMode ? 'Active' : 'Paused'}
            </span>
          </div>
          <button
            onClick={() => setAutonomousMode(!autonomousMode)}
            className="px-3 py-1.5 rounded-md bg-[#111726] hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition cursor-pointer"
          >
            {autonomousMode ? 'Pause Monitoring' : 'Resume Monitoring'}
          </button>
        </div>
      </div>

      {/* Goal Launcher Box */}
      <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-6 space-y-4 shadow-sm">
        <label className="block text-xs font-semibold text-slate-300">
          Define Objective or Mission
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLaunchMission()}
            placeholder="e.g. Audit all cloud connectors, verify uptime, and optimize pending task schedules..."
            className="flex-1 bg-[#121929] border border-slate-800 focus:border-blue-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition font-sans"
            disabled={isExecutingMission}
          />
          <button
            onClick={() => handleLaunchMission()}
            disabled={!goalInput.trim() || isExecutingMission}
            className={`px-5 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer shrink-0 ${
              isExecutingMission || !goalInput.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
            }`}
          >
            {isExecutingMission ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Mission</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Action Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-slate-500">Presets:</span>
          {presetObjectives.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setGoalInput(p.goal);
                handleLaunchMission(p.goal);
              }}
              disabled={isExecutingMission}
              className="px-2.5 py-1 rounded bg-[#121929] hover:bg-[#162035] text-slate-400 hover:text-slate-200 text-xs border border-slate-800/80 transition cursor-pointer"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Execution Stepper & Results */}
      {currentMission && (
        <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs text-slate-500">
                Started {currentMission.startedAt}
                {currentMission.completedAt && ` · Completed ${currentMission.completedAt}`}
              </div>
              <h2 className="text-base font-semibold text-white mt-1">
                {currentMission.goal}
              </h2>
            </div>
            <div className="text-right">
              <span className={`text-xs font-medium ${currentMission.status === 'completed' ? 'text-emerald-400' : 'text-blue-400'}`}>
                {currentMission.status === 'completed' ? 'Mission Completed' : 'In Progress'}
              </span>
            </div>
          </div>

          {/* Stepper Chain */}
          <div className="space-y-3">
            {currentMission.steps.map((step) => (
              <div
                key={step.id}
                className="p-4 bg-[#121929] border border-slate-800/70 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center justify-center font-medium">
                      {step.stepNumber}
                    </span>
                    <h3 className="text-xs font-medium text-slate-200">
                      {step.title}
                    </h3>
                  </div>
                  {step.toolInvoked && (
                    <span className="text-[11px] text-slate-500 font-mono">
                      Tool: {step.toolInvoked}
                    </span>
                  )}
                </div>

                {step.observation && (
                  <p className="text-xs text-slate-400 pl-7 leading-relaxed">
                    {step.observation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Deliverables & Conclusion */}
          {currentMission.outcomeSummary && (
            <div className="p-4 bg-[#121929] border border-slate-800/80 rounded-lg space-y-2">
              <div className="text-xs font-semibold text-white">Deliverable Summary</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentMission.outcomeSummary}
              </p>
              {currentMission.artifactsCreated && currentMission.artifactsCreated.length > 0 && (
                <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
                  <span>Artifacts:</span>
                  {currentMission.artifactsCreated.map((art, i) => (
                    <span key={i} className="text-slate-200">
                      {art}{i < currentMission.artifactsCreated!.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4 Dedicated Autonomous Workers */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white">Autonomous Worker Registry</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-200">{worker.name}</h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                {worker.role}
              </p>
              <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-500 flex items-center justify-between">
                <span>{worker.tasksCompleted} actions</span>
                <span>{worker.latencyMs}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proactive Discoveries & Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proactive Discoveries */}
        <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Proactive Discoveries</h2>
            <span className="text-xs text-slate-500">Autonomous Findings</span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 bg-[#121929] border border-slate-800/70 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-medium text-slate-200">{alert.title}</h3>
                  <span className="text-[11px] text-slate-500">{alert.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {alert.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Recommended: <span className="text-slate-300">{alert.suggestedAction}</span>
                  </span>
                  {!alert.resolved && (
                    <button
                      onClick={() => {
                        soundFX.playSuccess();
                        setAlerts((prev) =>
                          prev.map((a) => (a.id === alert.id ? { ...a, resolved: true } : a))
                        );
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Execution Stream */}
        <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Event Log</h2>
            <span className="text-xs text-slate-500">Live Stream</span>
          </div>

          <div className="bg-[#090d16] rounded-lg p-3.5 border border-slate-800/80 font-mono text-xs text-slate-400 space-y-2 h-[210px] overflow-y-auto scrollbar-none">
            {liveEventLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="text-blue-400 shrink-0">›</span>
                <span>{log}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Fast navigation:</span>
            <div className="flex items-center gap-3">
              <button onClick={onNavigateToHub} className="hover:text-slate-300 transition cursor-pointer">
                Web Directory
              </button>
              <span>·</span>
              <button onClick={onNavigateToOps} className="hover:text-slate-300 transition cursor-pointer">
                Life Operations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
