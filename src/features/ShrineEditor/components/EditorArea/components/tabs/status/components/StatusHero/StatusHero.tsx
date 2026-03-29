import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import styles from "./StatusHero.module.css";

type StatusHeroProps = {
  isSubmittable: boolean;
  errorCount: number;
  warningCount: number;
  totalIssues: number;
  isReadOnly: boolean;
  shrineStatus: string;
};

export default function StatusHero({
  isSubmittable,
  errorCount,
  warningCount,
  totalIssues,
  isReadOnly,
  shrineStatus,
}: StatusHeroProps) {
  return (
    <div
      className={`${styles.statusHero} ${
        isSubmittable ? styles.statusHeroReady : styles.statusHeroNotReady
      }`}
    >
      <div className={styles.statusHeroLeft}>
        <div className={styles.statusIconWrap}>
          {isSubmittable ? (
            <FiCheckCircle className={styles.statusIcon} />
          ) : (
            <FiXCircle className={styles.statusIcon} />
          )}
        </div>

        {!isReadOnly ? (
          <div>
            <p className={styles.statusHeroEyebrow}>Submission Status</p>

            {shrineStatus === "review" ? (
              <>
                <h3 className={styles.statusHeroTitle}>
                  Currently Under Review
                </h3>
                <p className={styles.statusHeroText}>
                  This shrine has been submitted and is under review. Admins can
                  still make edits during review.
                </p>
              </>
            ) : (
              <>
                <h3 className={styles.statusHeroTitle}>
                  {isSubmittable
                    ? "Ready for Submission"
                    : "Not Ready for Submission"}
                </h3>
                <p className={styles.statusHeroText}>
                  {isSubmittable
                    ? "All blocking issues are resolved. This shrine can be submitted for review."
                    : "This shrine still has blocking issues that must be fixed before submission."}
                </p>
              </>
            )}
          </div>
        ) : (
          <div>
            <p className={styles.statusHeroEyebrow}>Submission Results</p>
            <h3 className={styles.statusHeroTitle}>
              {shrineStatus === "review"
                ? "Currently Under Review"
                : "Published"}
            </h3>
            <p className={styles.statusHeroText}>
              {shrineStatus === "review"
                ? "This shrine is under review and is currently in view-only mode."
                : "This shrine has been published and is currently in view-only mode."}
            </p>
          </div>
        )}
      </div>

      <div className={styles.statusHeroStats}>
        <span className={styles.heroStat}>
          {errorCount} Error{errorCount !== 1 ? "s" : ""}
        </span>
        <span className={styles.heroStat}>
          {warningCount} Warning{warningCount !== 1 ? "s" : ""}
        </span>
        <span className={styles.heroStat}>
          {totalIssues} Total Issue{totalIssues !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
