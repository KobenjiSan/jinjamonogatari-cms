import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import mainStyles from "../../../EditorArea.module.css";
import ConfirmationModal from "../../../../../../../shared/components/confirmationModal/ConfirmationModal";
import { deleteFolklore, type FolkloreCMSDto } from "./folkloreApi";
import FolkloreList from "./components/FolkloreList/FolkloreList";
import toast from "react-hot-toast";
import { useConfirmationState } from "../../../../../../shared/hooks/useConfirmationState";
import FolkloreEditor from "./components/FolkloreEditor/FolkloreEditor";

type FolkloreTabProps = {
  shrineId: number;
  isReadOnly: boolean;
};

export default function FolkloreTab({
  shrineId,
  isReadOnly,
}: FolkloreTabProps) {
  const [selectedFolklore, setSelectedFolklore] =
    useState<FolkloreCMSDto | null>(null);

  // RELOAD LIST
  const [folkloreListReloadKey, setFolkloreListReloadKey] = useState(0);
  function reloadFolkloreList() {
    setFolkloreListReloadKey((prev) => prev + 1);
  }

  // EDIT/ADD FOLKLORE MODAL
  const [isFolkloreModalOpen, setIsFolkloreModalOpen] = useState(false);

  function openAddFolkloreModal() {
    setSelectedFolklore(null);
    setIsFolkloreModalOpen(true);
  }

  function openEditFolkloreModal(folkloreItem: FolkloreCMSDto) {
    setSelectedFolklore(folkloreItem);
    setIsFolkloreModalOpen(true);
  }

  function closeFolkloreModal() {
    setIsFolkloreModalOpen(false);
    setSelectedFolklore(null);
  }

  // REMOVE FOLKLORE
  const removeConfirm = useConfirmationState<string>();
  const [pendingDeleteFolklore, setPendingDeleteFolklore] =
    useState<FolkloreCMSDto | null>(null);

  async function confirmRemoveFolklore() {
    if (isReadOnly) return;
    if (!pendingDeleteFolklore) return;

    try {
      await deleteFolklore(pendingDeleteFolklore.folkloreId);
      toast.success("Folklore deleted successfully!");

      reloadFolkloreList();
      removeConfirm.close();
      setPendingDeleteFolklore(null);
    } catch (error) {
      console.error("Failed to remove folklore:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Failed to remove folklore");
    }
  }

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
          onRemove={(f) => {
            setPendingDeleteFolklore(f);
            removeConfirm.open(f?.title ?? "This Folklore");
          }}
          isReadOnly={isReadOnly}
        />
      </div>

      <FolkloreEditor
        isOpen={isFolkloreModalOpen}
        shrineId={shrineId}
        selectedFolklore={selectedFolklore}
        isReadOnly={isReadOnly}
        onClose={closeFolkloreModal}
        onReload={reloadFolkloreList}
      />

      <ConfirmationModal
        isOpen={removeConfirm.isOpen}
        variant="destructive"
        actionLabel="remove"
        subjectName={removeConfirm.subject ?? "this folklore"}
        confirmLabel="Remove"
        onConfirm={confirmRemoveFolklore}
        onCancel={removeConfirm.close}
      />
    </>
  );
}
