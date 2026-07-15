import type { JSX } from "react";

import { dashboardMetrics, liveMatches } from "./dashboard-data";
import { DashboardIcon } from "./dashboard-icons";
import styles from "./dashboard.module.css";

const metricToneClasses = {
  positive: styles.tonePositive,
  warning: styles.toneWarning,
  negative: styles.toneNegative,
  neutral: styles.toneNeutral,
  reasoning: styles.toneReasoning,
};

export function DashboardOverview(): JSX.Element {
  return (
    <>
      <section className={styles.metricsGrid} aria-label="Live dashboard metrics">
        {dashboardMetrics.map((metric) => (
          <article className={styles.metricCard} key={metric.label}>
            <div className={styles.metricTopLine}>
              <span className={`${styles.metricIcon} ${metricToneClasses[metric.tone]}`}>
                <DashboardIcon name={metric.icon} size={17} />
              </span>
              <button className={styles.compactAction} type="button" aria-label={`More about ${metric.label}`}>
                <DashboardIcon name="more" size={17} />
              </button>
            </div>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <div className={styles.metricFootnote}>
              <span className={metricToneClasses[metric.tone]}>{metric.change}</span>
              <small>{metric.detail}</small>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.overviewGrid} aria-label="Live match and consensus overview">
        <article className={`${styles.panel} ${styles.liveMatchPanel}`} id="live-match">
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.sectionKicker}>
                <span className={styles.liveDot} />
                Featured live match
              </div>
              <h3>Argentina v Morocco</h3>
            </div>
            <button className={styles.textAction} type="button">
              Open match room <DashboardIcon name="arrow-right" size={15} />
            </button>
          </div>

          <div className={styles.matchScoreboard}>
            <div className={styles.teamBlock}>
              <span className={`${styles.teamCrest} ${styles.argentinaCrest}`}>AR</span>
              <strong>Argentina</strong>
              <small>Home</small>
            </div>
            <div className={styles.scoreBlock}>
              <div>
                <strong>1</strong>
                <span>—</span>
                <strong>0</strong>
              </div>
              <p><span className={styles.liveDot} /> 67′ live</p>
              <small>World Cup · Group C</small>
            </div>
            <div className={styles.teamBlock}>
              <span className={`${styles.teamCrest} ${styles.moroccoCrest}`}>MA</span>
              <strong>Morocco</strong>
              <small>Away</small>
            </div>
          </div>

          <div className={styles.matchPulse}>
            <div className={styles.pulseHeading}>
              <span>Live momentum</span>
              <strong>Argentina +24</strong>
            </div>
            <svg aria-label="Momentum chart favoring Argentina" className={styles.momentumChart} role="img" viewBox="0 0 640 104">
              <defs>
                <linearGradient id="momentumArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#36A5FF" stopOpacity="0.34" />
                  <stop offset="100%" stopColor="#36A5FF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className={styles.chartGridLine} d="M0 24H640M0 52H640M0 80H640" />
              <path d="M0 81 C28 77 42 83 67 77 S102 53 125 61 S159 76 180 65 S224 40 249 49 S286 78 310 65 S341 29 365 38 S398 59 425 44 S457 18 482 27 S521 45 548 30 S588 10 640 14 L640 104 L0 104 Z" fill="url(#momentumArea)" />
              <path className={styles.chartLine} d="M0 81 C28 77 42 83 67 77 S102 53 125 61 S159 76 180 65 S224 40 249 49 S286 78 310 65 S341 29 365 38 S398 59 425 44 S457 18 482 27 S521 45 548 30 S588 10 640 14" />
              <circle className={styles.chartPoint} cx="548" cy="30" r="4" />
            </svg>
            <div className={styles.matchStats}>
              <span><strong>1.42</strong> xG</span>
              <span><strong>68%</strong> final-third possession</span>
              <span><strong>9–2</strong> high recoveries</span>
            </div>
          </div>

          <div className={styles.matchEvidence}>
            <span className={styles.evidenceLabel}>Why now</span>
            <p>Argentina’s high recoveries and final-third possession have held above their live baseline for 11 minutes.</p>
            <div className={styles.agentAvatars} aria-label="Supporting agents: Scout, Momentum, Consensus, Historical, Reporter">
              <span className={styles.avatarBlue}>SC</span>
              <span className={styles.avatarPurple}>MO</span>
              <span className={styles.avatarSlate}>HI</span>
              <span className={styles.avatarGreen}>CN</span>
              <span className={styles.avatarCounter}>+1</span>
            </div>
          </div>

          <div className={styles.otherLiveMatches}>
            {liveMatches.slice(1).map((match) => (
              <div className={styles.otherMatch} key={`${match.home}-${match.away}`}>
                <span className={styles.miniCrest}>{match.accent}</span>
                <span><strong>{match.home}</strong><small>{match.away}</small></span>
                <span className={styles.otherMatchScore}><strong>{match.score}</strong><small>{match.minute} live</small></span>
                <DashboardIcon name="chevron-right" size={16} />
              </div>
            ))}
          </div>
        </article>

        <article className={`${styles.panel} ${styles.consensusPanel}`} id="consensus">
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.sectionKicker}><DashboardIcon name="layers" size={14} /> Consensus pulse</div>
              <h3>Argentina v Morocco</h3>
            </div>
            <button className={styles.compactAction} type="button" aria-label="More consensus options">
              <DashboardIcon name="more" size={17} />
            </button>
          </div>

          <div className={styles.consensusScore}>
            <div className={styles.consensusRing}>
              <div><strong>78%</strong><span>confidence</span></div>
            </div>
            <div className={styles.consensusCopy}>
              <span className={styles.consensusLabel}>Current consensus</span>
              <strong>Argentina to maintain lead</strong>
              <p>Five modules agree. Risk remains the only partial dissent.</p>
            </div>
          </div>

          <div className={styles.outcomeList} aria-label="Outcome probability distribution">
            <div>
              <span>Argentina win</span><strong>78%</strong>
              <span className={`${styles.outcomeBar} ${styles.outcomeArgentina}`}><i /></span>
            </div>
            <div>
              <span>Draw</span><strong>15%</strong>
              <span className={`${styles.outcomeBar} ${styles.outcomeDraw}`}><i /></span>
            </div>
            <div>
              <span>Morocco win</span><strong>7%</strong>
              <span className={`${styles.outcomeBar} ${styles.outcomeMorocco}`}><i /></span>
            </div>
          </div>

          <div className={styles.consensusFooter}>
            <div>
              <DashboardIcon name="users" size={16} />
              <span><strong>5 of 6 agents</strong> in agreement</span>
            </div>
            <button type="button">View rationale <DashboardIcon name="arrow-right" size={14} /></button>
          </div>
        </article>
      </section>
    </>
  );
}
