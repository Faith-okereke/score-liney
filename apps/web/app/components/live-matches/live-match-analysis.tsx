import type { JSX } from "react";

import { DashboardIcon } from "../dashboard/dashboard-icons";
import { agentOpinions, historicalComparisons } from "./live-match-data";
import styles from "./live-matches.module.css";

const agentToneClasses = {
  positive: styles.agentPositive,
  warning: styles.agentWarning,
  negative: styles.agentNegative,
  neutral: styles.agentNeutral,
  reasoning: styles.agentReasoning,
};

export function LiveMatchAnalysis(): JSX.Element {
  return (
    <section className={styles.analysisSection} aria-label="Live match supporting analysis">
      <div className={styles.analysisTopGrid}>
        <article className={styles.analysisPanel}>
          <header className={styles.analysisPanelHeader}>
            <div><span><DashboardIcon name="chart" size={14} /> Odds history</span><h3>Market movement &amp; live confidence</h3></div>
            <button type="button">90 minutes <DashboardIcon name="chevron-down" size={14} /></button>
          </header>
          <div className={styles.oddsSummary}>
            <div><span>Argentina win</span><strong>1.48</strong><small><i /> −0.12 since 55′</small></div>
            <div><span>Draw</span><strong>3.92</strong><small>+0.21 since 55′</small></div>
            <div><span>Morocco win</span><strong>8.40</strong><small>+1.04 since 55′</small></div>
          </div>
          <div className={styles.oddsChartWrap}>
            <div className={styles.oddsLegend}><span><i className={styles.oddsArgentina} /> Argentina</span><span><i className={styles.oddsDraw} /> Draw</span><span><i className={styles.oddsMorocco} /> Morocco</span></div>
            <svg aria-label="Odds history chart" className={styles.oddsChart} role="img" viewBox="0 0 720 184">
              <path className={styles.oddsGrid} d="M0 22H720M0 63H720M0 104H720M0 145H720" />
              <path className={styles.oddsArgentinaLine} d="M0 52 C30 49 51 57 82 54 S126 64 157 60 S208 73 240 67 S287 79 319 74 S360 88 395 80 S439 98 473 91 S522 108 557 102 S601 118 637 111 S684 121 720 115" />
              <path className={styles.oddsDrawLine} d="M0 104 C31 101 52 107 83 105 S128 99 158 102 S207 93 238 96 S287 85 320 91 S360 79 396 84 S436 72 474 77 S521 65 556 71 S604 58 638 65 S682 51 720 57" />
              <path className={styles.oddsMoroccoLine} d="M0 136 C31 133 50 139 81 135 S129 127 159 132 S207 122 239 127 S288 118 319 124 S363 112 395 119 S440 108 473 114 S521 100 556 108 S601 94 638 101 S682 89 720 95" />
              <line className={styles.oddsMarker} x1="452" x2="452" y1="10" y2="161" />
              <circle className={styles.oddsMarkerPoint} cx="452" cy="95" r="4" />
            </svg>
            <div className={styles.oddsTimeScale}><span>Kickoff</span><span>15′</span><span>30′</span><span>HT</span><span>55′</span><span>67′</span><span>90′</span></div>
          </div>
          <div className={styles.oddsInsight}>
            <DashboardIcon name="sparkles" size={16} />
            <p><strong>Why the movement matters:</strong> the sharpest shift begins with Argentina’s sustained pressure at 55′ and remains aligned with the consensus model.</p>
          </div>
        </article>

        <article className={`${styles.analysisPanel} ${styles.historyPanel}`}>
          <header className={styles.analysisPanelHeader}>
            <div><span><DashboardIcon name="database" size={14} /> Historical comparison</span><h3>Similar match states</h3></div>
            <button className={styles.simpleIconButton} type="button" aria-label="More historical comparison options"><DashboardIcon name="more" size={17} /></button>
          </header>
          <p className={styles.historyLead}>18 World Cup matches matched on scoreline, minute, possession profile, and shot quality.</p>
          <div className={styles.historyBars}>
            {historicalComparisons.map((comparison) => (
              <div className={styles.historyBar} key={comparison.label}>
                <div><span>{comparison.label}</span><strong className={agentToneClasses[comparison.tone]}>{comparison.value}</strong></div>
                <i><b className={agentToneClasses[comparison.tone]} /></i>
                <small>{comparison.detail}</small>
              </div>
            ))}
          </div>
          <div className={styles.historyCallout}>
            <span>Comparable insight</span>
            <p>Leaders in this state retain the ball longer after 65′ when high recoveries exceed the opponent by six or more.</p>
          </div>
        </article>
      </div>

      <article className={`${styles.analysisPanel} ${styles.agentOpinionsPanel}`}>
        <header className={styles.analysisPanelHeader}>
          <div><span><DashboardIcon name="bot" size={14} /> Agent opinions</span><h3>How the intelligence team sees the match</h3></div>
          <button className={styles.compareAgentsButton} type="button">Compare positions <DashboardIcon name="arrow-right" size={15} /></button>
        </header>
        <div className={styles.agentOpinionGrid}>
          {agentOpinions.map((opinion) => (
            <article className={styles.agentOpinion} key={opinion.agent}>
              <div className={styles.agentOpinionTop}>
                <span className={`${styles.liveAgentAvatar} ${agentToneClasses[opinion.tone]}`}>{opinion.initials}</span>
                <div><strong>{opinion.agent}</strong><small>{opinion.specialty}</small></div>
                <span className={`${styles.agentOpinionConfidence} ${agentToneClasses[opinion.tone]}`}>{opinion.confidence}%</span>
              </div>
              <h4>{opinion.stance}</h4>
              <p>{opinion.reasoning}</p>
              <div className={styles.agentOpinionFooter}><span><i className={agentToneClasses[opinion.tone]} /> Live confidence</span><button type="button" aria-label={`Open ${opinion.agent} reasoning`}><DashboardIcon name="arrow-right" size={14} /></button></div>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}
