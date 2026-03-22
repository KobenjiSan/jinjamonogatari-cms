import type { AuditIssueDto } from "../../statusApi";
import styles from "./StatusSectionCard.module.css";

type StatusSectionCardProps = {
  section: string;
  sectionIssues: AuditIssueDto[];
  sectionGroups: Record<string, AuditIssueDto[]>;
};

export default function StatusSectionCard({
  section,
  sectionIssues,
  sectionGroups,
}: StatusSectionCardProps) {
  const hasError = sectionIssues.some((issue) => issue.severity === "Error");

  const orderedItemGroups = Object.entries(sectionGroups).sort(([a], [b]) => {
    if (a === "Section-Level") return -1;
    if (b === "Section-Level") return 1;
    return a.localeCompare(b, undefined, { numeric: true });
  });

  return (
    <div
      className={`card ${hasError ? styles.sectionError : styles.sectionWarning}`}
    >
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionTitle}>{section}</p>
          <p className={styles.sectionMeta}>
            {sectionIssues.length} issue{sectionIssues.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className={styles.itemGroupList}>
        {orderedItemGroups.map(([itemKey, issues]) => {
          return (
            <div
              key={`${section}-${itemKey}`}
              className={styles.itemGroupCard}
            >
              <div className={styles.itemGroupHeader}>
                <p className={styles.itemGroupTitle}>
                  {itemKey === "Section-Level"
                    ? "Section-Level Issues"
                    : itemKey.replace("-", " ")}
                </p>

                <p className={styles.itemGroupMeta}>
                  {issues.length} issue{issues.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className={styles.issueList}>
                {issues.map((issue, index) => {
                  const isError = issue.severity === "Error";
                  const key = `${section}-${itemKey}-${issue.field ?? "none"}-${index}`;

                  return (
                    <div
                      key={key}
                      className={`${styles.issueRow} ${
                        isError ? styles.issueRowError : styles.issueRowWarning
                      }`}
                    >
                      <div className={styles.issueRowLeft}>
                        <span
                          className={
                            isError
                              ? styles.inlineSeverityError
                              : styles.inlineSeverityWarning
                          }
                        >
                          {issue.severity}
                        </span>

                        <span
                          className={
                            isError
                              ? styles.issueInlineTextError
                              : styles.issueInlineTextWarning
                          }
                        >
                          {issue.message}
                        </span>
                      </div>

                      <div className={styles.issueInlineMeta}>
                        {issue.field && (
                          <span className={styles.metaBadge}>{issue.field}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}