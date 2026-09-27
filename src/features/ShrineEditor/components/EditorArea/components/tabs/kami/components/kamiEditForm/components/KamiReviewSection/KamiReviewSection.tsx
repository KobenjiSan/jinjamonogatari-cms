import mainStyles from "../../KamiEditForm.module.css";
import styles from "./KamiReviewSection.module.css";
import {
  getKamiReviewHistory,
  type EntityAuditCMSDto,
  type EntityReviewDto,
} from "../../../../kamiApi";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { BiSolidErrorAlt } from "react-icons/bi";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import BaseModal from "../../../../../../../../../../../shared/components/modal/BaseModal";
import ReviewHistory from "../../../../../../../../ReviewHistory/ReviewHistory";

type KamiReviewSectionProps = {
  entityAudit: EntityAuditCMSDto | null | undefined;
  kamiStatus: string;
  kamiId: number;
};

export default function KamiReviewSection({
  entityAudit,
  kamiStatus,
  kamiId,
}: KamiReviewSectionProps) {
  const [reviewHistory, setReviewHistory] = useState<EntityReviewDto[]>([]);
  const [isReviewHistoryOpen, setIsReviewHistoryOpen] = useState(false);
  const [isRecentlyRejected, setIsRecentlyRejected] = useState(false);

  useEffect(() => {
    async function getReviewHistory() {
      try {
        var results = await getKamiReviewHistory(kamiId);
        setReviewHistory(results);
        var test = results.at(0)?.decision === "Rejected" ? true : false;
        setIsRecentlyRejected(test);
      } catch (error) {
        console.error("Failed to retreive Kami review history", error);
        const err = error as { message?: string };
        toast.error(err.message ?? "Something went wrong");
      }
    }

    getReviewHistory();
  }, []);

  return (
    <>
      {entityAudit && (
        <>
          <div className={styles.header}>
            <p className={mainStyles.note}>
              Note: Changes here will update this Kami for all shrines it is
              linked with.
            </p>
            <div className={styles.rejectionGroup}>
              <button
                type="button"
                className={`btn ${!isRecentlyRejected ? "btn-outline" : "btn-danger"}`}
                aria-label="Submit for Review"
                onClick={() => setIsReviewHistoryOpen(true)}
              >
                {isRecentlyRejected && (
                  <BiSolidErrorAlt className={styles.checkErrorIcon} />
                )}
                <span>Review History</span>
              </button>
            </div>
          </div>
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

                {kamiStatus === "Draft" && (
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
                )}

                {kamiStatus === "Review" && (
                  <div>
                    <p className={styles.eyebrow}>Entity Audit</p>
                    <h3 className={styles.title}>Currently Under Review</h3>
                    <p className={styles.description}>
                      This Kami has been submitted and is under review. Admins
                      can still make edits during review.
                    </p>
                  </div>
                )}

                {kamiStatus === "Published" && (
                  <div>
                    <p className={styles.eyebrow}>Submission Results</p>
                    <h3 className={styles.title}>Published</h3>
                    <p className={styles.description}>
                      This Kami has been published and is currently in view-only
                      mode.
                    </p>
                  </div>
                )}
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
        </>
      )}

      <BaseModal
        isOpen={isReviewHistoryOpen}
        title="Review History"
        onClose={() => setIsReviewHistoryOpen(false)}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setIsReviewHistoryOpen(false)}
            >
              Cancel
            </button>
          </>
        }
      >
        <ReviewHistory reviewHistory={reviewHistory} entityType="Kami" />
      </BaseModal>
    </>
  );
}
