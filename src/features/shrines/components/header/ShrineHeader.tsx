import styles from "./ShrineHeader.module.css";

export default function ShrineHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.title}>Shrines</div>
      <div>
        <button className={styles.importButton}>+ Import</button>
      </div>
    </div>
  );
}