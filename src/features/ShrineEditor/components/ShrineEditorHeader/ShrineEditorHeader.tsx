import styles from "./ShrineEditorHeader.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function ShrineEditorHeader() {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button 
          className={styles.backButton} 
          type="button"
          onClick={() => navigate("/shrines")}
        >
          <IoIosArrowBack />
        </button>

        <div className={styles.titleGroup}>
          <span className="text-xl font-bold text-primary">Shrine Editor</span>
          <span className={styles.separator}>›</span>
          <span className="text-md text-secondary">Fushimi Inari Taisha</span>
        </div>
      </div>

      <button className="btn btn-outline" type="button">
        Submit for Review
      </button>
    </header>
  );
}