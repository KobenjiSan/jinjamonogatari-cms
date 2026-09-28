import { useEffect, useState } from "react";
import styles from "./KamiList.module.css";
import {
  getAllKami,
  type KamiCMSDto,
} from "../../../../ShrineEditor/components/EditorArea/components/tabs/kami/kamiApi";
import type { KamiSearchFilters } from "../KamiFilters/KamiFilters";
import toast from "react-hot-toast";
import { FiCheckCircle, FiMinusCircle } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import { PiWarningBold } from "react-icons/pi";
import { FaRegClock } from "react-icons/fa6";

export type KamiListPagination = {
  pageNumber: number;
  pageSize: number;
};

type KamiListProps = {
  filters: KamiSearchFilters | null;
  onEdit: (Kami: KamiCMSDto) => void;
  onRemove: (Kami: KamiCMSDto) => void;
  onUpdate: number;
  isDeleting: boolean;
};

export default function KamiList({
  filters,
  onEdit,
  onRemove,
  onUpdate,
  isDeleting,
}: KamiListProps) {
  const [kami, setKami] = useState<KamiCMSDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const showingLow = totalItems === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const showingHigh = Math.min(pageNumber * pageSize, totalItems);

  function handleRowPerPageChange(rows: number) {
    setPageSize(rows);
    setPageNumber(1);
  }

  useEffect(() => {
    async function loadKami() {
      setLoading(true);

      try {
        const result = await getAllKami(filters, { pageNumber, pageSize });
        setKami(result.kami);
        setTotalItems(result.totalCount);

        console.log(result.kami);
      } catch (error) {
        console.error("Failed to load Kami", error);
        const err = error as { message?: string };
        toast.error(err.message ?? "Failed to load Kami");
      } finally {
        setLoading(false);
      }
    }

    loadKami();
  }, [filters, pageNumber, pageSize, onUpdate]);

  return (
    <div className={styles.wrapper}>
      <div
        className={`listShell ${styles.gridTable}`}
        style={{
          gridTemplateColumns: ".25fr 2.25fr 1fr 1.5fr 1fr auto",
        }}
      >
        <div className="headerCell">ID</div>
        <div className="headerCell">Kami</div>
        <div className="headerCell">Status</div>
        <div className="headerCell">Entity Audit</div>
        <div className="headerCell">Last Updated</div>
        <div className="headerCell">Actions</div>

        {loading ? (
          <div className="rowGroup">
            <div className="bodyCell" style={{ gridColumn: "1 / -1" }}>
              <p className="text-md text-secondary">Loading...</p>
            </div>
          </div>
        ) : !kami.length ? (
          <div className="rowGroup">
            <div className="bodyCell" style={{ gridColumn: "1 / -1" }}>
              <p className="text-md text-secondary">No tags found.</p>
            </div>
          </div>
        ) : (
          kami.map((k) => {
            const errorCount = k.entityAudit?.errorCount ?? 0;
            const warningCount = k.entityAudit?.warningCount ?? 0;
            const isClean = errorCount === 0 && warningCount === 0;
            const firstIssue = k.entityAudit?.issues?.[0];

            return (
              <div key={k.kamiId} className="rowGroup">
                <div className="bodyCell">
                  <p className="metaText">{k.kamiId}</p>
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

                <div className="bodyCell">
                  <p className={`metaText ${styles.singleLine}`}>
                    {k.updatedAt ? new Date(k.updatedAt).toLocaleString() : "-"}
                  </p>
                </div>

                <div className="bodyCell">
                  <div className={styles.actionGroup}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => onEdit(k)}
                    >
                      Open
                    </button>

                    <button
                      type="button"
                      disabled={isDeleting}
                      className="btn btn-outline-danger"
                      onClick={() => onRemove(k)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="paginationBar">
        <div className="paginationLeft">
          <span className="paginationLabel">Rows per page</span>

          <select
            className="paginationSelect"
            value={pageSize}
            onChange={(e) => handleRowPerPageChange(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>

        <div className="paginationRight">
          <span className="paginationRange">
            Showing {showingLow}–{showingHigh} of {totalItems}
          </span>

          <div className="pageControls">
            <button
              type="button"
              className="pageButton"
              onClick={() => setPageNumber((p) => p - 1)}
              disabled={pageNumber === 1}
            >
              &lt;
            </button>

            <div className="pageNumber">{pageNumber}</div>

            <button
              type="button"
              className="pageButton"
              onClick={() => setPageNumber((p) => p + 1)}
              disabled={pageNumber * pageSize >= totalItems}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
