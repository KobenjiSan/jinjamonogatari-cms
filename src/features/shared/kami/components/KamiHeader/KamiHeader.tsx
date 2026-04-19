import { FiPlus } from "react-icons/fi";
import styles from "./KamiHeader.module.css";

type KamiHeaderProps = {
  onCreate: () => void;
};

export default function KamiHeader({ onCreate }: KamiHeaderProps) {
  return (
    <div className={styles.header}>
      <div className="page-title">Kami</div>
      <div className={styles.actionButtons}>
        <button className={`${styles.actionButton} btn btn-outline`} onClick={() => onCreate()}>
          <FiPlus size={18} />
          <span>New Kami</span>
        </button>
      </div>
    </div>
  );
}
