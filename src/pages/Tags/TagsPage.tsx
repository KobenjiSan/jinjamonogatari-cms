import { useState } from "react";
import TagsFilters, {
  type TagsSearchFilters,
} from "../../features/shared/tags/components/TagsFilters/TagsFilters";
import TagsHeader from "../../features/shared/tags/components/TagsHeader/TagsHeader";
import TagsList from "../../features/shared/tags/components/TagsList/TagsList";
import ConfirmationModal from "../../shared/components/confirmationModal/ConfirmationModal";
import { createTag, deleteTag, updateTag, type TagCMSDto, type TagRequest } from "../../features/shared/tags/tagApi";
import BaseModal from "../../shared/components/modal/BaseModal";
import TagsEditForm, {
  emptyTagForm,
  type TagFormValues,
} from "../../features/shared/tags/components/TagsEditForm/TagsEditForm";
import { toNullableString } from "../../features/ShrineEditor/components/EditorArea/helpers/tab.helpers";
import toast from "react-hot-toast";

export default function TagsPage() {
  const [filters, setFilters] = useState<TagsSearchFilters | null>(null);

  const [onUpdate, setOnUpdate] = useState(0);
  const [selectedTag, setSelectedTag] = useState<TagCMSDto | null>(null);
  const [isHandlingAction, setIsHandlingAction] = useState(false);

  const [tagDraft, setTagDraft] = useState<TagFormValues>(emptyTagForm);
  const isDraftTitleEmpty =
    JSON.stringify(tagDraft.titleEn) === JSON.stringify(emptyTagForm.titleEn);

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);

  function openCreateTagModal() {
    setSelectedTag(null);
    setTagDraft(emptyTagForm);
    setIsTagModalOpen(true);
  }
  function openEditTagModal(tagItem: TagCMSDto) {
    setSelectedTag(tagItem);
    setIsTagModalOpen(true);
  }

  function closeTagModal() {
    setIsTagModalOpen(false);
    setSelectedTag(null);
    setTagDraft(emptyTagForm);
  }

  async function confirmSaveTag() {
    if(tagDraft.titleEn == null) return;
    const payload: TagRequest = {
      titleEn: toNullableString(tagDraft.titleEn)!,
      titleJp: toNullableString(tagDraft.titleJp)
    };
    try {
      if (selectedTag) {
        await updateTag(selectedTag.tagId, payload);
        toast.success("Tag updated successfully!");
      } else {
        await createTag(payload);
        toast.success("Tag created successfully!");
      }

      setOnUpdate((prev) => prev + 1); // refresh list
      setIsConfirmSaveOpen(false);
      closeTagModal();
    } catch (error) {
      console.error("Failed to save tag:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }

  // Delete Tag
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  function openConfirmDelete(tag: TagCMSDto) {
    setSelectedTag(tag);
    setIsConfirmDeleteOpen(true);
  }
  async function handleDelete() {
    if (selectedTag == null) return;

    try {
      setIsHandlingAction(true);

      await deleteTag(selectedTag?.tagId);
      toast.success("Tag deleted successfully!");
      setIsConfirmDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete tag:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setIsHandlingAction(false);
      setOnUpdate((prev) => prev + 1); // refresh list
    }
  }

  return (
    <>
      <div>
        <TagsHeader onCreate={openCreateTagModal} />
        <div className="p-xl">
          <TagsFilters onSearch={setFilters} />
          <TagsList
            filters={filters}
            onEdit={openEditTagModal}
            onRemove={openConfirmDelete}
            onUpdate={onUpdate}
            isDeleting={false}
          />
        </div>
      </div>

      {/* Tag Edit / Create Modal */}
      <BaseModal
        isOpen={isTagModalOpen}
        title={selectedTag ? `Edit Tag: ${selectedTag.titleEn} | ${selectedTag.titleJp}` : "Add Tag"}
        onClose={closeTagModal}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeTagModal}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsConfirmSaveOpen(true)}
              disabled={isDraftTitleEmpty}
            >
              {selectedTag ? "Save Tag" : "Create Tag"}
            </button>
          </>
        }
      >
        <TagsEditForm tag={selectedTag} onChange={setTagDraft} />
      </BaseModal>

      {/* Confirm Save Modal */}
      <ConfirmationModal
        isOpen={isConfirmSaveOpen}
        variant="constructive"
        actionLabel={
          selectedTag
            ? `Update Tag "${tagDraft?.titleEn}"`
            : `Create Tag "${tagDraft.titleEn}"`
        }
        confirmLabel={selectedTag ? "Save" : "Create"}
        onConfirm={confirmSaveTag}
        onCancel={() => setIsConfirmSaveOpen(false)}
      />

      {/* Confirm Delete Modal */}
      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        variant="destructive"
        actionLabel="remove"
        title={`Remove Tag: ${selectedTag?.titleEn} | ${selectedTag?.titleJp}?`}
        message={`Are you sure you want to delete tag ${selectedTag?.titleEn}? This action cannot be undone.`}
        subjectName={selectedTag?.titleEn}
        confirmLabel={isHandlingAction ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />
    </>
  );
}
