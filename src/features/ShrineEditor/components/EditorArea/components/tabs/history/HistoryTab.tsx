import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import mainStyles from "../../../EditorArea.module.css";
import ConfirmationModal from "../../../../../../../shared/components/confirmationModal/ConfirmationModal";
import { deleteHistory } from "./historyApi";
import type { HistoryCMSDto } from "./historyApi";
import HistoryList from "./components/HistoryList/HistoryList";
import toast from "react-hot-toast";
import HistoryEditor from "./components/HistoryEditor/HistoryEditor";
import { useConfirmationState } from "../../../../../../shared/hooks/useConfirmationState";

type HistoryTabProps = {
  shrineId: number;
  isReadOnly: boolean;
};

export default function HistoryTab({ shrineId, isReadOnly }: HistoryTabProps) {
  const [selectedHistory, setSelectedHistory] = useState<HistoryCMSDto | null>(null);
  
  // RELOAD LIST
  const [historyListReloadKey, setHistoryListReloadKey] = useState(0);
  function reloadHistoryList() {
    setHistoryListReloadKey((prev) => prev + 1);
  }

  // EDIT/ADD HISTORY MODAL
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  function openAddHistoryModal() {
    setSelectedHistory(null);
    setIsHistoryModalOpen(true);
  }

  function openEditHistoryModal(historyItem: HistoryCMSDto) {
    setSelectedHistory(historyItem);
    setIsHistoryModalOpen(true);
  }

  function closeHistoryModal() {
    setIsHistoryModalOpen(false);
    setSelectedHistory(null);
  }

  // REMOVE HISTORY
  const removeConfirm = useConfirmationState<string>(); 
  const [pendingDeleteHistory, setPendingDeleteHistory] = useState<HistoryCMSDto | null>(null);
  
  async function confirmRemoveHistory() {
    if (isReadOnly) return;
    if (!pendingDeleteHistory) return;

    try {
      await deleteHistory(pendingDeleteHistory.historyId);
      toast.success("History deleted successfully!");

      reloadHistoryList();
      removeConfirm.close();
      setPendingDeleteHistory(null);
    } catch (error) {
      console.error("Failed to remove history:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }

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
          onRemove={(h) => {
            setPendingDeleteHistory(h);
            removeConfirm.open(h?.title ?? "This History");
          }}
          isReadOnly={isReadOnly}
        />
      </div>

      <HistoryEditor 
        isOpen={isHistoryModalOpen}
        shrineId={shrineId}
        selectedHistory={selectedHistory}
        isReadOnly={isReadOnly}
        onClose={closeHistoryModal}
        onReload={reloadHistoryList}
      />

      <ConfirmationModal
        isOpen={removeConfirm.isOpen}
        variant="destructive"
        actionLabel="remove"
        subjectName={removeConfirm.subject ?? "this history"}
        confirmLabel="Remove"
        onConfirm={confirmRemoveHistory}
        onCancel={removeConfirm.close}
      />
    </>
  );
}
