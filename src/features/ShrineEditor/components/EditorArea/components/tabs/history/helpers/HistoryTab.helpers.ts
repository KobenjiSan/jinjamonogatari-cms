import type {
  CitationListChangesRequest,
  CitationRequest,
  CreateCitationRequest,
  CreateHistoryRequest,
  CreateImageRequest,
  HistoryCMSDto,
  ImageChangeRequest,
  UpdateHistoryRequest,
} from "../historyApi";
import type { HistoryFormValues } from "../components/HistoryEditForm/helpers/HistoryForm.types";
import type { CitationFormValues } from "../../../../../../../shared/citations/helpers/CitationSection.types";
import type { ImageFormValues } from "../../../../../../../shared/images/helpers/ImageSection.types";

function toNullableString(value: string): string | null {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
}

function toNullableYear(value: string): number | null {
    const trimmed = value.trim();
    if(!trimmed) return null;

    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
}

function toNullableNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function isCitationEmpty(citation: CitationFormValues | null | undefined): boolean {
  if (!citation) return true;

  return (
    citation.title.trim() === "" &&
    citation.author.trim() === "" &&
    citation.url.trim() === "" &&
    citation.year.trim() === ""
  );
}

function isImageEmpty(image: ImageFormValues | null | undefined): boolean {
  if (!image) return true;

  return (
    image.imageUrl.trim() === "" &&
    image.title.trim() === "" &&
    image.desc.trim() === "" &&
    isCitationEmpty(image.citation)
  );
}

function mapCitationFormToCreate(
  citation: CitationFormValues,
): CreateCitationRequest {
  return {
    title: toNullableString(citation.title),
    author: toNullableString(citation.author),
    url: toNullableString(citation.url),
    year: toNullableYear(citation.year),
  };
}

function mapCitationFormToUpdate(
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

function mapImageFormToCreate(image: ImageFormValues): CreateImageRequest | null {
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

function mapImageFormToChange(
  image: ImageFormValues,
  existingImage: HistoryCMSDto["image"],
): ImageChangeRequest {
  const formImageIsEmpty = isImageEmpty(image);
  const hasExistingImage = !!existingImage;

  if (!hasExistingImage && formImageIsEmpty) {
    return {
      action: "none",
      imgSource: null,
      title: null,
      desc: null,
      citation: null,
    };
  }

  if (hasExistingImage && formImageIsEmpty) {
    return {
      action: "delete",
      imgSource: null,
      title: null,
      desc: null,
      citation: null,
    };
  }

  if (!hasExistingImage && !formImageIsEmpty) {
    return {
      action: "create",
      imgSource: toNullableString(image.imageUrl),
      title: toNullableString(image.title),
      desc: toNullableString(image.desc),
      citation: isCitationEmpty(image.citation)
        ? null
        : mapCitationFormToCreate(image.citation),
    };
  }

  return {
    action: "update",
    imgSource: toNullableString(image.imageUrl),
    title: toNullableString(image.title),
    desc: toNullableString(image.desc),
    citation: isCitationEmpty(image.citation)
      ? null
      : image.citation.citeId
        ? mapCitationFormToUpdate(image.citation)
        : mapCitationFormToCreate(image.citation),
  };
}

function buildCitationChanges(
  formCitations: CitationFormValues[],
  existingCitations: HistoryCMSDto["citations"],
): CitationListChangesRequest {
  const create: CreateCitationRequest[] = [];
  const update: CitationRequest[] = [];

  for (const citation of formCitations) {
    if (isCitationEmpty(citation)) continue;

    if (citation.citeId) {
      update.push(mapCitationFormToUpdate(citation));
    } else {
      create.push(mapCitationFormToCreate(citation));
    }
  }

  const formCitationIds = new Set(
    formCitations.filter((c) => c.citeId).map((c) => c.citeId as number),
  );

  const del = existingCitations
    .filter((citation) => !formCitationIds.has(citation.citeId))
    .map((citation) => citation.citeId);

  return {
    create,
    update,
    delete: del,
  };
}

export function buildCreateHistoryPayload(
  form: HistoryFormValues,
): CreateHistoryRequest {
  return {
    eventDate: toNullableString(form.eventDate),
    sortOrder: toNullableNumber(form.sortOrder),
    title: toNullableString(form.title),
    information: toNullableString(form.information),
    image: mapImageFormToCreate(form.image),
    citations: form.citations
      .filter((citation) => !isCitationEmpty(citation))
      .map((citation) => mapCitationFormToCreate(citation)),
  };
}

export function buildUpdateHistoryPayload(
  form: HistoryFormValues,
  existingHistory: HistoryCMSDto,
): UpdateHistoryRequest {
  return {
    basic: {
      eventDate: toNullableString(form.eventDate),
      sortOrder: toNullableNumber(form.sortOrder),
      title: toNullableString(form.title),
      information: toNullableString(form.information),
    },
    image: mapImageFormToChange(form.image, existingHistory.image),
    citations: buildCitationChanges(form.citations, existingHistory.citations),
  };
}
