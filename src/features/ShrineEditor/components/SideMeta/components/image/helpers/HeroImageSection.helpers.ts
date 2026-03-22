import type { ImageFormValues } from "../../../../../../shared/images/helpers/ImageSection.types";
import type { EditableHeroImage } from "./HeroImageSection.types";

export function buildHeroImagePayload(
  image: EditableHeroImage | null,
  imageForm: ImageFormValues,
  selectedFile: File | null
): EditableHeroImage {
  const trimmedTitle = imageForm.title.trim();
  const trimmedDesc = imageForm.desc.trim();

  const hasCitationChanges =
    (image?.citation?.title ?? "") !== (imageForm.citation.title.trim() || "") ||
    (image?.citation?.author ?? "") !== (imageForm.citation.author.trim() || "") ||
    (image?.citation?.url ?? "") !== (imageForm.citation.url.trim() || "") ||
    (image?.citation?.year?.toString() ?? "") !==
      (imageForm.citation.year.trim() || "");

  const hasImageChanges =
    !!selectedFile ||
    (image?.title ?? "") !== (trimmedTitle || "") ||
    (image?.desc ?? "") !== (trimmedDesc || "") ||
    hasCitationChanges;

  return {
    imgId: image?.imgId ?? Date.now(),
    imageUrl: image?.imageUrl ?? null,
    title: trimmedTitle || null,
    desc: trimmedDesc || null,
    citation:
      imageForm.citation.title.trim() ||
      imageForm.citation.author.trim() ||
      imageForm.citation.url.trim() ||
      imageForm.citation.year.trim()
        ? {
            citeId: image?.citation?.citeId ?? Date.now() + 1,
            title: imageForm.citation.title.trim() || null,
            author: imageForm.citation.author.trim() || null,
            url: imageForm.citation.url.trim() || null,
            year: imageForm.citation.year.trim()
              ? Number(imageForm.citation.year)
              : null,
          }
        : null,
    file: selectedFile,
    isNew: !image || image.isRemoved,
    isEdited: !!image && !image.isRemoved && hasImageChanges,
    isRemoved: false,
  };
}

export function getImagePreviewClassName(
  image: EditableHeroImage | null,
  baseClassName: string,
  changedClassName: string
) {
  if (image?.isNew || image?.isEdited || image?.isRemoved) {
    return `${baseClassName} ${changedClassName}`;
  }

  return baseClassName;
}