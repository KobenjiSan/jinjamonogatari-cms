import { useState } from "react";
import BaseModal from "../../../../../../shared/components/modal/BaseModal";
import TagForm from "../../../../../shared/tags/TagForm";
import styles from "./TagSection.module.css";

import {
  buildNewTag,
  getTagChipClassName,
  toggleRemoveTag,
} from "./helpers/TagSection.helpers";
import {
  emptyTagForm,
  type EditableTag,
} from "./helpers/TagSection.types";
import { FiPlus } from "react-icons/fi";

export type TagsSectionProps = {
  tags: EditableTag[];
  onChange: (nextTags: EditableTag[]) => void;
  isReadOnly: boolean;
};

export default function TagsSection({
  tags,
  onChange,
  isReadOnly,
}: TagsSectionProps) {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagForm, setTagForm] = useState(emptyTagForm);

  function openCreateTagModal() {
    setTagForm(emptyTagForm);
    setIsTagModalOpen(true);
  }

  function closeTagModal() {
    setIsTagModalOpen(false);
    setTagForm(emptyTagForm);
  }

  function handleSaveTag() {
    const newTag = buildNewTag(tagForm);
    if (!newTag) return;

    const existingTag = tags.find((tag) => tag.tagId === newTag.tagId);

    if (existingTag) {
      onChange(
        tags.map((tag) =>
          tag.tagId === existingTag.tagId
            ? {
                ...tag,
                isMarkedForRemoval: false,
              }
            : tag,
        ),
      );

      closeTagModal();
      return;
    }

    onChange([...tags, newTag]);
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
                  styles.changedInput,
                )}
              >
                <div className={styles.tagChipButton}>
                  <span
                    className={`${styles.tagChipText} ${
                      tag.isMarkedForRemoval ? styles.tagChipTextRemoved : ""
                    }`}
                  >
                    {tag.titleEn}
                    {tag.titleJp ? ` (${tag.titleJp})` : ""}
                  </span>
                </div>

                {!isReadOnly && (
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
                )}
              </div>
            ))
          ) : (
            <span className="text-sm text-secondary">No tags added yet.</span>
          )}
        </div>

        {!isReadOnly && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={openCreateTagModal}
          >
            <FiPlus size={16} />
            <span className={styles.tagButtonText}>Add Tag</span>
          </button>
        )}
      </div>

      <BaseModal
        isOpen={isTagModalOpen}
        title="Add Tag"
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
              Add Tag
            </button>
          </>
        }
      >
        <TagForm values={tagForm} onChange={setTagForm} editable={false} />
      </BaseModal>
    </>
  );
}
