import { useState } from "react";
import styles from "./AuditFilters.module.css";

export type AuditSearchFilters = {
  searchValue: string | null;
  sorting: string | null;
}

type AuditFiltersProps = {
  onSearch: (query: AuditSearchFilters) => void;
};

export default function AuditFilters({onSearch}: AuditFiltersProps) {
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
        placeholder="Search audit..." 
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
        <option value="createdAsc">Created (Oldest First)</option>
        <option value="createdDesc">Created (Newest First)</option>
        <option value="userAsc">User Id (Lowest First)</option>
        <option value="userDesc">User Id (Highest First)</option>
        <option value="actionAsc">Action (A → Z)</option>
        <option value="actionDesc">Action (Z → A)</option>
        <option value="successAsc">Failures First</option>
        <option value="successDesc">Success First</option>
      </select>

      <button className="btn btn-outline" onClick={handleSearch}>Apply</button>
    </div>
  );
}
