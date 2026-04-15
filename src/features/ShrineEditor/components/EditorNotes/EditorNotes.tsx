import { useEffect, useState } from "react";
import styles from "./EditorNotes.module.css";
import { getShrineNotesById, updateShrineNotes } from "../../ShrineEditorApi";
import toast from "react-hot-toast";

type EditorNotesProps = {
  shrineId: number;
  isReadOnly: boolean;
};

export default function EditorNotes({
  shrineId,
  isReadOnly,
}: EditorNotesProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    async function loadNotes() {
      setLoading(true);

      try {
        const result = await getShrineNotesById(shrineId);
        setNotes(result);
      } catch (error) {
        console.error("Failed to retreive shrine notes", error);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, [shrineId]);

  async function handleSaveNotes() {
    try {
      setLoading(true);

      await updateShrineNotes(shrineId, {
        notes: notes,
      });
      toast.success("Notes updated successfully!");

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save shrine notes", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleNotesUpdate(updatedValue: string) {
    setNotes(updatedValue);
    setHasUnsavedChanges(true);
  }

  return (
    <aside className={styles.editorNotes}>
      <div className={styles.panel}>
        <div className={styles.body}>
          <textarea
            id="editorNotes"
            className={`textarea ${styles.textarea} ${isReadOnly ? styles.disabledPadding : ""}`}
            disabled={isReadOnly}
            value={notes}
            onChange={(e) => handleNotesUpdate(e.target.value)}
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
            <span className="text-xs text-secondary">
              {hasUnsavedChanges ? <>Unsaved changes</> : <>All changes saved</>}
            </span>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSaveNotes}
              disabled={loading}
            >
              Save Notes
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
