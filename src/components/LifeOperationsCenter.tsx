import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Play,
  Zap,
  Calendar,
  Clock,
  Sparkles,
  Shield,
  Briefcase,
  Heart,
  DollarSign,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Trash2,
  AlertCircle,
  Check,
  RefreshCw,
} from 'lucide-react';
import { ExecutiveTask, LifeWorkflow } from '../types/index.ts';
import { soundFX } from '../utils/soundEffects.ts';

interface LifeOperationsCenterProps {
  tasks: ExecutiveTask[];
  onAddTask: (task: ExecutiveTask) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onDecomposeTask: (taskId: string) => void;
  workflows: LifeWorkflow[];
  onRunWorkflow: (workflow: LifeWorkflow) => Promise<void>;
  runningWorkflowId: string | null;
}

export const LifeOperationsCenter: React.FC<LifeOperationsCenterProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onDecomposeTask,
  workflows,
  onRunWorkflow,
  runningWorkflowId,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'workflows' | 'schedule'>('tasks');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<ExecutiveTask['priority']>('high');
  const [newTaskCategory, setNewTaskCategory] = useState<ExecutiveTask['category']>('work');
  const [selectedWorkflowResult, setSelectedWorkflowResult] = useState<any | null>(null);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: ExecutiveTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      category: newTaskCategory,
      completed: false,
      dueDate: 'Today',
      subtasks: [],
      aiRecommendation: 'High-impact focus item. Recommended to complete in early morning block.',
    };

    onAddTask(task);
    soundFX.playSuccess();
    setNewTaskTitle('');
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 100;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0d1627]/95 to-slate-900/90 border border-cyan-500/20 p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-cyan-400" />
                AUTONOMOUS LIFE & WORK OPERATIONS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {completionPercentage}% SYNCHRONIZED
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Life Operations & Execution Center
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Orchestrate your entire daily agenda, priorities, automated routines, communications, and personal milestones. Engineered to make your full life effortless through intelligent agent delegation.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Priority Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('workflows')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'workflows'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Autonomous Routines ({workflows.length})
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Task List & Quick Adder */}
          <div className="lg:col-span-2 space-y-4">
            {/* Quick Add Form */}
            <form
              onSubmit={handleCreateTask}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new executive task or life responsibility..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs tracking-wide shadow-md shadow-cyan-500/20 disabled:opacity-40 transition cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">Priority:</span>
                  {(['urgent', 'high', 'medium', 'low'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition cursor-pointer ${
                        newTaskPriority === p
                          ? p === 'urgent'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold'
                            : p === 'high'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                          : 'bg-slate-950 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">Category:</span>
                  {(['work', 'life', 'finance', 'learning'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewTaskCategory(cat)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition cursor-pointer ${
                        newTaskCategory === cat
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 font-bold'
                          : 'bg-slate-950 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Task Items */}
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-sm">
                  No active tasks. Add a task above to let the AI agent assist you.
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`rounded-2xl border p-4 transition-all duration-200 ${
                      task.completed
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/30 shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className="mt-0.5 text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div className="space-y-1">
                          <p
                            className={`text-sm font-semibold ${
                              task.completed ? 'line-through text-slate-400' : 'text-white'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                            <span
                              className={`px-1.5 py-0.5 rounded uppercase font-semibold ${
                                task.priority === 'urgent'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  : task.priority === 'high'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {task.priority}
                            </span>
                            <span className="px-1.5 py-0.5 rounded uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {task.category}
                            </span>
                            <span className="text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Due: {task.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {task.subtasks.length === 0 && !task.completed && (
                          <button
                            onClick={() => onDecomposeTask(task.id)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/40 text-[11px] font-mono flex items-center gap-1 transition cursor-pointer"
                            title="AI will decompose this task into atomic steps"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Breakdown</span>
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subtasks if generated */}
                    {task.subtasks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 pl-8">
                        <div className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
                          AI Decomposed Action Steps:
                        </div>
                        {task.subtasks.map((st) => (
                          <div key={st.id} className="flex items-center gap-2 text-xs text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>{st.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Col: Strategic Life Sentinel & Metrics */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Life & Work Progress Monitor
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Daily Execution Rate</span>
                  <span className="text-cyan-400 font-bold">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Total Handled</span>
                  <div className="text-lg font-bold text-white font-mono">{tasks.length}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Completed</span>
                  <div className="text-lg font-bold text-emerald-400 font-mono">{completedCount}</div>
                </div>
              </div>
            </div>

            {/* AI Executive Recommendations */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900/80 border border-indigo-500/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>EXECUTIVE RECOMMENDATION</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prioritize top 2 urgent items before 1:00 PM. High-focus cognitive energy is best utilized for critical reasoning and deep client deliverables early in the schedule.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Autonomous Workflows Tab */}
      {activeTab === 'workflows' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflows.map((wf) => {
              const isRunning = runningWorkflowId === wf.id;
              return (
                <div
                  key={wf.id}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 p-5 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                          {wf.category}
                        </span>
                        <h4 className="text-base font-bold text-white pt-1">{wf.title}</h4>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {wf.schedule}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{wf.description}</p>

                    {/* Automated Steps */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono uppercase text-slate-500">
                        Autonomous Execution Pipeline:
                      </span>
                      {wf.automatedSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trigger Action */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Ready for Execution
                    </span>
                    <button
                      onClick={() => onRunWorkflow(wf)}
                      disabled={isRunning}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs tracking-wide shadow-md shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-2 transition cursor-pointer"
                    >
                      {isRunning ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Executing...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>Run Routine Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Timeline Tab */}
      {activeTab === 'schedule' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Executive Daily Time Blocks
            </h3>
            <span className="text-xs font-mono text-cyan-400">Synchronized with AI Scheduler</span>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { time: '09:00 AM - 10:30 AM', title: 'Deep Work & Strategic Focus Block', tag: 'High Cognitive' },
              { time: '11:00 AM - 12:00 PM', title: 'Client Reviews & Operations Standup', tag: 'Collaborative' },
              { time: '01:00 PM - 02:00 PM', title: 'Executive Lunch & Hydration Break', tag: 'Rest & Recovery' },
              { time: '03:00 PM - 04:30 PM', title: 'Universal Web Connectors & SaaS Audits', tag: 'Engineering & AI' },
              { time: '05:30 PM - 06:00 PM', title: 'Daily Debrief & Tomorrow Scheduling', tag: 'Executive Sync' },
            ].map((slot, i) => (
              <div key={i} className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="w-36 text-xs font-mono text-cyan-400 shrink-0 pt-0.5">
                  {slot.time}
                </div>
                <div className="flex-1 space-y-0.5">
                  <h4 className="text-sm font-semibold text-white">{slot.title}</h4>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{slot.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
