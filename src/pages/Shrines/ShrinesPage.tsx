// import styles from "./ShrinesPage.module.css";
import { useState } from "react";
import Filters from "../../features/shrines/components/Filters/Filters";
import ShrineHeader from "../../features/shrines/components/header/ShrineHeader";
import ShrineList from "../../features/shrines/components/shrineList/ShrineList";
import StatusTabs, {
  type StatusTabKey,
} from "../../features/shrines/components/statusTab/StatusTabs";

export default function ShrinesPage() {
  const [activeTab, setActiveTab] = useState<StatusTabKey>("import");

  return (
    <div>
      <ShrineHeader />
      <div className="p-xl">
        <StatusTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <Filters />
        <ShrineList activeTab={activeTab} />
      </div>
    </div>
  );
}
