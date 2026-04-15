import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import mainStyles from "../../../EditorArea.module.css";
import BaseModal from "../../../../../../../shared/components/modal/BaseModal";
import ConfirmationModal from "../../../../../../../shared/components/confirmationModal/ConfirmationModal";

import { createHistory, deleteHistory, updateHistory } from "./historyApi";
import type { HistoryCMSDto } from "./historyApi";

import HistoryList from "./components/HistoryList/HistoryList";
import HistoryEditForm from "./components/HistoryEditForm/HistoryEditForm";

import type { HistoryFormValues } from "./components/HistoryEditForm/helpers/HistoryForm.types";
import { emptyHistoryForm } from "./components/HistoryEditForm/helpers/HistoryForm.helper";
import {
  buildCreateHistoryPayload,
  buildUpdateHistoryPayload,
} from "./helpers/HistoryTab.helpers";
import toast from "react-hot-toast";

type HistoryTabProps = {
  shrineId: number;
  isReadOnly: boolean;
};

export default function HistoryTab({ shrineId, isReadOnly }: HistoryTabProps) {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<HistoryCMSDto | null>(
    null,
  );

  const [historyListReloadKey, setHistoryListReloadKey] = useState(0);
  const [historyDraft, setHistoryDraft] =
    useState<HistoryFormValues>(emptyHistoryForm);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [pendingDeleteHistory, setPendingDeleteHistory] =
    useState<HistoryCMSDto | null>(null);

  const isDraftEmpty =
    JSON.stringify(historyDraft) === JSON.stringify(emptyHistoryForm);

  function reloadHistoryList() {
    setHistoryListReloadKey((prev) => prev + 1);
  }

  function openAddHistoryModal() {
    setSelectedHistory(null);
    setHistoryDraft(emptyHistoryForm);
    setIsHistoryModalOpen(true);
  }

  function openEditHistoryModal(historyItem: HistoryCMSDto) {
    setSelectedHistory(historyItem);
    setIsHistoryModalOpen(true);
  }

  function closeHistoryModal() {
    setIsHistoryModalOpen(false);
    setSelectedHistory(null);
    setHistoryDraft(emptyHistoryForm);
  }

  function handleRemoveHistory(history: HistoryCMSDto) {
    setPendingDeleteHistory(history);
    setIsConfirmDeleteOpen(true);
  }

  async function confirmRemoveHistory() {
    if (isReadOnly) return; // block API calls in read-only mode

    if (!pendingDeleteHistory) return;

    try {
      // delete history API
      await deleteHistory(pendingDeleteHistory.historyId);
      toast.success("History deleted successfully!");

      reloadHistoryList();
      setIsConfirmDeleteOpen(false);
      setPendingDeleteHistory(null);
    } catch (error) {
      console.error("Failed to remove history:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }

  function cancelRemoveHistory() {
    setIsConfirmDeleteOpen(false);
    setPendingDeleteHistory(null);
  }

  function handleSaveHistory() {
    setIsConfirmSaveOpen(true);
  }

  async function confirmSaveHistory() {
    if (isReadOnly) return; // block API calls in read-only mode

    try {
      if (selectedHistory) {
        const payload = buildUpdateHistoryPayload(
          historyDraft,
          selectedHistory,
        );
        await updateHistory(selectedHistory.historyId, payload);
        toast.success("History updated successfully!");
      } else {
        const payload = buildCreateHistoryPayload(historyDraft);
        await createHistory(shrineId, payload);
        toast.success("History created successfully!");
      }

      reloadHistoryList();
      setIsConfirmSaveOpen(false);
      closeHistoryModal();
    } catch (error) {
      console.error("Failed to save history:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }

  function cancelSaveHistory() {
    setIsConfirmSaveOpen(false);
  }

  const saveSubjectName =
    selectedHistory?.title || historyDraft.title || "this history entry";

  const deleteSubjectName = pendingDeleteHistory?.title || "this history entry";

  return (
    <>
      <div className={mainStyles.tabShell}>
        <div className={mainStyles.header}>
          <h2 className={mainStyles.title}>History</h2>

          {!isReadOnly && (
            <div className={mainStyles.headerActions}>
              <button
                type="button"
                className={`${mainStyles.actionButton} btn btn-outline`}
                aria-label="New history"
                onClick={openAddHistoryModal}
              >
                <FiPlus size={18} />
                <span>New History</span>
              </button>
            </div>
          )}
        </div>

        <HistoryList
          shrineId={shrineId}
          reloadKey={historyListReloadKey}
          onEdit={openEditHistoryModal}
          onRemove={handleRemoveHistory}
          isReadOnly={isReadOnly}
        />
      </div>

      <BaseModal
        isOpen={isHistoryModalOpen}
        title={selectedHistory ? "Edit History" : "Add History"}
        onClose={closeHistoryModal}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeHistoryModal}
            >
              Cancel
            </button>

            {!isReadOnly && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveHistory}
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
          isReadOnly={isReadOnly}
        />
      </BaseModal>

      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        variant="destructive"
        actionLabel="remove"
        subjectName={deleteSubjectName}
        confirmLabel="Remove"
        onConfirm={confirmRemoveHistory}
        onCancel={cancelRemoveHistory}
      />

      <ConfirmationModal
        isOpen={isConfirmSaveOpen}
        variant="constructive"
        actionLabel={selectedHistory ? "save changes to" : "create"}
        subjectName={saveSubjectName}
        confirmLabel={selectedHistory ? "Save" : "Create"}
        onConfirm={confirmSaveHistory}
        onCancel={cancelSaveHistory}
      />
    </>
  );
}
