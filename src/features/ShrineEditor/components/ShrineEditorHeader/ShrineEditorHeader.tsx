import styles from "./ShrineEditorHeader.module.css";

export default function ShrineEditorHeader() {
  return (
    <div className={styles.header}>
        <div>Back button</div>
      <div className="app-brand">Shrine Editor</div>
    </div>
  );
}