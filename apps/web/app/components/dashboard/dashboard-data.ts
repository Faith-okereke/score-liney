import type { IconName } from "./dashboard-icons";

export type SemanticTone = "positive" | "warning" | "negative" | "neutral" | "reasoning";

export interface NavigationItem {
  label: string;
  href: string;
  icon: IconName;
  badge?: string;
  active?: boolean;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export interface DashboardMetric {
  label: string;
  value: string;
  change: string;
  detail: string;
  icon: IconName;
  tone: SemanticTone;
}

export interface Signal {
  time: string;
  label: string;
  match: string;
  confidence: string;
  detail: string;
  tone: SemanticTone;
}

export interface Agent {
  initials: string;
  name: string;
  specialty: string;
  confidence: number;
  conclusion: string;
  accuracy: string;
  tone: SemanticTone;
}

export interface ReasoningItem {
  title: string;
  description: string;
  source: string;
  time: string;
  tone: SemanticTone;
}

export interface ActivityItem {
  title: string;
  detail: string;
  time: string;
  icon: IconName;
  tone: SemanticTone;
}

export interface Opportunity {
  id: string;
  match: string;
  market: string;
  signal: string;
  confidence: string;
  agents: string;
  evidence: string;
  tone: SemanticTone;
}

export const navigationGroups: NavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/", icon: "grid", active: true },
      { label: "Live Matches", href: "/live-matches", icon: "activity", badge: "3" },
      { label: "Fixtures", href: "#fixtures", icon: "calendar" },
      { label: "Markets", href: "#market-volatility", icon: "chart" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Agents", href: "#agents", icon: "bot" },
      { label: "Predictions", href: "#opportunities", icon: "target" },
      { label: "Signals", href: "#signals", icon: "sparkles", badge: "8" },
      { label: "Consensus", href: "#consensus", icon: "layers" },
      { label: "Replay", href: "#reasoning", icon: "replay" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Portfolio", href: "#opportunities", icon: "briefcase" },
      { label: "Analytics", href: "#accuracy", icon: "trending-up" },
      { label: "Notifications", href: "#activity", icon: "bell", badge: "4" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "#settings", icon: "settings" },
      { label: "Help", href: "#help", icon: "user" },
    ],
  },
];

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "Live matches",
    value: "03",
    change: "+1 in the last hour",
    detail: "Live World Cup coverage",
    icon: "activity",
    tone: "positive",
  },
  {
    label: "Prediction accuracy",
    value: "78.4%",
    change: "+4.8% vs. 30d average",
    detail: "286 resolved calls",
    icon: "target",
    tone: "positive",
  },
  {
    label: "Consensus confidence",
    value: "81.6%",
    change: "High agreement across live modules",
    detail: "Across active reasoning streams",
    icon: "layers",
    tone: "reasoning",
  },
  {
    label: "Market volatility",
    value: "Moderate",
    change: "6 sharp movements tracked",
    detail: "Tracked over the last 90 minutes",
    icon: "pulse",
    tone: "warning",
  },
];

export const liveMatches = [
  { home: "Argentina", away: "Morocco", score: "1 — 0", minute: "67′", accent: "AR" },
  { home: "Japan", away: "Croatia", score: "0 — 0", minute: "54′", accent: "JP" },
  { home: "Mexico", away: "Senegal", score: "2 — 1", minute: "31′", accent: "MX" },
];

export const signals: Signal[] = [
  {
    time: "2m ago",
    label: "Momentum shift",
    match: "Argentina v Morocco",
    confidence: "87%",
    detail: "Argentina's final-third entries have risen 42% since 55′ and now dominate the live pattern.",
    tone: "positive",
  },
  {
    time: "8m ago",
    label: "Risk alert",
    match: "Japan v Croatia",
    confidence: "64%",
    detail: "Croatia’s transition threat is increasing after two wide overloads.",
    tone: "warning",
  },
  {
    time: "14m ago",
    label: "Consensus formed",
    match: "Mexico v Senegal",
    confidence: "76%",
    detail: "Five agents now support Mexico to protect the lead through controlled possession.",
    tone: "reasoning",
  },
];

export const agents: Agent[] = [
  {
    initials: "SC",
    name: "Scout",
    specialty: "Live event scan",
    confidence: 92,
    conclusion: "Argentina pressure persists",
    accuracy: "81.2%",
    tone: "positive",
  },
  {
    initials: "MO",
    name: "Momentum",
    specialty: "Tempo & territory",
    confidence: 88,
    conclusion: "Home-side edge strengthening",
    accuracy: "79.7%",
    tone: "reasoning",
  },
  {
    initials: "HI",
    name: "Historical",
    specialty: "Pattern library",
    confidence: 74,
    conclusion: "Match state favours control",
    accuracy: "77.9%",
    tone: "neutral",
  },
  {
    initials: "RI",
    name: "Risk",
    specialty: "Contrarian exposure",
    confidence: 61,
    conclusion: "Set-piece risk remains",
    accuracy: "75.1%",
    tone: "warning",
  },
];

export const reasoningItems: ReasoningItem[] = [
  {
    title: "Why Argentina’s control signal strengthened",
    description:
      "Possession in Morocco’s half has held above 68% for 11 minutes, while high recoveries now outnumber Morocco’s progressive passes 9–2.",
    source: "Momentum + Scout",
    time: "Updated 2m ago",
    tone: "reasoning",
  },
  {
    title: "What prevents a full-conviction call",
    description:
      "Risk flags Morocco’s seven set-piece entries and a late-match historical scoring pattern. The model holds back 9 confidence points.",
    source: "Risk + Historical",
    time: "Updated 5m ago",
    tone: "warning",
  },
  {
    title: "Mexico’s lead remains structurally sound",
    description:
      "Mexico is limiting central entries and converting defensive recoveries into controlled possession rather than low-quality transitions.",
    source: "Consensus engine",
    time: "Updated 13m ago",
    tone: "positive",
  },
];

export const activityItems: ActivityItem[] = [
  {
    title: "Scout ingested a new event cluster",
    detail: "Argentina v Morocco · 5 events correlated",
    time: "Now",
    icon: "scan",
    tone: "reasoning",
  },
  {
    title: "Consensus recalculated",
    detail: "Argentina win outlook moved 73% → 78%",
    time: "2m",
    icon: "layers",
    tone: "positive",
  },
  {
    title: "Risk module raised an exception",
    detail: "Morocco set-piece exposure is above baseline",
    time: "6m",
    icon: "alert",
    tone: "warning",
  },
  {
    title: "Historical model resolved a pattern",
    detail: "Matched 18 similar 1–0 game states",
    time: "11m",
    icon: "database",
    tone: "neutral",
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "argentina-control",
    match: "Argentina v Morocco",
    market: "Match outcome",
    signal: "Argentina to maintain lead",
    confidence: "78%",
    agents: "5 / 6 agree",
    evidence: "Territory, recovery rate, live xG trend",
    tone: "positive",
  },
  {
    id: "japan-croatia-goals",
    match: "Japan v Croatia",
    market: "Match tempo",
    signal: "Late-event probability rising",
    confidence: "67%",
    agents: "4 / 6 agree",
    evidence: "Wide overloads, transition rate, price drift",
    tone: "warning",
  },
  {
    id: "mexico-senegal-control",
    match: "Mexico v Senegal",
    market: "Game state",
    signal: "Mexico control pattern",
    confidence: "76%",
    agents: "5 / 6 agree",
    evidence: "Defensive shape, possession quality, history",
    tone: "reasoning",
  },
];
