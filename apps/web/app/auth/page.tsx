import { TxLineAuthPanel } from "../txline-auth-panel";
import styles from "../page.module.css";

export default function AuthPage() {
  return (
    <main className={styles.page}>
      <TxLineAuthPanel />
    </main>
  );
}
