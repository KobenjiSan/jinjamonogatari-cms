import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import mainStyles from "../../../EditorArea.module.css";
import BaseModal from "../../../../../../../shared/components/modal/BaseModal";
import ConfirmationModal from "../../../../../../../shared/components/confirmationModal/ConfirmationModal";

import {
  createFolklore,
  deleteFolklore,
  updateFolklore,
  type FolkloreCMSDto,
} from "./folkloreApi";

import FolkloreList from "./components/FolkloreList/FolkloreList";
import FolkloreEditForm from "./components/FolkloreEditForm/FolkloreEditForm";

import type { FolkloreFormValues } from "./components/FolkloreEditForm/helpers/FolkloreForm.types";
import { emptyFolkloreForm } from "./components/FolkloreEditForm/helpers/FolkloreForm.helper";
import {
  buildCreateFolklorePayload,
  buildUpdateFolklorePayload,
} from "./helpers/FolkloreTab.helpers";
import toast from "react-hot-toast";

type FolkloreTabProps = {
  shrineId: number;
  isReadOnly: boolean;
};

export default function FolkloreTab({
  shrineId,
  isReadOnly,
}: FolkloreTabProps) {
  const [isFolkloreModalOpen, setIsFolkloreModalOpen] = useState(false);
  const [selectedFolklore, setSelectedFolklore] =
    useState<FolkloreCMSDto | null>(null);

  const [folkloreListReloadKey, setFolkloreListReloadKey] = useState(0);
  const [folkloreDraft, setFolkloreDraft] =
    useState<FolkloreFormValues>(emptyFolkloreForm);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [pendingDeleteFolklore, setPendingDeleteFolklore] =
    useState<FolkloreCMSDto | null>(null);

  const isDraftEmpty =
    JSON.stringify(folkloreDraft) === JSON.stringify(emptyFolkloreForm);

  function reloadFolkloreList() {
    setFolkloreListReloadKey((prev) => prev + 1);
  }

  function openAddFolkloreModal() {
    setSelectedFolklore(null);
    setFolkloreDraft(emptyFolkloreForm);
    setIsFolkloreModalOpen(true);
  }

  function openEditFolkloreModal(folkloreItem: FolkloreCMSDto) {
    setSelectedFolklore(folkloreItem);
    setIsFolkloreModalOpen(true);
  }

  function closeFolkloreModal() {
    setIsFolkloreModalOpen(false);
    setSelectedFolklore(null);
    setFolkloreDraft(emptyFolkloreForm);
  }

  function handleRemoveFolklore(folklore: FolkloreCMSDto) {
    setPendingDeleteFolklore(folklore);
    setIsConfirmDeleteOpen(true);
  }

  async function confirmRemoveFolklore() {
    if (isReadOnly) return; // block API calls in read-only mode
    if (!pendingDeleteFolklore) return;

    try {
      // Delete folklore in API (DELETE)
      await deleteFolklore(pendingDeleteFolklore.folkloreId);
      toast.success("Folklore deleted successfully!");

      reloadFolkloreList();
      setIsConfirmDeleteOpen(false);
      setPendingDeleteFolklore(null);
    } catch (error) {
      console.error("Failed to remove folklore:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Failed to remove folklore");
    }
  }

  function cancelRemoveFolklore() {
    setIsConfirmDeleteOpen(false);
    setPendingDeleteFolklore(null);
  }

  function handleSaveFolklore() {
    setIsConfirmSaveOpen(true);
  }

  async function confirmSaveFolklore() {
    if (isReadOnly) return; // block API calls in read-only mode
    try {
      if (selectedFolklore) {
        // API for existing folklore (PUT)
        const payload = buildUpdateFolklorePayload(
          folkloreDraft,
          selectedFolklore,
        );
        await updateFolklore(selectedFolklore.folkloreId, payload);
        toast.success("Folklore updated successfully!");
      } else {
        // API for new folklore (POST)
        const payload = buildCreateFolklorePayload(folkloreDraft);
        await createFolklore(shrineId, payload);
        toast.success("Folklore created successfully!");
      }

      reloadFolkloreList();
      setIsConfirmSaveOpen(false);
      closeFolkloreModal();
    } catch (error) {
      console.error("Failed to save folklore:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Failed to save folklore");
    }
  }

  function cancelSaveFolklore() {
    setIsConfirmSaveOpen(false);
  }

  const saveSubjectName =
    selectedFolklore?.title || folkloreDraft.title || "this folklore entry";

  const deleteSubjectName =
    pendingDeleteFolklore?.title || "this folklore entry";

  return (
    <>
      <div className={mainStyles.tabShell}>
        <div className={mainStyles.header}>
          <h2 className={mainStyles.title}>Folklore</h2>

          {!isReadOnly && (
            <div className={mainStyles.headerActions}>
              <button
                type="button"
                className={`${mainStyles.actionButton} btn btn-outline`}
                aria-label="New Folklore"
                onClick={openAddFolkloreModal}
              >
                <FiPlus size={18} />
                <span>New Folklore</span>
              </button>
            </div>
          )}
        </div>

        <FolkloreList
          shrineId={shrineId}
          reloadKey={folkloreListReloadKey}
          onEdit={openEditFolkloreModal}
          onRemove={handleRemoveFolklore}
          isReadOnly={isReadOnly}
        />
      </div>

      <BaseModal
        isOpen={isFolkloreModalOpen}
        title={selectedFolklore ? "Edit Folklore" : "Add Folklore"}
        onClose={closeFolkloreModal}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeFolkloreModal}
            >
              Cancel
            </button>

            {!isReadOnly && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveFolklore}
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
          isReadOnly={isReadOnly}
        />
      </BaseModal>

      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        variant="destructive"
        actionLabel="remove"
        subjectName={deleteSubjectName}
        confirmLabel="Remove"
        onConfirm={confirmRemoveFolklore}
        onCancel={cancelRemoveFolklore}
      />

      <ConfirmationModal
        isOpen={isConfirmSaveOpen}
        variant="constructive"
        actionLabel={selectedFolklore ? "save changes to" : "create"}
        subjectName={saveSubjectName}
        confirmLabel={selectedFolklore ? "Save" : "Create"}
        onConfirm={confirmSaveFolklore}
        onCancel={cancelSaveFolklore}
      />
    </>
  );
}
