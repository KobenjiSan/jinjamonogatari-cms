import { Outlet } from "react-router-dom";
import ShrineEditorHeader from "../features/ShrineEditor/components/ShrineEditorHeader/ShrineEditorHeader";

export default function ShrineEditorLayout() {
  return (
    <div style={{minHeight: "100vh"}}>
      <ShrineEditorHeader />

      <main>
        <Outlet />
      </main>
    </div>
  );
}