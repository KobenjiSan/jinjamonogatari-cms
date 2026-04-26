import { useAuth } from "../../../auth/AuthProvider";
import styles from "./UserCard.module.css";

export default function UserCard() {
  const { user, isLoading } = useAuth();

  return (
    <>
      {isLoading ? (
        <div className={`card center ${styles.frame}`}>Loading...</div>
      ) : (
        <div className={`card ${styles.frameGrid}`}>
          <div className={styles.imageSection}>
            <div className={styles.imageFrame}>
              <img src="blank-profile-picture.png" alt="profile image" />
            </div>
          </div>
          <div className={styles.userSection}>
            <div className="column gap-xs">
              <span className={styles.meta}>Username</span>
              <span className={styles.primary}>{user?.username}</span>
            </div>
            <div className="column gap-xs">
              <span className={styles.meta}>Role</span>
              <span className={styles.primary}>{user?.role}</span>
            </div>
          </div>
          <div className={styles.emailSection}>
            <div className="column gap-xs">
              <span className={styles.meta}>Email</span>
              <span className={styles.primary}>{user?.email}</span>
            </div>
          </div>
          <div className={styles.emailSection}>
            <div className="column gap-xs">
              <span className={styles.meta}>last Login</span>
              <span className={styles.primary}>---</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
