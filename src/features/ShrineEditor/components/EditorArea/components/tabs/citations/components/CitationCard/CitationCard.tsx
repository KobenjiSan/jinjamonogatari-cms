import styles from "./CitationCard.module.css";
import type { ShrineCitationCMSDto } from "../../citationTabApi";

type CitationCardProps = {
  citationItem: ShrineCitationCMSDto;
};

export default function CitationCard({ citationItem }: CitationCardProps) {
  const { citation, usageCount, linkedTo } = citationItem;

  const citationTitle = citation.title?.trim() || `Citation #${citation.citeId}`;
  const authorText = citation.author?.trim() || "Unknown source";
  const yearText = citation.year != null ? String(citation.year) : null;

  return (
    <div className={`card ${styles.citationCard}`}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardTitle}>{citationTitle}</p>

          <div className={styles.cardMeta}>
            <span className={styles.metaBadge}>{authorText}</span>

            {yearText && <span className={styles.metaBadge}>{yearText}</span>}

            <span className={styles.usageBadge}>
              {usageCount} linked use{usageCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.linkRow}>
        <span className={styles.linkLabel}>Source Link</span>

        {citation.url ? (
          <a
            href={citation.url}
            target="_blank"
            rel="noreferrer"
            className={styles.linkValue}
          >
            {citation.url}
          </a>
        ) : (
          <span className={styles.linkEmpty}>No source link provided</span>
        )}
      </div>

      <div className={styles.linkedSection}>
        <div className={styles.linkedSectionHeader}>
          <p className={styles.linkedSectionTitle}>Connected To</p>
          <p className={styles.linkedSectionMeta}>
            {linkedTo.length} item{linkedTo.length !== 1 ? "s" : ""}
          </p>
        </div>

        {linkedTo.length === 0 ? (
          <div className={styles.emptyRow}>
            <span className={styles.emptyText}>No linked items found.</span>
          </div>
        ) : (
          <div className={styles.issueList}>
            {linkedTo.map((item) => (
              <div
                key={`${item.type}-${item.id}-${item.name}`}
                className={styles.issueRow}
              >
                <div className={styles.issueRowLeft}>
                  <span className={styles.inlineType}>{item.type}</span>
                  <span className={styles.issueInlineText}>{item.name}</span>
                </div>

                <div className={styles.issueInlineMeta}>
                  <span className={styles.metaBadge}>ID #{item.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}