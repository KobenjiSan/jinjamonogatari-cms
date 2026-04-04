import { useState } from "react";
import EditorTabs, {
  type EditorTabKey,
} from "./components/EditorTabs/EditorTabs";
import styles from "./EditorArea.module.css";
import KamiTab from "./components/tabs/kami/KamiTab";
import HistoryTab from "./components/tabs/history/HistoryTab";
import FolkloreTab from "./components/tabs/folklore/FolkloreTab";
import GalleryTab from "./components/tabs/gallery/GalleryTab";
import StatusTab from "./components/tabs/status/StatusTab";
import CitationTab from "./components/tabs/citations/CitationTab";

type EditorAreaProps = {
  shrineId: number;
  isReadOnly: boolean;
  shrineStatus: string;
  onRefreshPage: () => void;
};

export default function EditorArea({
  shrineId,
  isReadOnly,
  shrineStatus,
  onRefreshPage
}: EditorAreaProps) {
  const [activeTab, setActiveTab] = useState<EditorTabKey>("status");

  function renderTabContent() {
    switch (activeTab) {
      case "status":
        return (
          <StatusTab
            shrineId={shrineId}
            isReadOnly={isReadOnly}
            shrineStatus={shrineStatus}
            onRefreshPage={onRefreshPage}
          />
        );
      case "kami":
        return <KamiTab shrineId={shrineId} isReadOnly={isReadOnly} />;
      case "history":
        return <HistoryTab shrineId={shrineId} isReadOnly={isReadOnly} />;
      case "folklore":
        return <FolkloreTab shrineId={shrineId} isReadOnly={isReadOnly} />;
      case "gallery":
        return <GalleryTab shrineId={shrineId} isReadOnly={isReadOnly} />;
      case "citations":
        return <CitationTab shrineId={shrineId} />;
      default:
        return null;
    }
  }

  return (
    <section className={styles.editorArea}>
      <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={styles.mainArea}>{renderTabContent()}</div>
    </section>
  );
}
