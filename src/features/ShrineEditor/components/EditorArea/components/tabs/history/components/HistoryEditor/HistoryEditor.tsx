import { useState } from "react";
import { createHistory, updateHistory, type HistoryCMSDto } from "../../historyApi";
import type { HistoryFormValues } from "../HistoryEditForm/helpers/HistoryForm.types";
import { emptyHistoryForm } from "../HistoryEditForm/helpers/HistoryForm.helper";
import { useConfirmationState } from "../../../../../../../../shared/hooks/useConfirmationState";
import toast from "react-hot-toast";
import { buildCreateHistoryFormData, buildUpdateHistoryFormData } from "../../helpers/HistoryTab.helpers";
import BaseModal from "../../../../../../../../../shared/components/modal/BaseModal";
import HistoryEditForm from "../HistoryEditForm/HistoryEditForm";
import ConfirmationModal from "../../../../../../../../../shared/components/confirmationModal/ConfirmationModal";

type HistoryEditorProps = {
  isOpen: boolean;
  shrineId: number;
  selectedHistory: HistoryCMSDto | null;
  isReadOnly: boolean;
  onClose: () => void;
  onReload: () => void;
};

export default function HistoryEditor({
  isOpen,
  shrineId,
  selectedHistory,
  isReadOnly,
  onClose,
  onReload,
}: HistoryEditorProps) {
  const [historyDraft, setHistoryDraft] =
    useState<HistoryFormValues>(emptyHistoryForm);
  const isDraftEmpty =
    JSON.stringify(historyDraft) === JSON.stringify(emptyHistoryForm);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const saveConfirm = useConfirmationState<string>();
  async function confirmSaveHistory() {
    if (isReadOnly) return;

    try {
      if (selectedHistory) {
        const formData = buildUpdateHistoryFormData(
          historyDraft,
          selectedHistory,
          selectedFile
        );
        await updateHistory(selectedHistory.historyId, formData);
        toast.success("History updated successfully!");
      } else {
        const formData = buildCreateHistoryFormData(historyDraft, selectedFile);
        await createHistory(shrineId, formData);
        toast.success("History created successfully!");
      }

      onReload();
      saveConfirm.close();
      onClose();
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to save history:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }

  return (
    <>
        <BaseModal
        isOpen={isOpen}
        title={selectedHistory ? "Edit History" : "Add History"}
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
                  saveConfirm.open(selectedHistory?.title ?? historyDraft.title)
                }
                disabled={isDraftEmpty}
              >
                {selectedHistory ? "Save History" : "Add History"}
              </button>
            )}
          </>
        }
      >
        <HistoryEditForm
          shrineId={shrineId}
          history={selectedHistory}
          onChange={setHistoryDraft}
          onFileChange={setSelectedFile}
          isReadOnly={isReadOnly}
        />
      </BaseModal>

      <ConfirmationModal
        isOpen={saveConfirm.isOpen}
        variant="constructive"
        actionLabel={selectedHistory ? "save changes to" : "create"}
        subjectName={saveConfirm.subject ?? historyDraft.title}
        confirmLabel={selectedHistory ? "Save" : "Create"}
        onConfirm={confirmSaveHistory}
        onCancel={saveConfirm.close}
      />
    </>
  );
}
