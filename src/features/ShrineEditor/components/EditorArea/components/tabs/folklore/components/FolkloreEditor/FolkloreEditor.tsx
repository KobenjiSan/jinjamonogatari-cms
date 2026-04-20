import { useState } from "react";
import { createFolklore, updateFolklore, type FolkloreCMSDto } from "../../folkloreApi";
import type { FolkloreFormValues } from "../FolkloreEditForm/helpers/FolkloreForm.types";
import { emptyFolkloreForm } from "../FolkloreEditForm/helpers/FolkloreForm.helper";
import { useConfirmationState } from "../../../../../../../../shared/hooks/useConfirmationState";
import toast from "react-hot-toast";
import FolkloreEditForm from "../FolkloreEditForm/FolkloreEditForm";
import BaseModal from "../../../../../../../../../shared/components/modal/BaseModal";
import ConfirmationModal from "../../../../../../../../../shared/components/confirmationModal/ConfirmationModal";
import { buildCreateFolkloreFormData, buildUpdateFolkloreFormData } from "../../helpers/FolkloreTab.helpers";

type FolkloreEditorProps = {
  isOpen: boolean;
  shrineId: number;
  selectedFolklore: FolkloreCMSDto | null;
  isReadOnly: boolean;
  onClose: () => void;
  onReload: () => void;
};

export default function FolkloreEditor({
  isOpen,
  shrineId,
  selectedFolklore,
  isReadOnly,
  onClose,
  onReload,
}: FolkloreEditorProps) {
    const [folkloreDraft, setFolkloreDraft] = useState<FolkloreFormValues>(emptyFolkloreForm);
    const isDraftEmpty = JSON.stringify(folkloreDraft) === JSON.stringify(emptyFolkloreForm);
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const saveConfirm = useConfirmationState<string>();
    async function confirmSaveFolklore() {
    if (isReadOnly) return;
    try {
      if (selectedFolklore) {
        const formData = buildUpdateFolkloreFormData(
          folkloreDraft,
          selectedFolklore,
          selectedFile
        );
        await updateFolklore(selectedFolklore.folkloreId, formData);
        toast.success("Folklore updated successfully!");
      } else {
        const formData = buildCreateFolkloreFormData(folkloreDraft, selectedFile);
        await createFolklore(shrineId, formData);
        toast.success("Folklore created successfully!");
      }

      onReload();
      saveConfirm.close();
      onClose();
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to save folklore:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Failed to save folklore");
    }
  }

  return (
    <>
        <BaseModal
        isOpen={isOpen}
        title={selectedFolklore ? "Edit Folklore" : "Add Folklore"}
        onClose={onClose}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>

            {!isReadOnly && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  saveConfirm.open(selectedFolklore?.title ?? folkloreDraft.title)
                }
                disabled={isDraftEmpty}
              >
                {selectedFolklore ? "Save Folklore" : "Add Folklore"}
              </button>
            )}
          </>
        }
      >
        <FolkloreEditForm
          shrineId={shrineId}
          folklore={selectedFolklore}
          onChange={setFolkloreDraft}
          onFileChange={setSelectedFile}
          isReadOnly={isReadOnly}
        />
      </BaseModal>

      <ConfirmationModal
        isOpen={saveConfirm.isOpen}
        variant="constructive"
        actionLabel={selectedFolklore ? "save changes to" : "create"}
        subjectName={saveConfirm.subject ?? folkloreDraft.title}
        confirmLabel={selectedFolklore ? "Save" : "Create"}
        onConfirm={confirmSaveFolklore}
        onCancel={saveConfirm.close}
      />
    </>
  );
}