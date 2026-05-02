import { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { getShrineHistoryById, type HistoryCMSDto } from "../../historyApi";
import styles from "./HistoryList.module.css";
import toast from "react-hot-toast";

type HistoryListProps = {
  shrineId: number;
  onEdit?: (historyItem: HistoryCMSDto) => void;
  onRemove: (historyItem: HistoryCMSDto) => void;
  onLoaded?: (historyItems: HistoryCMSDto[]) => void;
  reloadKey?: number;
  isReadOnly: boolean;
};

export default function HistoryList({
  shrineId,
  onEdit,
  onRemove,
  onLoaded,
  reloadKey,
  isReadOnly,
}: HistoryListProps) {
  const [historyItems, setHistoryItems] = useState<HistoryCMSDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);

      try {
        const result = await getShrineHistoryById(shrineId);
        setHistoryItems(result);
        onLoaded?.(result);
      } catch (error) {
        console.error("Failed to retrieve history list", error);
        const err = error as { message?: string };
        toast.error(err.message ?? "Something went wrong");
        setHistoryItems([]);
        onLoaded?.([]);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [shrineId, reloadKey, onLoaded]);

  if (loading) {
    return (
      <div className="card">
        <p className="text-md text-secondary">Loading...</p>
      </div>
    );
  }

  if (historyItems.length === 0) {
    return (
      <div className="card">
        <p className="text-md text-secondary">No history entries found.</p>
      </div>
    );
  }

  function formatHistoryDate(dateString: string) {
    const date = new Date(dateString);

    return `${date.getFullYear()}, ${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;
  }

  return (
    <div className="listShell">
      <div className={styles.listGrid}>
        <div className="headerCell">ID</div>
        <div className="headerCell">Event</div>
        <div className="headerCell">Status</div>
        <div className="headerCell">Created / Updated</div>
        <div className="headerCell">Issues</div>
        <div className="headerCell">Actions</div>

        {historyItems.map((item) => {
          const errorCount = item.audit?.errorCount ?? 0;
          const warningCount = item.audit?.warningCount ?? 0;
          const isClean = errorCount === 0 && warningCount === 0;

          return (
            <div key={item.historyId} className="rowGroup">
              <div className="bodyCell">
                <span className="metaText">{item.historyId}</span>
              </div>

              <div className="bodyCell">
                <div className={styles.historyItem}>
                  <p className="primaryText">
                    {item.eventDate ? formatHistoryDate(item.eventDate) : "-"}
                  </p>

                  <p className={styles.secondaryText}>{item.title ?? "-"}</p>
                </div>
              </div>

              <div className="bodyCell">
                <div className="listStackSm">
                  <span className="pill">{item.status ?? "-"}</span>
                </div>
              </div>

              <div className="bodyCell">
                <div className="listStackSm">
                  <p className="metaText">
                    Created:{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "-"}
                  </p>

                  <p className="metaText">
                    Updated:{" "}
                    {item.updatedAt
                      ? new Date(item.updatedAt).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="bodyCell">
                {isClean ? (
                  <div className={styles.auditOk}>
                    <FiCheckCircle className={styles.auditOkIcon} />
                    <span>All good</span>
                  </div>
                ) : (
                  <div className={styles.auditStack}>
                    {errorCount > 0 && (
                      <span className={styles.errorPill}>
                        {errorCount} error{errorCount !== 1 ? "s" : ""}
                      </span>
                    )}

                    {warningCount > 0 && (
                      <span className={styles.warningPill}>
                        {warningCount} warning
                        {warningCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="bodyCell">
                <div className="actionGroup">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => onEdit?.(item)}
                  >
                    {!isReadOnly ? "Edit" : "View"}
                  </button>

                  {!isReadOnly && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => onRemove(item)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
