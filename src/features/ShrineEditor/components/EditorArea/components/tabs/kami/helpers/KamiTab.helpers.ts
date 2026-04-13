import type {
  CreateKamiInShrineRequest,
  UpdateKamiRequest,
  KamiCMSDto,
} from "../kamiApi";
import type {
  CitationListChangesRequest,
  CitationRequest,
  CreateCitationRequest,
  LinkExistingCitationRequest,
} from "../../../../../../../shared/citations/helpers/CitationApi.types";
import type {
  ImageChangeRequest,
} from "../../../../../../../shared/images/helpers/ImageApi.types";
import type { KamiFormValues } from "../components/kamiEditForm/helpers/KamiForm.types";
import type { CitationFormValues } from "../../../../../../../shared/citations/helpers/CitationSection.types";
import type { ImageFormValues } from "../../../../../../../shared/images/helpers/ImageSection.types";
import {
  isCitationEmpty,
  isImageEmpty,
  mapCitationFormToCreate,
  mapCitationFormToUpdate,
  mapImageFormToCreate,
  toNullableString,
} from "../../../../helpers/tab.helpers";

function mapImageFormToChange(
  image: ImageFormValues,
  existingImage: KamiCMSDto["image"],
): ImageChangeRequest {
  const formImageIsEmpty = isImageEmpty(image);
  const hasExistingImage = !!existingImage;

  if (!hasExistingImage && formImageIsEmpty) {
    return {
      action: "none",
      imageUrl: null,
      title: null,
      desc: null,
      citation: null,
    };
  }

  if (hasExistingImage && formImageIsEmpty) {
    return {
      action: "delete",
      imageUrl: null,
      title: null,
      desc: null,
      citation: null,
    };
  }

  if (!hasExistingImage && !formImageIsEmpty) {
    return {
      action: "create",
      imageUrl: toNullableString(image.imageUrl),
      title: toNullableString(image.title),
      desc: toNullableString(image.desc),
      citation: isCitationEmpty(image.citation)
        ? null
        : mapCitationFormToCreate(image.citation),
    };
  }

  return {
    action: "update",
    imageUrl: toNullableString(image.imageUrl),
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
): {
  create: CreateCitationRequest[];
  linkExisting: LinkExistingCitationRequest[];
} {
  const create: CreateCitationRequest[] = [];
  const linkExisting: LinkExistingCitationRequest[] = [];

  for (const citation of formCitations) {
    if (isCitationEmpty(citation)) continue;

    if (citation.citeId) {
      linkExisting.push(mapCitationFormToLinkExisting(citation));
      continue;
    }

    create.push(mapCitationFormToCreate(citation));
  }

  return {
    create,
    linkExisting,
  };
}

function buildCitationChanges(
  formCitations: CitationFormValues[],
  existingCitations: KamiCMSDto["citations"],
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

export function buildCreateKamiPayload(
  form: KamiFormValues,
): CreateKamiInShrineRequest {
  return {
    nameEn: toNullableString(form.nameEn),
    nameJp: toNullableString(form.nameJp),
    desc: toNullableString(form.desc),
    image: mapImageFormToCreate(form.image),
    citations: buildCreateCitationChanges(form.citations),
  };
}

export function buildUpdateKamiPayload(
  form: KamiFormValues,
  existingKami: KamiCMSDto,
): UpdateKamiRequest {
  return {
    basic: {
      nameEn: toNullableString(form.nameEn),
      nameJp: toNullableString(form.nameJp),
      desc: toNullableString(form.desc),
    },
    image: mapImageFormToChange(form.image, existingKami.image),
    citations: buildCitationChanges(form.citations, existingKami.citations),
  };
}