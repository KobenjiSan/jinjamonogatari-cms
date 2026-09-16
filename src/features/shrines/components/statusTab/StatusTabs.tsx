import { NavLink } from "react-router-dom";
import styles from "./StatusTabs.module.css";

export type StatusTabKey =
  | "map"
  | "imported"
  | "drafts"
  | "review"
  | "published";

const tabs: { key: StatusTabKey; label: string }[] = [
  { key: "map", label: "Map" },
  { key: "imported", label: "Imported" },
  { key: "drafts", label: "Drafts" },
  { key: "review", label: "Under Review" },
  { key: "published", label: "Published" },
];

export default function StatusTabs() {
  return (
    <nav className={styles.wrapper} aria-label="Shrine status">
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <NavLink
            key={tab.key}
            to={tab.key}
            className={({ isActive }) =>
              `${styles.tab} ${isActive ? styles.active : ""}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
