import React, { useState } from 'react';
import {
  Globe,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Cpu,
  ArrowRight,
  Clock,
  Play,
  Plus,
  Search,
  Check,
  Bot,
  Zap,
  TrendingUp,
  CheckSquare,
  Flame,
  Star,
  SunMedium,
  RotateCw
} from 'lucide-react';
import { NavigationTab, WebConnector, ExecutiveTask, LifeWorkflow } from '../types/index.ts';
import { soundFX } from '../utils/soundEffects.ts';

interface ExecutiveDashboardProps {
  onNavigate: (tab: NavigationTab) => void;
  connectors: WebConnector[];
  tasks: ExecutiveTask[];
  workflows: LifeWorkflow[];
  onRunWorkflow: (workflow: LifeWorkflow) => Promise<void>;
  runningWorkflowId: string | null;
  onAddTask?: (task: ExecutiveTask) => void;
  onToggleTask?: (id: string) => void;
  onDecomposeTask?: (id: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onNavigate,
  connectors,
  tasks,
  workflows,
  onRunWorkflow,
  runningWorkflowId,
  onAddTask,
  onToggleTask,
  onDecomposeTask,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const favoriteConnectors = connectors.filter((c) => c.isFavorite).slice(0, 8);
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    const lower = quickInput.toLowerCase();
    if (lower.startsWith('add task') || lower.startsWith('remind me')) {
      const title = quickInput.replace(/^(add task|remind me to)\s*/i, '').trim();
      if (title && onAddTask) {
        onAddTask({
          id: `task-${Date.now()}`,
          title,
          priority: 'high',
          category: 'work',
          completed: false,
          dueDate: 'Today',
          subtasks: [],
        });
        soundFX.playSuccess();
        setQuickInput('');
        return;
      }
    }
    onNavigate('agentic-mission');
  };

  const handleCreateInlineTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !onAddTask) return;
    onAddTask({
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      priority: 'high',
      category: 'work',
      completed: false,
      dueDate: 'Today',
      subtasks: [],
    });
    soundFX.playSuccess();
    setNewTaskTitle('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Delightful Executive Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#131d36] via-[#1a2646] to-[#121c33] border border-white/10 p-6 sm:p-8 shadow-xl shadow-black/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Executive Workspace
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-300">Muheb</span>
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your day is fully aligned. {connectors.length} web portals connected, {tasks.filter((t) => !t.completed).length} pending priorities, and 4 autonomous life workflows standing by.
            </p>
          </div>

          {/* Quick Stat Pill Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <button
              onClick={() => onNavigate('web-hub')}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition group cursor-pointer"
            >
              <div className="text-[11px] font-semibold text-sky-400 flex items-center gap-1 mb-1">
                <Globe className="w-3.5 h-3.5" /> Web Hub
              </div>
              <div className="text-xl font-bold text-white group-hover:text-sky-300 transition">
                {connectors.length}
              </div>
              <div className="text-[11px] text-slate-400">5,000+ Ready</div>
            </button>

            <button
              onClick={() => onNavigate('life-ops')}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition group cursor-pointer"
            >
              <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mb-1">
                <CheckSquare className="w-3.5 h-3.5" /> Priorities
              </div>
              <div className="text-xl font-bold text-white group-hover:text-emerald-300 transition">
                {tasks.filter((t) => !t.completed).length}
              </div>
              <div className="text-[11px] text-slate-400">{progressPercent}% Done</div>
            </button>

            <button
              onClick={() => onNavigate('agentic-mission')}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition group cursor-pointer col-span-2 sm:col-span-1"
            >
              <div className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1 mb-1">
                <Bot className="w-3.5 h-3.5" /> Agent Core
              </div>
              <div className="text-xl font-bold text-white group-hover:text-indigo-300 transition">
                4 Active
              </div>
              <div className="text-[11px] text-slate-400">Step 3 Engine</div>
            </button>
          </div>
        </div>
      </div>

      {/* Spotlight Omni-Action Bar */}
      <div className="relative">
        <form
          onSubmit={handleQuickSubmit}
          className="relative flex items-center bg-[#131b2e] border-2 border-white/10 focus-within:border-blue-500 rounded-2xl px-5 py-4 shadow-lg shadow-black/20 transition-all"
        >
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Type anything: 'add task Call Client', 'audit web connectors', 'conduct research'..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="ml-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer shadow-md shadow-blue-500/25 shrink-0"
          >
            <span>Execute</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Action Shortcut Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 px-1">
          <span className="text-xs font-semibold text-slate-400">Quick Actions:</span>
          <button
            onClick={() => onNavigate('agentic-mission')}
            className="px-3 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-sky-300 text-xs font-medium border border-blue-500/25 transition cursor-pointer"
          >
            ⚡ Run Autonomous Mission
          </button>
          <button
            onClick={() => onNavigate('web-hub')}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 transition cursor-pointer"
          >
            🌐 Connect New Website
          </button>
          <button
            onClick={() => onNavigate('research')}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 transition cursor-pointer"
          >
            🔍 Deep Research
          </button>
          <button
            onClick={() => {
              const morningWf = workflows.find((w) => w.id === 'wf-morning');
              if (morningWf) onRunWorkflow(morningWf);
            }}
            className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/25 transition cursor-pointer"
          >
            ☕ Morning Executive Brief
          </button>
        </div>
      </div>

      {/* Main Grid: Priorities & Life Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Tasks Card */}
        <div className="rounded-3xl bg-[#11182a]/90 border border-white/10 p-6 space-y-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Today's Executive Priorities</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {completedCount} of {tasks.length} tasks completed ({progressPercent}%)
              </p>
            </div>
            <button
              onClick={() => onNavigate('life-ops')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Inline Add Task Input */}
          <form onSubmit={handleCreateInlineTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="+ Add a new priority task for today..."
              className="flex-1 bg-[#17223b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold transition cursor-pointer"
            >
              Add
            </button>
          </form>

          {/* Tasks List */}
          <div className="space-y-3">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all duration-200 ${
                  task.completed
                    ? 'bg-white/[0.02] border-white/5 opacity-60'
                    : 'bg-[#152037] border-white/10 hover:border-blue-500/40 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => onToggleTask?.(task.id)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 transition cursor-pointer shrink-0 ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'border-slate-600 hover:border-emerald-400 bg-white/5'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div className="flex-1">
                      <span
                        className={`text-xs sm:text-sm font-semibold block leading-snug ${
                          task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className={`font-semibold ${task.priority === 'urgent' ? 'text-rose-400' : 'text-amber-400'}`}>
                          {task.priority?.toUpperCase()}
                        </span>
                        <span>·</span>
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Decompose Button */}
                  {!task.completed && (!task.subtasks || task.subtasks.length === 0) && (
                    <button
                      onClick={() => onDecomposeTask?.(task.id)}
                      className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-sky-300 border border-blue-500/25 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer shrink-0"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Break Down</span>
                    </button>
                  )}
                </div>

                {/* Subtasks if decomposed */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-3 pl-8 pt-2 border-t border-white/5 space-y-1.5">
                    {task.subtasks.map((st) => (
                      <div key={st.id} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        <span>{st.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Autonomous Life Operations Workflows */}
        <div className="rounded-3xl bg-[#11182a]/90 border border-white/10 p-6 space-y-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Autonomous Life Operations</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated routines that run personal & work operations
              </p>
            </div>
            <button
              onClick={() => onNavigate('life-ops')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {workflows.map((wf) => {
              const isRunning = runningWorkflowId === wf.id;
              return (
                <div
                  key={wf.id}
                  className="p-4 rounded-2xl bg-[#152037] border border-white/10 hover:border-blue-500/40 transition-all duration-200 flex items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-sky-300 transition">
                      {wf.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                      {wf.description}
                    </p>
                    <div className="text-[10px] text-slate-500 font-medium pt-0.5">
                      {wf.schedule} · {wf.automatedSteps.length} automated steps
                    </div>
                  </div>

                  <button
                    onClick={() => onRunWorkflow(wf)}
                    disabled={isRunning}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 shadow-sm ${
                      isRunning
                        ? 'bg-blue-600/30 text-sky-300 border border-blue-500/50'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Routine</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Frequently Used Web Connectors (5,000+ Gateway) */}
      <div className="rounded-3xl bg-[#11182a]/90 border border-white/10 p-6 space-y-5 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Universal Web Hub · Fast Launch</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant 1-click access to your top connected tools and platforms ({connectors.length} in catalog)
            </p>
          </div>
          <button
            onClick={() => onNavigate('web-hub')}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View all 5,000+</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {favoriteConnectors.map((c) => (
            <a
              key={c.id}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-[#152037] hover:bg-[#1a2846] border border-white/10 hover:border-sky-500/40 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sky-400 font-bold text-xs group-hover:scale-105 transition">
                  {c.name.charAt(0)}
                </div>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-sky-400 transition" />
              </div>
              <div className="mt-3">
                <div className="text-xs font-bold text-white group-hover:text-sky-300 transition truncate">
                  {c.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {c.category}
                </div>
              </div>
            </a>
          ))}

          {/* Add New Portal Card */}
          <button
            onClick={() => onNavigate('web-hub')}
            className="p-3.5 rounded-2xl border-2 border-dashed border-white/15 hover:border-sky-500/40 hover:bg-white/5 transition flex flex-col items-center justify-center text-center cursor-pointer min-h-[96px] group"
          >
            <Plus className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition mb-1" />
            <span className="text-xs font-semibold text-slate-300 group-hover:text-sky-300 transition">
              + Connect Website
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
