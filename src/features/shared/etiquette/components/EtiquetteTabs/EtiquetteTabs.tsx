import styles from "./EtiquetteTabs.module.css";

export type EtiquetteTabKey = "topics" | "glance";

type EtiquetteTabsProps = {
  activeTab: EtiquetteTabKey;
  onTabChange: (tab: EtiquetteTabKey) => void;
};

export default function EtiquetteTabs({
  activeTab,
  onTabChange,
}: EtiquetteTabsProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "topics" ? styles.active : ""
          }`}
          onClick={() => onTabChange("topics")}
        >
          Topics
        </button>

        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "glance" ? styles.active : ""
          }`}
          onClick={() => onTabChange("glance")}
        >
          Glance
        </button>
      </div>
    </div>
  );
}
