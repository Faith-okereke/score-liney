import Link from "next/link";
import type { JSX } from "react";

import { DashboardIcon } from "./dashboard-icons";
import styles from "./dashboard.module.css";

interface DashboardHeaderProps {
  title?: string;
  breadcrumb?: string;
  liveActionHref?: string;
  liveActionLabel?: string;
}

export function DashboardHeader({
  title = "Command center",
  breadcrumb = "Live World Cup intelligence",
  liveActionHref = "/live-matches",
  liveActionLabel = "Open live match room",
}: DashboardHeaderProps): JSX.Element {
  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerTitleArea}>
        <Link className={styles.mobileBrandMark} href="/" aria-label="Athena dashboard home">
          A
        </Link>
        <div>
          <div className={styles.breadcrumb}>
            <span>Workspace</span>
            <DashboardIcon name="chevron-right" size={13} />
            <strong>{breadcrumb}</strong>
          </div>
          <h1>{title}</h1>
        </div>
      </div>

      <div className={styles.headerActions}>
        <label className={styles.searchBox}>
          <DashboardIcon name="search" size={17} />
          <span className={styles.visuallyHidden}>Search insights</span>
          <input aria-label="Search insights" placeholder="Search matches, signals, agents…" type="search" />
          <kbd>⌘ K</kbd>
        </label>
        <button className={styles.iconButton} type="button" aria-label="View notifications">
          <DashboardIcon name="bell" size={18} />
          <span className={styles.notificationDot} />
        </button>
        <Link className={styles.liveButton} href={liveActionHref}>
          <span className={styles.liveDot} />
          {liveActionLabel}
          <DashboardIcon name="arrow-right" size={16} />
        </Link>
      </div>
    </header>
  );
}
