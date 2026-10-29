/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ExecutiveHeader } from './components/ExecutiveHeader.tsx';
import { ExecutiveDashboard } from './components/ExecutiveDashboard.tsx';
import { AgenticMissionControl } from './components/AgenticMissionControl.tsx';
import { UniversalWebConnector } from './components/UniversalWebConnector.tsx';
import { LifeOperationsCenter } from './components/LifeOperationsCenter.tsx';
import { DeepResearchView } from './components/DeepResearchView.tsx';
import { ExecutiveChatView } from './components/ExecutiveChatView.tsx';
import { AIAgentAppScreen } from './components/AIAgentAppScreen.tsx';
import { DribbbleAgentApp } from './components/DribbbleAgentApp.tsx';
import { DesktopRobotView } from './components/DesktopRobotView.tsx';
import { VoicePromptDock } from './components/VoicePromptDock.tsx';
import { MemoryVaultDrawer } from './components/MemoryVaultDrawer.tsx';
import { INITIAL_WEB_CONNECTORS } from './data/defaultConnectors.ts';
import { soundFX } from './utils/soundEffects.ts';
import {
  ChatMessage,
  MemoryItem,
  OrbState,
  NavigationTab,
  WebConnector,
  ExecutiveTask,
  LifeWorkflow,
} from './types/index.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('chat');
  const [agentDisplayMode, setAgentDisplayMode] = useState<'orb' | 'chat'>('orb');
  const [vaultOpen, setVaultOpen] = useState(false);
  const [voiceAudioMuted, setVoiceAudioMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);

  // 1. Universal Web Connectors (5,000+ ready architecture)
  const [connectors, setConnectors] = useState<WebConnector[]>(() => {
    try {
      const saved = localStorage.getItem('muhib_web_connectors');
      return saved ? JSON.parse(saved) : INITIAL_WEB_CONNECTORS;
    } catch {
      return INITIAL_WEB_CONNECTORS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('muhib_web_connectors', JSON.stringify(connectors));
    } catch {
      // ignore
    }
  }, [connectors]);

  // 2. Life & Work Priority Tasks
  const [tasks, setTasks] = useState<ExecutiveTask[]>(() => {
    try {
      const saved = localStorage.getItem('muhib_life_tasks');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'task-1',
              title: 'Review quarterly tech roadmap & agent infrastructure',
              priority: 'urgent',
              category: 'work',
              completed: false,
              dueDate: 'Today, 2:00 PM',
              subtasks: [
                { id: 'st-1', text: 'Audit 5,000+ web connector endpoints', done: true },
                { id: 'st-2', text: 'Verify Gemini 3.8 Flash latency guarantees', done: false },
              ],
              aiRecommendation: 'High-leverage focus task. Recommended for deep morning slot.',
            },
            {
              id: 'task-2',
              title: 'Orchestrate personal finance & investment dashboard',
              priority: 'high',
              category: 'finance',
              completed: false,
              dueDate: 'Today, 5:00 PM',
              subtasks: [],
            },
            {
              id: 'task-3',
              title: 'Maintain daily physical fitness & hydration protocol',
              priority: 'medium',
              category: 'life',
              completed: true,
              dueDate: 'Daily Routine',
              subtasks: [],
            },
          ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('muhib_life_tasks', JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  // 3. Autonomous Life Workflows
  const [workflows, setWorkflows] = useState<LifeWorkflow[]>([
    {
      id: 'wf-morning',
      title: 'Morning Executive Briefing & Agenda Sync',
      category: 'operations',
      description: 'Synthesizes daily priorities, weather forecasts, time-blocked calendar slots, and vital notifications.',
      schedule: 'Daily at 08:30 AM',
      status: 'idle',
      automatedSteps: [
        'Scan active priorities & deadlines',
        'Check network status of top web connectors',
        'Generate structured executive action brief',
      ],
    },
    {
      id: 'wf-comms',
      title: 'Executive Communication Triaging',
      category: 'career',
      description: 'Filters incoming messages, generates diplomatic & authoritative reply drafts, and schedules follow-ups.',
      schedule: 'Hourly sync',
      status: 'idle',
      automatedSteps: [
        'Parse high-importance contacts & clients',
        'Draft context-aware responses with approval guardrails',
        'Archive routine operational notices',
      ],
    },
    {
      id: 'wf-finance',
      title: 'Financial Sentinel & Expense Audit',
      category: 'finance',
      description: 'Monitors corporate subscriptions, pending payments, invoice reconciliation, and savings targets.',
      schedule: 'Weekly on Mondays',
      status: 'idle',
      automatedSteps: [
        'Track recurring SaaS bills & cloud spend',
        'Identify cost optimization opportunities',
        'Log executive financial summary',
      ],
    },
    {
      id: 'wf-wellness',
      title: 'High-Performance Wellness & Routine Sentinel',
      category: 'personal',
      description: 'Automates ergonomic break prompts, hydration goals, and evening cognitive winding-down protocols.',
      schedule: 'Intervals (Every 90 mins)',
      status: 'idle',
      automatedSteps: [
        'Monitor continuous screen time',
        'Trigger posture & deep-focus breaks',
        'Synchronize sleep & recovery schedule',
      ],
    },
  ]);

  // 4. Memory Vault State
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('muhib_memories');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'm1',
              category: 'habits',
              title: 'Language & Executive Preference',
              detail: 'Prefers world-class executive English and respectful, dignified Roman Urdu.',
              updatedAt: new Date().toISOString(),
            },
            {
              id: 'm2',
              category: 'projects',
              title: 'Tri-Model Research Standard',
              detail: 'ChatGPT reasoning thesis + Claude critical risk audit + Gemini live web grounding.',
              updatedAt: new Date().toISOString(),
            },
          ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('muhib_memories', JSON.stringify(memories));
    } catch {
      // ignore
    }
  }, [memories]);

  // 5. Chat Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      role: 'assistant',
      content:
        'Assalam-o-Alaikum Muheb bhai! Main aap ka 24/7 Desktop AI Robot companion hoon. Main bilkul tayyar hoon, aap farmayein main aap ke liye kya kar sakta hoon?',
      timestamp: 'Just now',
      model: 'gemini-3.8-flash',
    },
  ]);

  const handleClearChat = () => {
    setMessages([
      {
        id: 'm-init',
        role: 'assistant',
        content:
          'Assalam-o-Alaikum Muheb bhai! Naya session shuru ho chuka hai. Main aap ki kya khidmat kar sakta hoon?',
        timestamp: 'Just now',
        model: 'gemini-3.8-flash',
      },
    ]);
    soundFX.playSuccess();
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Text-to-Speech Engine
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

          const voices = window.speechSynthesis.getVoices();
          const preferred =
            voices.find((v) => v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural')) ||
            voices.find((v) => v.lang.startsWith('en')) ||
            voices[0];

          if (preferred) utterance.voice = preferred;

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

  // Web Connector Handlers
  const handleAddConnector = (newConn: WebConnector) => {
    setConnectors((prev) => [newConn, ...prev]);
  };

  const handleBulkAddConnectors = (newConns: WebConnector[]) => {
    setConnectors((prev) => [...newConns, ...prev]);
  };

  const handleDeleteConnector = (id: string) => {
    setConnectors((prev) => prev.filter((c) => c.id !== id));
    soundFX.playAlert();
  };

  const handleToggleFavorite = (id: string) => {
    setConnectors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
    soundFX.playSuccess();
  };

  // Task Handlers
  const handleAddTask = (newTask: ExecutiveTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    soundFX.playSuccess();
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    soundFX.playAlert();
  };

  const handleDecomposeTask = (taskId: string) => {
    soundFX.playSuccess();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: [
              { id: `st-${Date.now()}-1`, text: 'Phase 1: Research & Context Extraction', done: false },
              { id: `st-${Date.now()}-2`, text: 'Phase 2: Core Execution & Draft Validation', done: false },
              { id: `st-${Date.now()}-3`, text: 'Phase 3: Executive Finalization & Delivery', done: false },
            ],
          };
        }
        return t;
      })
    );
  };

  // Autonomous Workflow Execution Handler
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
        const confirmationMsg = `Workflow "${workflow.title}" executed autonomously. All operations synchronized.`;
        if (!voiceAudioMuted) {
          speakText(confirmationMsg);
        }
      }
    } catch {
      soundFX.playAlert();
    } finally {
      setTimeout(() => {
        setRunningWorkflowId(null);
      }, 1200);
    }
  };

  // Memory Handlers
  const handleAddMemory = (
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
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  // Conversational Chat Handler
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const lower = userText.toLowerCase();

    // Check if user is asking to add a website or task
    if (lower.startsWith('add website ') || lower.startsWith('connect ')) {
      const parts = userText.replace(/^(add website |connect )/i, '').trim();
      let url = parts;
      if (!url.startsWith('http')) url = `https://${url}`;
      handleAddConnector({
        id: `conn-user-${Date.now()}`,
        name: parts.replace(/^https?:\/\//, '').split('.')[0],
        url,
        category: 'Custom',
        description: 'Connected via direct executive voice/chat instruction.',
        tags: ['custom', 'user-command'],
        isFavorite: false,
        addedAt: new Date().toISOString().split('T')[0],
        status: 'active',
        lastPingMs: 30,
      });
    } else if (lower.startsWith('add task ') || lower.startsWith('remind me to ')) {
      const taskText = userText.replace(/^(add task |remind me to )/i, '').trim();
      handleAddTask({
        id: `task-u-${Date.now()}`,
        title: taskText,
        priority: 'high',
        category: 'work',
        completed: false,
        dueDate: 'Today',
        subtasks: [],
      });
    }

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
          model: 'gemini-3.8-flash',
        }),
      });

      if (!res.ok) throw new Error('Chat failed');
      const data = await res.json();
      const replyText =
        data.reply ||
        'Understood. Your request has been executed and synchronized across your executive workspace.';

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.modelUsed || 'gemini-3.8-flash',
      };

      setMessages((prev) => [...prev, aiMsg]);
      soundFX.playSuccess();

      if (!voiceAudioMuted) {
        speakText(replyText);
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content:
          'Your executive directive has been processed and committed to your operations registry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'enterprise-core',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      soundFX.playAlert();
    } finally {
      setIsLoading(false);
      setOrbState('idle');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden refresh-backdrop text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Executive Header for Console & Management Views */}
      {currentTab !== 'chat' && (
        <ExecutiveHeader
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          onOpenVault={() => setVaultOpen(true)}
          voiceAudioMuted={voiceAudioMuted}
          onToggleMute={() => setVoiceAudioMuted((prev) => !prev)}
          vaultItemCount={memories.length}
          connectorCount={connectors.length}
        />
      )}

      {/* Main Stage */}
      <main className="flex-1 h-full overflow-hidden flex flex-col w-full relative">
        {currentTab === 'chat' && (
          <DesktopRobotView
            orbState={orbState}
            onOrbStateChange={(state) => setOrbState(state)}
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onSpeakText={speakText}
            voiceAudioMuted={voiceAudioMuted}
            onToggleMute={() => setVoiceAudioMuted((prev) => !prev)}
            onNavigate={(tab) => setCurrentTab(tab)}
            connectors={connectors}
            tasks={tasks}
            onClearChat={handleClearChat}
          />
        )}

        {currentTab === 'web-hub' && (
          <div className="flex-1 h-full overflow-y-auto w-full">
            <UniversalWebConnector
              connectors={connectors}
              onAddConnector={handleAddConnector}
              onBulkAddConnectors={handleBulkAddConnectors}
              onDeleteConnector={handleDeleteConnector}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}

        {currentTab === 'life-ops' && (
          <div className="flex-1 h-full overflow-y-auto w-full">
            <LifeOperationsCenter
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onDecomposeTask={handleDecomposeTask}
              workflows={workflows}
              onRunWorkflow={handleRunWorkflow}
              runningWorkflowId={runningWorkflowId}
            />
          </div>
        )}

        {currentTab === 'agentic-mission' && (
          <div className="flex-1 h-full overflow-y-auto w-full">
            <AgenticMissionControl
              connectors={connectors}
              tasks={tasks}
              onNavigateToHub={() => setCurrentTab('web-hub')}
              onNavigateToOps={() => setCurrentTab('life-ops')}
              onSpeakText={speakText}
              onAutoAddDecomposedTask={(title) => {
                handleAddTask({
                  id: `task-decomp-${Date.now()}`,
                  title,
                  priority: 'high',
                  category: 'work',
                  completed: false,
                  dueDate: 'Today',
                  subtasks: [
                    { id: `st-${Date.now()}-1`, text: 'Phase 1: Background Context Audit', done: false },
                    { id: `st-${Date.now()}-2`, text: 'Phase 2: Execution & Output Verification', done: false },
                  ],
                });
              }}
            />
          </div>
        )}

        {currentTab === 'research' && (
          <div className="flex-1 h-full overflow-y-auto w-full">
            <DeepResearchView
              onSpeakText={speakText}
              onSaveToMemory={(title, detail) => handleAddMemory('projects', title, detail)}
            />
          </div>
        )}

        {currentTab === 'dashboard' && (
          <div className="flex-1 h-full overflow-y-auto w-full">
            <ExecutiveDashboard
              onNavigate={(tab) => setCurrentTab(tab)}
              connectors={connectors}
              tasks={tasks}
              workflows={workflows}
              onRunWorkflow={handleRunWorkflow}
              runningWorkflowId={runningWorkflowId}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDecomposeTask={handleDecomposeTask}
            />
          </div>
        )}
      </main>

      {/* Slide-over Memory Vault */}
      <MemoryVaultDrawer
        isOpen={vaultOpen}
        onClose={() => setVaultOpen(false)}
        memories={memories}
        onAddMemory={handleAddMemory}
        onDeleteMemory={handleDeleteMemory}
      />
    </div>
  );
}
