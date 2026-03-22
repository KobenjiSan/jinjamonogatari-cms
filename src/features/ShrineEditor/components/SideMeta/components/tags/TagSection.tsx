import { useState } from "react";
import BaseModal from "../../../../../../shared/components/modal/BaseModal";
import TagForm from "../../../../../shared/tags/TagForm";
import styles from "./TagSection.module.css";

import {
  buildNewTag,
  buildUpdatedTags,
  getTagChipClassName,
  mapTagToForm,
  toggleRemoveTag,
} from "./helpers/TagSection.helpers";
import {
  emptyTagForm,
  type EditableTag,
  type TagsSectionProps,
} from "./helpers/TagSection.types";
import { FiPlus } from "react-icons/fi";

export default function TagsSection({ tags, onChange }: TagsSectionProps) {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [tagForm, setTagForm] = useState(emptyTagForm);

  function openCreateTagModal() {
    setEditingTagId(null);
    setTagForm(emptyTagForm);
    setIsTagModalOpen(true);
  }

  function openEditTagModal(tag: EditableTag) {
    setEditingTagId(tag.tagId);
    setTagForm(mapTagToForm(tag));
    setIsTagModalOpen(true);
  }

  function closeTagModal() {
    setIsTagModalOpen(false);
    setEditingTagId(null);
    setTagForm(emptyTagForm);
  }

  function handleSaveTag() {
    if (editingTagId === null) {
      const newTag = buildNewTag(tagForm);
      if (!newTag) return;

      onChange([...tags, newTag]);
    } else {
      onChange(buildUpdatedTags(tags, editingTagId, tagForm));
    }

    closeTagModal();
  }

  function handleToggleRemoveTag(tagId: number) {
    onChange(toggleRemoveTag(tags, tagId));
  }

  return (
    <>
      <div className={styles.block}>
        <p className={styles.blockTitle}>Tags</p>

        <div className={styles.tagList}>
          {tags.length ? (
            tags.map((tag) => (
              <div
                key={tag.tagId}
                className={getTagChipClassName(
                  tag,
                  styles.tagChip,
                  styles.tagChipRemoved,
                  styles.changedInput
                )}
              >
                <button
                  type="button"
                  className={styles.tagChipButton}
                  onClick={() => openEditTagModal(tag)}
                >
                  <span
                    className={`${styles.tagChipText} ${
                      tag.isMarkedForRemoval ? styles.tagChipTextRemoved : ""
                    }`}
                  >
                    {tag.titleEn}
                    {tag.titleJp ? ` (${tag.titleJp})` : ""}
                  </span>
                </button>

                <button
                  type="button"
                  className={styles.tagRemove}
                  onClick={() => handleToggleRemoveTag(tag.tagId)}
                  aria-label={
                    tag.isMarkedForRemoval
                      ? `Restore ${tag.titleEn}`
                      : `Mark ${tag.titleEn} for removal`
                  }
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <span className="text-sm text-secondary">No tags added yet.</span>
          )}
        </div>

        <button
          type="button"
          className="btn btn-outline"
          onClick={openCreateTagModal}
        >
          <FiPlus size={16} />
          <span className={styles.tagButtonText}>Add Tag</span>
        </button>
      </div>

      <BaseModal
        isOpen={isTagModalOpen}
        title={editingTagId ? "Edit Tag" : "Add Tag"}
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
              onClick={handleSaveTag}
            >
              {editingTagId ? "Save Tag" : "Add Tag"}
            </button>
          </>
        }
      >
        <TagForm values={tagForm} onChange={setTagForm} />
      </BaseModal>
    </>
  );
}