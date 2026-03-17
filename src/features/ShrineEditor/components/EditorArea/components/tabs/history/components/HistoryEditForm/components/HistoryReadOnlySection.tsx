import styles from "../HistoryEditForm.module.css";
import type { HistoryCMSDto } from "../../../historyApi";

type HistoryReadOnlySectionProps = {
  history: HistoryCMSDto;
};

export default function HistoryReadOnlySection({
  history,
}: HistoryReadOnlySectionProps) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Read Only Info</p>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>History ID</span>
        <span className={styles.metaValue}>{history.historyId}</span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Status</span>
        <span className={styles.metaValue}>{history.status ?? "-"}</span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Published At</span>
        <span className={styles.metaValue}>
          {history.publishedAt
            ? new Date(history.publishedAt).toLocaleString()
            : "-"}
        </span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Created At</span>
        <span className={styles.metaValue}>
          {history.createdAt
            ? new Date(history.createdAt).toLocaleString()
            : "-"}
        </span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Updated At</span>
        <span className={styles.metaValue}>
          {history.updatedAt
            ? new Date(history.updatedAt).toLocaleString()
            : "-"}
        </span>
      </div>
    </div>
  );
}