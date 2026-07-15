export type LiveTone = "positive" | "warning" | "negative" | "neutral" | "reasoning";

export interface MatchEvent {
  minute: string;
  title: string;
  detail: string;
  tone: LiveTone;
  kind: "goal" | "chance" | "card" | "pressure" | "substitution";
}

export interface AgentOpinion {
  initials: string;
  agent: string;
  specialty: string;
  stance: string;
  confidence: number;
  reasoning: string;
  tone: LiveTone;
}

export interface LiveFixture {
  home: string;
  away: string;
  score: string;
  minute: string;
  group: string;
  state: "live" | "upcoming";
}

export const matchEvents: MatchEvent[] = [
  {
    minute: "13′",
    title: "Morocco tests the near post",
    detail: "El Khannouss reaches the byline; the cutback is cleared inside the six-yard box.",
    tone: "warning",
    kind: "chance",
  },
  {
    minute: "27′",
    title: "Goal · Argentina 1–0 Morocco",
    detail: "Álvarez finishes a five-pass move after a turnover in Morocco’s right channel.",
    tone: "positive",
    kind: "goal",
  },
  {
    minute: "43′",
    title: "Morocco disrupts the rhythm",
    detail: "A tactical foul stops an Argentina break; Risk marks the set-piece phase as elevated.",
    tone: "warning",
    kind: "card",
  },
  {
    minute: "55′",
    title: "Argentina’s pressure cycle begins",
    detail: "Three high recoveries in four minutes push the live momentum index above 70.",
    tone: "reasoning",
    kind: "pressure",
  },
  {
    minute: "64′",
    title: "Morocco add a direct runner",
    detail: "A front-line change increases transition speed but leaves more space between the lines.",
    tone: "neutral",
    kind: "substitution",
  },
];

export const agentOpinions: AgentOpinion[] = [
  {
    initials: "SC",
    agent: "Scout",
    specialty: "Live event scan",
    stance: "Control is holding",
    confidence: 92,
    reasoning: "Argentina have won 9 of the last 11 second balls in Morocco’s half.",
    tone: "positive",
  },
  {
    initials: "MO",
    agent: "Momentum",
    specialty: "Territory & tempo",
    stance: "Pressure is accelerating",
    confidence: 88,
    reasoning: "The momentum index has remained positive for 12 minutes after the tactical shift.",
    tone: "reasoning",
  },
  {
    initials: "HI",
    agent: "Historical",
    specialty: "Pattern library",
    stance: "Game state favours the leader",
    confidence: 74,
    reasoning: "Comparable 1–0 World Cup states resolve without an equaliser 71% of the time.",
    tone: "neutral",
  },
  {
    initials: "RI",
    agent: "Risk",
    specialty: "Contrarian exposure",
    stance: "Set-piece caveat remains",
    confidence: 61,
    reasoning: "Morocco have created seven dead-ball entries; this is the strongest counter-signal.",
    tone: "warning",
  },
  {
    initials: "DA",
    agent: "Devil’s Advocate",
    specialty: "Disconfirming evidence",
    stance: "Watch the wide channel",
    confidence: 58,
    reasoning: "Argentina’s left side is vulnerable when the full-back steps into the press.",
    tone: "negative",
  },
  {
    initials: "CN",
    agent: "Consensus",
    specialty: "Cross-agent synthesis",
    stance: "Maintain lead outlook",
    confidence: 78,
    reasoning: "Five agents agree; counter-signals are insufficient to reverse the current view.",
    tone: "positive",
  },
];

export const liveFixtures: LiveFixture[] = [
  { home: "Argentina", away: "Morocco", score: "1 — 0", minute: "67′", group: "Group C", state: "live" },
  { home: "Japan", away: "Croatia", score: "0 — 0", minute: "54′", group: "Group F", state: "live" },
  { home: "Mexico", away: "Senegal", score: "2 — 1", minute: "31′", group: "Group D", state: "live" },
  { home: "Colombia", away: "Korea Republic", score: "20:00", minute: "Upcoming", group: "Group B", state: "upcoming" },
];

export const historicalComparisons = [
  { label: "Leader held the result", value: "71%", detail: "of 18 comparable World Cup states", tone: "positive" as LiveTone },
  { label: "Equaliser after 65′", value: "17%", detail: "mostly following set-piece pressure", tone: "warning" as LiveTone },
  { label: "Second goal for leader", value: "12%", detail: "when final-third dominance persists", tone: "neutral" as LiveTone },
];
