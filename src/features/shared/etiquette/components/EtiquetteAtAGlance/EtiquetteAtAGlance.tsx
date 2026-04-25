import { useState } from "react";
import ConfirmationModal from "../../../../../shared/components/confirmationModal/ConfirmationModal";
import BaseModal from "../../../../../shared/components/modal/BaseModal";
import { useConfirmationState } from "../../../hooks/useConfirmationState";
import AtAGlanceList from "../AtAGlanceList/AtAGlanceList";
import { deleteGlance, updateGlance, type AtAGlanceDto } from "../../etiquetteApi";
import { AtAGlanceEditForm, emptyAtAGlanceForm, type AtAGlanceFormValues } from "../AtAGlanceEditForm/AtAGlanceEditForm";
import toast from "react-hot-toast";
import { buildUpdateGlancePayload } from "../EtiquetteTopics/topicsEditor.helpers";
// import styles from "./EtiquetteAtAGlance.module.css";

export default function EtiquetteAtAGlance() {
  const [selectedItem, setSelectedItem] = useState<AtAGlanceDto | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // edit glance item (update fields and save to topic)
  const saveConfirm = useConfirmationState<String>();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [atAGlanceDraft, setAtAGlanceDraft] = useState<AtAGlanceFormValues>(emptyAtAGlanceForm);
  const isDraftEmpty = JSON.stringify(atAGlanceDraft) === JSON.stringify(emptyAtAGlanceForm);

  function openEditor(topic: AtAGlanceDto){
    setSelectedItem(topic);
    setIsEditOpen(true);
  }
  function closeEditor(){
    setSelectedItem(null);
    setIsEditOpen(false);
  }

  async function saveGlanceItem(){
    if(!selectedItem) return;

    try {
      const payload = buildUpdateGlancePayload(atAGlanceDraft);
      await updateGlance(selectedItem.topicId, payload);
      toast.success("Topic updated successfully!");

      setReloadKey(p => p + 1);
      saveConfirm.close();
      closeEditor();
    } catch (error) {
      console.error("Failed to save Topic:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }

  // REMOVE GLANCE
  // remove glance item (set showInAGlance false)
  const removeConfirm = useConfirmationState<string>();
  const [pendingDelete, setPendingDelete] = useState<number | null>(
    null,
  );

  async function removeGlance() {
    if (!pendingDelete) return;

    try {
      await deleteGlance(pendingDelete); // pending delete is TopicId
      toast.success("Removed from At A Glance successfully!");

      setReloadKey(p => p + 1);
      removeConfirm.close();
      setPendingDelete(null);
    } catch (error) {
      console.error("Failed to remove step:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }

  return (
    <>
      <AtAGlanceList 
        onEdit={openEditor} 
        onRemove={(g) => {
            setPendingDelete(g);
            removeConfirm.open(g ? `Topic ID: ${g}` : "This topic");
          }}
        onUpdate={reloadKey} 
        isDeleting={false} 
      />

      <BaseModal
        isOpen={isEditOpen}
        title="Edit Details"
        onClose={closeEditor}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={closeEditor}>
              Cancel
            </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  saveConfirm.open(
                    selectedItem?.titleShort ?? "this Item",
                  )
                }
                disabled={isDraftEmpty}
              >
                Save Details
              </button>
          </>
        }
      >
        <AtAGlanceEditForm topic={selectedItem} onChange={setAtAGlanceDraft}/>
      </BaseModal>

      <ConfirmationModal
        isOpen={saveConfirm.isOpen}
        variant="constructive"
        actionLabel="save changes to"
        subjectName={selectedItem?.titleLong ? selectedItem.titleLong : "This Item"}
        confirmLabel="Save"
        onConfirm={saveGlanceItem}
        onCancel={saveConfirm.close}
      />

      <ConfirmationModal
        isOpen={removeConfirm.isOpen}
        variant="destructive"
        actionLabel="remove from At A Glance"
        subjectName={removeConfirm.subject ?? "this topic"}
        confirmLabel="Remove"
        onConfirm={removeGlance}
        onCancel={removeConfirm.close}
      />
    </>
  );
}
