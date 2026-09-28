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
                style={{ backgroundColor: "var(--color-imported)" }}
              ></div>
              <p className="primaryText">Import</p>
            </li>
            <li>
              <div
                className={styles.dot}
                style={{ backgroundColor: "var(--color-draft)" }}
              ></div>
              <p className="primaryText">Draft</p>
            </li>
            <li>
              <div
                className={styles.dot}
                style={{ backgroundColor: "var(--color-review)" }}
              ></div>
              <p className="primaryText">Under Review</p>
            </li>
            <li>
              <div
                className={styles.dot}
                style={{ backgroundColor: "var(--color-published)" }}
              ></div>
              <p className="primaryText">Published</p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
