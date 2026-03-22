import { useParams } from "react-router-dom";
import EditorArea from "../../features/ShrineEditor/components/EditorArea/EditorArea";
import EditorNotes from "../../features/ShrineEditor/components/EditorNotes/EditorNotes";
import SideMeta from "../../features/ShrineEditor/components/SideMeta/SideMeta";
import styles from "./ShrineEditorPage.module.css";

export default function ShrineEditorPage() {
  const { shrineId } = useParams();
  const shrineIdNumber = shrineId ? Number(shrineId) : null;

  if (!shrineIdNumber || Number.isNaN(shrineIdNumber)) {
    return <div>Invalid shrine id.</div>;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.leftPane}>
        <SideMeta shrineId={shrineIdNumber} />
      </div>

      <div className={styles.centerPane}>
        <EditorArea shrineId={shrineIdNumber} />
      </div>

      <div className={styles.rightPane}>
        <EditorNotes />
      </div>
    </div>
  );
}