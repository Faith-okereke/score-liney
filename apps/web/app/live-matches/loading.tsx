import styles from "../components/live-matches/live-matches.module.css";

export default function LiveMatchesLoading() {
  return (
    <main className={styles.loadingPage} aria-label="Loading live match intelligence" aria-busy="true">
      <div className={styles.loadingHeader}>
        <span />
        <i />
      </div>
      <div className={styles.loadingFixtures}>
        <i /><i /><i /><i />
      </div>
      <div className={styles.loadingGrid}>
        <i />
        <div><i /><i /><i /></div>
      </div>
    </main>
  );
}
