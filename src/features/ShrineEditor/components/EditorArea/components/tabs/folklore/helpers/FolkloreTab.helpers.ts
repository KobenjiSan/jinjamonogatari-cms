import type { 
    FolkloreCMSDto,
    CreateFolkloreRequest,
    UpdateFolkloreRequest
} from "../folkloreApi";
import type {
  CitationListChangesRequest,
  CitationRequest,
  CreateCitationRequest,
} from "../../../../../../../shared/citations/helpers/CitationApi.types";
import type { ImageChangeRequest } from "../../../../../../../shared/images/helpers/ImageApi.types";
import type { FolkloreFormValues } from "../components/FolkloreEditForm/helpers/FolkloreForm.types";
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
  existingImage: FolkloreCMSDto["image"],
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
  existingCitations: FolkloreCMSDto["citations"],
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

export function buildCreateFolklorePayload(
  form: FolkloreFormValues,
): CreateFolkloreRequest {
  return {
    sortOrder: toNullableNumber(form.sortOrder),
    title: toNullableString(form.title),
    information: toNullableString(form.information),
    image: mapImageFormToCreate(form.image),
    citations: form.citations
      .filter((citation) => !isCitationEmpty(citation))
      .map((citation) => mapCitationFormToCreate(citation)),
  };
}

export function buildUpdateFolklorePayload(
  form: FolkloreFormValues,
  existingFolklore: FolkloreCMSDto,
): UpdateFolkloreRequest {
  return {
    basic: {
      sortOrder: toNullableNumber(form.sortOrder),
      title: toNullableString(form.title),
      information: toNullableString(form.information),
    },
    image: mapImageFormToChange(form.image, existingFolklore.image),
    citations: buildCitationChanges(form.citations, existingFolklore.citations),
  };
}