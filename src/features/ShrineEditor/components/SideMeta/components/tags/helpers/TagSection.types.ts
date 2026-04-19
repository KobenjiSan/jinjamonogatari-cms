import type { TagDto } from "../../../../../../shared/tags/tagApi";
import type { TagFormValues } from "../../../../../../shared/tags/TagForm";

export type EditableTag = TagDto & {
  isAdded?: boolean;
  isMarkedForRemoval?: boolean;
};

export const emptyTagForm: TagFormValues = {
  tagId: null,
  titleEn: "",
  titleJp: "",
};