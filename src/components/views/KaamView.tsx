import React, { useState } from 'react';
import { CheckSquare, Sprout, Search, ShieldCheck, Plus, CheckCircle2, Circle, Clock, AlertTriangle, ArrowRight, Play, Eye } from 'lucide-react';
import { Card } from '../ui/Card.tsx';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { PlantCareVision } from '../PlantCareVision.tsx';
import { DeepResearchView } from '../DeepResearchView.tsx';
import { ExecutiveTask, LifeWorkflow, ApprovalItem } from '../../types/index.ts';

interface KaamViewProps {
  tasks: ExecutiveTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: ExecutiveTask) => void;
  onDecomposeTask: (id: string) => void;
  workflows: LifeWorkflow[];
  onRunWorkflow: (wf: LifeWorkflow) => void;
  runningWorkflowId: string | null;
  pendingApprovals: ApprovalItem[];
  onOpenApproval: (item: ApprovalItem) => void;
  onSpeakText: (text: string) => void;
  onSaveToMemory: (title: string, detail: string) => void;
  onSendPlantToChat: (analysis: any, b64: string) => void;
}

export const KaamView: React.FC<KaamViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDecomposeTask,
  workflows,
  onRunWorkflow,
  runningWorkflowId,
  pendingApprovals,
  onOpenApproval,
  onSpeakText,
  onSaveToMemory,
  onSendPlantToChat,
}) => {
  const [activeSkill, setActiveSkill] = useState<'tasks' | 'plant' | 'research' | 'safety'>('tasks');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      priority: 'high',
      category: 'work',
      completed: false,
      dueDate: 'Today',
      subtasks: [],
    });
    setNewTaskTitle('');
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header & Skill Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1c2a38] pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-[#e6edf3]">Kaam & Autonomous Skills</h2>
          <p className="text-xs text-[#8b9bab]">
            Missions, task execution, aur integrated specialized skills ek hi jagah.
          </p>
        </div>

        {/* Skill Segmented Control (Zero Clutter) */}
        <div className="flex items-center bg-[#0b1118] border border-[#1c2a38] rounded-lg p-1 gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveSkill('tasks')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSkill === 'tasks'
                ? 'bg-[#27d7e6] text-[#05080c] font-semibold shadow-sm'
                : 'text-[#8b9bab] hover:text-[#e6edf3]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Tasks & Missions
          </button>
          <button
            onClick={() => setActiveSkill('plant')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSkill === 'plant'
                ? 'bg-[#27d7e6] text-[#05080c] font-semibold shadow-sm'
                : 'text-[#8b9bab] hover:text-[#e6edf3]'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            Plant Vision (Skill)
          </button>
          <button
            onClick={() => setActiveSkill('research')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSkill === 'research'
                ? 'bg-[#27d7e6] text-[#05080c] font-semibold shadow-sm'
                : 'text-[#8b9bab] hover:text-[#e6edf3]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Deep Research (Skill)
          </button>
          <button
            onClick={() => setActiveSkill('safety')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSkill === 'safety'
                ? 'bg-[#27d7e6] text-[#05080c] font-semibold shadow-sm'
                : 'text-[#8b9bab] hover:text-[#e6edf3]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Safety Gate
          </button>
        </div>
      </div>

      {/* 1. Tasks & Autonomous Workflows */}
      {activeSkill === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Tasks Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#27d7e6] uppercase">
                ACTIVE OPERATIONAL TASKS
              </span>
              <span className="text-xs text-[#8b9bab] font-mono">
                {tasks.filter((t) => !t.completed).length} Pending
              </span>
            </div>

            <form onSubmit={handleCreate} className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Naya task likhein aur Enter dabayein..."
                className="flex-1 bg-[#111a24] border border-[#1c2a38] rounded-lg px-4 py-2 text-sm text-[#e6edf3] placeholder-[#8b9bab] focus:outline-none focus:border-[#27d7e6]"
              />
              <Button type="submit" variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </form>

            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id} className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      onClick={() => onToggleTask(task.id)}
                      className="flex items-start gap-3 flex-1 cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#2ee59d] mt-0.5 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#8b9bab] mt-0.5 shrink-0 hover:text-[#27d7e6]" />
                      )}
                      <div>
                        <h4
                          className={`text-sm font-medium ${
                            task.completed ? 'line-through text-[#8b9bab]' : 'text-[#e6edf3]'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <span className="text-xs font-mono text-[#8b9bab]">{task.dueDate}</span>
                      </div>
                    </div>
                    <Badge variant={task.priority === 'urgent' ? 'laal' : 'peela'} size="sm">
                      {task.priority.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Subtasks breakdown */}
                  {task.subtasks && task.subtasks.length > 0 ? (
                    <div className="bg-[#111a24] rounded-lg p-2.5 space-y-1.5 ml-8 border border-[#1c2a38]">
                      {task.subtasks.map((st) => (
                        <div key={st.id} className="flex items-center gap-2 text-xs text-[#8b9bab]">
                          <span className={`w-1.5 h-1.5 rounded-full ${st.done ? 'bg-[#2ee59d]' : 'bg-[#f5b83d]'}`} />
                          <span className={st.done ? 'line-through' : 'text-[#e6edf3]'}>{st.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !task.completed && (
                      <div className="ml-8">
                        <button
                          onClick={() => onDecomposeTask(task.id)}
                          className="text-xs text-[#27d7e6] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Step-by-step decompose karein (Agent Planner) →
                        </button>
                      </div>
                    )
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Autonomous Workflows Column */}
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-[#2ee59d] uppercase">
              AUTONOMOUS WORKFLOWS
            </span>

            <div className="space-y-3">
              {workflows.map((wf) => {
                const isRunning = runningWorkflowId === wf.id;
                return (
                  <Card key={wf.id} className="flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-[#e6edf3]">{wf.title}</h4>
                        <Badge variant="cyan" size="sm">{wf.category}</Badge>
                      </div>
                      <p className="text-xs text-[#8b9bab] leading-relaxed">{wf.description}</p>
                    </div>

                    <div className="pt-2 border-t border-[#1c2a38] flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#8b9bab]">{wf.schedule}</span>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onRunWorkflow(wf)}
                        disabled={isRunning}
                        className="text-xs"
                      >
                        {isRunning ? 'Chala raha hai...' : 'Run Autonomous'}
                        <Play className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Plant Care Vision Skill */}
      {activeSkill === 'plant' && (
        <div className="bg-[#0b1118] border border-[#1c2a38] rounded-xl p-4 md:p-6">
          <PlantCareVision
            onSendToChat={onSendPlantToChat}
            onAnalysisStart={() => {}}
            onAnalysisEnd={() => {}}
          />
        </div>
      )}

      {/* 3. Deep Research Skill */}
      {activeSkill === 'research' && (
        <div className="bg-[#0b1118] border border-[#1c2a38] rounded-xl p-4 md:p-6">
          <DeepResearchView
            onSpeakText={onSpeakText}
            onSaveToMemory={onSaveToMemory}
          />
        </div>
      )}

      {/* 4. Safety Gate Matrix (Dil/Zameer) */}
      {activeSkill === 'safety' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-[#e6edf3]">Dil / Zameer: Safety ke 4 Darje</h3>
            <p className="text-xs text-[#8b9bab]">
              Blueprint Section 4: Agent kis ijazat ke sath kaam karta hai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hara */}
            <Card className="border-[#2ee59d]/30">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="hara">HARA DARJA</Badge>
                <span className="text-xs font-mono text-[#2ee59d]">Auto-Execute</span>
              </div>
              <h4 className="text-sm font-semibold text-[#e6edf3] mb-1">Khud kar de, sirf log likhe</h4>
              <p className="text-xs text-[#8b9bab] mb-3">
                Yeh kaam bilkul mehfooz hain. Agent bina puche execution karta hai aur record log karta hai.
              </p>
              <div className="text-xs font-mono text-[#8b9bab] bg-[#111a24] p-2.5 rounded-lg border border-[#1c2a38] space-y-1">
                <div>• Chuni hui folder se files parhna</div>
                <div>• Web search & information query</div>
                <div>• Notes aur yaadasht recall</div>
              </div>
            </Card>

            {/* Peela */}
            <Card className="border-[#f5b83d]/30">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="peela">PEELA DARJA</Badge>
                <span className="text-xs font-mono text-[#f5b83d]">Ask Once</span>
              </div>
              <h4 className="text-sm font-semibold text-[#e6edf3] mb-1">Ek baar poochhe</h4>
              <p className="text-xs text-[#8b9bab] mb-3">
                Naram kaam: pehli baar pooch kar permission leta hai, phir workspace mein apply karta hai.
              </p>
              <div className="text-xs font-mono text-[#8b9bab] bg-[#111a24] p-2.5 rounded-lg border border-[#1c2a38] space-y-1">
                <div>• Sirf "Muhib Workspace" folder mein file likhna</div>
                <div>• App kholna, clipboard copy</div>
                <div>• Email / WhatsApp ka draft taiyar karna</div>
              </div>
            </Card>

            {/* Laal */}
            <Card className="border-[#ff4d5e]/30">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="laal">LAAL DARJA</Badge>
                <span className="text-xs font-mono text-[#ff4d5e]">Approval Sheet Mandatory</span>
              </div>
              <h4 className="text-sm font-semibold text-[#e6edf3] mb-1">Har baar poochhe (BHEJ DO, BADLO, CANCEL)</h4>
              <p className="text-xs text-[#8b9bab] mb-3">
                Khatarnak kaam: bina aap ke button dabaye koi message ya delete nahi ho sakta.
              </p>
              <div className="text-xs font-mono text-[#8b9bab] bg-[#111a24] p-2.5 rounded-lg border border-[#1c2a38] space-y-1">
                <div>• WhatsApp ya Email waqai bhejna</div>
                <div>• Kisi file ko Trash mein bhejna</div>
                <div>• External tools run karna</div>
              </div>
            </Card>

            {/* Siyah */}
            <Card className="border-[#1c2a38]">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="neutral">SIYAH DARJA</Badge>
                <span className="text-xs font-mono text-[#ff4d5e]">Blocked Forever</span>
              </div>
              <h4 className="text-sm font-semibold text-[#e6edf3] mb-1">Kabhi nahi (Strictly Forbidden)</h4>
              <p className="text-xs text-[#8b9bab] mb-3">
                Yeh cheezein agent ke programming code mein permanently block hain.
              </p>
              <div className="text-xs font-mono text-[#8b9bab] bg-[#111a24] p-2.5 rounded-lg border border-[#1c2a38] space-y-1">
                <div>• Paisay bhejna ya payment authentication</div>
                <div>• Passwords ya private keys export karna</div>
                <div>• Operating system ki core files ko delete karna</div>
              </div>
            </Card>
          </div>

          {/* Pending Approvals quick table */}
          {pendingApprovals.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#1c2a38]">
              <h4 className="text-xs font-mono font-bold text-[#ff4d5e] uppercase">
                PENDING APPROVALS WAITING FOR DECISION ({pendingApprovals.length})
              </h4>
              <div className="space-y-2">
                {pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#0b1118] border border-[#ff4d5e]/40 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#e6edf3]">{item.title}</span>
                        <Badge variant="laal" size="sm">{item.channel}</Badge>
                      </div>
                      <p className="text-xs text-[#8b9bab] mt-1">{item.content}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onOpenApproval(item)}
                      className="shrink-0 text-xs font-bold"
                    >
                      BHEJ DO / BADLO / CANCEL
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
