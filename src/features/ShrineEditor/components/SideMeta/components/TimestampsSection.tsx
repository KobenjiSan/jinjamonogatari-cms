import styles from "../SideMeta.module.css";

type TimestampsSectionProps = {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export default function TimestampsSection({
  createdAt,
  updatedAt,
}: TimestampsSectionProps) {
  return (
    <div className={styles.block}>
      <p className={styles.blockTitle}>Timestamps</p>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Created At</span>
        <span className={styles.metaValue}>
          {createdAt ? new Date(createdAt).toLocaleString() : ""}
        </span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Updated At</span>
        <span className={styles.metaValue}>
          {updatedAt ? new Date(updatedAt).toLocaleString() : ""}
        </span>
      </div>
    </div>
  );
}