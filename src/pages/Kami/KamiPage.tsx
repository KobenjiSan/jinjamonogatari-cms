import { useState } from "react";
import KamiFilters, {
  type KamiSearchFilters,
} from "../../features/shared/kami/components/KamiFilters/KamiFilters";
import KamiHeader from "../../features/shared/kami/components/KamiHeader/KamiHeader";
import KamiList from "../../features/shared/kami/components/KamiList/KamiList";
import KamiEditor from "../../features/ShrineEditor/components/EditorArea/components/tabs/kami/components/KamiEditor/KamiEditor";
import { deleteKami, type KamiCMSDto } from "../../features/ShrineEditor/components/EditorArea/components/tabs/kami/kamiApi";
import ConfirmationModal from "../../shared/components/confirmationModal/ConfirmationModal";
import { useConfirmationState } from "../../features/shared/hooks/useConfirmationState";
import toast from "react-hot-toast";

export default function KamiPage() {
  const [filters, setFilters] = useState<KamiSearchFilters | null>(null);
  const [selectedKami, setSelectedKami] = useState<KamiCMSDto | null>(null);

  // RELOAD LIST
  const [kamiListReloadKey, setKamiListReloadKey] = useState(0);
  function reloadKamiList() {
    setKamiListReloadKey((prev) => prev + 1);
  }

  const [isKamiModalOpen, setIsKamiModalOpen] = useState(false);

  function openAddKamiModal() {
    setSelectedKami(null);
    setIsKamiModalOpen(true);
  }

  function openEditKamiModal(kamiItem: KamiCMSDto) {
    setSelectedKami(kamiItem);
    setIsKamiModalOpen(true);
  }

  function closeKamiModal() {
    setIsKamiModalOpen(false);
    setSelectedKami(null);
  }

  // REMOVE KAMI
  const removeConfirm = useConfirmationState<string>();
  const [pendingDeleteKami, setPendingDeleteKami] = useState<KamiCMSDto | null>(
    null,
  );

  async function confirmRemoveKami() {
    if (!pendingDeleteKami) return;

    try {
      await deleteKami(pendingDeleteKami.kamiId);
      toast.success("Kami removed successfully!");

      reloadKamiList();
      removeConfirm.close();
      setPendingDeleteKami(null);
    } catch (error) {
      console.error("Failed to unlink kami from shrine:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }

  return (
    <>
      <div>
        <KamiHeader onCreate={openAddKamiModal} />
        <div className="p-xl">
          <KamiFilters onSearch={setFilters} />
          <KamiList
            filters={filters}
            onEdit={openEditKamiModal}
            onRemove={(k) => {
              setPendingDeleteKami(k);
              removeConfirm.open(k?.nameEn ?? "This Kami");
            }}
            onUpdate={kamiListReloadKey}
            isDeleting={false}
          />
        </div>
      </div>

      <KamiEditor
        isOpen={isKamiModalOpen}
        selectedKami={selectedKami}
        isReadOnly={false}
        onClose={closeKamiModal}
        onReload={reloadKamiList}
      />

      {/* Confirm Delete Modal */}
      <ConfirmationModal
        isOpen={removeConfirm.isOpen}
        variant="destructive"
        actionLabel="remove"
        subjectName={removeConfirm.subject ?? "this kami"}
        confirmLabel="Remove"
        onConfirm={confirmRemoveKami}
        onCancel={removeConfirm.close}
      />
    </>
  );
}
