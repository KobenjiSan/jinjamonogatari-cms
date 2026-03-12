import { useEffect, useState } from "react";
import {
  getShrineKamiById,
  getAllShrineKamiList,
  type KamiCMSDto,
} from "../../kamiApi";
import styles from "./KamiList.module.css";

type KamiListProps = {
  id?: number;
  disabledIds?: number[];
  onEdit?: (kamiItem: KamiCMSDto) => void;
  onSelect?: (kamiItem: KamiCMSDto) => void;
  onRemove?: (kamiId: number) => void;
  onLoaded?: (kami: KamiCMSDto[]) => void;
  reloadKey?: number;
};

export default function KamiList({
  id,
  disabledIds = [],
  onEdit,
  onSelect,
  onRemove,
  onLoaded,
  reloadKey,
}: KamiListProps) {
  const [kami, setKami] = useState<KamiCMSDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKami() {
      setLoading(true);

      try {
        if (id != null) {
          const result = await getShrineKamiById(id);
          setKami(result);
          onLoaded?.(result);
        } else {
          const result = await getAllShrineKamiList();
          setKami(result);
        }
      } catch (err) {
        console.error("Failed to retrieve kami list", err);
        setKami([]);
        if (id != null) {
          onLoaded?.([]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadKami();
  }, [id, reloadKey]);

  if (loading) {
    return (
      <div className="card">
        <p className="text-md text-secondary">Loading...</p>
      </div>
    );
  }

  if (kami.length === 0) {
    return (
      <div className="card">
        <p className="text-md text-secondary">No kami found.</p>
      </div>
    );
  }

  return (
    <div className="list-shell">
      <div className={`list-header ${styles.gridRow}`}>
        <div>Kami</div>
        <div>Summary</div>
        <div>Status</div>
        <div>Created / Updated</div>
        <div>Actions</div>
      </div>

      {kami.map((k) => {
        const isDisabled = disabledIds.includes(k.kamiId);

        return (
          <div
            key={k.kamiId}
            className={`list-row ${styles.gridRow} ${isDisabled ? styles.disabledRow : ""}`}
          >
            <div className={styles.cell}>
              <div className={styles.kamiItem}>
                <p className={styles.primaryText}>{k.nameEn ?? "-"}</p>
                <p className={styles.secondaryText}>{k.nameJp ?? "-"}</p>
              </div>
            </div>

            <div className={styles.cell}>
              <p className={styles.summaryText}>{k.desc ?? "-"}</p>
            </div>

            <div className={styles.cell}>
              <div className={styles.statusBlock}>
                <span className="pill">{k.status ?? "-"}</span>
              </div>
            </div>

            <div className={styles.cell}>
              <div className={styles.timeBlock}>
                <p className={styles.metaText}>
                  Created:{" "}
                  {k.createdAt ? new Date(k.createdAt).toLocaleString() : "-"}
                </p>
                <p className={styles.metaText}>
                  Updated:{" "}
                  {k.updatedAt ? new Date(k.updatedAt).toLocaleString() : "-"}
                </p>
              </div>
            </div>

            <div className={styles.cell}>
              {id != null ? (
                <div className={styles.actionGroup}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => onEdit?.(k)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => onRemove?.(k.kamiId)}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className={styles.actionGroup}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) {
                        onSelect?.(k);
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
