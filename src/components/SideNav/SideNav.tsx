import { NavLink } from "react-router-dom";
import styles from "./SideNav.module.css";
import { useAuth } from "../../auth/AuthProvider";

export default function SideNav() {
  const { user } = useAuth();

  return (
    <aside className={styles.sideNav}>
      <div className="app-brand">CMS</div>

      <nav className={styles.nav}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/shrines"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          Shrines
        </NavLink>

        <NavLink
          to="/etiquette" // Update later
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          Etiquette
        </NavLink>

        <NavLink
          to="/kami" // Update later
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          Kami
        </NavLink>

        <NavLink
          to="/tags" // Update later
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          Tags
        </NavLink>

        {user!.role == "Admin" && (
          <>
            <hr />
            <NavLink
              to="/users" // Update later
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              Users
            </NavLink>

            <NavLink
              to="/audits" // Update later
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              Audits
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
