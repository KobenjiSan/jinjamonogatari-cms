import styles from "../../SideMeta.module.css";

type SystemSectionProps = {
  shrineId: number;
  inputtedId?: string | null;
};

export default function SystemSection({
  shrineId,
  inputtedId,
}: SystemSectionProps) {
  return (
    <div className={styles.block}>
      <p className={styles.blockTitle}>System</p>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Shrine ID</span>
        <span className={styles.metaValue}>{shrineId}</span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Inputted ID</span>
        <span className={styles.metaValue}>{inputtedId}</span>
      </div>
    </div>
  );
}