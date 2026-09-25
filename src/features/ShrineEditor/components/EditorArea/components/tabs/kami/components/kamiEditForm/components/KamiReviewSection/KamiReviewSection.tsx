import mainStyles from "../../KamiEditForm.module.css";
import styles from "./KamiReviewSection.module.css";
import type { EntityAuditCMSDto } from "../../../../kamiApi";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

type KamiReviewSectionProps = {
  entityAudit: EntityAuditCMSDto | null | undefined;
};

export default function KamiReviewSection({
  entityAudit,
}: KamiReviewSectionProps) {
  return (
    <>
      {entityAudit && (
        <div className={styles.entityAuditCard}>
          <div
            className={`${styles.hero} ${entityAudit?.canSubmit ? styles.ready : styles.blocked}`}
          >
            <div className={styles.main}>
              {entityAudit?.canSubmit ? (
                <FiCheckCircle className={styles.icon} aria-hidden="true" />
              ) : (
                <FiXCircle className={styles.icon} aria-hidden="true" />
              )}

              <div>
                <p className={styles.eyebrow}>Entity Audit</p>
                <h3 className={styles.title}>
                  {entityAudit?.canSubmit
                    ? "Ready for Submission"
                    : "Not Ready for Submission"}
                </h3>
                <p className={styles.description}>
                  {entityAudit?.canSubmit
                    ? "This entity has no errors blocking submission."
                    : "Resolve the blocking errors listed below."}
                </p>
              </div>
            </div>

            <div className={styles.stats}>
              <span className={styles.stat}>
                {entityAudit?.errorCount} Error
                {entityAudit?.errorCount !== 1 ? "s" : ""}
              </span>
              <span className={styles.stat}>
                {entityAudit?.warningCount} Warning
                {entityAudit?.warningCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className={mainStyles.divider} />

          <div className={styles.issueStack}>
            {entityAudit?.issues?.map((issue, index) => (
              <div
                key={index}
                className={`${styles.issueCard} ${
                  issue.severity === "Error"
                    ? styles.errorDiv
                    : styles.warningDiv
                }`}
              >
                <div className={styles.issueHeader}>
                  <div className={styles.leftSide}>
                    <div className={styles.locator}>
                      <span className={styles.issueField}>{issue.field}</span>

                      {issue.relatedItemType && (
                        <div className={styles.relatedItems}>
                          {issue.relatedItemType} #{issue.relatedItemId}
                        </div>
                      )}
                    </div>

                    <p className={styles.issueMessage}>{issue.message}</p>
                  </div>

                  <div
                    className={
                      issue.severity === "Error" ? "errorPill" : "warningPill"
                    }
                  >
                    {issue.severity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
