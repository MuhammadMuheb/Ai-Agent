import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, MessageSquare, AlertTriangle, Plus, Sparkles, Cpu, Wifi, Activity, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card.tsx';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { ApprovalItem, OrbState, NavigationTab } from '../../types/index.ts';

interface AajViewProps {
  tasks: Array<{ id: string; title: string; time: string; completed: boolean; category?: string }>;
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, time: string) => void;
  pendingApprovals: ApprovalItem[];
  onOpenApproval: (item: ApprovalItem) => void;
  orbState: OrbState;
  onNavigate: (tab: NavigationTab) => void;
  onQuickChat: (prompt: string) => void;
}

export const AajView: React.FC<AajViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  pendingApprovals,
  onOpenApproval,
  orbState,
  onNavigate,
  onQuickChat,
}) => {
  const [newTaskInput, setNewTaskInput] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    onAddTask(newTaskInput.trim(), newTaskTime.trim() || 'Today');
    setNewTaskInput('');
    setNewTaskTime('');
    setShowAddForm(false);
  };

  const freshIdeas = [
    {
      id: 'idea-1',
      title: 'Plant Care Vision: 3 plants routine check',
      desc: 'Indoor monstera aur pothos ka sunlight aur watering status review karein.',
      actionPrompt: 'Mere paas indoor plants hain, unki care check karni hai.',
    },
    {
      id: 'idea-2',
      title: 'Sir Imran ke meeting notes prepare karein',
      desc: 'Tech infrastructure roadmap ki summary taiyar hai.',
      actionPrompt: 'Sir Imran ki meeting ke liye concise bullet point notes banao.',
    },
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
      {/* Main Content (1 Kaam Ek Waqt) */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Welcome Greeting */}
        <div className="flex flex-col gap-1 border-b border-[#1c2a38] pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#e6edf3] tracking-tight">
              Assalam-o-Alaikum, Muheb
            </h1>
            <span className="w-2 h-2 rounded-full bg-[#2ee59d] animate-ping" />
          </div>
          <p className="text-sm text-[#8b9bab]">
            Aap ka personal 24/7 AI Desktop Agent tayyar hai. Aaj ka schedule aur pending tasks yeh hain:
          </p>
        </div>

        {/* AAJ KA PLAN */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#27d7e6]">
                AAJ KA PLAN
              </span>
              <Badge variant="cyan" size="sm">
                {tasks.filter((t) => !t.completed).length} Baqi
              </Badge>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs text-[#27d7e6] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Naya Task
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row gap-2 p-3 bg-[#111a24] border border-[#1c2a38] rounded-lg">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Task ka naam (e.g. Boss ko update email)"
                className="flex-1 bg-[#0b1118] border border-[#1c2a38] rounded px-3 py-1.5 text-xs text-[#e6edf3] focus:outline-none focus:border-[#27d7e6]"
                autoFocus
              />
              <input
                type="text"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                placeholder="Time (e.g. 15:00)"
                className="w-24 bg-[#0b1118] border border-[#1c2a38] rounded px-3 py-1.5 text-xs text-[#e6edf3] focus:outline-none focus:border-[#27d7e6]"
              />
              <Button type="submit" size="sm" variant="primary">
                Add
              </Button>
            </form>
          )}

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  task.completed
                    ? 'bg-[#0b1118]/50 border-[#1c2a38]/50 opacity-60'
                    : 'bg-[#0b1118] border-[#1c2a38] hover:border-[#27d7e6]/50 hover:bg-[#111a24]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#2ee59d] shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#8b9bab] shrink-0 hover:text-[#27d7e6]" />
                  )}
                  <span
                    className={`text-sm ${
                      task.completed ? 'line-through text-[#8b9bab]' : 'text-[#e6edf3] font-medium'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#8b9bab] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#27d7e6]" />
                    {task.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NAYE MESSAGES & FRESH IDEAS */}
        <div className="flex flex-col gap-3 pt-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#27d7e6]">
            FRESH IDEAS & AGENT PROMPTS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {freshIdeas.map((idea) => (
              <Card
                key={idea.id}
                interactive
                onClick={() => {
                  onNavigate('baat-cheet');
                  onQuickChat(idea.actionPrompt);
                }}
                className="flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-[#e6edf3]">{idea.title}</h4>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#27d7e6]" />
                  </div>
                  <p className="text-xs text-[#8b9bab] leading-relaxed">{idea.desc}</p>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] text-[#27d7e6] font-medium">Click karein aur shuru karein →</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel (Status & Approvals Panel as Blueprint 6.4) */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        {/* Agent Status Card with Mini Orb */}
        <Card className="flex flex-col gap-4 border-[#1c2a38]">
          <div className="flex items-center justify-between border-b border-[#1c2a38] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b9bab]">
                AGENT HALAT
              </span>
              <h3 className="text-sm font-semibold text-[#e6edf3]">Muhib AI: Tayyar</h3>
            </div>
            {/* Status Indicator */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2ee59d] animate-pulse" />
              <span className="text-xs font-mono text-[#2ee59d] uppercase">ONLINE</span>
            </div>
          </div>

          {/* Mini Orb Visual */}
          <div
            onClick={() => onNavigate('baat-cheet')}
            className="h-28 bg-[#05080c] rounded-xl border border-[#1c2a38] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-[#27d7e6] transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#27d7e6]/20 border border-[#27d7e6]/50 flex items-center justify-center text-[#27d7e6] shadow-[0_0_20px_rgba(39,215,230,0.4)] group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[11px] font-medium text-[#8b9bab] mt-2 group-hover:text-[#27d7e6]">
              {orbState === 'idle'
                ? 'Ready for orders (Click to Chat)'
                : orbState === 'listening'
                ? 'Sun raha hai...'
                : orbState === 'thinking'
                ? 'Soch raha hai...'
                : 'Bol raha hai...'}
            </span>
          </div>
        </Card>

        {/* MANZOORI (Pending Approvals) Card */}
        <Card className="flex flex-col gap-3 border-[#1c2a38]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff4d5e] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              MANZOORI
            </span>
            <Badge variant="laal" size="sm">
              {pendingApprovals.length} Intezar
            </Badge>
          </div>

          {pendingApprovals.length === 0 ? (
            <p className="text-xs text-[#8b9bab] py-2">
              Koi cheez approval ke liye pending nahi hai. All safe.
            </p>
          ) : (
            <div className="space-y-2.5">
              {pendingApprovals.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#111a24] border border-[#ff4d5e]/30 rounded-lg flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-semibold text-[#e6edf3] line-clamp-1">
                      {item.title}
                    </h5>
                    <Badge variant="laal" size="sm">Laal</Badge>
                  </div>
                  <p className="text-[11px] text-[#8b9bab] line-clamp-2">
                    {item.content}
                  </p>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onOpenApproval(item)}
                    className="w-full text-xs"
                  >
                    [Dekho / Faisla Karo]
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* System HALAT Card */}
        <Card className="flex flex-col gap-2.5 border-[#1c2a38] text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b9bab]">
            HALAT (METRICS)
          </span>
          <div className="flex items-center justify-between py-1 border-b border-[#1c2a38]">
            <span className="text-[#8b9bab] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#27d7e6]" /> CPU Usage
            </span>
            <span className="font-mono text-[#e6edf3]">14% Normal</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#1c2a38]">
            <span className="text-[#8b9bab] flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-[#2ee59d]" /> Network Ping
            </span>
            <span className="font-mono text-[#2ee59d]">28ms Live</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[#8b9bab] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#f5b83d]" /> Model Engine
            </span>
            <span className="font-mono text-[#e6edf3]">Gemini 2.5 Flash</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
