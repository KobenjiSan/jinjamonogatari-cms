import styles from "../FolkloreEditForm.module.css";
import type { FolkloreCMSDto } from "../../../folkloreApi";

type FolkloreReadOnlySectionProps = {
  folklore: FolkloreCMSDto;
};

export default function FolkloreReadOnlySection({
  folklore,
}: FolkloreReadOnlySectionProps) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Read Only Info</p>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Folklore ID</span>
        <span className={styles.metaValue}>{folklore.folkloreId}</span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Status</span>
        <span className={styles.metaValue}>{folklore.status ?? "-"}</span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Published At</span>
        <span className={styles.metaValue}>
          {folklore.publishedAt
            ? new Date(folklore.publishedAt).toLocaleString()
            : "-"}
        </span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Created At</span>
        <span className={styles.metaValue}>
          {folklore.createdAt
            ? new Date(folklore.createdAt).toLocaleString()
            : "-"}
        </span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Updated At</span>
        <span className={styles.metaValue}>
          {folklore.updatedAt
            ? new Date(folklore.updatedAt).toLocaleString()
            : "-"}
        </span>
      </div>
    </div>
  );
}