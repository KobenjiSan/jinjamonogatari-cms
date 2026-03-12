import styles from "../SideMeta.module.css";

type PublishingSectionProps = {
  status?: string | null;
  publishedAt?: string | null;
};

export default function PublishingSection({
  status,
  publishedAt,
}: PublishingSectionProps) {
  return (
    <div className={styles.block}>
      <p className={styles.blockTitle}>Publishing</p>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Status</span>
        <span className={styles.metaValue}>{status ?? ""}</span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Published At</span>
        <span className={styles.metaValue}>
          {publishedAt ? new Date(publishedAt).toLocaleString() : ""}
        </span>
      </div>
    </div>
  );
}