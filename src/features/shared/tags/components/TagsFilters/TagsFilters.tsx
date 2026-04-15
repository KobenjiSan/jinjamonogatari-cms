import { useState } from "react";
import styles from "./TagsFilters.module.css";

export type TagsSearchFilters = {
  searchValue: string | null;
  sorting: string | null;
}

type TagsFiltersProps = {
  onSearch: (query: TagsSearchFilters) => void;
};

export default function TagsFilters({onSearch}: TagsFiltersProps) {
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
        placeholder="Search tags..." 
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
        <option value="titleAsc">Title (A → Z)</option>
        <option value="titleDesc">Title (Z → A)</option>
        <option value="idAsc">TagId (Lowest First)</option>
        <option value="idDesc">TagId (Highest First)</option>
        <option value="updatedAsc">Updated (Oldest First)</option>
        <option value="updatedDesc">Updated (Newest First)</option>
      </select>

      <button className="btn btn-outline" onClick={handleSearch}>Apply</button>
    </div>
  );
}
