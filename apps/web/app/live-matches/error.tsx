"use client";

import styles from "../components/live-matches/live-matches.module.css";

interface LiveMatchesErrorProps {
  reset: () => void;
}

export default function LiveMatchesError({ reset }: LiveMatchesErrorProps) {
  return (
    <main className={styles.errorPage}>
      <div>
        <span>Live intelligence temporarily unavailable</span>
        <h1>We could not refresh this match room.</h1>
        <p>The live stream may be reconnecting. Retry to restore the most recent match analysis.</p>
        <button type="button" onClick={reset}>Retry live stream</button>
      </div>
    </main>
  );
}
