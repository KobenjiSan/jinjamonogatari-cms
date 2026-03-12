import styles from "../KamiEditForm.module.css";
import type { KamiCMSDto } from "../../../kamiApi";

type KamiReadOnlySectionProps = {
  kami: KamiCMSDto;
};

export default function KamiReadOnlySection({
  kami,
}: KamiReadOnlySectionProps) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Read Only Info</p>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Kami ID</span>
        <span className={styles.metaValue}>{kami.kamiId}</span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Status</span>
        <span className={styles.metaValue}>{kami.status ?? "-"}</span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Published At</span>
        <span className={styles.metaValue}>
          {kami.publishedAt
            ? new Date(kami.publishedAt).toLocaleString()
            : "-"}
        </span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Created At</span>
        <span className={styles.metaValue}>
          {kami.createdAt
            ? new Date(kami.createdAt).toLocaleString()
            : "-"}
        </span>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Updated At</span>
        <span className={styles.metaValue}>
          {kami.updatedAt
            ? new Date(kami.updatedAt).toLocaleString()
            : "-"}
        </span>
      </div>
    </div>
  );
}