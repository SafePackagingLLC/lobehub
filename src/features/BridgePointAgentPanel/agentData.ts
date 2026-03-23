/**
 * BridgePoint AI — Manufacturing Agent definitions
 * Static data for the right-hand Agent Panel.
 */

export type AgentBehavior = 'execute' | 'minimal' | 'ask-first' | 'platform' | 'soon';
export type AgentCategory =
  | 'Operations'
  | 'Quality'
  | 'Finance'
  | 'Safety'
  | 'Maintenance'
  | 'Management'
  | 'Engineering'
  | 'Strategy'
  | 'HR / Compliance'
  | 'Platform Intelligence'
  | 'Communications'
  | 'Planning';

export interface BPAgent {
  behavior: AgentBehavior;
  category: AgentCategory;
  description: string;
  emoji: string;
  id: string;
  model: string;
  name: string;
  provider: string;
  temperature: number;
}

export const BEHAVIOR_LABELS: Record<AgentBehavior, string> = {
  'ask-first': 'Ask First',
  'execute': 'Execute',
  'minimal': 'Minimal',
  'platform': 'Platform',
  'soon': 'Soon',
};

export const BEHAVIOR_COLORS: Record<AgentBehavior, { bg: string; text: string }> = {
  'ask-first': { bg: 'rgba(236, 72, 153, 0.15)', text: '#F472B6' },
  'execute': { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399' },
  'minimal': { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24' },
  'platform': { bg: 'rgba(34, 211, 238, 0.15)', text: '#22D3EE' },
  'soon': { bg: 'rgba(107, 114, 128, 0.15)', text: '#6B7280' },
};

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'Communications': { bg: 'rgba(251, 146, 60, 0.12)', text: '#FB923C' },
  'Engineering': { bg: 'rgba(129, 140, 248, 0.12)', text: '#818CF8' },
  'Finance': { bg: 'rgba(248, 113, 113, 0.12)', text: '#F87171' },
  'HR / Compliance': { bg: 'rgba(192, 132, 252, 0.12)', text: '#C084FC' },
  'Maintenance': { bg: 'rgba(167, 139, 250, 0.12)', text: '#A78BFA' },
  'Management': { bg: 'rgba(244, 114, 182, 0.12)', text: '#F472B6' },
  'Operations': { bg: 'rgba(52, 211, 153, 0.12)', text: '#34D399' },
  'Planning': { bg: 'rgba(96, 165, 250, 0.12)', text: '#60A5FA' },
  'Platform Intelligence': { bg: 'rgba(34, 211, 238, 0.12)', text: '#22D3EE' },
  'Quality': { bg: 'rgba(96, 165, 250, 0.12)', text: '#60A5FA' },
  'Safety': { bg: 'rgba(251, 191, 36, 0.12)', text: '#FBBF24' },
  'Strategy': { bg: 'rgba(45, 212, 191, 0.12)', text: '#2DD4BF' },
};

export const FILTER_TABS = [
  'All',
  'Operations',
  'Quality',
  'Finance',
  'Safety',
  'Mgmt',
  'Eng',
  'Strategy',
] as const;

export const FILTER_MAP: Record<string, string[]> = {
  All: [],
  Eng: ['Engineering'],
  Finance: ['Finance'],
  Mgmt: ['Management'],
  Operations: ['Operations', 'Maintenance'],
  Quality: ['Quality'],
  Safety: ['Safety'],
  Strategy: ['Strategy', 'Platform Intelligence'],
};

export const AGENTS: BPAgent[] = [
  // ── Execute Immediately (7) ──
  {
    behavior: 'execute',
    category: 'Operations',
    description: 'Diagnose equipment issues with guided troubleshooting',
    emoji: '🔧',
    id: 'equipment-troubleshooting',
    model: 'anthropic/claude-sonnet-4',
    name: 'Equipment Troubleshooting',
    provider: 'openrouter',
    temperature: 0.4,
  },
  {
    behavior: 'execute',
    category: 'Quality',
    description: 'Search quality standards, SOPs, and compliance docs',
    emoji: '📑',
    id: 'quality-compliance-search',
    model: 'anthropic/claude-sonnet-4',
    name: 'Quality & Compliance Search',
    provider: 'openrouter',
    temperature: 0.2,
  },
  {
    behavior: 'execute',
    category: 'Operations',
    description: 'Generate structured shift handoff reports',
    emoji: '🔄',
    id: 'shift-handoff',
    model: 'anthropic/claude-haiku-4',
    name: 'Shift Handoff Report',
    provider: 'openrouter',
    temperature: 0.3,
  },
  {
    behavior: 'execute',
    category: 'Finance',
    description: 'Process invoices, POs, and packing slips',
    emoji: '🧾',
    id: 'invoice-po-processor',
    model: 'google/gemini-2.0-flash',
    name: 'Invoice & PO Processor',
    provider: 'openrouter',
    temperature: 0.2,
  },
  {
    behavior: 'execute',
    category: 'Maintenance',
    description: 'Create and manage maintenance work orders',
    emoji: '🔨',
    id: 'maintenance-work-order',
    model: 'anthropic/claude-haiku-4',
    name: 'Maintenance Work Order',
    provider: 'openrouter',
    temperature: 0.3,
  },
  {
    behavior: 'execute',
    category: 'Management',
    description: 'Summarize meetings, reviews, and discussions',
    emoji: '📝',
    id: 'meeting-summarizer',
    model: 'anthropic/claude-haiku-4',
    name: 'Meeting & Review Summarizer',
    provider: 'openrouter',
    temperature: 0.4,
  },
  {
    behavior: 'execute',
    category: 'HR / Compliance',
    description: 'Track training records and certification status',
    emoji: '🎓',
    id: 'training-certification',
    model: 'anthropic/claude-haiku-4',
    name: 'Training & Certification Tracker',
    provider: 'openrouter',
    temperature: 0.3,
  },

  // ── Ask Minimal (4) ──
  {
    behavior: 'minimal',
    category: 'Operations',
    description: 'Generate detailed maintenance and inspection reports',
    emoji: '📋',
    id: 'maintenance-report',
    model: 'anthropic/claude-haiku-4',
    name: 'Maintenance Report',
    provider: 'openrouter',
    temperature: 0.3,
  },
  {
    behavior: 'minimal',
    category: 'Engineering',
    description: 'Create technical drawings and process diagrams',
    emoji: '📐',
    id: 'technical-drawing',
    model: 'anthropic/claude-sonnet-4',
    name: 'Technical Drawing & Diagram',
    provider: 'openrouter',
    temperature: 0.4,
  },
  {
    behavior: 'minimal',
    category: 'Finance',
    description: 'Analyze costs, budgets, and spending trends',
    emoji: '💰',
    id: 'cost-budget-analyst',
    model: 'anthropic/claude-sonnet-4',
    name: 'Cost & Budget Analyst',
    provider: 'openrouter',
    temperature: 0.3,
  },
  {
    behavior: 'minimal',
    category: 'Operations',
    description: 'Manage shipping, tracking, and logistics',
    emoji: '🚚',
    id: 'shipping-logistics',
    model: 'anthropic/claude-haiku-4',
    name: 'Shipping & Logistics',
    provider: 'openrouter',
    temperature: 0.3,
  },

  // ── Ask First (5) ──
  {
    behavior: 'ask-first',
    category: 'Safety',
    description: 'Document and report safety incidents',
    emoji: '⚠️',
    id: 'safety-incident-reporter',
    model: 'anthropic/claude-sonnet-4',
    name: 'Safety Incident Reporter',
    provider: 'openrouter',
    temperature: 0.3,
  },
  {
    behavior: 'ask-first',
    category: 'Strategy',
    description: 'Coach continuous improvement and lean practices',
    emoji: '📈',
    id: 'continuous-improvement',
    model: 'anthropic/claude-sonnet-4',
    name: 'Continuous Improvement Coach',
    provider: 'openrouter',
    temperature: 0.6,
  },
  {
    behavior: 'ask-first',
    category: 'Management',
    description: 'Draft executive summaries and briefs',
    emoji: '👔',
    id: 'executive-brief',
    model: 'anthropic/claude-sonnet-4',
    name: 'Executive Brief',
    provider: 'openrouter',
    temperature: 0.5,
  },
  {
    behavior: 'ask-first',
    category: 'Strategy',
    description: 'Analyze decisions, risks, and opportunities',
    emoji: '🔍',
    id: 'due-diligence',
    model: 'anthropic/claude-sonnet-4',
    name: 'Due Diligence & Decision Analysis',
    provider: 'openrouter',
    temperature: 0.4,
  },
  {
    behavior: 'platform',
    category: 'Platform Intelligence',
    description: 'Teach and improve your entire workspace',
    emoji: '🧠',
    id: 'company-intelligence',
    model: 'anthropic/claude-sonnet-4',
    name: 'Company Intelligence Advisor',
    provider: 'openrouter',
    temperature: 0.5,
  },

  // ── Coming Soon (3) ──
  {
    behavior: 'soon',
    category: 'Communications',
    description: 'Draft and manage professional emails',
    emoji: '📧',
    id: 'smart-email',
    model: 'anthropic/claude-sonnet-4',
    name: 'Smart Email',
    provider: 'openrouter',
    temperature: 0.4,
  },
  {
    behavior: 'soon',
    category: 'Planning',
    description: 'Forecast demand and track inventory',
    emoji: '📊',
    id: 'demand-analyst',
    model: 'anthropic/claude-sonnet-4',
    name: 'Inventory & Demand Analyst',
    provider: 'openrouter',
    temperature: 0.3,
  },
  {
    behavior: 'soon',
    category: 'Strategy',
    description: 'Daily digest of priorities and insights',
    emoji: '💡',
    id: 'daily-insight',
    model: 'anthropic/claude-sonnet-4',
    name: 'Daily Insight',
    provider: 'openrouter',
    temperature: 0.5,
  },
];

/** Group agents by behavior section */
export const BEHAVIOR_SECTIONS: { agents: BPAgent[]; behavior: AgentBehavior; label: string }[] = [
  {
    agents: AGENTS.filter((a) => a.behavior === 'execute'),
    behavior: 'execute',
    label: '⚡ Execute Immediately',
  },
  {
    agents: AGENTS.filter((a) => a.behavior === 'minimal'),
    behavior: 'minimal',
    label: '💬 Ask Minimal',
  },
  {
    agents: AGENTS.filter((a) => a.behavior === 'ask-first' || a.behavior === 'platform'),
    behavior: 'ask-first',
    label: '❓ Ask First',
  },
  {
    agents: AGENTS.filter((a) => a.behavior === 'platform'),
    behavior: 'platform',
    label: '🧠 Platform Intelligence',
  },
  {
    agents: AGENTS.filter((a) => a.behavior === 'soon'),
    behavior: 'soon',
    label: '🔒 Coming Soon',
  },
];
