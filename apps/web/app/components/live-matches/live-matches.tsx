import type { JSX } from "react";

import { DashboardHeader } from "../dashboard/dashboard-header";
import { DashboardIcon } from "../dashboard/dashboard-icons";
import { DashboardSidebar } from "../dashboard/dashboard-sidebar";
import sharedStyles from "../dashboard/dashboard.module.css";
import { liveFixtures } from "./live-match-data";
import { LiveMatchAnalysis } from "./live-match-analysis";
import { LiveMatchCommandCenter } from "./live-match-command-center";
import styles from "./live-matches.module.css";

export function LiveMatches(): JSX.Element {
  return (
    <div className={sharedStyles.dashboardPage}>
      <DashboardSidebar activeItem="Live Matches" />
      <main className={sharedStyles.mainContent}>
        <DashboardHeader
          breadcrumb="Live monitoring"
          liveActionHref="#live-match"
          liveActionLabel="3 live now"
          title="Live Matches"
        />
        <div className={`${sharedStyles.contentScroll} ${styles.liveContent}`}>
          <section className={styles.pageIntro} aria-labelledby="live-matches-title">
            <div>
              <p>World Cup · live intelligence desk</p>
              <h2 id="live-matches-title">Every live call, with its evidence.</h2>
              <span>Follow the match state, agent disagreements, and the signals changing the outlook in real time.</span>
            </div>
            <div className={styles.connectionStatus}>
              <i />
              <span><strong>Live event stream healthy</strong> · Last event received seconds ago</span>
            </div>
          </section>

          <section className={styles.fixtureRail} id="all-live" aria-label="Live and upcoming fixtures">
            <div className={styles.fixtureRailHeading}>
              <div>
                <span className={styles.liveLabel}><i /> Live now</span>
                <strong>3 live fixtures · 1 upcoming</strong>
              </div>
              <button type="button">World Cup <DashboardIcon name="chevron-down" size={14} /></button>
            </div>
            <div className={styles.fixtureList}>
              {liveFixtures.map((fixture, index) => (
                <button
                  aria-pressed={index === 0}
                  className={`${styles.fixtureCard} ${index === 0 ? styles.fixtureCardActive : ""}`}
                  key={`${fixture.home}-${fixture.away}`}
                  type="button"
                >
                  <span className={styles.fixtureCrest}>{fixture.home.slice(0, 2).toUpperCase()}</span>
                  <span className={styles.fixtureTeams}>
                    <strong>{fixture.home} <b>{fixture.score}</b> {fixture.away}</strong>
                    <small>{fixture.group}</small>
                  </span>
                  <span className={`${styles.fixtureMinute} ${fixture.state === "live" ? styles.fixtureMinuteLive : ""}`}>
                    {fixture.state === "live" ? <i /> : null}{fixture.minute}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <LiveMatchCommandCenter />
          <LiveMatchAnalysis />

          <footer className={sharedStyles.dashboardFooter}>
            <span>Athena live intelligence workspace</span>
            <span>Match views are designed for explainable, evidence-led analysis</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
