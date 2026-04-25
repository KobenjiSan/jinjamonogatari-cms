import { FiPlus } from "react-icons/fi";
import styles from "./EtiquetteHeader.module.css";

type EtiquetteHeaderProps = {
  onCreate: () => void;
};

export default function EtiquetteHeader({ onCreate }: EtiquetteHeaderProps) {
  return (
    <div className={styles.header}>
      <div className="page-title">Etiquette</div>
      <div className={styles.actionButtons}>
        <button className={`${styles.actionButton} btn btn-outline`} onClick={() => onCreate()}>
          <FiPlus size={18} />
          <span>New Topic</span>
        </button>
      </div>
    </div>
  );
}
