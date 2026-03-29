import styles from "./StatusTabs.module.css";

export type StatusTabKey = "import" | "draft" | "review" | "published";

type StatusTabsProps = {
  activeTab: StatusTabKey;
  onTabChange: (tab: StatusTabKey) => void;
};

export default function StatusTabs({
  activeTab,
  onTabChange,
}: StatusTabsProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "import" ? styles.active : ""
          }`}
          onClick={() => onTabChange("import")}
        >
          Imported
        </button>

        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "draft" ? styles.active : ""
          }`}
          onClick={() => onTabChange("draft")}
        >
          Drafts
        </button>

        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "review" ? styles.active : ""
          }`}
          onClick={() => onTabChange("review")}
        >
          Under Review
        </button>

        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "published" ? styles.active : ""
          }`}
          onClick={() => onTabChange("published")}
        >
          Published
        </button>
      </div>
    </div>
  );
}
