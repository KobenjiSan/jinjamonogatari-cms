import styles from "./ShrineHeader.module.css";

export default function ShrineHeader() {
  return (
    <div className={styles.header}>
      <div className="page-title">Shrines</div>

      <div>
        <button className="btn btn-outline">+ Import</button>
      </div>
    </div>
  );
}