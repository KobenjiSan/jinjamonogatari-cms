import type { EditableTag, TagFormValues } from "./TagSection.types";

export function mapTagToForm(tag: EditableTag): TagFormValues {
  return {
    titleEn: tag.titleEn ?? "",
    titleJp: tag.titleJp ?? "",
  };
}

export function buildNewTag(tagForm: TagFormValues): EditableTag | null {
  const trimmedTitleEn = tagForm.titleEn.trim();
  const trimmedTitleJp = tagForm.titleJp.trim();

  if (!trimmedTitleEn) return null;

  return {
    tagId: Date.now(),
    titleEn: trimmedTitleEn,
    titleJp: trimmedTitleJp,
    isNew: true,
    isEdited: false,
    isMarkedForRemoval: false,
  };
}

export function buildUpdatedTags(
  tags: EditableTag[],
  editingTagId: number,
  tagForm: TagFormValues
): EditableTag[] {
  const trimmedTitleEn = tagForm.titleEn.trim();
  const trimmedTitleJp = tagForm.titleJp.trim();

  if (!trimmedTitleEn) return tags;

  return tags.map((tag) =>
    tag.tagId === editingTagId
      ? {
          ...tag,
          titleEn: trimmedTitleEn,
          titleJp: trimmedTitleJp,
          isEdited: !tag.isNew,
          isMarkedForRemoval: false,
        }
      : tag
  );
}

export function toggleRemoveTag(
  tags: EditableTag[],
  tagId: number
): EditableTag[] {
  const tagToUpdate = tags.find((tag) => tag.tagId === tagId);
  if (!tagToUpdate) return tags;

  if (tagToUpdate.isNew) {
    return tags.filter((tag) => tag.tagId !== tagId);
  }

  return tags.map((tag) =>
    tag.tagId === tagId
      ? {
          ...tag,
          isMarkedForRemoval: !tag.isMarkedForRemoval,
        }
      : tag
  );
}

export function getTagChipClassName(
  tag: EditableTag,
  baseClassName: string,
  removedClassName: string,
  changedClassName: string
) {
  if (tag.isMarkedForRemoval) {
    return `${baseClassName} ${removedClassName}`;
  }

  if (tag.isNew || tag.isEdited) {
    return `${baseClassName} ${changedClassName}`;
  }

  return baseClassName;
}