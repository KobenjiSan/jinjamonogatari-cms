import styles from "./EditorNotes.module.css";

export default function EditorNotes() {
  return (
    <aside className={styles.editorNotes}>
      <div className={styles.panel}>
        <div className={styles.body}>
          <textarea
            id="editorNotes"
            className={`textarea ${styles.textarea}`}
            placeholder={`Use this area for internal notes only...

- missing English title
- verify address formatting
- need better hero image
- double check official website
- folklore section still incomplete`}
          />
        </div>

        <div className={styles.footer}>
          <span className="text-xs text-secondary">Unsaved changes</span>
          <button className="btn btn-primary" type="button">
            Save Notes
          </button>
        </div>
      </div>
    </aside>
  );
}