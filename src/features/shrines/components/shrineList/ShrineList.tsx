import { useEffect, useState } from "react";
import { getShrineList, type ShrineListDto } from "../../shrinesApi";
import styles from "./ShrineList.module.css";

export default function ShrineList() {
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
    return <p>Loading...</p>;
  }

  if (!shrines.length) return <p>No shrines found.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.shrine}>Shrine</div>
        <div className={styles.status}>Status</div>
        <div className={styles.location}>Location</div>
        <div className={styles.update}>Last Updated</div>
        <div className={styles.ready}>Readiness</div>
        <div className={styles.action}>Actions</div>
      </div>
      {shrines.map((s) => (
        <div key={s.shrineId} className={styles.item}>
          <div className={styles.shrine}>
            <div className={styles.shrineItem}>
              <p>{s.nameEn ?? "-"}</p>
              <p>{s.nameJp ?? "-"}</p>
            </div>
          </div>
          <div className={styles.status}>{s.status ?? "-"}</div>
          <div className={styles.location}>
            <div className={styles.locationItem}>
              {s.city ?? "-"}
              <div className={styles.coords}>
                <p>Lat: {s.lat ?? "-"}</p>
                <p>Lon: {s.lon ?? "-"}</p>
              </div>
            </div>
          </div>
          <div className={styles.update}>
            <p>{s.updatedAt ? new Date(s.updatedAt).toLocaleString() : "-"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
