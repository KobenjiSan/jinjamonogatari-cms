import { useEffect, useState } from "react";
import { getShrineFolkloreById, type FolkloreCMSDto } from "../../folkloreApi";
import styles from "./FolkloreList.module.css";

type FolkloreListProps = {
  shrineId: number;
  onEdit?: (folkloreItem: FolkloreCMSDto) => void;
  onRemove: (folkloreItem: FolkloreCMSDto) => void;
  onLoaded?: (folkloreItems: FolkloreCMSDto[]) => void;
  reloadKey?: number;
};

export default function FolkloreList({
  shrineId,
  onEdit,
  onRemove,
  onLoaded,
  reloadKey,
}: FolkloreListProps) {
  const [folkloreItems, setFolkloreItems] = useState<FolkloreCMSDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFolklore() {
      setLoading(true);

      try {
        const result = await getShrineFolkloreById(shrineId);
        setFolkloreItems(result);
        onLoaded?.(result);
      } catch (err) {
        console.error("Failed to retrieve folklore list", err);
        setFolkloreItems([]);
        onLoaded?.([]);
      } finally {
        setLoading(false);
      }
    }

    loadFolklore();
  }, [shrineId, reloadKey, onLoaded]);

  if (loading) {
    return (
      <div className="card">
        <p className="text-md text-secondary">Loading...</p>
      </div>
    );
  }

  if (folkloreItems.length === 0) {
    return (
      <div className="card">
        <p className="text-md text-secondary">No Folklore entries found.</p>
      </div>
    );
  }

  return (
    <div className="listShell">
      <div className={styles.listGrid}>
        <div className={`headerCell ${styles.folkloreTitleCol}`}>Folklore Title</div>
        <div className={`headerCell ${styles.statusCol}`}>Status</div>
        <div className={`headerCell ${styles.timestampsCol}`}>Created / Updated</div>
        <div className={`headerCell ${styles.actionsCol}`}>Actions</div>

        {folkloreItems.map((item) => (
          <div key={item.folkloreId} className="rowGroup">
            <div className={`bodyCell ${styles.folkloreTitleCol}`}>
              <div className={styles.folkloreItem}>
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