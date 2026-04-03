import type { TagDto } from "../../../../../../shared/tags/tagApi";
import type { TagFormValues } from "../../../../../../shared/tags/TagForm";

export type EditableTag = TagDto & {
  isAdded?: boolean;
  isMarkedForRemoval?: boolean;
};

export type TagsSectionProps = {
  tags: EditableTag[];
  onChange: (nextTags: EditableTag[]) => void;
  isReadOnly: boolean;
};

export const emptyTagForm: TagFormValues = {
  tagId: null,
  titleEn: "",
  titleJp: "",
};