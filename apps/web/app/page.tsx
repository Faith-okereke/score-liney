import { TxLineAuthPanel } from "./txline-auth-panel";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <TxLineAuthPanel />
    </main>
  );
}

