import { useEffect, useState } from "react";
import {
  getShrineKamiById,
  getAllShrineKamiList,
  type KamiCMSDto,
} from "../../kamiApi";
import styles from "./KamiList.module.css";
import { FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

type KamiListProps = {
  id?: number;
  disabledIds?: number[];
  onEdit?: (kamiItem: KamiCMSDto) => void;
  onSelect?: (kamiItem: KamiCMSDto) => void;
  onRemove?: (kami: KamiCMSDto) => void;
  onLoaded?: (kami: KamiCMSDto[]) => void;
  reloadKey?: number;
  isReadOnly?: boolean;
  searchTerm?: string;
};

export default function KamiList({
  id,
  disabledIds = [],
  onEdit,
  onSelect,
  onRemove,
  onLoaded,
  reloadKey,
  isReadOnly,
  searchTerm,
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
      } catch (error) {
        console.error("Failed to retrieve kami list", error);
        setKami([]);
        if (id != null) {
          onLoaded?.([]);
        }
        const err = error as { message?: string };
        toast.error(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadKami();
  }, [id, reloadKey]);

  const filteredKami = kami.filter((k) => {
    const term = searchTerm?.toLowerCase() || "";

    return (
      k.nameEn?.toLowerCase().includes(term) ||
      k.nameJp?.toLowerCase().includes(term) ||
      k.desc?.toLowerCase().includes(term)
    );
  });

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
      <div
        className={styles.listGrid}
        style={{
          gridTemplateColumns:
            id != null
              ? "50px 2fr 1fr 2fr 1fr auto"
              : "50px 2fr 1fr 1.5fr auto",
        }}
      >
        <div className="headerCell">ID</div>
        <div className="headerCell">Kami</div>
        <div className="headerCell">Status</div>
        <div className="headerCell">Created / Updated</div>
        {id != null && <div className="headerCell">Issues</div>}
        <div className="headerCell">Actions</div>

        {filteredKami.map((k) => {
          const isDisabled = disabledIds.includes(k.kamiId);
          const errorCount = k.audit?.errorCount ?? 0;
          const warningCount = k.audit?.warningCount ?? 0;
          const isClean = errorCount === 0 && warningCount === 0;

          return (
            <div
              key={k.kamiId}
              className={`rowGroup ${isDisabled ? styles.disabledRow : ""}`}
            >
              <div className="bodyCell">
                <span className="metaText">{k.kamiId}</span>
              </div>

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

              {id != null && (
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
                          {warningCount} warning{warningCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="bodyCell">
                {id != null ? (
                  <div className="actionGroup">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => onEdit?.(k)}
                    >
                      {!isReadOnly ? "Edit" : "View"}
                    </button>

                    {!isReadOnly && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => onRemove?.(k)}
                      >
                        Remove
                      </button>
                    )}
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
