import { useState } from "react";
import MapContainer from "../../../../features/map/MapContainer/MapContainer";
import MapFilters, { type ShrineMapSearchFilters } from "../../../../features/shrines/components/Filters/MapFilters";

export default function ShrineMapTab() {
  const [currentSearch, setCurrentSearch] = useState<ShrineMapSearchFilters | null>(null);
  return (
    <div>
      <MapFilters onSearch={setCurrentSearch} />
      <MapContainer searchValues={currentSearch} />
    </div>
  );
}
