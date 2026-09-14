import { useState } from "react";
import styles from "./Filters.module.css";

export type ShrineSearchFilters = {
  searchValue: string | null;
  prefecture: string | null;
  status: string | null;
}

type MapFiltersProps = {
  onSearch: (query: ShrineSearchFilters) => void;
};

export default function MapFilters({onSearch}: MapFiltersProps) {
  const [searchValue, setSearchValue] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [status, setStatus] = useState("");

  function handleSearch(){
    onSearch({
      searchValue: searchValue.trim(),
      prefecture: prefecture.trim(),
      status: status.trim(),
    });
  }

  return (
    <div className={styles.filters}>
      <input 
        type="text" 
        placeholder="Search shrines..." 
        className="input" 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <select
        id="location-filter"
        className="select"
        value={prefecture}
        onChange={(e) => setPrefecture(e.target.value)}
      >
        <option value="">Prefecture</option>
        <option value="tokyo">Tokyo (東京都)</option>
        <option value="osaka">Osaka (大阪府)</option>
        <option value="kyoto">Kyoto (京都府)</option>
      </select>

      <select
        id="status-filter"
        className="select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Status</option>
        <option value="import">Imported</option>
        <option value="draft">Drafts</option>
        <option value="review">Under Review</option>
        <option value="published">Published</option>
      </select>

      <button className="btn btn-outline" onClick={handleSearch}>Apply</button>
    </div>
  );
}
