import type { CitationRequest, CreateCitationRequest } from "../../../../shared/citations/helpers/CitationApi.types";
import type { CitationFormValues } from "../../../../shared/citations/helpers/CitationSection.types";
import type { CreateImageRequest } from "../../../../shared/images/helpers/ImageApi.types";
import type { ImageFormValues } from "../../../../shared/images/helpers/ImageSection.types";


export function toNullableString(value: string): string | null {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
}

export function toNullableYear(value: string): number | null {
    const trimmed = value.trim();
    if(!trimmed) return null;

    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
}

export function toNullableNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

export function isCitationEmpty(citation: CitationFormValues | null | undefined): boolean {
  if (!citation) return true;

  return (
    citation.title.trim() === "" &&
    citation.author.trim() === "" &&
    citation.url.trim() === "" &&
    citation.year.trim() === ""
  );
}

export function isImageEmpty(image: ImageFormValues | null | undefined): boolean {
  if (!image) return true;

  return (
    image.imageUrl.trim() === "" &&
    image.title.trim() === "" &&
    image.desc.trim() === "" &&
    isCitationEmpty(image.citation)
  );
}

export function mapCitationFormToCreate(
  citation: CitationFormValues,
): CreateCitationRequest {
  return {
    title: toNullableString(citation.title),
    author: toNullableString(citation.author),
    url: toNullableString(citation.url),
    year: toNullableYear(citation.year),
  };
}

export function mapCitationFormToUpdate(
  citation: CitationFormValues,
): CitationRequest {
  return {
    citeId: citation.citeId!,
    title: toNullableString(citation.title),
    author: toNullableString(citation.author),
    url: toNullableString(citation.url),
    year: toNullableYear(citation.year),
  };
}

export function mapImageFormToCreate(image: ImageFormValues): CreateImageRequest | null {
  if (isImageEmpty(image)) return null;

  return {
    imgSource: toNullableString(image.imageUrl),
    title: toNullableString(image.title),
    desc: toNullableString(image.desc),
    citation: isCitationEmpty(image.citation)
      ? null
      : mapCitationFormToCreate(image.citation),
  };
}