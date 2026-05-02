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
        <div className="headerCell">ID</div>
        <div className="headerCell">Identity</div>
        <div className="headerCell">Role</div>
        <div className="headerCell">Created / Updated</div>
        <div className="headerCell">Last Login</div>
        <div className="headerCell"># Saved</div>
        <div className="headerCell">Actions</div>

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
              <div className="bodyCell">
                <p className="metaText">{u.userId}</p>
              </div>

              <div className="bodyCell">
                <div className="listStackSm">
                  <p className="primaryText">{u.username || "-"}</p>
                  <p className="metaText">{u.email || "-"}</p>
                </div>
              </div>

              <div className="bodyCell">
                <div className={styles.statusArea}>
                  <span className="pill">{u.roleName || "-"}</span>
                </div>
              </div>

              <div className="bodyCell">
                <div className="listStackSm">
                  <p className="metaText">
                    Created: {formatDateTime(u.createdAt)}
                  </p>
                  <p className="metaText">
                    Updated: {formatDateTime(u.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="bodyCell">
                <p className="primaryText">{formatDateTime(u.lastLoginAt)}</p>
              </div>

              <div className="bodyCell">
                <p className="primaryText">{u.savedShrineCount ?? 0}</p>
              </div>

              <div className="bodyCell">
                <div className={styles.actionGroup}>
                  <button
                    type="button"
                    disabled={user?.userId === u.userId}
                    className="btn btn-outline"
                    onClick={() => onEdit(u)}
                  >
                    Edit Role
                  </button>

                  <button
                    type="button"
                    disabled={isDeleting || user?.userId === u.userId}
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
