import styles from "./ShrineHeader.module.css";

type ShrineHeaderProps = {
  onImport: () => void;
  onCreate: () => void;
}

export default function ShrineHeader({onImport, onCreate}: ShrineHeaderProps) {
  return (
    <div className={styles.header}>
      <div className="page-title">Shrines</div>
      <div className={styles.actionButtons}>
        <button className="btn btn-outline" onClick={onImport}>Import</button>
        <button className="btn btn-primary" onClick={onCreate}>Create</button>
      </div>
    </div>
  );
}