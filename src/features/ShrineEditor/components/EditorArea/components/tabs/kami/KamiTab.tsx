import { useState } from "react";
import type { KamiCMSDto } from "./kamiApi";
import {
  createKamiInShrine,
  linkKamiToShrine,
  unlinkKamiFromShrine,
  updateKami,
} from "./kamiApi";
import styles from "./KamiTab.module.css";
import { IoSearchOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import BaseModal from "../../../../../../../shared/components/modal/BaseModal";
import KamiEditForm from "./components/kamiEditForm/KamiEditForm";
import KamiSearchForm from "./components/kamiSearchForm/KamiSearchForm";
import KamiList from "./components/kamiList/KamiList";
import type { KamiFormValues } from "./components/kamiEditForm/helpers/KamiForm.types";
import {
  emptyKamiForm
} from "./components/kamiEditForm/helpers/KamiForm.helper";
import ConfirmationModal from "../../../../../../../shared/components/confirmationModal/ConfirmationModal";
import {
  buildCreateKamiPayload,
  buildUpdateKamiPayload,
} from "./helpers/KamiTab.helpers";

type KamiTabProps = {
  shrineId: number;
};

export default function KamiTab({ shrineId }: KamiTabProps) {
  const [isKamiModalOpen, setIsKamiModalOpen] = useState(false);
  const [selectedKami, setSelectedKami] = useState<KamiCMSDto | null>(null);
  const [isKamiSearchModalOpen, setIsKamiSearchModalOpen] = useState(false);
  const [currentKamiIds, setCurrentKamiIds] = useState<number[]>([]);
  const [kamiListReloadKey, setKamiListReloadKey] = useState(0);
  const [selectedSearchKami, setSelectedSearchKami] = useState<KamiCMSDto[]>([]);
  const [kamiDraft, setKamiDraft] = useState<KamiFormValues>(emptyKamiForm);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [pendingDeleteKami, setPendingDeleteKami] = useState<KamiCMSDto | null>(null);

  const isDraftEmpty = JSON.stringify(kamiDraft) === JSON.stringify(emptyKamiForm);

  // Initial setting of Kami from KamiList
  function handleKamiListLoaded(kamiItems: KamiCMSDto[]) {
    setCurrentKamiIds(kamiItems.map((k) => k.kamiId));
  }

  // Pings KamiList to refresh data from API
  function reloadKamiList() {
    setKamiListReloadKey((prev) => prev + 1);
  }

  // Add Kami
  function openAddKamiModal() {
    setSelectedKami(null);
    setKamiDraft(emptyKamiForm);
    setIsKamiModalOpen(true);
  }

  // Edit selected existing Kami
  function openEditKamiModal(kamiItem: KamiCMSDto) {
    setSelectedKami(kamiItem);
    setIsKamiModalOpen(true);
  }

  function closeKamiModal() {
    setIsKamiModalOpen(false);
    setSelectedKami(null);
    setKamiDraft(emptyKamiForm);
  }

  // Search for Global Kami
  function openKamiSearchModal() {
    setSelectedSearchKami([]);
    setIsKamiSearchModalOpen(true);
  }

  function closeKamiSearchModal() {
    setIsKamiSearchModalOpen(false);
    setSelectedSearchKami([]); // Clear list
  }

  // Keep track of Kami selected from Search Modal
  function handleSearchSelectionChange(nextSelectedKami: KamiCMSDto[]) {
    setSelectedSearchKami(nextSelectedKami);
  }

  // Call API to add selected Kami from Search Modal
  async function handleAddSelectedKami() {
    try {
      await Promise.all(
        selectedSearchKami.map((kami) => linkKamiToShrine(shrineId, kami.kamiId)),
      );

      reloadKamiList();
      closeKamiSearchModal();
    } catch (error) {
      console.error("Failed to link selected kami to shrine:", error);
    }
  }

  // Opens delete confirmation first
  function handleRemoveKami(kami: KamiCMSDto) {
    setPendingDeleteKami(kami);
    setIsConfirmDeleteOpen(true);
  }

  // Actually delete after confirmation
  async function confirmRemoveKami() {
    if (!pendingDeleteKami) return;

    try {
      await unlinkKamiFromShrine(shrineId, pendingDeleteKami.kamiId);

      reloadKamiList();
      setIsConfirmDeleteOpen(false);
      setPendingDeleteKami(null);
    } catch (error) {
      console.error("Failed to unlink kami from shrine:", error);
    }
  }

  function cancelRemoveKami() {
    setIsConfirmDeleteOpen(false);
    setPendingDeleteKami(null);
  }

  // Opens save confirmation first
  function handleSaveKami() {
    setIsConfirmSaveOpen(true);
  }

  // Actually save after confirmation
  async function confirmSaveKami() {
    try {
      if (selectedKami) {
        const payload = buildUpdateKamiPayload(kamiDraft, selectedKami);
        await updateKami(selectedKami.kamiId, payload);
      } else {
        const payload = buildCreateKamiPayload(kamiDraft);
        await createKamiInShrine(shrineId, payload);
      }

      reloadKamiList();
      setIsConfirmSaveOpen(false);
      closeKamiModal();
    } catch (error) {
      console.error("Failed to save kami:", error);
    }
  }

  function cancelSaveKami() {
    setIsConfirmSaveOpen(false);
  }

  const saveSubjectName =
    selectedKami?.nameEn ||
    kamiDraft.nameEn ||
    kamiDraft.nameJp ||
    "this kami";

  const deleteSubjectName =
    pendingDeleteKami?.nameEn ||
    pendingDeleteKami?.nameJp ||
    "this kami";

  return (
    <>
      <div className={styles.tabShell}>
        <div className={styles.header}>
          <h2 className={styles.title}>Kami</h2>

          <div className={styles.headerActions}>
            <button
              type="button"
              className="icon-btn"
              aria-label="Search kami"
              onClick={openKamiSearchModal}
            >
              <IoSearchOutline size={18} />
            </button>

            <button
              type="button"
              className={`${styles.kamiActionButton} btn btn-outline`}
              aria-label="Add kami"
              onClick={openAddKamiModal}
            >
              <FiPlus size={18} />
              <span>Create Kami</span>
            </button>
          </div>
        </div>

        <KamiList
          id={shrineId}
          reloadKey={kamiListReloadKey}
          onLoaded={handleKamiListLoaded}
          onEdit={openEditKamiModal}
          onRemove={handleRemoveKami}
        />
      </div>

      {/* EDIT / ADD Kami Modal */}
      <BaseModal
        isOpen={isKamiModalOpen}
        title={selectedKami ? "Edit Kami" : "Add Kami"}
        onClose={closeKamiModal}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeKamiModal}
            >
              Cancel
            </button>

            {/* Saves or Adds Kami to be updated / created in DB */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveKami}
              disabled={isDraftEmpty}
            >
              {selectedKami ? "Save Kami" : "Add Kami"}
            </button>
          </>
        }
      >
        {/* Optionally: Takes selected Kami */}
        <KamiEditForm kami={selectedKami} onChange={setKamiDraft} />
      </BaseModal>

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
        isOpen={isConfirmDeleteOpen}
        variant="destructive"
        actionLabel="remove"
        subjectName={deleteSubjectName}
        confirmLabel="Remove"
        onConfirm={confirmRemoveKami}
        onCancel={cancelRemoveKami}
      />

      {/* Confirm Save Modal */}
      <ConfirmationModal
        isOpen={isConfirmSaveOpen}
        variant="constructive"
        actionLabel={selectedKami ? "save changes to" : "create"}
        subjectName={saveSubjectName}
        confirmLabel={selectedKami ? "Save" : "Create"}
        onConfirm={confirmSaveKami}
        onCancel={cancelSaveKami}
      />
    </>
  );
}