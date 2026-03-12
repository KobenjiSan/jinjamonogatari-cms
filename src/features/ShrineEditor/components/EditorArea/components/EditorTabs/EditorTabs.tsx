import styles from "./EditorTabs.module.css";

export type EditorTabKey =
  | "status"
  | "kami"
  | "history"
  | "folklore"
  | "gallery";

type EditorTabsProps = {
  activeTab: EditorTabKey;
  onTabChange: (tab: EditorTabKey) => void;
};

export default function EditorTabs({
  activeTab,
  onTabChange,
}: EditorTabsProps) {
  return (
    <div className={styles.tabs}>
      <button
        type="button"
        className={`${styles.tab} ${
          activeTab === "status" ? styles.active : ""
        }`}
        onClick={() => onTabChange("status")}
      >
        Status
      </button>

      <button
        type="button"
        className={`${styles.tab} ${activeTab === "kami" ? styles.active : ""}`}
        onClick={() => onTabChange("kami")}
      >
        Kami
      </button>

      <button
        type="button"
        className={`${styles.tab} ${
          activeTab === "history" ? styles.active : ""
        }`}
        onClick={() => onTabChange("history")}
      >
        History
      </button>

      <button
        type="button"
        className={`${styles.tab} ${
          activeTab === "folklore" ? styles.active : ""
        }`}
        onClick={() => onTabChange("folklore")}
      >
        Folklore
      </button>

      <button
        type="button"
        className={`${styles.tab} ${
          activeTab === "gallery" ? styles.active : ""
        }`}
        onClick={() => onTabChange("gallery")}
      >
        Gallery
      </button>
    </div>
  );
}
