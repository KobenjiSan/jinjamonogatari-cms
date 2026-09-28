import { useEffect, useState } from "react";
import {
  getShrineKamiById,
  getAllShrineKamiList,
  type KamiCMSDto,
} from "../../kamiApi";
import styles from "./KamiList.module.css";
import { FiCheckCircle, FiMinusCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { PiWarningBold } from "react-icons/pi";
import { MdErrorOutline } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";

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
              ? "50px 1.25fr 1.25fr 1.5fr 1fr auto"
              : "50px 2fr 1.25fr 1.5fr auto",
        }}
      >
        <div className="headerCell">ID</div>
        <div className="headerCell">Kami</div>
        <div className="headerCell">Status</div>
        {id != null && <div className="headerCell">Entity Audit</div>}
        <div className="headerCell">Last Updated</div>
        <div className="headerCell">Actions</div>

        {filteredKami.map((k) => {
          const isDisabled = disabledIds.includes(k.kamiId);
          const errorCount = k.audit?.errorCount ?? 0;
          const warningCount = k.audit?.warningCount ?? 0;
          const isClean = errorCount === 0 && warningCount === 0;
          const firstIssue = k.entityAudit?.issues?.[0];

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
                <div className="auditRow">
                  <span
                    className="pill"
                    style={
                      k.status
                        ? {
                            color: `var(--color-${k.status.toLowerCase()})`,
                            backgroundColor: `var(--color-${k.status.toLowerCase()}-bg)`,
                            border: `var(--border-width) solid var(--color-${k.status.toLowerCase()}-border)`,
                          }
                        : undefined
                    }
                  >
                    {k.status ?? "-"}
                  </span>
                  {k.lastReviewDecision && (
                    <>
                      {k.lastReviewDecision == "Rejected" && (
                        <span className="rejectedPill gap-xs">
                          <FaRegClock className="reviewIcon" />
                          Rejected
                        </span>
                      )}
                      {k.lastReviewDecision == "Withdrawn" && (
                        <span className="withdrawnPill gap-xs">
                          <FaRegClock className="reviewIcon" />
                          Withdrawn
                        </span>
                      )}
                      {k.lastReviewDecision == "Unpublished" && (
                        <span className="unpublishedPill gap-xs">
                          <FaRegClock className="reviewIcon" />
                          Unpublished
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {id != null && (
                <div className="bodyCell">
                  {k.entityAudit != null ? (
                    isClean ? (
                      <div className="auditOk">
                        <FiCheckCircle className="auditOkIcon" />
                        <span>No Issues</span>
                      </div>
                    ) : (
                      <div className="auditStack">
                        <div className="auditRow">
                          {errorCount > 0 && (
                            <span className="auditError">
                              <MdErrorOutline className="auditOkIcon" />
                              {errorCount} error{errorCount !== 1 ? "s" : ""}
                            </span>
                          )}

                          {warningCount > 0 && (
                            <span className="auditWarning">
                              <PiWarningBold className="auditOkIcon" />
                              {warningCount} warning
                              {warningCount !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        {firstIssue && (
                          <span className="text-muted text-sm">
                            {firstIssue.message}
                          </span>
                        )}
                      </div>
                    )
                  ) : (
                    <span className="auditNone">
                      <FiMinusCircle className="auditOkIcon" />
                      Audit Unavailable
                    </span>
                  )}
                </div>
              )}

              <div className="bodyCell">
                <p className={`metaText ${styles.singleLine}`}>
                  {k.updatedAt ? new Date(k.updatedAt).toLocaleString() : "-"}
                </p>
              </div>

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
