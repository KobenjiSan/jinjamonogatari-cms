import { useState } from "react";
import styles from "./UserFilters.module.css";

export type UserSearchFilters = {
  searchValue: string | null;
  role: string | null;
  sorting: string | null;
}

type UserFiltersProps = {
  onSearch: (query: UserSearchFilters) => void;
};

export default function UserFilters({onSearch}: UserFiltersProps) {
  const [searchValue, setSearchValue] = useState("");
  const [role, setRole] = useState("");
  const [sorting, setSorting] = useState("");

  function handleSearch(){
    onSearch({
      searchValue: searchValue.trim(),
      role: role.trim(),
      sorting: sorting.trim(),
    });
  }

  return (
    <div className={styles.filters}>
      <input 
        type="text" 
        placeholder="Search users..." 
        className="input" 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <select
        id="location-filter"
        className="select"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Role</option>
        <option value="User">User</option>
        <option value="Editor">Editor</option>
        <option value="Admin">Admin</option>
      </select>

      <select
        id="sorting-filter"
        className="select"
        value={sorting}
        onChange={(e) => setSorting(e.target.value)}
      >
        <option value="">Filters</option>
        <option value="usernameAsc">Username (A → Z)</option>
        <option value="usernameDesc">Username (Z → A)</option>
        <option value="IdAsc">UserId (Lowest First)</option>
        <option value="IdDesc">UserId (Highest First)</option>
        <option value="lastLoginAsc">Last Login (Oldest First)</option>
        <option value="lastLoginDesc">Last Login (Newest First)</option>
      </select>

      <button className="btn btn-outline" onClick={handleSearch}>Apply</button>
    </div>
  );
}
