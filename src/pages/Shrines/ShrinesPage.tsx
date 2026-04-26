// import styles from "./ShrinesPage.module.css";
import { useEffect, useState } from "react";
import Filters, {
  type ShrineSearchFilters,
} from "../../features/shrines/components/Filters/Filters";
import ShrineHeader from "../../features/shrines/components/header/ShrineHeader";
import ShrineList from "../../features/shrines/components/shrineList/ShrineList";
import StatusTabs, {
  type StatusTabKey,
} from "../../features/shrines/components/statusTab/StatusTabs";
import BaseModal from "../../shared/components/modal/BaseModal";
import ImportForm from "../../features/shrines/components/ImportForm/ImportForm";
import {
  createShrine,
  importShrines,
  type ShrineListDto,
  type CreateShrineRequest,
  type ImportPreviewItemDto,
  type ImportShrinesRequest,
  deleteShrine,
} from "../../features/shrines/shrinesApi";
import ConfirmationModal from "../../shared/components/confirmationModal/ConfirmationModal";
import CreateShrineForm from "../../features/shrines/components/CreateShrineForm/CreateShrineForm";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

export default function ShrinesPage() {
  // Routing logic
  const location = useLocation();

  const routeState = location.state as {
    openImportModal?: boolean;
    activeTab?: StatusTabKey;
  } | null;

  useEffect(() => {
    if (routeState?.openImportModal) {
      openImportModal();
    }

    if (routeState) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  const [activeTab, setActiveTab] = useState<StatusTabKey>(routeState?.activeTab ?? "import");
  const [filters, setFilters] = useState<ShrineSearchFilters | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImportReady, setIsImportReady] = useState(false);
  const [previewList, setPreviewList] = useState<ImportPreviewItemDto[] | null>(
    null,
  );
  const [isConfirmImportOpen, setIsConfirmImportOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [requestPing, setRequestPing] = useState(0);
  const [pendingContent, setPendingContent] =
    useState<CreateShrineRequest | null>(null);
  const [isConfirmCreateOpen, setIsConfirmCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [shrineToDelete, setShrineToDelete] = useState<ShrineListDto | null>(
    null,
  );
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const shrineToDeleteName =
    shrineToDelete?.nameEn || shrineToDelete?.nameJp || "this shrine";
  const shrineToDeleteTitle = `Delete Shrine ID: ${shrineToDelete?.shrineId}`;
  const [isDeleting, setIsDeleting] = useState(false);
  const [onUpdate, setOnUpdate] = useState(0);

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

  // Importing
  function openImportModal() {
    setIsImportReady(false);
    setIsImportModalOpen(true);
    setPreviewList(null);
  }
  function closeImportModal() {
    setIsImportModalOpen(false);
    setIsImportReady(false);
    setPreviewList(null);
  }

  function confirmImport() {
    setIsConfirmImportOpen(true);
  }
  function cancelImport() {
    setIsConfirmImportOpen(false);
  }

  function handleHasPreview(items: ImportPreviewItemDto[]) {
    setPreviewList(items);

    const validItems = items.filter(
      (item) =>
        !!item.importId?.trim() && item.lat !== null && item.lon !== null,
    );

    setIsImportReady(validItems.length > 0);
  }

  async function handleImport() {
    if (!previewList || previewList.length === 0) return;

    const previews = previewList
      .filter(
        (item) =>
          !!item.importId?.trim() && item.lat !== null && item.lon !== null,
      )
      .map((item) => ({
        importId: item.importId,
        name: item.name,
        lat: item.lat as number,
        lon: item.lon as number,
      }));

    if (previews.length === 0) return;

    const body: ImportShrinesRequest = {
      previews,
    };

    try {
      setIsImporting(true);
      await importShrines(body);
      toast.success("Imported successfully!");

      setIsConfirmImportOpen(false);
      closeImportModal();
    } catch (error) {
      console.error("Failed to import shrines:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setIsImporting(false);
      setActiveTab("import");
      setOnUpdate((prev) => prev + 1); // refresh list
    }
  }

  // Creating
  function openCreateModal() {
    setIsCreateModalOpen(true);
    setPendingContent(null);
  }
  function closeCreateModal() {
    setIsCreateModalOpen(false);
    setPendingContent(null);
  }

  function confirmCreate() {
    handleRequestFormContent(); // sets pending content
    setIsConfirmCreateOpen(true);
  }
  function cancelCreate() {
    setIsConfirmCreateOpen(false);
  }
  function handleRequestFormContent() {
    setRequestPing((prev) => prev + 1);
  }

  async function handleCreate() {
    if (!pendingContent || pendingContent === null) return;

    try {
      setIsCreating(true);
      await createShrine(pendingContent);
      toast.success("Shrine created successfully!");

      closeCreateModal();
      setActiveTab("draft");
      setOnUpdate((prev) => prev + 1); // refresh list
    } catch (error) {
      console.error("Failed to create shrine:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setIsCreating(false);
      setIsConfirmCreateOpen(false);
    }
  }

  return (
    <>
      <div>
        <ShrineHeader onImport={openImportModal} onCreate={openCreateModal} />
        <div className="p-xl">
          <StatusTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <Filters onSearch={setFilters} />
          <ShrineList
            activeTab={activeTab}
            filters={filters}
            onRemove={openDeleteModal}
            onUpdate={onUpdate}
            isDeleting={isDeleting}
          />
        </div>
      </div>

      <BaseModal
        isOpen={isImportModalOpen}
        title={"Import Shrines"}
        onClose={closeImportModal}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeImportModal}
              disabled={isImporting}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={confirmImport}
              disabled={!isImportReady || isImporting}
            >
              Import
            </button>
          </>
        }
      >
        <ImportForm onHasPreview={handleHasPreview} />
      </BaseModal>

      <BaseModal
        isOpen={isCreateModalOpen}
        title={"Create Shrine"}
        onClose={closeCreateModal}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeCreateModal}
              // disabled={isImporting}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={confirmCreate}
              // disabled={!isImportReady || isImporting}
            >
              Create Shrine
            </button>
          </>
        }
      >
        <CreateShrineForm
          requestPing={requestPing}
          onContentRequest={setPendingContent}
        />
      </BaseModal>

      {/* Confirm Import Modal */}
      <ConfirmationModal
        isOpen={isConfirmImportOpen}
        variant="constructive"
        actionLabel="Import Shrines"
        confirmLabel={isImporting ? "Importing..." : "Import"}
        onConfirm={handleImport}
        onCancel={cancelImport}
      />

      {/* Confirm Create Modal */}
      <ConfirmationModal
        isOpen={isConfirmCreateOpen}
        variant="constructive"
        actionLabel="Create Shrine"
        confirmLabel={isCreating ? "Creating..." : "Create"}
        onConfirm={handleCreate}
        onCancel={cancelCreate}
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
