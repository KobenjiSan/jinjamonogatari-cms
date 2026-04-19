import { useState } from "react";
import styles from "./KamiFilters.module.css";

export type KamiSearchFilters = {
  searchValue: string | null;
  sorting: string | null;
}

type KamiFiltersProps = {
  onSearch: (query: KamiSearchFilters) => void;
};

export default function KamiFilters({onSearch}: KamiFiltersProps) {
  const [searchValue, setSearchValue] = useState("");
  const [sorting, setSorting] = useState("");

  function handleSearch(){
    onSearch({
      searchValue: searchValue.trim(),
      sorting: sorting.trim(),
    });
  }

  return (
    <div className={styles.filters}>
      <input 
        type="text" 
        placeholder="Search kami..." 
        className="input" 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <select
        id="sorting-filter"
        className="select"
        value={sorting}
        onChange={(e) => setSorting(e.target.value)}
      >
        <option value="">Filters</option>
        <option value="titleAsc">Name (A → Z)</option>
        <option value="titleDesc">Name (Z → A)</option>
        <option value="idAsc">Id (Lowest First)</option>
        <option value="idDesc">Id (Highest First)</option>
        <option value="updatedAsc">Updated (Oldest First)</option>
        <option value="updatedDesc">Updated (Newest First)</option>
      </select>

      <button className="btn btn-outline" onClick={handleSearch}>Apply</button>
    </div>
  );
}
