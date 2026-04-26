import {
  FaFileImport,
  FaFileLines,
  FaRegCircleXmark,
  FaRegClock,
  FaToriiGate,
} from "react-icons/fa6";
import styles from "./QuickCounts.module.css";
import { useEffect, useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { getShrineCounts, type ShrineCounts } from "../dashboardApi";
import toast from "react-hot-toast";

export default function QuickCounts() {
  const [isLoading, setIsLoading] = useState(false);
  const [counts, setCounts] = useState<ShrineCounts | null>(null);

  // api call that pulls
  // total shrines, # status = import, # status = draft, # status = review, # status = published, # recent review is rejected

  useEffect(() => {
    async function loadCounts() {
      setIsLoading(true);
      try {
        const result = await getShrineCounts();
        setCounts(result);
      } catch (error) {
        console.error("Failed to load counts", error);
        const err = error as { message?: string };
        toast.error(err.message ?? "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }

    loadCounts();
  }, []);

  return (
    <div className="card">
      <p className="text-primary font-bold text-lg">Quick Counts</p>
      <div className={styles.frame}>
        <div className={styles.section}>
          <div className={styles.sectionDiv}>
            <div className="column gap-xs">
              <span className={styles.meta}>Total Shrines</span>
              <span className="text-hero font-bold">
                {isLoading ? <p>...</p> : <p>{counts?.total}</p>}
              </span>
            </div>
            <div className="center">
              <div className={`${styles.iconContainer} ${styles.total}`}>
                <FaToriiGate size={36} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.section}>
          <div className={styles.sectionDiv}>
            <div className="column gap-xs">
              <span className={styles.meta}>Imports Backlog</span>
              <span className="text-hero font-bold">
                {isLoading ? <p>...</p> : <p>{counts?.imports}</p>}
              </span>
            </div>
            <div className="center">
              <div className={`${styles.iconContainer} ${styles.imports}`}>
                <FaFileImport size={36} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.section}>
          <div className={styles.sectionDiv}>
            <div className="column gap-xs">
              <span className={styles.meta}>Drafted</span>
              <span className="text-hero font-bold">
                {isLoading ? <p>...</p> : <p>{counts?.drafts}</p>}
              </span>
            </div>
            <div className="center">
              <div className={`${styles.iconContainer} ${styles.drafts}`}>
                <FaFileLines size={36} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.section}>
          <div className={styles.sectionDiv}>
            <div className="column gap-xs">
              <span className={styles.meta}>Under Review</span>
              <span className="text-hero font-bold">
                {isLoading ? <p>...</p> : <p>{counts?.review}</p>}
              </span>
            </div>
            <div className="center">
              <div className={`${styles.iconContainer} ${styles.review}`}>
                <FaRegClock size={36} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.section}>
          <div className={styles.sectionDiv}>
            <div className="column gap-xs">
              <span className={styles.meta}>Published</span>
              <span className="text-hero font-bold">
                {isLoading ? <p>...</p> : <p>{counts?.published}</p>}
              </span>
            </div>
            <div className="center">
              <div className={`${styles.iconContainer} ${styles.published}`}>
                <FaRegCheckCircle size={36} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.section}>
          <div className={styles.sectionDiv}>
            <div className="column gap-xs">
              <span className={styles.meta}>Recently Rejected</span>
              <span className="text-hero font-bold">
                {isLoading ? <p>...</p> : <p>{counts?.rejected}</p>}
              </span>
            </div>
            <div className="center">
              <div className={`${styles.iconContainer} ${styles.rejected}`}>
                <FaRegCircleXmark size={36} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
