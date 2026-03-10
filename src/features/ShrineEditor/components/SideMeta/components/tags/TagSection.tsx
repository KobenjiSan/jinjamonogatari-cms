import { useState } from "react";
import BaseModal from "../../../../../../shared/components/modal/BaseModal";
import TagForm from "../../../../../shared/tags/TagForm";
import styles from "./TagSection.module.css";

import type { TagDto } from "../../../../ShrineEditorApi";

type TagFormValues = {
  titleEn: string;
  titleJp: string;
};

export type EditableTag = TagDto & {
  isNew?: boolean;
  isEdited?: boolean;
  isMarkedForRemoval?: boolean;
};

type TagsSectionProps = {
  tags: EditableTag[];
  onChange: (nextTags: EditableTag[]) => void;
};

const emptyTagForm: TagFormValues = {
  titleEn: "",
  titleJp: "",
};

export default function TagsSection({ tags, onChange }: TagsSectionProps) {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [tagForm, setTagForm] = useState<TagFormValues>(emptyTagForm);

  function openCreateTagModal() {
    setEditingTagId(null);
    setTagForm(emptyTagForm);
    setIsTagModalOpen(true);
  }

  function openEditTagModal(tag: EditableTag) {
    setEditingTagId(tag.tagId);
    setTagForm({
      titleEn: tag.titleEn ?? "",
      titleJp: tag.titleJp ?? "",
    });
    setIsTagModalOpen(true);
  }

  function closeTagModal() {
    setIsTagModalOpen(false);
    setEditingTagId(null);
    setTagForm(emptyTagForm);
  }

  function handleSaveTag() {
    const trimmedTitleEn = tagForm.titleEn.trim();
    const trimmedTitleJp = tagForm.titleJp.trim();

    if (!trimmedTitleEn) return;

    if (editingTagId === null) {
      const newTag: EditableTag = {
        tagId: Date.now(),
        titleEn: trimmedTitleEn,
        titleJp: trimmedTitleJp,
        isNew: true,
        isEdited: false,
        isMarkedForRemoval: false,
      };

      onChange([...tags, newTag]);
    } else {
      onChange(
        tags.map((tag) =>
          tag.tagId === editingTagId
            ? {
                ...tag,
                titleEn: trimmedTitleEn,
                titleJp: trimmedTitleJp,
                isEdited: !tag.isNew,
                isMarkedForRemoval: false,
              }
            : tag
        )
      );
    }

    closeTagModal();
  }

  function handleToggleRemoveTag(tagId: number) {
    onChange(
      tags.map((tag) =>
        tag.tagId === tagId
          ? {
              ...tag,
              isMarkedForRemoval: !tag.isMarkedForRemoval,
            }
          : tag
      )
    );
  }

  function getTagChipClassName(tag: EditableTag) {
    if (tag.isMarkedForRemoval) {
      return `${styles.tagChip} ${styles.tagChipRemoved}`;
    }

    if (tag.isNew || tag.isEdited) {
      return `${styles.tagChip} ${styles.changedInput}`;
    }

    return styles.tagChip;
  }

  return (
    <>
      <div className={styles.block}>
        <p className={styles.blockTitle}>Tags</p>

        <div className={styles.tagList}>
          {tags.length ? (
            tags.map((tag) => (
              <div key={tag.tagId} className={getTagChipClassName(tag)}>
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
          + Add Tag
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