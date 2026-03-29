import type { ImageFullDto } from "../../../../../ShrineEditorApi";

export type EditableHeroImage = ImageFullDto & {
  file?: File | null;
  isNew?: boolean;
  isEdited?: boolean;
  isRemoved?: boolean;
};

export type HeroImageSectionProps = {
  image: EditableHeroImage | null;
  onChange: (nextImage: EditableHeroImage | null) => void;
  isReadOnly: boolean;
};
