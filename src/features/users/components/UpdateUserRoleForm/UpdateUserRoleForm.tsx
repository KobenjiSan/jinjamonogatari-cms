import { useEffect, useState } from "react";
import styles from "./UpdateUserRoleForm.module.css";
import type { UserListDto } from "../../usersApi";

type UpdateUserRoleFormProps = {
  user: UserListDto;
  onRole: (newRole: string) => void;
};

export default function UpdateUserRoleForm({user, onRole,}: UpdateUserRoleFormProps) {
  const [role, setRole] = useState(user.roleName);

  useEffect(() => {
    setRole(user.roleName);
  }, [user]);

  useEffect(() => {
    onRole(role);
  }, [role, onRole]);

  const isSameRole = role === user.roleName;

  return (
     <div className={`column gap-lg ${styles.wrapper}`}>
      <div className="column gap-xs">
        <p className="text-sm text-muted font-semibold">SELECTED USER</p>
        <h3 className="text-xl font-bold text-primary">{user.username}</h3>
      </div>

      <div className="card column gap-lg">
        <div className={styles.currentRoleRow}>
          <div className="column gap-xs">
            <p className="text-sm text-secondary font-semibold">Current Role</p>
            <p className="text-sm text-muted">
              User&apos;s current permission level.
            </p>
          </div>

          <span className="pill">{user.roleName}</span>
        </div>

        <div className="divider" />

        <div className="form-group">
          <label htmlFor="user-role" className="label">
            Select Role
          </label>

          <select
            id="user-role"
            className="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Editor">Editor</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {isSameRole && (
        <p className={styles.helperText}>
          Select a different role to enable updating.
        </p>
      )}
    </div>
  );
}