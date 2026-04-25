import { useState } from "react";
import EtiquetteAtAGlance from "../../features/shared/etiquette/components/EtiquetteAtAGlance/EtiquetteAtAGlance";
import EtiquetteHeader from "../../features/shared/etiquette/components/EtiquetteHeader/EtiquetteHeader";
import EtiquetteList from "../../features/shared/etiquette/components/EtiquetteList/EtiquetteList";
import EtiquetteTabs, {
  type EtiquetteTabKey,
} from "../../features/shared/etiquette/components/EtiquetteTabs/EtiquetteTabs";
import EtiquetteTopicsEditor from "../../features/shared/etiquette/components/EtiquetteTopics/EtiquetteTopicsEditor";
import { deleteEtiquette, type EtiquetteTopic } from "../../features/shared/etiquette/etiquetteApi";
import ConfirmationModal from "../../shared/components/confirmationModal/ConfirmationModal";
import { useConfirmationState } from "../../features/shared/hooks/useConfirmationState";
import toast from "react-hot-toast";

export default function EtiquettePage() {
  const [activeTab, setActiveTab] = useState<EtiquetteTabKey>("topics");

  // RELOAD LIST
  const [listReloadKey, setListReloadKey] = useState(0);
  function reloadList() {
    setListReloadKey((prev) => prev + 1);
  }

  // EDIT / ADD TOPIC
  const [selectedTopic, setSelectedTopic] = useState<EtiquetteTopic | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  function openAddModal() {
    setSelectedTopic(null);
    setIsEditModalOpen(true);
  }

  function openEditModal(topic: EtiquetteTopic) {
    setSelectedTopic(topic);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    setSelectedTopic(null);
  }

  // REMOVE TOPIC
  const removeConfirm = useConfirmationState<string>();
  const [pendingDelete, setPendingDelete] = useState<EtiquetteTopic | null>(
    null,
  );

  async function removeTopic() {
    if (!pendingDelete) return;

    try {
      await deleteEtiquette(pendingDelete.topicId);
      toast.success("Topic removed successfully!");

      reloadList();
      removeConfirm.close();
      setPendingDelete(null);
    } catch (error) {
      console.error("Failed to remove topic:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }

  return (
    <>
      <div>
        <EtiquetteHeader onCreate={openAddModal} />
        <div className="p-xl">
          <EtiquetteTabs activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab == "topics" ? (
            <EtiquetteList
              onEdit={openEditModal}
              onRemove={(t) => {
                setPendingDelete(t);
                removeConfirm.open(t?.titleLong ?? "This Topic");
              }}
              onUpdate={listReloadKey}
              isDeleting={false}
            />
          ) : (
            <EtiquetteAtAGlance />
          )}
        </div>
      </div>

      <EtiquetteTopicsEditor
        isOpen={isEditModalOpen}
        selectedTopic={selectedTopic}
        onClose={closeEditModal}
        onReload={reloadList}
      />

      <ConfirmationModal
        isOpen={removeConfirm.isOpen}
        variant="destructive"
        actionLabel="remove"
        subjectName={removeConfirm.subject ?? "this Topic"}
        confirmLabel="Remove"
        onConfirm={removeTopic}
        onCancel={removeConfirm.close}
      />
    </>
  );
}
