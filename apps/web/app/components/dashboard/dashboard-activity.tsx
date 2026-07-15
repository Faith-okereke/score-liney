import type { JSX } from "react";

import { activityItems, opportunities, reasoningItems } from "./dashboard-data";
import { DashboardIcon } from "./dashboard-icons";
import styles from "./dashboard.module.css";

const activityToneClasses = {
  positive: styles.activityPositive,
  warning: styles.activityWarning,
  negative: styles.activityNegative,
  neutral: styles.activityNeutral,
  reasoning: styles.activityReasoning,
};

export function DashboardActivity(): JSX.Element {
  return (
    <section className={styles.activitySection} aria-label="Reasoning and performance analysis">
      <div className={styles.reasoningGrid}>
        <article className={styles.panel} id="reasoning">
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.sectionKicker}><DashboardIcon name="sparkles" size={14} /> Recent reasoning</div>
              <h3>Evidence, not just outcomes</h3>
            </div>
            <button className={styles.textAction} type="button">Open replay <DashboardIcon name="arrow-right" size={15} /></button>
          </div>
          <div className={styles.reasoningList}>
            {reasoningItems.map((item) => (
              <article className={styles.reasoningItem} key={item.title}>
                <span className={`${styles.reasoningTimeline} ${activityToneClasses[item.tone]}`}><i /></span>
                <div>
                  <div className={styles.reasoningMeta}>
                    <span className={activityToneClasses[item.tone]}>{item.source}</span>
                    <time>{item.time}</time>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className={styles.panel} id="activity">
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.sectionKicker}><DashboardIcon name="wave" size={14} /> Live feed</div>
              <h3>System activity</h3>
            </div>
            <span className={styles.feedStatus}><i /> Streaming</span>
          </div>
          <div className={styles.activityList}>
            {activityItems.map((item) => (
              <article className={styles.activityItem} key={item.title}>
                <span className={`${styles.activityIcon} ${activityToneClasses[item.tone]}`}><DashboardIcon name={item.icon} size={16} /></span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
                <time>{item.time}</time>
              </article>
            ))}
          </div>
          <button className={styles.panelFooterAction} type="button">
            Inspect full activity log <DashboardIcon name="arrow-right" size={15} />
          </button>
        </article>
      </div>

      <div className={styles.performanceGrid}>
        <article className={`${styles.panel} ${styles.opportunitiesPanel}`} id="opportunities">
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.sectionKicker}><DashboardIcon name="target" size={14} /> Current opportunities</div>
              <h3>Explainable positions</h3>
            </div>
            <button className={styles.textAction} type="button">View all <DashboardIcon name="arrow-right" size={15} /></button>
          </div>
          <div className={styles.opportunityTableWrap}>
            <table className={styles.opportunityTable}>
              <caption>Active opportunities with supporting evidence</caption>
              <thead>
                <tr>
                  <th scope="col">Match &amp; signal</th>
                  <th scope="col">Confidence</th>
                  <th scope="col">Agreement</th>
                  <th scope="col">Evidence considered</th>
                  <th scope="col"><span className={styles.visuallyHidden}>Open</span></th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opportunity) => (
                  <tr key={opportunity.id}>
                    <td>
                      <div className={styles.tableSignal}>
                        <span className={`${styles.tableIndicator} ${activityToneClasses[opportunity.tone]}`} />
                        <span><small>{opportunity.match} · {opportunity.market}</small><strong>{opportunity.signal}</strong></span>
                      </div>
                    </td>
                    <td><strong className={activityToneClasses[opportunity.tone]}>{opportunity.confidence}</strong></td>
                    <td><span className={styles.agreementChip}>{opportunity.agents}</span></td>
                    <td><span className={styles.evidenceCell}>{opportunity.evidence}</span></td>
                    <td><button className={styles.rowAction} type="button" aria-label={`Open ${opportunity.match} opportunity`}><DashboardIcon name="chevron-right" size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className={`${styles.panel} ${styles.accuracyPanel}`} id="accuracy">
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.sectionKicker}><DashboardIcon name="trending-up" size={14} /> Performance</div>
              <h3>Prediction accuracy</h3>
            </div>
            <button className={styles.periodSelector} type="button">30 days <DashboardIcon name="chevron-down" size={14} /></button>
          </div>
          <div className={styles.accuracyValue}>
            <strong>78.4%</strong>
            <span><DashboardIcon name="trending-up" size={14} /> 4.8% above baseline</span>
          </div>
          <svg aria-label="30-day prediction accuracy trend" className={styles.accuracyChart} role="img" viewBox="0 0 390 138">
            <defs>
              <linearGradient id="accuracyArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4DE0A0" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4DE0A0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className={styles.chartGridLine} d="M0 20H390M0 61H390M0 102H390" />
            <path d="M0 104 C20 102 26 92 43 96 S71 98 89 86 S111 70 128 76 S149 97 166 88 S195 63 213 68 S244 77 262 60 S284 35 303 46 S337 55 354 40 S372 30 390 33 L390 138 L0 138 Z" fill="url(#accuracyArea)" />
            <path className={styles.accuracyLine} d="M0 104 C20 102 26 92 43 96 S71 98 89 86 S111 70 128 76 S149 97 166 88 S195 63 213 68 S244 77 262 60 S284 35 303 46 S337 55 354 40 S372 30 390 33" />
            <circle className={styles.accuracyPoint} cx="390" cy="33" r="4" />
          </svg>
          <div className={styles.accuracyLegend}>
            <span><i /> Overall accuracy</span>
            <span>286 resolved calls</span>
          </div>
        </article>
      </div>
    </section>
  );
}
