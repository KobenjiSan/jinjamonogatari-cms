import type {
  CreateHistoryRequest,
  HistoryCMSDto,
  UpdateHistoryRequest,
} from "../historyApi";
import type {
  CitationCreateChangesRequest,
  CitationListChangesRequest,
  CitationRequest,
  CreateCitationRequest,
  LinkExistingCitationRequest,
} from "../../../../../../../shared/citations/helpers/CitationApi.types";
import type { ImageChangeRequest } from "../../../../../../../shared/images/helpers/ImageApi.types";
import type { HistoryFormValues } from "../components/HistoryEditForm/helpers/HistoryForm.types";
import type { CitationFormValues } from "../../../../../../../shared/citations/helpers/CitationSection.types";
import type { ImageFormValues } from "../../../../../../../shared/images/helpers/ImageSection.types";
import {
  isCitationEmpty,
  isImageEmpty,
  mapCitationFormToCreate,
  mapCitationFormToUpdate,
  mapImageFormToCreate,
  toNullableNumber,
  toNullableString,
} from "../../../../helpers/tab.helpers";

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

function mapCitationFormToLinkExisting(
  citation: CitationFormValues,
): LinkExistingCitationRequest {
  return {
    citeId: citation.citeId!,
    title: toNullableString(citation.title),
    author: toNullableString(citation.author),
    url: toNullableString(citation.url),
    year: citation.year ? Number(citation.year) : null,
  };
}

function buildCreateCitationChanges(
  formCitations: CitationFormValues[],
): CitationCreateChangesRequest {
  const create: CreateCitationRequest[] = [];
  const linkExisting: LinkExistingCitationRequest[] = [];

  for (const citation of formCitations) {
    if (isCitationEmpty(citation)) continue;

    if (citation.citeId) {
      linkExisting.push(mapCitationFormToLinkExisting(citation));
    } else {
      create.push(mapCitationFormToCreate(citation));
    }
  }

  return {
    create,
    linkExisting,
  };
}

function buildCitationChanges(
  formCitations: CitationFormValues[],
  existingCitations: HistoryCMSDto["citations"],
): CitationListChangesRequest {
  const create: CreateCitationRequest[] = [];
  const update: CitationRequest[] = [];
  const linkExisting: LinkExistingCitationRequest[] = [];

  const existingCitationIds = new Set(existingCitations.map((c) => c.citeId));

  for (const citation of formCitations) {
    if (isCitationEmpty(citation)) continue;

    if (!citation.citeId) {
      create.push(mapCitationFormToCreate(citation));
      continue;
    }

    if (!existingCitationIds.has(citation.citeId)) {
      linkExisting.push(mapCitationFormToLinkExisting(citation));
      continue;
    }

    update.push(mapCitationFormToUpdate(citation));
  }

  const formCitationIds = new Set(
    formCitations
      .filter((c) => c.citeId)
      .map((c) => c.citeId as number),
  );

  const del = existingCitations
    .filter((citation) => !formCitationIds.has(citation.citeId))
    .map((citation) => citation.citeId);

  return {
    create,
    update,
    linkExisting,
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
    citations: buildCreateCitationChanges(form.citations),
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