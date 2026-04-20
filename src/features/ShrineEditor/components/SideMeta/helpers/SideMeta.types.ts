import type { ShrineMetaDto } from "../../../ShrineEditorApi";
import type { EditableTag } from "../components/tags/helpers/TagSection.types";

export type EditableShrineMeta = Omit<ShrineMetaDto, "tags"> & {
  tags: EditableTag[];
};

export type EditableShrineMetaField = keyof ShrineMetaDto;