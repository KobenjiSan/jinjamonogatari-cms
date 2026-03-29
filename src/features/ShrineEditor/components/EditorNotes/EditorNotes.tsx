import styles from "./EditorNotes.module.css";

type EditorNotesProps = {
  shrineId: number;
  isReadOnly: boolean;
};

export default function EditorNotes({
  shrineId,
  isReadOnly,
}: EditorNotesProps) {
  return (
    <aside className={styles.editorNotes}>
      <div className={styles.panel}>
        <div className={styles.body}>
          <textarea
            id="editorNotes"
            className={`textarea ${styles.textarea}`}
            disabled={isReadOnly}
            placeholder={`Use this area for internal notes only...

- missing English title
- verify address formatting
- need better hero image
- double check official website
- folklore section still incomplete

- Shrine Id: ${shrineId}
- Editable? ${!isReadOnly}`}
          />
        </div>
        {!isReadOnly && (
          <div className={styles.footer}>
            <span className="text-xs text-secondary">Unsaved changes</span>
            <button className="btn btn-primary" type="button">
              Save Notes
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
