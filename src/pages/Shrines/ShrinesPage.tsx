import styles from "./ShrinesPage.module.css";
import ShrineHeader from "../../features/shrines/components/header/ShrineHeader";
import ShrineList from "../../features/shrines/components/shrineList/ShrineList";

export default function ShrinesPage() {
  return (
    <div>
      <ShrineHeader />
      <ShrineList />
    </div>
  );
}