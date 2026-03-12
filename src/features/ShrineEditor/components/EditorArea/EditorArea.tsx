import { useState } from "react";
import EditorTabs, { type EditorTabKey } from "./components/EditorTabs/EditorTabs";
import styles from "./EditorArea.module.css";
import KamiTab from "./components/tabs/kami/KamiTab";

type EditorAreaProps = {
  shrineId: number;
};

export default function EditorArea({shrineId}: EditorAreaProps) {
  const [activeTab, setActiveTab] = useState<EditorTabKey>("status");

  function renderTabContent() {
    switch (activeTab) {
      case "status":
        return <div>Status editor goes here</div>;
      case "kami":
        return <KamiTab shrineId={shrineId} />;
      case "history":
        return <div>History editor goes here</div>;
      case "folklore":
        return <div>Folklore editor goes here</div>;
      case "gallery":
        return <div>Gallery editor goes here</div>;
      default:
        return null;
    }
  }

  return (
    <div>
      <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={styles.mainArea}>{renderTabContent()}</div>
    </div>
  );
}
