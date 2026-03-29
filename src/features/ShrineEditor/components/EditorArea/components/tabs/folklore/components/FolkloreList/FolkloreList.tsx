import { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { getShrineFolkloreById, type FolkloreCMSDto } from "../../folkloreApi";
import styles from "./FolkloreList.module.css";

type FolkloreListProps = {
  shrineId: number;
  onEdit?: (folkloreItem: FolkloreCMSDto) => void;
  onRemove: (folkloreItem: FolkloreCMSDto) => void;
  onLoaded?: (folkloreItems: FolkloreCMSDto[]) => void;
  reloadKey?: number;
  isReadOnly: boolean;
};

export default function FolkloreList({
  shrineId,
  onEdit,
  onRemove,
  onLoaded,
  reloadKey,
  isReadOnly,
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
        <p className="text-md text-secondary">No folklore entries found.</p>
      </div>
    );
  }

  return (
    <div className="listShell">
      <div className={styles.listGrid}>
        <div className="headerCell">ID</div>
        <div className={`headerCell ${styles.folkloreTitleCol}`}>Folklore</div>
        <div className={`headerCell ${styles.statusCol}`}>Status</div>
        <div className={`headerCell ${styles.timestampsCol}`}>
          Created / Updated
        </div>
        <div className={`headerCell ${styles.issuesCol}`}>Issues</div>
        <div className={`headerCell ${styles.actionsCol}`}>Actions</div>

        {folkloreItems.map((item) => {
          const errorCount = item.audit?.errorCount ?? 0;
          const warningCount = item.audit?.warningCount ?? 0;
          const isClean = errorCount === 0 && warningCount === 0;

          return (
            <div key={item.folkloreId} className="rowGroup">
              <div className="bodyCell">
                <span className="metaText">{item.folkloreId}</span>
              </div>

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

              <div className={`bodyCell ${styles.issuesCol}`}>
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
                        {warningCount} warning{warningCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className={`bodyCell ${styles.actionsCol}`}>
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
