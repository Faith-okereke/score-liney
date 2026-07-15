import type { JSX } from "react";

import { DashboardIcon } from "../dashboard/dashboard-icons";
import { matchEvents } from "./live-match-data";
import styles from "./live-matches.module.css";

const eventToneClasses = {
  positive: styles.eventPositive,
  warning: styles.eventWarning,
  negative: styles.eventNegative,
  neutral: styles.eventNeutral,
  reasoning: styles.eventReasoning,
};

const eventKindIcons = {
  goal: "target",
  chance: "activity",
  card: "alert",
  pressure: "pulse",
  substitution: "users",
} as const;

export function LiveMatchCommandCenter(): JSX.Element {
  return (
    <section className={styles.commandGrid} id="live-match" aria-label="Argentina versus Morocco live match room">
      <article className={styles.commandPanel}>
        <header className={styles.commandPanelHeader}>
          <div>
            <span className={styles.matchLabel}><i /> Live match room</span>
            <h3>Argentina v Morocco</h3>
          </div>
          <div className={styles.matchPanelActions}>
            <button type="button"><DashboardIcon name="bell" size={15} /> Watch</button>
            <button className={styles.primaryPanelAction} type="button">Open match room <DashboardIcon name="arrow-right" size={15} /></button>
          </div>
        </header>

        <div className={styles.scoreboard}>
          <div className={styles.scoreTeam}>
            <span className={`${styles.largeCrest} ${styles.argentinaCrest}`}>AR</span>
            <div><strong>Argentina</strong><small>Home · 4–3–3</small></div>
          </div>
          <div className={styles.centralScore}>
            <div><strong>1</strong><span>—</span><strong>0</strong></div>
            <p><i /> 67′ live</p>
            <small>World Cup · Group C</small>
          </div>
          <div className={`${styles.scoreTeam} ${styles.scoreTeamAway}`}>
            <div><strong>Morocco</strong><small>Away · 4–2–3–1</small></div>
            <span className={`${styles.largeCrest} ${styles.moroccoCrest}`}>MA</span>
          </div>
        </div>

        <div className={styles.matchSummaryBar}>
          <div><span>Match state</span><strong>Argentina controlling territory</strong></div>
          <div><span>Time remaining</span><strong>23′ + stoppage</strong></div>
          <div><span>Last key event</span><strong>Morocco substitution · 64′</strong></div>
        </div>

        <div className={styles.commandContentGrid}>
          <section className={styles.eventsSection} aria-labelledby="match-events-title">
            <div className={styles.subsectionHeader}>
              <div><span>Match timeline</span><h4 id="match-events-title">Important events</h4></div>
              <button type="button">Full timeline <DashboardIcon name="arrow-right" size={14} /></button>
            </div>
            <div className={styles.eventList}>
              {matchEvents.map((event) => (
                <article className={styles.eventItem} key={`${event.minute}-${event.title}`}>
                  <time>{event.minute}</time>
                  <span className={`${styles.eventIcon} ${eventToneClasses[event.tone]}`}>
                    <DashboardIcon name={eventKindIcons[event.kind]} size={14} />
                  </span>
                  <div>
                    <strong>{event.title}</strong>
                    <p>{event.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.momentumSection} aria-labelledby="momentum-title">
            <div className={styles.subsectionHeader}>
              <div><span>Live model</span><h4 id="momentum-title">Momentum &amp; expected goals</h4></div>
              <span className={styles.momentumValue}>Argentina +24</span>
            </div>
            <div className={styles.momentumLegend}>
              <span><i className={styles.argentinaLegend} /> Argentina</span>
              <span><i className={styles.moroccoLegend} /> Morocco</span>
            </div>
            <svg aria-label="Live momentum chart that favors Argentina" className={styles.liveMomentumChart} role="img" viewBox="0 0 555 183">
              <defs>
                <linearGradient id="liveMomentumArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3aa9ff" stopOpacity="0.31" />
                  <stop offset="100%" stopColor="#3aa9ff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="moroccoMomentumArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#e66f75" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#e66f75" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className={styles.liveChartGrid} d="M0 20H555M0 61H555M0 102H555M0 143H555" />
              <path d="M0 119 C19 113 30 130 52 115 S79 95 100 107 S126 129 149 118 S176 86 199 98 S223 122 245 111 S272 95 294 97 S323 78 346 83 S369 61 392 72 S421 101 445 87 S474 43 497 57 S527 40 555 35 L555 183 L0 183 Z" fill="url(#liveMomentumArea)" />
              <path d="M0 149 C18 151 29 137 50 151 S80 164 101 149 S132 130 151 139 S174 154 196 141 S226 119 247 132 S273 153 296 142 S320 129 345 135 S370 153 391 141 S421 120 445 132 S474 150 496 143 S530 156 555 148 L555 183 L0 183 Z" fill="url(#moroccoMomentumArea)" />
              <path className={styles.argentinaMomentumLine} d="M0 119 C19 113 30 130 52 115 S79 95 100 107 S126 129 149 118 S176 86 199 98 S223 122 245 111 S272 95 294 97 S323 78 346 83 S369 61 392 72 S421 101 445 87 S474 43 497 57 S527 40 555 35" />
              <path className={styles.moroccoMomentumLine} d="M0 149 C18 151 29 137 50 151 S80 164 101 149 S132 130 151 139 S174 154 196 141 S226 119 247 132 S273 153 296 142 S320 129 345 135 S370 153 391 141 S421 120 445 132 S474 150 496 143 S530 156 555 148" />
              <line className={styles.liveMarkerLine} x1="414" x2="414" y1="11" y2="169" />
              <circle className={styles.liveMarkerPoint} cx="414" cy="94" r="4" />
            </svg>
            <div className={styles.chartTimeScale}><span>0′</span><span>15′</span><span>30′</span><span>HT</span><span>60′</span><span>67′</span><span>90′</span></div>
            <div className={styles.liveStatCards}>
              <div><span>xG</span><strong>1.42 <i>—</i> 0.58</strong></div>
              <div><span>Final-third possession</span><strong>68% <i>—</i> 32%</strong></div>
              <div><span>High recoveries</span><strong>9 <i>—</i> 2</strong></div>
            </div>
          </section>
        </div>
      </article>

      <aside className={styles.insightStack} aria-label="Live match intelligence summary">
        <article className={styles.insightPanel}>
          <div className={styles.insightPanelHeader}>
            <span><DashboardIcon name="layers" size={14} /> Consensus meter</span>
            <button type="button" aria-label="More consensus options"><DashboardIcon name="more" size={17} /></button>
          </div>
          <div className={styles.consensusDisplay}>
            <div className={styles.liveConsensusRing}><div><strong>78%</strong><span>confidence</span></div></div>
            <div><small>Final consensus</small><strong>Argentina to maintain lead</strong><p>Five modules agree. Risk provides the only material dissent.</p></div>
          </div>
          <div className={styles.liveProbabilityRows}>
            <div><span>Argentina win</span><strong>78%</strong><i><b className={styles.argentinaProbability} /></i></div>
            <div><span>Draw</span><strong>15%</strong><i><b className={styles.drawProbability} /></i></div>
            <div><span>Morocco win</span><strong>7%</strong><i><b className={styles.moroccoProbability} /></i></div>
          </div>
          <button className={styles.viewRationale} type="button">Trace consensus reasoning <DashboardIcon name="arrow-right" size={14} /></button>
        </article>

        <article className={`${styles.insightPanel} ${styles.predictionPanel}`}>
          <div className={styles.insightPanelHeader}>
            <span><DashboardIcon name="target" size={14} /> Prediction confidence</span>
            <span className={styles.highConfidenceBadge}>High</span>
          </div>
          <strong className={styles.predictionTitle}>Argentina control pattern</strong>
          <p className={styles.predictionDescription}>The live model expects Argentina to protect their lead unless Morocco convert increased set-piece pressure.</p>
          <div className={styles.predictionEvidence}>
            <span><i /> 68% final-third possession</span>
            <span><i /> 5 agents supporting</span>
            <span><i /> Market drift aligned</span>
          </div>
        </article>

        <article className={`${styles.insightPanel} ${styles.commentaryPanel}`}>
          <div className={styles.insightPanelHeader}>
            <span><DashboardIcon name="sparkles" size={14} /> AI match commentary</span>
            <time>Updated now</time>
          </div>
          <p>Argentina are turning Morocco’s direct approach into repeat recoveries. The next decisive phase is likely to come from whether Morocco can sustain pressure after a dead-ball restart.</p>
          <button type="button">Open commentary stream <DashboardIcon name="arrow-right" size={14} /></button>
        </article>
      </aside>
    </section>
  );
}
