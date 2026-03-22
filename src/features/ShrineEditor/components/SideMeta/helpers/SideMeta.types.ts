import type { ShrineMetaDto } from "../../../ShrineEditorApi";
import type { EditableTag } from "../components/tags/helpers/TagSection.types";
import type { EditableHeroImage } from "../components/image/helpers/HeroImageSection.types";

export type EditableShrineMeta = Omit<ShrineMetaDto, "tags" | "image"> & {
  tags: EditableTag[];
  image: EditableHeroImage | null;
};

export type EditableShrineMetaField = keyof ShrineMetaDto;