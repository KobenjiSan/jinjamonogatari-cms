import { FiPlus } from "react-icons/fi";
import styles from "./TagsHeader.module.css";

type TagsHeaderProps = {
  onCreate: () => void;
};

export default function TagsHeader({ onCreate }: TagsHeaderProps) {
  return (
    <div className={styles.header}>
      <div className="page-title">Tags</div>
      <div className={styles.actionButtons}>
        <button className={`${styles.actionButton} btn btn-outline`} onClick={() => onCreate()}>
          <FiPlus size={18} />
          <span>New Tag</span>
        </button>
      </div>
    </div>
  );
}
