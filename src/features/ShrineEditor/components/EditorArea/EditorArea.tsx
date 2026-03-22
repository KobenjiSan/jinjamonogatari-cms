import { useState } from "react";
import EditorTabs, { type EditorTabKey } from "./components/EditorTabs/EditorTabs";
import styles from "./EditorArea.module.css";
import KamiTab from "./components/tabs/kami/KamiTab";
import HistoryTab from "./components/tabs/history/HistoryTab";
import FolkloreTab from "./components/tabs/folklore/FolkloreTab";
import GalleryTab from "./components/tabs/gallery/GalleryTab";
import StatusTab from "./components/tabs/status/StatusTab";

type EditorAreaProps = {
  shrineId: number;
};

export default function EditorArea({ shrineId }: EditorAreaProps) {
  const [activeTab, setActiveTab] = useState<EditorTabKey>("status");

  function renderTabContent() {
    switch (activeTab) {
      case "status":
        return <StatusTab shrineId={shrineId} />;
      case "kami":
        return <KamiTab shrineId={shrineId} />;
      case "history":
        return <HistoryTab shrineId={shrineId} />;
      case "folklore":
        return <FolkloreTab shrineId={shrineId} />;
      case "gallery":
        return <GalleryTab shrineId={shrineId} />;
      default:
        return null;
    }
  }

  return (
    <section className={styles.editorArea}>
      <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={styles.mainArea}>
        {renderTabContent()}
      </div>
    </section>
  );
}