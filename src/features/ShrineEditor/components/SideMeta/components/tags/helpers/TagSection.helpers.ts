import type { EditableTag } from "./TagSection.types";
import type { TagFormValues } from "../../../../../../shared/tags/TagForm";

export function buildNewTag(tagForm: TagFormValues): EditableTag | null {
  const trimmedTitleEn = tagForm.titleEn.trim();
  const trimmedTitleJp = tagForm.titleJp.trim();

  if (!tagForm.tagId || !trimmedTitleEn) return null;

  return {
    tagId: tagForm.tagId,
    titleEn: trimmedTitleEn,
    titleJp: trimmedTitleJp,
    isAdded: true,
    isMarkedForRemoval: false,
  };
}

export function toggleRemoveTag(
  tags: EditableTag[],
  tagId: number
): EditableTag[] {
  const tagToUpdate = tags.find((tag) => tag.tagId === tagId);
  if (!tagToUpdate) return tags;

  if (tagToUpdate.isAdded) {
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

  if (tag.isAdded) {
    return `${baseClassName} ${changedClassName}`;
  }

  return baseClassName;
}