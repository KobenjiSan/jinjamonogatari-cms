import { Outlet } from "react-router-dom";
import ShrineEditorHeader from "../components/ShrineEditorHeader/ShrineEditorHeader";
import SideMeta from "../components/SideMeta/SideMeta";
import EditorNotes from "../components/EditorNotes/EditorNotes";

export default function ShrineEditorLayout() {
  return (
    <div style={{minHeight: "100vh"}}>
      <ShrineEditorHeader />

      <main style={{ display: "flex", background: "#f7f6f3"}}>
        <div style={{ flex: 2.25 }}>
          <SideMeta />
        </div>

        <div style={{ flex: 8 }}>
          <Outlet />
        </div>

        <div style={{ flex: 2.5 }}>
          <EditorNotes />
        </div>
      </main>
    </div>
  );
}