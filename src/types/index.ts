export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  image?: string;
  generatedCode?: {
    language: string;
    code: string;
    title?: string;
  };
  generatedImage?: {
    url: string;
    prompt: string;
    title: string;
  };
  plantAnalysis?: PlantCareResult;
}

export interface TaskItem {
  id: string;
  time: string;
  title: string;
  completed: boolean;
  priority?: 'high' | 'normal' | 'low';
}

export interface InboxMessage {
  id: string;
  sender: string;
  source: 'WhatsApp' | 'Email' | 'Voice' | 'SMS';
  preview: string;
  fullText: string;
  time: string;
  unread: boolean;
  audioDuration?: string;
}

export interface MemoryItem {
  id: string;
  category: 'boss' | 'mama' | 'projects' | 'habits';
  title: string;
  detail: string;
  updatedAt: string;
}

export interface ActionLog {
  id: string;
  time: string;
  action: string;
  status: 'approved' | 'sent' | 'read' | 'pending' | 'denied';
  details?: string;
}

export interface PlantCareResult {
  isPlant: boolean;
  commonName: string;
  scientificName?: string;
  family?: string;
  healthStatus: string;
  healthNotes?: string;
  careGuide?: {
    watering: string;
    sunlight: string;
    humidity: string;
    soil: string;
    fertilizer: string;
    toxicity: string;
  };
  romanUrduSummary: string;
  quickTips?: string[];
}

export interface DeepResearchResult {
  topic: string;
  executiveSummary: string;
  chatgptPerspective: {
    title: string;
    coreThesis: string;
    keyMechanics: string[];
    conceptualAnalogy: string;
  };
  claudePerspective: {
    title: string;
    riskAnalysis: string[];
    blindSpotsAndBiases: string;
    edgeCases: string[];
  };
  geminiPerspective: {
    title: string;
    verifiedFacts: string[];
    realWorldMetrics: string[];
    sources: Array<{ name: string; url: string; keyFinding: string }>;
  };
  comparisonMatrix: Array<{
    dimension: string;
    chatgptStance: string;
    claudeStance: string;
    geminiStance: string;
    metaVerdict: string;
  }>;
  actionPlan: Array<{
    stepNumber: number;
    title: string;
    action: string;
    expectedOutcome: string;
  }>;
  finalVerdict: string;
}

export interface WebConnector {
  id: string;
  name: string;
  url: string;
  category:
    | 'Productivity'
    | 'AI & Machine Learning'
    | 'Engineering & Cloud'
    | 'Finance & Invoicing'
    | 'Design & Creative'
    | 'Research & Data'
    | 'Communications & Social'
    | 'Operations & Commerce'
    | 'Custom';
  description: string;
  tags: string[];
  isFavorite: boolean;
  addedAt: string;
  status: 'active' | 'synced' | 'pending';
  lastPingMs?: number;
  aiAuditNotes?: string;
}

export interface LifeWorkflow {
  id: string;
  title: string;
  category: 'career' | 'personal' | 'finance' | 'learning' | 'operations';
  description: string;
  automatedSteps: string[];
  status: 'idle' | 'running' | 'completed' | 'scheduled';
  schedule: string;
  lastRun?: string;
}

export interface ExecutiveTask {
  id: string;
  title: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: 'work' | 'life' | 'finance' | 'learning';
  completed: boolean;
  dueDate: string;
  subtasks: { id: string; text: string; done: boolean }[];
  aiRecommendation?: string;
}

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

export type ActiveTab = 'agent' | 'voice' | 'notes' | 'plant' | 'research' | 'desktop';

export type NavigationTab =
  | 'aaj'
  | 'baat-cheet'
  | 'kaam'
  | 'yaadasht'
  | 'settings'
  | 'dashboard'
  | 'agentic-mission'
  | 'web-hub'
  | 'life-ops'
  | 'research'
  | 'chat';

export interface ApprovalItem {
  id: string;
  title: string;
  recipient?: string;
  channel?: string;
  content: string;
  darja: 'hara' | 'peela' | 'laal' | 'siyah';
  createdAt: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface WorkspaceFile {
  id: string;
  name: string;
  size: string;
  updatedAt: string;
  content: string;
}

export interface AgentMissionStep {
  id: string;
  stepNumber: number;
  phase: 'planning' | 'thought' | 'action' | 'observation' | 'reflection';
  title: string;
  toolInvoked?: string;
  toolInput?: Record<string, any>;
  observation?: string;
  status: 'running' | 'completed' | 'failed' | 'self_healed';
  timestamp: string;
}

export interface AgentMission {
  id: string;
  goal: string;
  status: 'planning' | 'executing' | 'completed' | 'paused' | 'failed';
  startedAt: string;
  completedAt?: string;
  progressPercent: number;
  currentStepIndex: number;
  steps: AgentMissionStep[];
  outcomeSummary?: string;
  artifactsCreated?: string[];
}

export interface AutonomousWorker {
  id: string;
  name: string;
  role: string;
  category: 'web' | 'operations' | 'research' | 'memory';
  status: 'active' | 'standby' | 'evaluating';
  tasksCompleted: number;
  lastAction: string;
  lastActionTime: string;
  latencyMs: number;
  healthPercent: number;
}

export interface AgentSentinelAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'web-hub' | 'life-ops' | 'memory' | 'system';
  title: string;
  description: string;
  suggestedAction: string;
  timestamp: string;
  resolved: boolean;
  actionPayload?: any;
}

export type ActiveModal =
  | 'none'
  | 'add-website'
  | 'bulk-import-websites'
  | 'audit-website'
  | 'create-workflow'
  | 'vault'
  | 'settings'
  | 'memory'
  | 'skills'
  | 'character'
  | 'deep-research'
  | 'agent-framework'
  | 'access-logs'
  | 'website-brief'
  | 'morning-briefing'
  | 'file-sandbox'
  | 'mcp'
  | 'desktop-hub'
  | 'message-analyzer';

