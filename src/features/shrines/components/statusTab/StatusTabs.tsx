import styles from "./StatusTabs.module.css";

export default function StatusTabs() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button type="button" className={`${styles.tab} ${styles.active}`}>
          Imported
        </button>

        <button type="button" className={styles.tab}>
          Drafts
        </button>

        <button type="button" className={styles.tab}>
          Under Review
        </button>

        <button type="button" className={styles.tab}>
          Published
        </button>
      </div>
    </div>
  );
}