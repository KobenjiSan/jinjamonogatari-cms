import { useEffect, useState } from "react";
import styles from "./ShrineEditorHeader.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import BaseModal from "../../../../shared/components/modal/BaseModal";
import ReviewHistory from "../ReviewHistory/ReviewHistory";
import {
  getShrineReviewHistory,
  type ShrineReviewDto,
} from "../../ShrineEditorApi";
import { BiSolidErrorAlt } from "react-icons/bi";

type ShrineEditorHeaderProps = {
  shrineName: string;
  shrineId: number;
};

export default function ShrineEditorHeader({
  shrineName,
  shrineId,
}: ShrineEditorHeaderProps) {
  const navigate = useNavigate();

  const [reviewHistory, setReviewHistory] = useState<ShrineReviewDto[]>([]);
  const [isReviewHistoryOpen, setIsReviewHistoryOpen] = useState(false);
  const [isRecentlyRejected, setIsRecentlyRejected] = useState(false);

  useEffect(() => {
    async function getReviewHistory() {
      try {
        var results = await getShrineReviewHistory(shrineId);

        setReviewHistory(results);
        var test = results.at(0)?.decision === "Rejected" ? true : false;
        setIsRecentlyRejected(test);
      } catch (err) {
        console.error("Failed to retreive shrine review history", err);
      }
    }

    getReviewHistory();
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <button
            className={styles.backButton}
            type="button"
            onClick={() => navigate("/shrines")}
          >
            <IoIosArrowBack />
          </button>

          <div className={styles.titleGroup}>
            <span className="text-xl font-bold text-primary">
              Shrine Editor
            </span>
            <span className={styles.separator}>›</span>
            <span className="text-md text-secondary">{shrineName}</span>
          </div>
        </div>
        <div className={styles.rejectionGroup}>
          <button
            type="button"
            className={`btn ${!isRecentlyRejected ? "btn-outline" : "btn-danger" }`}
            aria-label="Submit for Review"
            onClick={() => setIsReviewHistoryOpen(true)}
          >
            {isRecentlyRejected && (<BiSolidErrorAlt className={styles.checkErrorIcon} />)}
            <span>Review History</span>
          </button>
        </div>
      </header>

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
        <ReviewHistory reviewHistory={reviewHistory} />
      </BaseModal>
    </>
  );
}
