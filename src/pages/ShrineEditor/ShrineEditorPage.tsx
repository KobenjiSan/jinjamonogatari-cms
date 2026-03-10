import EditorArea from "../../features/ShrineEditor/components/EditorArea/EditorArea";
import EditorNotes from "../../features/ShrineEditor/components/EditorNotes/EditorNotes";
import SideMeta from "../../features/ShrineEditor/components/SideMeta/SideMeta";

import { useParams } from "react-router-dom";


export default function ShrineEditorPage() {
  const { shrineId } = useParams();
  const shrineIdNumber = shrineId ? Number(shrineId) : null;

  if (!shrineIdNumber || Number.isNaN(shrineIdNumber)) {
    return <div>Invalid shrine id.</div>;
  }

  return (
    <div style={{ display: "flex", background: "#f7f6f3"}}>
        <div style={{ flex: 2.25 }}>
          <SideMeta shrineId={shrineIdNumber} />
        </div>

        <div style={{ flex: 8 }}>
          <EditorArea />
        </div>

        <div style={{ flex: 2.5 }}>
          <EditorNotes />
        </div>
      </div>
  );
}