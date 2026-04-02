import { useState } from "react";
import styles from "./Filters.module.css";

export type ShrineSearchFilters = {
  searchValue: string | null;
  prefecture: string | null;
  sorting: string | null;
}

type FiltersProps = {
  onSearch: (query: ShrineSearchFilters) => void;
};

export default function Filters({onSearch}: FiltersProps) {
  const [searchValue, setSearchValue] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [sorting, setSorting] = useState("");

  function handleSearch(){
    onSearch({
      searchValue: searchValue.trim(),
      prefecture: prefecture.trim(),
      sorting: sorting.trim(),
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
        id="sorting-filter"
        className="select"
        value={sorting}
        onChange={(e) => setSorting(e.target.value)}
      >
        <option value="">Filters</option>
        <option value="titleAsc">Title (A → Z)</option>
        <option value="titleDesc">Title (Z → A)</option>
        <option value="updatedDesc">Last Updated (Newest First)</option>
        <option value="updatedAsc">Last Updated (Oldest First)</option>
      </select>

      <button className="btn btn-outline" onClick={handleSearch}>Apply</button>
    </div>
  );
}
