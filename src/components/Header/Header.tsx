import styles from "./Header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <div className="app-brand">JinjaMonogatari</div>
    </div>
  );
}