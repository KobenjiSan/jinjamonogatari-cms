import { useEffect, useState } from "react";
import styles from "./KamiList.module.css";
import {
  getAllKami,
  type KamiCMSDto,
} from "../../../../ShrineEditor/components/EditorArea/components/tabs/kami/kamiApi";
import type { KamiSearchFilters } from "../KamiFilters/KamiFilters";
import toast from "react-hot-toast";

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
  const [pageSize, setPageSize] = useState(5);
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
          gridTemplateColumns: ".25fr 1.25fr .5fr 3fr 1.5fr auto",
        }}
      >
        <div className="headerCell">ID</div>
        <div className="headerCell">Kami</div>
        <div className="headerCell">Status</div>
        <div className="headerCell">Description</div>
        <div className="headerCell">Created / Updated</div>
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
          kami.map((k) => (
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
                <span className="pill">{k.status ?? "-"}</span>
              </div>

              <div className="bodyCell">
                <span className={styles.description}>{k.desc ?? "-"}</span>
              </div>

              <div className="bodyCell">
                <div className="listStackSm">
                  <p className={`metaText ${styles.singleLine}`}>
                    Created:{" "}
                    {k.createdAt ? new Date(k.createdAt).toLocaleString() : "-"}
                  </p>

                  <p className={`metaText ${styles.singleLine}`}>
                    Updated:{" "}
                    {k.updatedAt ? new Date(k.updatedAt).toLocaleString() : "-"}
                  </p>
                </div>
              </div>

              <div className="bodyCell">
                <div className={styles.actionGroup}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => onEdit(k)}
                  >
                    Edit
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
