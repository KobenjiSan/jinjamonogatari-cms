import MapContainer from "../../../../features/map/MapContainer/MapContainer";
import MapFilters from "../../../../features/shrines/components/Filters/MapFilters";

export default function ShrineMapTab() {
  return (
    <div>
      <MapFilters onSearch={() => {}} />
      <MapContainer />
    </div>
  );
}
