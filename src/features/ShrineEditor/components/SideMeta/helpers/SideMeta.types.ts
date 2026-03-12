import type { ShrineMetaDto } from "../../../ShrineEditorApi";
import type { EditableTag } from "../components/tags/TagSection";
import type { EditableHeroImage } from "../components/image/HeroImageSection";

export type EditableShrineMeta = Omit<ShrineMetaDto, "tags" | "image"> & {
  tags: EditableTag[];
  image: EditableHeroImage | null;
};

export type EditableShrineMetaField = keyof ShrineMetaDto;