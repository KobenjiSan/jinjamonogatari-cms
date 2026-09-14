import { useState } from "react";
import Filters, { type ShrineSearchFilters } from "../Filters/Filters";
import ShrineList from "../shrineList/ShrineList";
import { deleteShrine, type ShrineListDto } from "../../shrinesApi";
import ConfirmationModal from "../../../../shared/components/confirmationModal/ConfirmationModal";
import toast from "react-hot-toast";

export type StatusKey = "import" | "draft" | "review" | "published";

type TabPageProps = {
  activeTab: StatusKey;
};

export default function TabPage({ activeTab }: TabPageProps) {
  const [filters, setFilters] = useState<ShrineSearchFilters | null>(null);

  const [onUpdate, setOnUpdate] = useState(0);

  const [shrineToDelete, setShrineToDelete] = useState<ShrineListDto | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const shrineToDeleteName =
    shrineToDelete?.nameEn || shrineToDelete?.nameJp || "this shrine";
  const shrineToDeleteTitle = `Delete Shrine ID: ${shrineToDelete?.shrineId}`;
  const [isDeleting, setIsDeleting] = useState(false);

  function openDeleteModal(shrine: ShrineListDto) {
    setShrineToDelete(shrine);
    setIsConfirmDeleteOpen(true);
  }
  async function confirmRemoveShrine() {
    if (shrineToDelete == null) return;
    try {
      setIsDeleting(true);
      await deleteShrine(shrineToDelete.shrineId);
      toast.success("Shrine deleted successfully!");

      setIsConfirmDeleteOpen(false);
      setShrineToDelete(null);
      setOnUpdate((prev) => prev + 1); // refresh list
    } catch (error) {
      console.error(
        `Failed to delete shrine ${shrineToDelete.shrineId}:`,
        error,
      );
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  }
  function cancelRemoveShrine() {
    setIsConfirmDeleteOpen(false);
    setShrineToDelete(null);
  }

  return (
    <>
      <Filters onSearch={setFilters} />
      
      <ShrineList
        activeTab={activeTab}
        filters={filters}
        onRemove={openDeleteModal}
        onUpdate={onUpdate}
        isDeleting={isDeleting}
      />

      {/* Confirm Delete Modal */}
      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        variant="destructive"
        actionLabel="remove"
        title={shrineToDeleteTitle}
        subjectName={shrineToDeleteName}
        confirmLabel="Remove"
        onConfirm={confirmRemoveShrine}
        onCancel={cancelRemoveShrine}
      />
    </>
  );
}
