import { useEffect, useState } from "react";
import { getShrineList, type ShrineListDto } from "../../shrinesApi";
import styles from "./ShrineList.module.css";
import { useNavigate } from "react-router-dom";

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

export default function ShrineList() {
  const navigate = useNavigate();
  const [shrines, setShrines] = useState<ShrineListDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShrines() {
      try {
        const result = await getShrineList();
        setShrines(result.shrines);
      } catch (err) {
        console.error("Failed to load shrines", err);
      } finally {
        setLoading(false);
      }
    }

    loadShrines();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <p className="text-md text-secondary">Loading...</p>
      </div>
    );
  }

  if (!shrines.length) {
    return (
      <div className="card">
        <p className="text-md text-secondary">No shrines found.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={`listShell ${styles.gridTable}`}>
        {/* Header */}
        <div className={`headerCell ${styles.shrineCol}`}>Shrine</div>
        <div className={`headerCell ${styles.statusCol}`}>Status</div>
        <div className={`headerCell ${styles.locationCol}`}>Location</div>
        <div className={`headerCell ${styles.updatedCol}`}>Last Updated</div>
        <div className={`headerCell ${styles.readinessCol}`}>Readiness</div>
        <div className={`headerCell ${styles.actionsCol}`}>Actions</div>

        {/* Rows */}
        {shrines.map((s) => (
          <div key={s.shrineId} className="rowGroup">
            <div className={`bodyCell ${styles.shrineCol}`}>
              <div className="listStackSm">
                <p className="primaryText">{s.nameEn ?? "-"}</p>
                <p className="metaText">{s.nameJp ?? "-"}</p>
              </div>
            </div>

            <div className={`bodyCell ${styles.statusCol}`}>
              <span className="pill">{s.status ?? "-"}</span>
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
              <span className="text-sm text-secondary">-</span>
            </div>

            <div className={`bodyCell ${styles.actionsCol}`}>
              <div className="actionGroup">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate(`/shrines/${s.shrineId}`)}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.paginationBar}>
        <div className={styles.paginationLeft}>
          <span className={styles.paginationLabel}>Rows per page</span>
          <select className={styles.paginationSelect} defaultValue="10">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div className={styles.paginationRight}>
          <span className={styles.paginationRange}>Showing 1–10 of 48</span>

          <div className={styles.pageControls}>
            <button type="button" className={styles.pageButton}>
              &lt;
            </button>

            <div className={styles.pageNumber}>1</div>

            <button type="button" className={styles.pageButton}>
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}