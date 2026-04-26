import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider";
import styles from "./DashboardHeader.module.css";

export default function DashboardHeader() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className={styles.header}>
      <div className="page-title">Dashboard</div>
      <div className={styles.actionButtons}>
        <button
          className={`${styles.actionButton} btn btn-outline`}
          onClick={handleLogout}
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
