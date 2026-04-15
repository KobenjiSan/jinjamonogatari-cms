import { useEffect, useState } from "react";
import styles from "./TagsList.module.css";
import { getAllTagsList , type TagCMSDto } from "../../tagApi";
import type { TagsSearchFilters } from "../TagsFilters/TagsFilters";
import toast from "react-hot-toast";

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

export type TagsListPagination = {
  pageNumber: number;
  pageSize: number;
};

type TagsListProps = {
  filters: TagsSearchFilters | null;
  onEdit: (Tags: TagCMSDto) => void;
  onRemove: (Tags: TagCMSDto) => void;
  onUpdate: number;
  isDeleting: boolean;
};

export default function TagsList({
  filters,
  onEdit,
  onRemove,
  onUpdate,
  isDeleting,
}: TagsListProps) {
  const [tags, setTags] = useState<TagCMSDto[]>([]);
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
    async function loadTags() {
      setLoading(true);

      try {
        const result = await getAllTagsList(filters, { pageNumber, pageSize });
        setTags(result.tags);
        setTotalItems(result.totalCount);
      } catch (error) {
        console.error("Failed to load tags", error);
        const err = error as { message?: string };
        toast.error(err.message ?? "Failed to load tags");
      } finally {
        setLoading(false);
      }
    }

    loadTags();
  }, [filters, pageNumber, pageSize, onUpdate]);

  return (
    <div className={styles.wrapper}>
      <div
        className={`listShell ${styles.gridTable}`}
        style={{
          gridTemplateColumns: ".25fr 1fr 1fr .75fr .75fr auto",
        }}
      >
        <div className={`headerCell ${styles.idCol}`}>ID</div>
        <div className={`headerCell ${styles.titleEn}`}>Title (English)</div>
        <div className={`headerCell ${styles.titleJp}`}>Title (Japanese)</div>
        <div className={`headerCell ${styles.createdCol}`}>Created</div>
        <div className={`headerCell ${styles.updatedCol}`}>Last Updated</div>
        <div className={`headerCell ${styles.actionsCol}`}>Actions</div>

        {loading ? (
          <div className="rowGroup">
            <div className="bodyCell" style={{ gridColumn: "1 / -1" }}>
              <p className="text-md text-secondary">Loading...</p>
            </div>
          </div>
        ) : !tags.length ? (
          <div className="rowGroup">
            <div className="bodyCell" style={{ gridColumn: "1 / -1" }}>
              <p className="text-md text-secondary">No tags found.</p>
            </div>
          </div>
        ) : (
          tags.map((t) => (
            <div key={t.tagId} className="rowGroup">
              <div className={`bodyCell ${styles.idCol}`}>
                <div className="listStackSm">
                  <p className="metaText">{t.tagId}</p>
                </div>
              </div>

              <div className={`bodyCell ${styles.titleEn}`}>
                <div className="listStackSm">
                  <p className="primaryText">{t.titleEn}</p>
                </div>
              </div>

              <div className={`bodyCell ${styles.titleJp}`}>
                <div className="listStackSm">
                  <p className="primaryText">{t.titleJp || "-"}</p>
                </div>
              </div>

              <div className={`bodyCell ${styles.createdCol}`}>
                <div className="listStackSm">
                  <p className="metaText">
                    {formatDateTime(t.createdAt)}
                  </p>
                </div>
              </div>

              <div className={`bodyCell ${styles.createdCol}`}>
                <div className="listStackSm">
                  <p className="metaText">
                    {formatDateTime(t.updatedAt)}
                  </p>
                </div>
              </div>

              <div className={`bodyCell ${styles.actionsCol}`}>
                <div className={styles.actionGroup}>
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => onEdit(t)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    className="btn btn-outline-danger"
                    onClick={() => onRemove(t)}
                  >
                    Remove
                  </button>
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
              disabled={pageNumber === 1}
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