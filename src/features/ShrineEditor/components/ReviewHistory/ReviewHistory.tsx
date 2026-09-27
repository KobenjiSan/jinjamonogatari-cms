import type { ReviewDto } from "../../ShrineEditorApi";
import type { EntityReviewDto } from "../EditorArea/components/tabs/kami/kamiApi";
import styles from "./ReviewHistory.module.css";

type ReviewHistoryProps = {
  reviewHistory: ReviewDto[] | EntityReviewDto[];
  entityType: string;
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

export default function ReviewHistory({
  reviewHistory,
  entityType,
}: ReviewHistoryProps) {
  if (!reviewHistory || reviewHistory.length === 0) {
    return (
      <div className="card">
        <p className="primaryText">No review history to show.</p>
        <p className="metaText">
          This {entityType} does not have any recorded review actions yet.
        </p>
      </div>
    );
  }

  return (
    <div className="column gap-md">
      {reviewHistory.map((review, index) => {
        const isLatest = index === 0;
        const isEntityReview = "returnedToDraftAt" in review;
        const hasReviewData = isEntityReview
          ? !!review.resolvedAt
          : !!review.reviewedAt;

        const unpublishedAt = isEntityReview ? review.returnedToDraftAt : null;
        const resolvedAt = isEntityReview
          ? review.resolvedAt
          : review.reviewedAt;

        const hasFinalDecision = review.decision !== "Pending" && !!resolvedAt;

        const timestamp =
          unpublishedAt ??
          (hasFinalDecision ? resolvedAt : null) ??
          review.submittedAt;

        const timestampLabel = unpublishedAt
          ? "Unpublished"
          : hasFinalDecision
            ? review.decision
            : "Submitted";

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
                      : review.decision === "Published"
                        ? styles.decisionApproved
                        : review.decision === "Unpublished"
                          ? styles.decisionUnpublished
                          : review.decision === "Withdrawn"
                            ? styles.decisionWithdrawn
                            : styles.decisionNeutral
                  }`}
                >
                  {formatDecision(review.decision)}
                </span>

                {isLatest && (
                  <span className={styles.latestPill}>Most Recent</span>
                )}
              </div>

              <div className={styles.timeBlock}>
                <p className={styles.timeLabel}>{timestampLabel}</p>
                <p className={styles.timeValue}>{formatDate(timestamp)}</p>
              </div>
            </div>

            <div
              className={`grid gap-sm ${review.decision === "Unpublished" ? " grid-3" : " grid-2"}`}
            >
              <div className={`subtle-surface p-sm ${styles.metaCard}`}>
                <p className={styles.metaLabel}>Submitted By</p>
                <p className="primaryText">{review.submittedByUsername}</p>
                <p className="metaText">{formatDate(review.submittedAt)}</p>
              </div>

              {isEntityReview && review.decision == "Withdrawn" ? (
                <div className={`subtle-surface p-sm ${styles.metaCard}`}>
                  <p className={styles.metaLabel}>Withdrawn By</p>
                  <p className="primaryText">
                    {review.resolvedByUsername ?? "Not Reviewed yet"}
                  </p>
                  <p className="metaText">
                    {hasReviewData
                      ? formatDate(review.resolvedAt)
                      : "Pending review"}
                  </p>
                </div>
              ) : (
                <div className={`subtle-surface p-sm ${styles.metaCard}`}>
                  <p className={styles.metaLabel}>Reviewed By</p>
                  <p className="primaryText">
                    {isEntityReview
                      ? (review.resolvedByUsername ?? "Not Reviewed yet")
                      : (review.reviewedByUsername ?? "Not Reviewed yet")}
                  </p>
                  <p className="metaText">
                    {hasReviewData
                      ? isEntityReview
                        ? formatDate(review.resolvedAt)
                        : formatDate(review.reviewedAt)
                      : "Pending review"}
                  </p>
                </div>
              )}

              {isEntityReview && review.decision == "Unpublished" && (
                <div className={`subtle-surface p-sm ${styles.metaCard}`}>
                  <p className={styles.metaLabel}>Unpublished By</p>
                  <p className="primaryText">
                    {review.returnedToDraftByUsername}
                  </p>
                  <p className="metaText">
                    {formatDate(review.returnedToDraftAt)}
                  </p>
                </div>
              )}
            </div>

            {review.reviewerComment &&
              review.decision === "Unpublished" &&
              review.reviewerComment.trim().length > 0 && (
                <div className={styles.commentBlockUnpublish}>
                  <p className={styles.commentLabelUnpublish}>
                    Reason for Unpublishing
                  </p>
                  <p className={styles.commentText}>{review.reviewerComment}</p>
                </div>
              )}

            {review.reviewerComment &&
              review.decision !== "Unpublished" &&
              review.reviewerComment.trim().length > 0 && (
                <div className={styles.commentBlock}>
                  <p className={styles.commentLabel}>Reason for Rejection</p>
                  <p className={styles.commentText}>{review.reviewerComment}</p>
                </div>
              )}
          </article>
        );
      })}
    </div>
  );
}
