import { useState } from "react";
import type { KamiCMSDto } from "./kamiApi";
import { linkKamiToShrine, unlinkKamiFromShrine } from "./kamiApi";
import mainStyles from "../../../EditorArea.module.css";
import { IoSearchOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import BaseModal from "../../../../../../../shared/components/modal/BaseModal";
import KamiSearchForm from "./components/kamiSearchForm/KamiSearchForm";
import KamiList from "./components/kamiList/KamiList";
import toast from "react-hot-toast";
import KamiEditor from "./components/KamiEditor/KamiEditor";
import { useConfirmationState } from "../../../../../../shared/hooks/useConfirmationState";
import ConfirmationModal from "../../../../../../../shared/components/confirmationModal/ConfirmationModal";

type KamiTabProps = {
  shrineId: number;
  isReadOnly: boolean;
};

export default function KamiTab({ shrineId, isReadOnly }: KamiTabProps) {
  const [selectedKami, setSelectedKami] = useState<KamiCMSDto | null>(null);

  // RELOAD LIST
  const [kamiListReloadKey, setKamiListReloadKey] = useState(0);
  function reloadKamiList() {
    setKamiListReloadKey((prev) => prev + 1);
  }

  // EDIT/ADD KAMI MODAL
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

  // SEARCH GLOBAL KAMI MODAL
  const [isKamiSearchModalOpen, setIsKamiSearchModalOpen] = useState(false);
  const [currentKamiIds, setCurrentKamiIds] = useState<number[]>([]);
  const [selectedSearchKami, setSelectedSearchKami] = useState<KamiCMSDto[]>(
    [],
  );

  function handleKamiListLoaded(kamiItems: KamiCMSDto[]) {
    setCurrentKamiIds(kamiItems.map((k) => k.kamiId));
  }

  function openKamiSearchModal() {
    setSelectedSearchKami([]);
    setIsKamiSearchModalOpen(true);
  }

  function closeKamiSearchModal() {
    setIsKamiSearchModalOpen(false);
    setSelectedSearchKami([]);
  }

  // Keep track of Kami selected from Search Modal
  function handleSearchSelectionChange(nextSelectedKami: KamiCMSDto[]) {
    setSelectedSearchKami(nextSelectedKami);
  }

  async function handleAddSelectedKami() {
    if (isReadOnly) return;

    try {
      await Promise.all(
        selectedSearchKami.map((kami) =>
          linkKamiToShrine(shrineId, kami.kamiId),
        ),
      );
      toast.success("Kami added successfully!");

      reloadKamiList();
      closeKamiSearchModal();
    } catch (error) {
      console.error("Failed to link selected kami to shrine:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }

  // REMOVE KAMI
  const removeConfirm = useConfirmationState<string>();
  const [pendingDeleteKami, setPendingDeleteKami] = useState<KamiCMSDto | null>(
    null,
  );

  async function confirmRemoveKami() {
    if (isReadOnly) return;
    if (!pendingDeleteKami) return;

    try {
      await unlinkKamiFromShrine(shrineId, pendingDeleteKami.kamiId);
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
      <div className={mainStyles.tabShell}>
        <div className={mainStyles.header}>
          <h2 className={mainStyles.title}>Kami</h2>

          {!isReadOnly && (
            <div className={mainStyles.headerActions}>
              <button
                type="button"
                className={`${mainStyles.actionButton} btn btn-outline`}
                aria-label="Search kami"
                onClick={openKamiSearchModal}
              >
                <IoSearchOutline size={18} />
                <span>Find Kami</span>
              </button>

              <button
                type="button"
                className={`${mainStyles.actionButton} btn btn-outline`}
                aria-label="new kami"
                onClick={openAddKamiModal}
              >
                <FiPlus size={18} />
                <span>New Kami</span>
              </button>
            </div>
          )}
        </div>

        <KamiList
          id={shrineId}
          reloadKey={kamiListReloadKey}
          onLoaded={handleKamiListLoaded}
          onEdit={openEditKamiModal}
          onRemove={(k) => {
            setPendingDeleteKami(k);
            removeConfirm.open(k?.nameEn ?? "This Kami");
          }}
          isReadOnly={isReadOnly}
        />
      </div>

      {/* EDIT / ADD Kami Modal */}
      <KamiEditor
        isOpen={isKamiModalOpen}
        shrineId={shrineId}
        selectedKami={selectedKami}
        isReadOnly={isReadOnly}
        onClose={closeKamiModal}
        onReload={reloadKamiList}
      />

      {/* Search Global Kami Modal */}
      <BaseModal
        isOpen={isKamiSearchModalOpen}
        title="Find Kami"
        onClose={closeKamiSearchModal}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeKamiSearchModal}
            >
              Cancel
            </button>

            {/* Sets list of Kami to be added to Shrine's Kami list */}
            <button
              type="button"
              className="btn btn-primary"
              disabled={selectedSearchKami.length === 0}
              onClick={handleAddSelectedKami}
            >
              Add Kami
            </button>
          </>
        }
      >
        {/* Takes current kami and returns list of added Kami */}
        <KamiSearchForm
          existingKamiIds={currentKamiIds}
          onSelectionChange={handleSearchSelectionChange}
        />
      </BaseModal>

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
