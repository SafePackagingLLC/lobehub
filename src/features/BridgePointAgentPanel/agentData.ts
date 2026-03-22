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
  name: string;
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
    name: 'Equipment Troubleshooting',
  },
  {
    behavior: 'execute',
    category: 'Quality',
    description: 'Search quality standards, SOPs, and compliance docs',
    emoji: '📑',
    id: 'quality-compliance-search',
    name: 'Quality & Compliance Search',
  },
  {
    behavior: 'execute',
    category: 'Operations',
    description: 'Generate structured shift handoff reports',
    emoji: '🔄',
    id: 'shift-handoff',
    name: 'Shift Handoff Report',
  },
  {
    behavior: 'execute',
    category: 'Finance',
    description: 'Process invoices, POs, and packing slips',
    emoji: '🧾',
    id: 'invoice-po-processor',
    name: 'Invoice & PO Processor',
  },
  {
    behavior: 'execute',
    category: 'Maintenance',
    description: 'Create and manage maintenance work orders',
    emoji: '🔨',
    id: 'maintenance-work-order',
    name: 'Maintenance Work Order',
  },
  {
    behavior: 'execute',
    category: 'Management',
    description: 'Summarize meetings, reviews, and discussions',
    emoji: '📝',
    id: 'meeting-summarizer',
    name: 'Meeting & Review Summarizer',
  },
  {
    behavior: 'execute',
    category: 'HR / Compliance',
    description: 'Track training records and certification status',
    emoji: '🎓',
    id: 'training-certification',
    name: 'Training & Certification Tracker',
  },

  // ── Ask Minimal (4) ──
  {
    behavior: 'minimal',
    category: 'Operations',
    description: 'Generate detailed maintenance and inspection reports',
    emoji: '📋',
    id: 'maintenance-report',
    name: 'Maintenance Report',
  },
  {
    behavior: 'minimal',
    category: 'Engineering',
    description: 'Create technical drawings and process diagrams',
    emoji: '📐',
    id: 'technical-drawing',
    name: 'Technical Drawing & Diagram',
  },
  {
    behavior: 'minimal',
    category: 'Finance',
    description: 'Analyze costs, budgets, and spending trends',
    emoji: '💰',
    id: 'cost-budget-analyst',
    name: 'Cost & Budget Analyst',
  },
  {
    behavior: 'minimal',
    category: 'Operations',
    description: 'Manage shipping, tracking, and logistics',
    emoji: '🚚',
    id: 'shipping-logistics',
    name: 'Shipping & Logistics',
  },

  // ── Ask First (5) ──
  {
    behavior: 'ask-first',
    category: 'Safety',
    description: 'Document and report safety incidents',
    emoji: '⚠️',
    id: 'safety-incident-reporter',
    name: 'Safety Incident Reporter',
  },
  {
    behavior: 'ask-first',
    category: 'Strategy',
    description: 'Coach continuous improvement and lean practices',
    emoji: '📈',
    id: 'continuous-improvement',
    name: 'Continuous Improvement Coach',
  },
  {
    behavior: 'ask-first',
    category: 'Management',
    description: 'Draft executive summaries and briefs',
    emoji: '👔',
    id: 'executive-brief',
    name: 'Executive Brief',
  },
  {
    behavior: 'ask-first',
    category: 'Strategy',
    description: 'Analyze decisions, risks, and opportunities',
    emoji: '🔍',
    id: 'due-diligence',
    name: 'Due Diligence & Decision Analysis',
  },
  {
    behavior: 'platform',
    category: 'Platform Intelligence',
    description: 'Teach and improve your entire workspace',
    emoji: '🧠',
    id: 'company-intelligence',
    name: 'Company Intelligence Advisor',
  },

  // ── Coming Soon (3) ──
  {
    behavior: 'soon',
    category: 'Communications',
    description: 'Draft and manage professional emails',
    emoji: '📧',
    id: 'smart-email',
    name: 'Smart Email',
  },
  {
    behavior: 'soon',
    category: 'Planning',
    description: 'Forecast demand and track inventory',
    emoji: '📊',
    id: 'demand-analyst',
    name: 'Inventory & Demand Analyst',
  },
  {
    behavior: 'soon',
    category: 'Strategy',
    description: 'Daily digest of priorities and insights',
    emoji: '💡',
    id: 'daily-insight',
    name: 'Daily Insight',
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
