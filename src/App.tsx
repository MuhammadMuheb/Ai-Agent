/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LeftRail } from './components/navigation/LeftRail.tsx';
import { AajView } from './components/views/AajView.tsx';
import { BaatCheetView } from './components/views/BaatCheetView.tsx';
import { KaamView } from './components/views/KaamView.tsx';
import { YaadashtView } from './components/views/YaadashtView.tsx';
import { SettingsView } from './components/views/SettingsView.tsx';
import { ApprovalSheet } from './components/ui/ApprovalSheet.tsx';
import { DetailDrawer } from './components/ui/DetailDrawer.tsx';
import { CommandPalette } from './components/ui/CommandPalette.tsx';
import { soundFX } from './utils/soundEffects.ts';
import { INITIAL_WEB_CONNECTORS } from './data/defaultConnectors.ts';
import {
  ChatMessage,
  MemoryItem,
  OrbState,
  NavigationTab,
  WebConnector,
  ExecutiveTask,
  LifeWorkflow,
  ApprovalItem,
  WorkspaceFile,
  ActionLog,
} from './types/index.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('aaj');
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [voiceAudioMuted, setVoiceAudioMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);

  // Overlay states (Strict 2 overlays rule from Blueprint)
  const [activeApproval, setActiveApproval] = useState<ApprovalItem | null>(null);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Persistent Database State (Synchronized with /data/agent_db.json)
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [tasks, setTasks] = useState<ExecutiveTask[]>([]);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalItem[]>([]);
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceFile[]>([]);
  const [connectors, setConnectors] = useState<WebConnector[]>(INITIAL_WEB_CONNECTORS);

  // Workflows state
  const [workflows, setWorkflows] = useState<LifeWorkflow[]>([
    {
      id: 'wf-morning',
      title: 'Morning Executive Briefing & Agenda Sync',
      category: 'operations',
      description: 'Daily priorities, weather context, time-blocked calendar slots, aur vital notifications.',
      schedule: 'Daily at 08:30 AM',
      status: 'idle',
      automatedSteps: ['Active priorities check', 'Web connectors scan', 'Action brief ready'],
    },
    {
      id: 'wf-comms',
      title: 'Executive Communication Triaging',
      category: 'career',
      description: 'Incoming messages filter, Roman Urdu reply drafts, aur follow-up reminders.',
      schedule: 'Hourly sync',
      status: 'idle',
      automatedSteps: ['Sir Imran & Mama messages check', 'Draft responses with approval guardrails'],
    },
    {
      id: 'wf-finance',
      title: 'Financial Sentinel & Subscription Audit',
      category: 'finance',
      description: 'Recurring cloud spend, pending payments, aur invoice reconciliation.',
      schedule: 'Weekly on Mondays',
      status: 'idle',
      automatedSteps: ['Track recurring cloud spend', 'Log financial summary'],
    },
  ]);

  // Messages Stream
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      role: 'assistant',
      content:
        'Assalam-o-Alaikum Muheb bhai! Main aap ka 24/7 Desktop AI Agent companion hoon. Aaj ka schedule aur system guardrails tayyar hain. Aap batayein main aap ki kya madad kar sakta hoon?',
      timestamp: 'Just now',
      model: 'gemini-2.5-flash',
    },
  ]);

  // Load persistent database on mount
  useEffect(() => {
    const fetchDb = async () => {
      try {
        const res = await fetch('/api/db/state');
        if (res.ok) {
          const data = await res.json();
          if (data.memories) setMemories(data.memories);
          if (data.tasks) {
            setTasks(
              data.tasks.map((t: any) => ({
                id: t.id,
                title: t.title,
                priority: t.priority || 'medium',
                category: t.category || 'work',
                completed: !!t.completed,
                dueDate: t.time || 'Today',
                subtasks: t.subtasks || [],
              }))
            );
          }
          if (data.logs) setLogs(data.logs);
          if (data.approvals) {
            setPendingApprovals(data.approvals.filter((a: any) => a.status === 'pending'));
          }
          if (data.workspaceFiles) setWorkspaceFiles(data.workspaceFiles);
        }
      } catch (err) {
        console.error('Failed to load initial database:', err);
      }
    };
    fetchDb();
  }, []);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Text to Speech
  const speakText = async (text: string) => {
    if (voiceAudioMuted) return;

    const cleaned = text
      .replace(/[*_#`~>]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleaned) return;

    setOrbState('speaking');

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleaned.slice(0, 300), voice: 'Kore' }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          audioRef.current = audio;
          audio.onended = () => setOrbState('idle');
          audio.onerror = () => fallbackBrowserSpeech(cleaned);
          await audio.play();
          return;
        }
      }
    } catch {
      // fallback
    }

    fallbackBrowserSpeech(cleaned);
  };

  const fallbackBrowserSpeech = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setOrbState('idle');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      setTimeout(() => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.onend = () => setOrbState('idle');
          utterance.onerror = () => setOrbState('idle');
          window.speechSynthesis.speak(utterance);
        } catch {
          setOrbState('idle');
        }
      }, 50);
    } catch {
      setOrbState('idle');
    }
  };

  // Conversational Chat Handler
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const newMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);
    setOrbState('thinking');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: 'gemini-2.5-flash',
        }),
      });

      if (!res.ok) throw new Error('Chat failed');
      const data = await res.json();
      const replyText =
        data.reply || 'Jee Muheb bhai, aap ka kaam process kar liya gaya hai.';

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.modelUsed || 'gemini-3.8-flash',
        generatedCode: data.generatedCode,
        generatedImage: data.generatedImage,
      };

      setMessages((prev) => [...prev, aiMsg]);
      soundFX.playSuccess();

      // If a website file or task was created, refresh workspace in real-time
      if (data.generatedCode || data.generatedImage) {
        try {
          const dbRes = await fetch('/api/db/state');
          if (dbRes.ok) {
            const dbData = await dbRes.json();
            if (dbData.tasks) setTasks(dbData.tasks);
            if (dbData.logs) setLogs(dbData.logs);
            if (dbData.workspaceFiles) setWorkspaceFiles(dbData.workspaceFiles);
          }
        } catch {
          // ignore sync failure
        }
      }

      if (!voiceAudioMuted) {
        speakText(replyText);
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content:
          'Jee Muheb bhai, main ne aap ka paighaam note kar liya hai aur workspace registry mein synchronize kar diya hai.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'gemini-2.5-flash',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      soundFX.playAlert();
    } finally {
      setIsLoading(false);
      setOrbState('idle');
    }
  };

  // Task Handlers (Persisted)
  const handleToggleTask = async (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    const nextCompleted = !target.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );
    soundFX.playSuccess();

    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: nextCompleted }),
      });
    } catch {
      // ignore
    }
  };

  const handleAddTask = async (task: ExecutiveTask) => {
    setTasks((prev) => [task, ...prev]);
    soundFX.playSuccess();

    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          time: task.dueDate,
          priority: task.priority,
          category: task.category,
        }),
      });
    } catch {
      // ignore
    }
  };

  const handleDecomposeTask = (taskId: string) => {
    soundFX.playSuccess();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: [
              { id: `st-${Date.now()}-1`, text: 'Pehla qadam: Context & requirements review', done: false },
              { id: `st-${Date.now()}-2`, text: 'Doosra qadam: Core execution & draft check', done: false },
              { id: `st-${Date.now()}-3`, text: 'Teesra qadam: Final confirmation & delivery', done: false },
            ],
          };
        }
        return t;
      })
    );
  };

  // Autonomous Workflow Run
  const handleRunWorkflow = async (workflow: LifeWorkflow) => {
    setRunningWorkflowId(workflow.id);
    soundFX.playWakeChime();

    try {
      const res = await fetch('/api/workflow/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId: workflow.id,
          title: workflow.title,
          category: workflow.category,
        }),
      });

      if (res.ok) {
        soundFX.playSuccess();
        const msg = `Workflow "${workflow.title}" kamyabi se execute ho gaya.`;
        if (!voiceAudioMuted) speakText(msg);
      }
    } catch {
      soundFX.playAlert();
    } finally {
      setTimeout(() => setRunningWorkflowId(null), 1200);
    }
  };

  // Memory Handlers (Persisted)
  const handleAddMemory = async (
    category: 'boss' | 'mama' | 'projects' | 'habits',
    title: string,
    detail: string
  ) => {
    const newItem: MemoryItem = {
      id: `m-${Date.now()}`,
      category,
      title,
      detail,
      updatedAt: new Date().toISOString(),
    };
    setMemories((prev) => [newItem, ...prev]);
    soundFX.playSuccess();

    try {
      await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, title, detail }),
      });
    } catch {
      // ignore
    }
  };

  const handleDeleteMemory = async (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    soundFX.playAlert();

    try {
      await fetch(`/api/memories/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
  };

  // Workspace File Handlers (Persisted)
  const handleCreateFile = async (name: string, content: string) => {
    const newFile: WorkspaceFile = {
      id: `f-${Date.now()}`,
      name,
      size: `${(content.length / 1024).toFixed(1)} KB`,
      updatedAt: 'Just now',
      content,
    };
    setWorkspaceFiles((prev) => [newFile, ...prev]);
    soundFX.playSuccess();

    try {
      await fetch('/api/workspace/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content }),
      });
    } catch {
      // ignore
    }
  };

  // Approval Gate: BHEJ DO, BADLO, CANCEL
  const handleApprovalResponse = async (
    id: string,
    action: 'approved' | 'modified' | 'denied',
    feedback?: string,
    updatedContent?: string
  ) => {
    setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
    soundFX.playSuccess();

    try {
      const res = await fetch('/api/approvals/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, feedback, updatedContent }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.logs) setLogs(data.logs);
      }
    } catch {
      // ignore
    }
  };

  const handleOpenApproval = (item: ApprovalItem) => {
    setActiveApproval(item);
    setIsApprovalOpen(true);
  };

  const handleSelectWorkspaceFile = (file: WorkspaceFile) => {
    setSelectedFile(file);
    setIsDrawerOpen(true);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'm-init',
        role: 'assistant',
        content:
          'Assalam-o-Alaikum Muheb bhai! Naya chat session shuru ho chuka hai. Main aap ki kya khidmat kar sakta hoon?',
        timestamp: 'Just now',
        model: 'gemini-2.5-flash',
      },
    ]);
    soundFX.playSuccess();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#05080c] text-[#e6edf3] flex font-sans select-none">
      {/* Blueprint Left Rail Navigation (5 Icons Only) */}
      <LeftRail
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        pendingApprovalsCount={pendingApprovals.length}
      />

      {/* Main Single-Task Stage */}
      <main className="flex-1 h-full overflow-hidden flex flex-col relative bg-[#05080c]">
        {/* Tab 1: Aaj (Home) */}
        {currentTab === 'aaj' && (
          <AajView
            tasks={tasks.map((t) => ({
              id: t.id,
              title: t.title,
              time: t.dueDate,
              completed: t.completed,
              category: t.category,
            }))}
            onToggleTask={handleToggleTask}
            onAddTask={(title, time) =>
              handleAddTask({
                id: `task-${Date.now()}`,
                title,
                priority: 'high',
                category: 'work',
                completed: false,
                dueDate: time,
                subtasks: [],
              })
            }
            pendingApprovals={pendingApprovals}
            onOpenApproval={handleOpenApproval}
            orbState={orbState}
            onNavigate={(tab) => setCurrentTab(tab)}
            onQuickChat={(prompt) => {
              setCurrentTab('baat-cheet');
              handleSendMessage(prompt);
            }}
          />
        )}

        {/* Tab 2: Baat-cheet (Roman Urdu Chat + 3D Robot) */}
        {(currentTab === 'baat-cheet' || currentTab === 'chat') && (
          <BaatCheetView
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            orbState={orbState}
            onOrbStateChange={(state) => setOrbState(state)}
            onSpeakText={speakText}
            voiceAudioMuted={voiceAudioMuted}
            onToggleMute={() => setVoiceAudioMuted((prev) => !prev)}
            onClearChat={handleClearChat}
          />
        )}

        {/* Tab 3: Kaam (Tasks, Plant Vision Skill, Deep Research Skill, Safety Gate) */}
        {(currentTab === 'kaam' ||
          currentTab === 'life-ops' ||
          currentTab === 'agentic-mission' ||
          currentTab === 'research') && (
          <KaamView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDecomposeTask={handleDecomposeTask}
            workflows={workflows}
            onRunWorkflow={handleRunWorkflow}
            runningWorkflowId={runningWorkflowId}
            pendingApprovals={pendingApprovals}
            onOpenApproval={handleOpenApproval}
            onSpeakText={speakText}
            onSaveToMemory={(title, detail) => handleAddMemory('projects', title, detail)}
            onSendPlantToChat={(analysis, b64) => {
              setCurrentTab('baat-cheet');
              handleSendMessage(
                `Plant analysis: ${analysis.commonName || 'Plant'} health summary: ${analysis.romanUrduSummary}`
              );
            }}
          />
        )}

        {/* Tab 4: Yaadasht (Memory Vault & Workspace Files) */}
        {currentTab === 'yaadasht' && (
          <YaadashtView
            memories={memories}
            onAddMemory={handleAddMemory}
            onDeleteMemory={handleDeleteMemory}
            workspaceFiles={workspaceFiles}
            onSelectFile={handleSelectWorkspaceFile}
            onCreateFile={handleCreateFile}
          />
        )}

        {/* Tab 5: Settings (Safety, Voice, Logs, Connectors) */}
        {(currentTab === 'settings' || currentTab === 'web-hub' || currentTab === 'dashboard') && (
          <SettingsView
            logs={logs}
            connectors={connectors}
            voiceAudioMuted={voiceAudioMuted}
            onToggleMute={() => setVoiceAudioMuted((prev) => !prev)}
            onClearLogs={() => setLogs([])}
          />
        )}
      </main>

      {/* Overlay 1: Approval Sheet (Slides up from bottom for Laal darja actions: BHEJ DO, BADLO, CANCEL) */}
      <ApprovalSheet
        item={activeApproval}
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
        onRespond={handleApprovalResponse}
      />

      {/* Overlay 2: Detail Drawer (Slides from right to inspect workspace files without popup nesting) */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedFile?.name || 'File Detail'}
        subtitle={`Size: ${selectedFile?.size} • ${selectedFile?.updatedAt}`}
      >
        <div className="bg-[#111a24] border border-[#1c2a38] rounded-lg p-4 font-mono text-xs text-[#e6edf3] whitespace-pre-wrap leading-relaxed select-text">
          {selectedFile?.content}
        </div>
      </DetailDrawer>

      {/* Fast Command Launcher: Ctrl + K */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
        onQuickAction={(action) => {
          if (action === 'open-palette') setIsCommandPaletteOpen(true);
          if (action === 'new-task') {
            setCurrentTab('aaj');
          }
          if (action === 'stop-agent') {
            setOrbState('idle');
            soundFX.playAlert();
          }
        }}
      />
    </div>
  );
}
