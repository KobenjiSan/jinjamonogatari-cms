import styles from "./Filters.module.css";

export default function Filters() {
  return (
    <div className={styles.filters}>
      <input
        type="text"
        placeholder="Search shrines..."
        className="input"
      />

      <select className="select">
        <option>Location</option>
      </select>

      <select className="select">
        <option>Filter</option>
      </select>

      <button className="btn btn-outline">
        Apply
      </button>
    </div>
  );
}