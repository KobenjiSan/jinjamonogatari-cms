// import styles from "./ShrinesPage.module.css";
import Filters from "../../features/shrines/components/Filters/Filters";
import ShrineHeader from "../../features/shrines/components/header/ShrineHeader";
import ShrineList from "../../features/shrines/components/shrineList/ShrineList";
import StatusTabs from "../../features/shrines/components/statusTab/StatusTabs";

export default function ShrinesPage() {
  return (
    <div>
      <ShrineHeader />
      <div className="p-xl">
        <StatusTabs />
        <Filters />
        <ShrineList />
      </div>
    </div>
  );
}