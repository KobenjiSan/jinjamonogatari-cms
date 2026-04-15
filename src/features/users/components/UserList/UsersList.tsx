import { useEffect, useState } from "react";
import styles from "./UsersList.module.css";
import { getUserList, type UserListDto } from "../../usersApi";
import type { UserSearchFilters } from "../UserFilters/UserFilters";
import { useAuth } from "../../../../auth/AuthProvider";
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

export type UserListPagination = {
  pageNumber: number;
  pageSize: number;
};

type UserListProps = {
  filters: UserSearchFilters | null;
  onEdit: (user: UserListDto) => void;
  onRemove: (user: UserListDto) => void;
  onUpdate: number;
  isDeleting: boolean;
};

export default function UsersList({
  filters,
  onEdit,
  onRemove,
  onUpdate,
  isDeleting,
}: UserListProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserListDto[]>([]);
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
    async function loadUsers() {
      setLoading(true);

      try {
        const result = await getUserList(filters, { pageNumber, pageSize });
        setUsers(result.users);
        setTotalItems(result.totalCount);
      } catch (error) {
        console.error("Failed to load users", error);
        const err = error as { message?: string };
        toast.error(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [filters, pageNumber, pageSize, onUpdate]);

  return (
    <div className={styles.wrapper}>
      <div
        className={`listShell ${styles.gridTable}`}
        style={{
          gridTemplateColumns: ".25fr 1.5fr .5fr 1fr 1fr .5fr auto",
        }}
      >
        <div className={`headerCell ${styles.idCol}`}>ID</div>
        <div className={`headerCell ${styles.identityCol}`}>Identity</div>
        <div className={`headerCell ${styles.roleCol}`}>Role</div>
        <div className={`headerCell ${styles.createdCol}`}>Created / Updated</div>
        <div className={`headerCell ${styles.lastLoginCol}`}>Last Login</div>
        <div className={`headerCell ${styles.numSavedCol}`}># Saved</div>
        <div className={`headerCell ${styles.actionsCol}`}>Actions</div>

        {loading ? (
          <div className="rowGroup">
            <div className="bodyCell" style={{ gridColumn: "1 / -1" }}>
              <p className="text-md text-secondary">Loading...</p>
            </div>
          </div>
        ) : !users.length ? (
          <div className="rowGroup">
            <div className="bodyCell" style={{ gridColumn: "1 / -1" }}>
              <p className="text-md text-secondary">No users found.</p>
            </div>
          </div>
        ) : (
          users.map((u) => (
            <div key={u.userId} className="rowGroup">
              <div className={`bodyCell ${styles.idCol}`}>
                <div className="listStackSm">
                  <p className="metaText">{u.userId}</p>
                </div>
              </div>

              <div className={`bodyCell ${styles.identityCol}`}>
                <div className="listStackSm">
                  <p className="primaryText">{u.username || "-"}</p>
                  <p className="metaText">{u.email || "-"}</p>
                </div>
              </div>

              <div className={`bodyCell ${styles.roleCol}`}>
                <div className={styles.statusArea}>
                  <span className="pill">{u.roleName || "-"}</span>
                </div>
              </div>

              <div className={`bodyCell ${styles.createdCol}`}>
                <div className="listStackSm">
                  <p className="metaText">
                    Created:{" "}
                    {formatDateTime(u.createdAt)}
                  </p>
                  <p className="metaText">
                    Updated:{" "}
                    {formatDateTime(u.updatedAt)}
                  </p>
                </div>
              </div>

              <div className={`bodyCell ${styles.lastLoginCol}`}>
                <div className="timeBlock">
                  <p className="primaryText">{formatDateTime(u.lastLoginAt)}</p>
                </div>
              </div>

              <div className={`bodyCell ${styles.numSavedCol}`}>
                <div className="listStackSm">
                  <p className="primaryText">{u.savedShrineCount ?? 0}</p>
                </div>
              </div>

              <div className={`bodyCell ${styles.actionsCol}`}>
                <div className={styles.actionGroup}>
                <button
                    type="button"
                    disabled={user?.userId == u.userId}
                    className="btn btn-outline"
                    onClick={() => onEdit(u)}
                  >
                    Edit Role
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting || user?.userId == u.userId}
                    className="btn btn-outline-danger"
                    onClick={() => onRemove(u)}
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