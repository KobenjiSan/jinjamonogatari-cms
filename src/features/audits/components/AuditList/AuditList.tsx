import { useEffect, useState } from "react";
import styles from "./AuditList.module.css";
import type { AuditSearchFilters } from "../AuditFilters/AuditFilters";
import toast from "react-hot-toast";
import { getAuditLog, type AuditDto } from "../../auditApi";

function formatDateTime(dateString?: string | null) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatAction(action: string) {
  if (!action) return "";

  return action.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export type AuditListPagination = {
  pageNumber: number;
  pageSize: number;
};

type AuditListProps = {
  filters: AuditSearchFilters | null;
};

export default function AuditList({ filters }: AuditListProps) {
  const [auditLog, setAuditLog] = useState<AuditDto[]>([]);
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
    async function loadAuditLog() {
      setLoading(true);

      try {
        const result = await getAuditLog(filters, { pageNumber, pageSize });
        setAuditLog(result.audits);
        setTotalItems(result.totalCount);
      } catch (error) {
        console.error("Failed to load audit log", error);
        const err = error as { message?: string };
        toast.error(err.message ?? "Failed to load audit log");
      } finally {
        setLoading(false);
      }
    }

    loadAuditLog();
  }, [filters, pageNumber, pageSize]);

  return (
    <div className={styles.wrapper}>
      <div
        className={`listShell ${styles.gridTable}`}
        style={{
          gridTemplateColumns: ".75fr 1fr 1.5fr 1fr .5fr .75fr",
        }}
      >
        <div className="headerCell">Date</div>
        <div className="headerCell">Action</div>
        <div className="headerCell">Location</div>
        <div className="headerCell">User</div>
        <div className="headerCell">Success</div>
        <div className="headerCell">Message</div>

        {loading ? (
          <div className="rowGroup">
            <div className="bodyCell" style={{ gridColumn: "1 / -1" }}>
              <p className="text-md text-secondary">Loading...</p>
            </div>
          </div>
        ) : !auditLog.length ? (
          <div className="rowGroup">
            <div className="bodyCell" style={{ gridColumn: "1 / -1" }}>
              <p className="text-md text-secondary">No audits found.</p>
            </div>
          </div>
        ) : (
          auditLog.map((a) => (
            <div key={a.auditId} className="rowGroup">
              <div className="bodyCell">
                <p className="metaText">{formatDateTime(a.createdAt)}</p>
              </div>

              <div className="bodyCell">
                <p className="primaryText">{formatAction(a.action)}</p>
              </div>

              <div className="bodyCell">
                <p className="primaryText">{a.target}</p>
              </div>

              <div className="bodyCell">
                <p className="primaryText">{a.username}</p>
              </div>

              <div className="bodyCell">
                <div className={styles.auditStack}>
                  <span
                    className={
                      a.isSuccessful ? styles.validPill : styles.errorPill
                    }
                  >
                    {a.isSuccessful ? "True" : "False"}
                  </span>
                </div>
              </div>

              <div className="bodyCell">
                <p className={styles.errorText}>{a.message || ""}</p>
              </div>
            </div>
          ))
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
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="75">75</option>
            <option value="100">100</option>
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
