import { useEffect, useState } from "react";
import { getShrineHistoryById, type HistoryCMSDto } from "../../historyApi";
import styles from "./HistoryList.module.css";

type HistoryListProps = {
  shrineId: number;
  onEdit?: (historyItem: HistoryCMSDto) => void;
  onRemove: (historyItem: HistoryCMSDto) => void;
  onLoaded?: (historyItems: HistoryCMSDto[]) => void;
  reloadKey?: number;
};

export default function HistoryList({
  shrineId,
  onEdit,
  onRemove,
  onLoaded,
  reloadKey,
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
      } catch (err) {
        console.error("Failed to retrieve history list", err);
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
        <div className={`headerCell ${styles.eventDateCol}`}>Event Date</div>
        <div className={`headerCell ${styles.eventTitleCol}`}>Event Title</div>
        <div className={`headerCell ${styles.statusCol}`}>Status</div>
        <div className={`headerCell ${styles.timestampsCol}`}>Created / Updated</div>
        <div className={`headerCell ${styles.actionsCol}`}>Actions</div>

        {historyItems.map((item) => (
          <div key={item.historyId} className="rowGroup">
            <div className={`bodyCell ${styles.eventDateCol}`}>
              <p className="primaryText">
                {item.eventDate
                  ? formatHistoryDate(item.eventDate)
                  : "-"}
              </p>
            </div>

            <div className={`bodyCell ${styles.eventTitleCol}`}>
              <div className={styles.historyItem}>
                <p className="primaryText">{item.title ?? "-"}</p>
              </div>
            </div>

            <div className={`bodyCell ${styles.statusCol}`}>
              <div className="listStackSm">
                <span className="pill">{item.status ?? "-"}</span>
              </div>
            </div>

            <div className={`bodyCell ${styles.timestampsCol}`}>
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

            <div className={`bodyCell ${styles.actionsCol}`}>
              <div className="actionGroup">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => onEdit?.(item)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => onRemove(item)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}