import { useParams } from "react-router-dom";
import EditorArea from "../../features/ShrineEditor/components/EditorArea/EditorArea";
import EditorNotes from "../../features/ShrineEditor/components/EditorNotes/EditorNotes";
import SideMeta from "../../features/ShrineEditor/components/SideMeta/SideMeta";
import styles from "./ShrineEditorPage.module.css";
import { useEffect, useState } from "react";
import ShrineEditorHeader from "../../features/ShrineEditor/components/ShrineEditorHeader/ShrineEditorHeader";
import { useAuth } from "../../auth/AuthProvider";

export default function ShrineEditorPage() {
  const { user } = useAuth();
  const { shrineId } = useParams();
  const shrineIdNumber = shrineId ? Number(shrineId) : null;

  const [shrineStatus, setShrineStatus] = useState("");
  const [shrineName, setShrineName] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(true);

  useEffect(() => {
    const isEditor = user?.role === "Editor";
    const isAdmin = user?.role === "Admin";
    if (isEditor) {
      setIsReadOnly(shrineStatus === "review" || shrineStatus === "published");
    } else if (isAdmin) {
      setIsReadOnly(shrineStatus === "published");
    }
  }, [user, shrineStatus]);

  if (!shrineIdNumber || Number.isNaN(shrineIdNumber)) {
    return <div>Invalid shrine id.</div>;
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <ShrineEditorHeader shrineName={shrineName} />

      {isReadOnly && (
        <div className={styles.readOnlyWarningCard}>
          This shrine is view-only. Any changes you make won’t be saved.
        </div>
      )}

      <main>
        <div className={styles.layout}>
          <div className={styles.leftPane}>
            <SideMeta
              shrineId={shrineIdNumber}
              onStatusChange={(status) => setShrineStatus(status)}
              onShrineNameChange={(shrineName) => setShrineName(shrineName)}
              isReadOnly={isReadOnly}
            />
          </div>

          <div className={styles.centerPane}>
            <EditorArea
              shrineId={shrineIdNumber}
              isReadOnly={isReadOnly}
              shrineStatus={shrineStatus}
            />
          </div>

          <div className={styles.rightPane}>
            <EditorNotes shrineId={shrineIdNumber} isReadOnly={isReadOnly} />
          </div>
        </div>
      </main>
    </div>
  );
}
