import Link from "next/link";
import type { JSX } from "react";

import { navigationGroups } from "./dashboard-data";
import { DashboardIcon } from "./dashboard-icons";
import styles from "./dashboard.module.css";

interface DashboardSidebarProps {
  activeItem?: string;
}

export function DashboardSidebar({ activeItem = "Dashboard" }: DashboardSidebarProps): JSX.Element {
  return (
    <aside className={styles.sidebar} aria-label="Primary navigation">
      <Link className={styles.brand} href="/" aria-label="Athena dashboard home">
        <span className={styles.brandMark}>A</span>
        <span className={styles.brandText}>
          <strong>Athena</strong>
          <small>Sports intelligence</small>
        </span>
      </Link>

      <nav className={styles.navigation} aria-label="Dashboard sections">
        {navigationGroups.map((group) => (
          <div className={styles.navigationGroup} key={group.label}>
            <p className={styles.navigationLabel}>{group.label}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link
                    aria-current={item.label === activeItem ? "page" : undefined}
                    className={`${styles.navigationLink} ${
                      item.label === activeItem ? styles.navigationLinkActive : ""
                    }`}
                    href={item.href}
                  >
                    <DashboardIcon name={item.icon} size={17} />
                    <span>{item.label}</span>
                    {item.badge ? <em>{item.badge}</em> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.sidebarBottom}>
        <Link className={styles.connectionCard} href="/auth">
          <span className={styles.connectionIcon}>
            <DashboardIcon name="command" size={15} />
          </span>
          <span>
            <strong>Data connection</strong>
            <small>Manage TxLINE access</small>
          </span>
          <DashboardIcon name="chevron-right" size={15} />
        </Link>

        <button className={styles.userSummary} type="button" aria-label="Open account menu">
          <span className={styles.userAvatar}>GO</span>
          <span>
            <strong>George O.</strong>
            <small>Research workspace</small>
          </span>
          <DashboardIcon name="more" size={18} />
        </button>
      </div>
    </aside>
  );
}
