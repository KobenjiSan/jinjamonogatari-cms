import styles from "./EditorTabs.module.css";

export default function EditorTabs() {
  return (
    <div className={styles.tabs}>
      <button className={`${styles.tab} ${styles.active}`}>Status</button>
      <button className={styles.tab}>Kami</button>
      <button className={styles.tab}>History</button>
      <button className={styles.tab}>Folklore</button>
      <button className={styles.tab}>Gallery</button>
    </div>
  );
}