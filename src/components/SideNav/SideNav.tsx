import { NavLink } from "react-router-dom";
import styles from "./SideNav.module.css";

export default function SideNav() {
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
      </nav>
    </aside>
  );
}