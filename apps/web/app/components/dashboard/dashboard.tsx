

import type { JSX } from "react";

import { DashboardActivity } from "./dashboard-activity";
import { DashboardHeader } from "./dashboard-header";
import { DashboardIntelligence } from "./dashboard-intelligence";
import { DashboardOverview } from "./dashboard-overview";
import { DashboardSidebar } from "./dashboard-sidebar";
import styles from "./dashboard.module.css";

export function Dashboard(): JSX.Element {
  const lastUpdatedLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date());

  return (
    <div className={styles.dashboardPage}>
      <DashboardSidebar />
      <main className={styles.mainContent}>
        <DashboardHeader />
        <div className={styles.contentScroll}>
          <section className={styles.introRow} aria-labelledby="dashboard-overview">
            <div>
              <p className={styles.eyebrow}>{lastUpdatedLabel}</p>
              <h2 id="dashboard-overview">Live intelligence, wired to the match feed.</h2>
              <p>Trace every live conclusion back to the evidence, agent consensus, and market context behind it.</p>
            </div>
            <div className={styles.realtimeStatus} aria-label="Realtime data connection active">
              <span className={styles.realtimeBeacon} />
              Realtime telemetry linked
              <span>· Updated moments ago</span>
            </div>
          </section>

          <DashboardOverview />
          <DashboardIntelligence />
          <DashboardActivity />

          <footer className={styles.dashboardFooter}>
            <span>Athena intelligence workspace</span>
            <span>Data modeled from live match events · Explainable by design</span>
          </footer>
        </div>
      </main>
    </div>
  );
}