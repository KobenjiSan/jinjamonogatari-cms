import styles from "./UsersHeader.module.css";

type UsersHeaderProps = {}

export default function UsersHeader({}: UsersHeaderProps) {
  return (
    <div className={styles.header}>
      <div className="page-title">Users</div>
      <div className={styles.actionButtons}>
        <button className="btn btn-outline" disabled={true}>Create User</button>
      </div>
    </div>
  );
}