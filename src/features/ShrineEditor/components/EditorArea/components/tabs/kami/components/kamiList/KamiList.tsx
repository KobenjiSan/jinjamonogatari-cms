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
  onRemove: (kami: KamiCMSDto) => void;
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
    <div className="listShell">
      <div className={styles.listGrid}>
        <div className="headerCell">Kami</div>
        <div className="headerCell">Status</div>
        <div className="headerCell">Created / Updated</div>
        <div className="headerCell">Actions</div>

        {kami.map((k) => {
          const isDisabled = disabledIds.includes(k.kamiId);

          return (
            <div
              key={k.kamiId}
              className={`rowGroup ${isDisabled ? styles.disabledRow : ""}`}
            >
              <div className="bodyCell">
                <div className={styles.kamiItem}>
                  <p className="primaryText">{k.nameEn ?? "-"}</p>
                  <p className={styles.secondaryText}>{k.nameJp ?? "-"}</p>
                </div>
              </div>

              <div className="bodyCell">
                <div className="listStackSm">
                  <span className="pill">{k.status ?? "-"}</span>
                </div>
              </div>

              <div className="bodyCell">
                <div className="listStackSm">
                  <p className="metaText">
                    Created:{" "}
                    {k.createdAt ? new Date(k.createdAt).toLocaleString() : "-"}
                  </p>
                  <p className="metaText">
                    Updated:{" "}
                    {k.updatedAt ? new Date(k.updatedAt).toLocaleString() : "-"}
                  </p>
                </div>
              </div>

              <div className="bodyCell">
                {id != null ? (
                  <div className="actionGroup">
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
                      onClick={() => onRemove(k)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="actionGroup">
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
    </div>
  );
}