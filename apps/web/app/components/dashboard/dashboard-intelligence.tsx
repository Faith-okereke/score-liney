import type { JSX } from "react";

import { agents, signals } from "./dashboard-data";
import { DashboardIcon } from "./dashboard-icons";
import styles from "./dashboard.module.css";

const agentToneClasses = {
  positive: styles.agentTonePositive,
  warning: styles.agentToneWarning,
  negative: styles.agentToneNegative,
  neutral: styles.agentToneNeutral,
  reasoning: styles.agentToneReasoning,
};

const signalToneClasses = {
  positive: styles.signalPositive,
  warning: styles.signalWarning,
  negative: styles.signalNegative,
  neutral: styles.signalNeutral,
  reasoning: styles.signalReasoning,
};

export function DashboardIntelligence(): JSX.Element {
  return (
    <section className={styles.intelligenceGrid} aria-label="Active intelligence">
      <article className={styles.panel} id="signals">
        <div className={styles.panelHeader}>
          <div>
            <div className={styles.sectionKicker}><DashboardIcon name="sparkles" size={14} /> Latest signals</div>
            <h3>Signal queue</h3>
          </div>
          <button className={styles.textAction} type="button">All signals <DashboardIcon name="arrow-right" size={15} /></button>
        </div>
        <div className={styles.signalList}>
          {signals.map((signal) => (
            <article className={styles.signalItem} key={`${signal.time}-${signal.label}`}>
              <span className={`${styles.signalMarker} ${signalToneClasses[signal.tone]}`} />
              <div className={styles.signalContent}>
                <div>
                  <span className={styles.signalLabel}>{signal.label}</span>
                  <time>{signal.time}</time>
                </div>
                <strong>{signal.match}</strong>
                <p>{signal.detail}</p>
              </div>
              <span className={`${styles.confidencePill} ${signalToneClasses[signal.tone]}`}>{signal.confidence}</span>
            </article>
          ))}
        </div>
      </article>

      <article className={styles.panel} id="agents">
        <div className={styles.panelHeader}>
          <div>
            <div className={styles.sectionKicker}><DashboardIcon name="bot" size={14} /> Agent confidence</div>
            <h3>Active reasoning modules</h3>
          </div>
          <button className={styles.compactAction} type="button" aria-label="More agent options">
            <DashboardIcon name="more" size={17} />
          </button>
        </div>
        <div className={styles.agentList}>
          {agents.map((agent) => (
            <article className={styles.agentItem} key={agent.name}>
              <span className={`${styles.agentAvatar} ${agentToneClasses[agent.tone]}`}>{agent.initials}</span>
              <div className={styles.agentCopy}>
                <div><strong>{agent.name}</strong><span>{agent.confidence}%</span></div>
                <small>{agent.specialty}</small>
                <p>{agent.conclusion}</p>
              </div>
              <div className={styles.agentScore}>
                <span><i className={agentToneClasses[agent.tone]} /><b>{agent.confidence}%</b></span>
                <small>{agent.accuracy} accuracy</small>
              </div>
            </article>
          ))}
        </div>
        <button className={styles.panelFooterAction} type="button">
          Compare all agent positions <DashboardIcon name="arrow-right" size={15} />
        </button>
      </article>

      <article className={styles.panel} id="market-volatility">
        <div className={styles.panelHeader}>
          <div>
            <div className={styles.sectionKicker}><DashboardIcon name="pulse" size={14} /> Market volatility</div>
            <h3>Movement watch</h3>
          </div>
          <button className={styles.periodSelector} type="button">90 min <DashboardIcon name="chevron-down" size={14} /></button>
        </div>
        <div className={styles.volatilityMetric}>
          <strong>6.2<span>/10</span></strong>
          <p><span className={styles.statusWarning}>Elevated</span> across tracked live markets</p>
        </div>
        <svg aria-label="Market volatility chart" className={styles.volatilityChart} role="img" viewBox="0 0 380 136">
          <defs>
            <linearGradient id="volatilityArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#F0B555" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#F0B555" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className={styles.chartGridLine} d="M0 24H380M0 64H380M0 104H380" />
          <path d="M0 99 L25 94 L48 96 L74 76 L98 88 L120 68 L147 75 L171 46 L195 64 L224 59 L248 26 L270 42 L293 31 L321 54 L350 36 L380 43 L380 136 L0 136 Z" fill="url(#volatilityArea)" />
          <path className={styles.volatilityLine} d="M0 99 L25 94 L48 96 L74 76 L98 88 L120 68 L147 75 L171 46 L195 64 L224 59 L248 26 L270 42 L293 31 L321 54 L350 36 L380 43" />
          <circle className={styles.volatilityPoint} cx="248" cy="26" r="4" />
        </svg>
        <div className={styles.volatilityEvents}>
          <span><i /> Argentina 1X2</span>
          <span><i /> Japan v Croatia goals</span>
        </div>
      </article>
    </section>
  );
}
