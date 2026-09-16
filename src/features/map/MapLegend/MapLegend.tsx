import styles from "./MapLegend.module.css";

export default function MapLegend() {
  return (
    <>
      <div className={styles.container}>
        <p className="metaText">Legend</p>
        <div className={styles.list}>
          <ul>
            <li>
              <div
                className={styles.dot}
                style={{ backgroundColor: "#64748B" }}
              ></div>
              <p className="primaryText">Import</p>
            </li>
            <li>
              <div
                className={styles.dot}
                style={{ backgroundColor: "#2563EB" }}
              ></div>
              <p className="primaryText">Draft</p>
            </li>
            <li>
              <div
                className={styles.dot}
                style={{ backgroundColor: "#D97706" }}
              ></div>
              <p className="primaryText">Under Review</p>
            </li>
            <li>
              <div
                className={styles.dot}
                style={{ backgroundColor: "#16A34A" }}
              ></div>
              <p className="primaryText">Published</p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
