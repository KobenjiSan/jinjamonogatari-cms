import type {
  CitationListChangesRequest,
  CitationRequest,
  CreateCitationRequest,
  CreateImageRequest,
  CreateKamiInShrineRequest,
  ImageChangeRequest,
  UpdateKamiRequest,
  KamiCMSDto,
} from "../kamiApi";
import type {
  CitationFormValues,
  ImageFormValues,
  KamiFormValues,
} from "../components/kamiEditForm/helpers/KamiForm.types";

function toNullableString(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function toNullableYear(value: string): number | null {
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
  existingImage: KamiCMSDto["image"],
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
  existingCitations: KamiCMSDto["citations"],
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

export function buildCreateKamiPayload(
  form: KamiFormValues,
): CreateKamiInShrineRequest {
  return {
    nameEn: toNullableString(form.nameEn),
    nameJp: toNullableString(form.nameJp),
    desc: toNullableString(form.desc),
    image: mapImageFormToCreate(form.image),
    citations: form.citations
      .filter((citation) => !isCitationEmpty(citation))
      .map((citation) => mapCitationFormToCreate(citation)),
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