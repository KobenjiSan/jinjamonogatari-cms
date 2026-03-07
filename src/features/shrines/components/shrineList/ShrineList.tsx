import { useEffect, useState } from "react";
import { getShrineList, type ShrineListDto } from "../../shrinesApi";
import styles from "./ShrineList.module.css";
import { useNavigate } from "react-router-dom";

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
    <div className={styles.container}>
      <div className={`list-header ${styles.gridRow}`}>
        <div>Shrine</div>
        <div>Status</div>
        <div>Location</div>
        <div>Last Updated</div>
        <div>Readiness</div>
        <div>Actions</div>
      </div>

      {shrines.map((s) => (
        <div key={s.shrineId} className={`list-row ${styles.gridRow}`}>
          <div className={styles.cell}>
            <div className={styles.shrineItem}>
              <p className={styles.primaryText}>{s.nameEn ?? "-"}</p>
              <p className={styles.secondaryText}>{s.nameJp ?? "-"}</p>
            </div>
          </div>

          <div className={styles.cell}>
            <span className="pill">{s.status ?? "-"}</span>
          </div>

          <div className={styles.cell}>
            <div className={styles.locationItem}>
              <p className={styles.primaryText}>{s.city ?? "-"}</p>
              <div className={styles.coords}>
                <span>Lat: {s.lat ?? "-"}</span>
                <span>Lon: {s.lon ?? "-"}</span>
              </div>
            </div>
          </div>

          <div className={styles.cell}>
            <p className={styles.primaryText}>
              {s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "-"}
            </p>
          </div>

          <div className={styles.cell}>
            <span className="text-sm text-secondary">-</span>
          </div>

          <div className={styles.cell}>
            <button 
              className="btn btn-outline"
              onClick={() => navigate(`/shrines/${s.shrineId}`)}
            >
              Edit
            </button>
          </div>
        </div>
      ))}
      
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