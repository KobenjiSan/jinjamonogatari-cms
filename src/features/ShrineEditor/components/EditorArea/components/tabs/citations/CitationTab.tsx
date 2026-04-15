import { useEffect, useState } from "react";
import mainStyles from "../../../EditorArea.module.css";
import styles from "./CitationTab.module.css";
import CitationCard from "./components/CitationCard/CitationCard";
import {
  getShrineCitationsById,
  type ShrineCitationCMSDto,
} from "./citationTabApi";
import toast from "react-hot-toast";

type CitationTabProps = {
  shrineId: number;
};

export default function CitationTab({ shrineId }: CitationTabProps) {
  const [citations, setCitations] = useState<ShrineCitationCMSDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCitations() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getShrineCitationsById(shrineId);

        if (!isMounted) return;
        setCitations(data);
      } catch {
        if (!isMounted) return;
        setError("Failed to load shrine citations.");
        const err = error as { message?: string };
        toast.error(err.message ?? "Something went wrong");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    loadCitations();

    return () => {
      isMounted = false;
    };
  }, [shrineId]);

  const totalUsageCount = citations.reduce(
    (sum, citation) => sum + citation.usageCount,
    0,
  );

  return (
    <div className={mainStyles.tabShell}>
      <div className={mainStyles.header}>
        <h2 className={mainStyles.title}>Citations</h2>

        <div className={mainStyles.headerActions}></div>
      </div>

      {isLoading && (
        <div className="card">
          <p className="primaryText">Loading shrine citations...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="card">
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className={styles.citationContent}>
          <div className="card">
            <p className={styles.summaryTitle}>Shrine Source Map</p>
            <p className={styles.summaryText}>
              View every citation used across this shrine and see what content it
              supports.
            </p>

            <div className={styles.summaryStats}>
              <div className={styles.summaryStat}>
                <span className={styles.summaryStatValue}>
                  {citations.length}
                </span>
                <span className={styles.summaryStatLabel}>
                  Citation{citations.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className={styles.summaryStat}>
                <span className={styles.summaryStatValue}>{totalUsageCount}</span>
                <span className={styles.summaryStatLabel}>
                  Total Linked Use{totalUsageCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {citations.length === 0 && (
            <div className="card">
              <p className={styles.summaryTitle}>No citations found.</p>
              <p className={styles.summaryText}>
                This shrine does not currently have any linked citations.
              </p>
            </div>
          )}

          {citations.length > 0 && (
            <div className={styles.cardList}>
              {citations.map((citationItem) => (
                <CitationCard
                  key={citationItem.citation.citeId}
                  citationItem={citationItem}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}