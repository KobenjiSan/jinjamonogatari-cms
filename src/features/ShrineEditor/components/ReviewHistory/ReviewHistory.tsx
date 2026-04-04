import type { ShrineReviewDto } from "../../ShrineEditorApi";
import styles from "./ReviewHistory.module.css";

type ReviewHistoryProps = {
  reviewHistory: ShrineReviewDto[];
};

function formatDecision(decision: string) {
  return decision.charAt(0) + decision.slice(1).toLowerCase();
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not reviewed yet";

  return new Date(value).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ReviewHistory({ reviewHistory }: ReviewHistoryProps) {
  if (!reviewHistory || reviewHistory.length === 0) {
    return (
      <div className="card">
        <p className="primaryText">No review history to show.</p>
        <p className="metaText">
          This shrine does not have any recorded review actions yet.
        </p>
      </div>
    );
  }

  return (
    <div className="column gap-md">
      {reviewHistory.map((review, index) => {
        const isLatest = index === 0;
        const hasReviewData = !!review.reviewedAt;

        return (
          <article
            key={review.reviewId}
            className={`card column gap-md ${isLatest ? styles.latestCard : ""}`}
          >
            <div className="row-between gap-md">
              <div className="row-center gap-sm">
                <span
                  className={`${styles.decisionBadge} ${
                    review.decision === "Rejected"
                      ? styles.decisionRejected
                      : review.decision === "Approved" ||
                          review.decision === "Published"
                        ? styles.decisionApproved
                        : styles.decisionNeutral
                  }`}
                >
                  {formatDecision(review.decision)}
                </span>

                {isLatest && <span className={styles.latestPill}>Most Recent</span>}
              </div>

              <div className={styles.timeBlock}>
                <p className={styles.timeLabel}>Submitted</p>
                <p className={styles.timeValue}>{formatDate(review.submittedAt)}</p>
              </div>
            </div>

            <div className="grid grid-2 gap-sm">
              <div className={`subtle-surface p-sm ${styles.metaCard}`}>
                <p className={styles.metaLabel}>Submitted By</p>
                <p className="primaryText">{review.submittedByUsername}</p>
                <p className="metaText">{formatDate(review.submittedAt)}</p>
              </div>

              <div className={`subtle-surface p-sm ${styles.metaCard}`}>
                <p className={styles.metaLabel}>Reviewed By</p>
                <p className="primaryText">
                  {review.reviewedByUsername ?? "Not reviewed yet"}
                </p>
                <p className="metaText">
                  {hasReviewData ? formatDate(review.reviewedAt) : "Pending review"}
                </p>
              </div>
            </div>

            {review.reviewerComment && review.reviewerComment.trim().length > 0 && (
              <div className={styles.commentBlock}>
                <p className={styles.commentLabel}>Reviewer Message</p>
                <p className={styles.commentText}>{review.reviewerComment}</p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}