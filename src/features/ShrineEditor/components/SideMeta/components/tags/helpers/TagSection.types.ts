import type { TagDto } from "../../../../../ShrineEditorApi";

export type TagFormValues = {
  titleEn: string;
  titleJp: string;
};

export type EditableTag = TagDto & {
  isNew?: boolean;
  isEdited?: boolean;
  isMarkedForRemoval?: boolean;
};

export type TagsSectionProps = {
  tags: EditableTag[];
  onChange: (nextTags: EditableTag[]) => void;
  isReadOnly: boolean;
};

export const emptyTagForm: TagFormValues = {
  titleEn: "",
  titleJp: "",
};
