import EditorTabs from "../EditorTabs/EditorTabs";
import styles from "./EditorArea.module.css";

export default function EditorArea() {
  return (
    <div >
        <EditorTabs />
        <div className={styles.mainArea}>
            Shrine Editor Area
        </div>
    </div>
  );
}