import { useEffect, useState } from "react";
import { getShrineList, type ShrineListDto } from "../../shrinesApi";
import styles from "./ShrineList.module.css";
import { useNavigate } from "react-router-dom";
import type { StatusTabKey } from "../statusTab/StatusTabs";
import { useAuth } from "../../../../auth/AuthProvider";
import type { ShrineSearchFilters } from "../Filters/Filters";
import { FiCheckCircle } from "react-icons/fi";
import { FaCircleInfo } from "react-icons/fa6";

function formatUpdatedAt(dateString?: string | null) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export type ShrineListPagination = {
  pageNumber: number;
  pageSize: number;
};

type ShrineListProps = {
  activeTab: StatusTabKey;
  filters: ShrineSearchFilters | null;
  onRemove: (shrine: ShrineListDto) => void;
  onUpdate: number;
  isDeleting: boolean;
};

export default function ShrineList({
  activeTab,
  filters,
  onRemove,
  onUpdate,
  isDeleting,
}: ShrineListProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shrines, setShrines] = useState<ShrineListDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const showingLow = totalItems === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const showingHigh = Math.min(pageNumber * pageSize, totalItems);

  function handleRowPerPageChange(rows: number) {
    setPageSize(rows);
    setPageNumber(1);
  }

  useEffect(() => {
    async function loadShrines() {
      try {
        const result = await getShrineList(activeTab, filters, {
          pageNumber,
          pageSize,
        });
        setShrines(result.shrines);
        setTotalItems(result.totalCount);
      } catch (err) {
        console.error("Failed to load shrines", err);
      } finally {
        setLoading(false);
      }
    }

    loadShrines();
  }, [activeTab, filters, pageNumber, pageSize, onUpdate]);

  function getReadOnly(): boolean {
    const isEditor = user?.role === "Editor";
    const isAdmin = user?.role === "Admin";
    if (isEditor) {
      return activeTab === "review" || activeTab === "published";
    } else if (isAdmin) {
      return activeTab === "published";
    }
    return false;
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={`listShell ${styles.gridTable}`}
        style={{
          gridTemplateColumns:
            user?.role != "Admin"
              ? ".25fr 2fr 1fr 1.5fr 1.5fr 1fr 120px"
              : ".25fr 2fr 1fr 1.5fr 1.5fr 1fr 200px",
        }}
      >
        {/* Header */}
        <div className={`headerCell ${styles.idCol}`}>ID</div>
        <div className={`headerCell ${styles.shrineCol}`}>Shrine</div>
        <div className={`headerCell ${styles.statusCol}`}>Status</div>
        <div className={`headerCell ${styles.locationCol}`}>Location</div>
        <div className={`headerCell ${styles.updatedCol}`}>Last Updated</div>
        <div className={`headerCell ${styles.readinessCol}`}>Blockers</div>
        <div className={`headerCell ${styles.actionsCol}`}>Actions</div>

        {/* Rows */}
        {loading ? (
          <div className="rowGroup">
            <div className="bodyCell" style={{ gridColumn: "1 / -1" }}>
              <p className="text-md text-secondary">Loading...</p>
            </div>
          </div>
        ) : !shrines.length ? (
          <div className="rowGroup">
            <div className="bodyCell" style={{ gridColumn: "1 / -1" }}>
              <p className="text-md text-secondary">No shrines found.</p>
            </div>
          </div>
        ) : (
          shrines.map((s) => (
            <div key={s.shrineId} className="rowGroup">
              <div className={`bodyCell ${styles.idCol}`}>
                <div className="listStackSm">
                  <p className="metaText">{s.shrineId ?? "-"}</p>
                </div>
              </div>

              <div className={`bodyCell ${styles.shrineCol}`}>
                <div className="listStackSm">
                  <p className="primaryText">{s.nameEn ?? "-"}</p>
                  <p className="metaText">{s.nameJp ?? "-"}</p>
                </div>
              </div>

              <div className={`bodyCell ${styles.statusCol}`}>
                <div className={styles.statusArea}>
                  <span
                    className={`pill status-wrapper ${s.recentlyRejected ? styles.rejectionPill : ""}`}
                    title={s.recentlyRejected ? "Recently Rejected" : ""}
                  >
                    {s.recentlyRejected && <FaCircleInfo />}
                    {s.status ?? "-"}
                  </span>
                </div>
              </div>

              <div className={`bodyCell ${styles.locationCol}`}>
                <div className="listStackSm">
                  <p className="primaryText">{s.city ?? "-"}</p>
                  <div className={styles.coords}>
                    <span>Lat: {s.lat ?? "-"}</span>
                    <span>Lon: {s.lon ?? "-"}</span>
                  </div>
                </div>
              </div>

              <div className={`bodyCell ${styles.updatedCol}`}>
                <div className="timeBlock">
                  <p className="primaryText">{formatUpdatedAt(s.updatedAt)}</p>
                </div>
              </div>

              <div className={`bodyCell ${styles.readinessCol}`}>
                {(s.errorCount ?? 0) === 0 ? (
                  <div className={styles.auditOk}>
                    <FiCheckCircle className={styles.auditOkIcon} />
                    <span>No Blockers</span>
                  </div>
                ) : (
                  <div className={styles.auditStack}>
                    {s.errorCount > 0 && (
                      <span className={styles.errorPill}>
                        {s.errorCount} Blocker{s.errorCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className={`bodyCell ${styles.actionsCol}`}>
                <div className={`${styles.actionGroup}`}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => navigate(`/shrines/${s.shrineId}`)}
                  >
                    {getReadOnly() ? "View" : "Edit"}
                  </button>

                  {user?.role === "Admin" && (
                    <button
                      type="button"
                      disabled={isDeleting}
                      className="btn btn-outline-danger"
                      onClick={() => onRemove(s)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.paginationBar}>
        <div className={styles.paginationLeft}>
          <span className={styles.paginationLabel}>Rows per page</span>
          <select
            className={styles.paginationSelect}
            value={pageSize}
            onChange={(e) => handleRowPerPageChange(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>

        <div className={styles.paginationRight}>
          <span className={styles.paginationRange}>
            Showing {showingLow}–{showingHigh} of {totalItems}
          </span>

          <div className={styles.pageControls}>
            <button
              type="button"
              className={styles.pageButton}
              onClick={() => setPageNumber((p) => p - 1)}
              disabled={pageNumber == 1}
            >
              &lt;
            </button>

            <div className={styles.pageNumber}>{pageNumber}</div>

            <button
              type="button"
              className={styles.pageButton}
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
