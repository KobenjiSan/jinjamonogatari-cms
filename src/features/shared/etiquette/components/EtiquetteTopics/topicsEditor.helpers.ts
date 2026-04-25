import {
  isCitationEmpty,
  isImageEmpty,
  mapCitationFormToCreate,
  mapCitationFormToUpdate,
  mapImageFormToCreate,
  toNullableNumber,
  toNullableString,
} from "../../../../ShrineEditor/components/EditorArea/helpers/tab.helpers";
import type {
  CitationCreateChangesRequest,
  CitationListChangesRequest,
  CitationRequest,
  CreateCitationRequest,
  LinkExistingCitationRequest,
} from "../../../citations/helpers/CitationApi.types";
import type { CitationFormValues } from "../../../citations/helpers/CitationSection.types";
import type { ImageChangeRequest } from "../../../images/helpers/ImageApi.types";
import type { ImageFormValues } from "../../../images/helpers/ImageSection.types";
import type {
  CreateEtiquetteRequest,
  EtiquetteStep,
  EtiquetteTopic,
  UpdateEtiquetteRequest,
  UpdateGlanceRequest,
} from "../../etiquetteApi";
import type { AtAGlanceFormValues } from "../AtAGlanceEditForm/AtAGlanceEditForm";
import type { EtiquetteMetaFormValues } from "../EtiquetteTopicEditForm/components/TopicMetaForm";
import type { EtiquetteStepFormValues } from "../EtiquetteTopicEditForm/components/TopicStepForm";

function mapImageFormToChange(
  image: ImageFormValues,
  existingImage: EtiquetteStep["image"],
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

function buildCreateCitationChanges(
  formCitations: CitationFormValues[],
): CitationCreateChangesRequest {
  const create: CreateCitationRequest[] = [];
  const linkExisting: LinkExistingCitationRequest[] = [];

  for (const citation of formCitations) {
    if (isCitationEmpty(citation)) continue;
    create.push(mapCitationFormToCreate(citation));
  }

  return {
    create,
    linkExisting,
  };
}

function buildCitationChanges(
  formCitations: CitationFormValues[],
  existingCitations: EtiquetteTopic["citations"],
): CitationListChangesRequest {
  const create: CreateCitationRequest[] = [];
  const update: CitationRequest[] = [];
  const linkExisting: LinkExistingCitationRequest[] = [];

  for (const citation of formCitations) {
    if (isCitationEmpty(citation)) continue;

    if (!citation.citeId) {
      create.push(mapCitationFormToCreate(citation));
      continue;
    }

    update.push(mapCitationFormToUpdate(citation));
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
    linkExisting,
    delete: del,
  };
}

// #region Create Etiquette

export function buildCreateEtiquettePayload(
  form: EtiquetteMetaFormValues,
): CreateEtiquetteRequest {
  return {
    basic: {
      slug: toNullableString(form.slug),
      titleLong: toNullableString(form.titleLong),
      summary: toNullableString(form.summary),
      showInGlance: form.showInGlance,
      showAsHighlight: form.showAsHighlight,
      guideOrder: toNullableNumber(form.guideOrder),
    },
    citations: buildCreateCitationChanges(form.citations),
  };
}

// #endregion

// #region Update Etiquette

export function buildUpdateEtiquettePayload(
  form: EtiquetteMetaFormValues,
  existingEtiquette: EtiquetteTopic,
): UpdateEtiquetteRequest {
  return {
    basic: {
      slug: toNullableString(form.slug),
      titleLong: toNullableString(form.titleLong),
      summary: toNullableString(form.summary),
      showInGlance: form.showInGlance,
      showAsHighlight: form.showAsHighlight,
      guideOrder: toNullableNumber(form.guideOrder),
    },
    citations: buildCitationChanges(
      form.citations,
      existingEtiquette.citations,
    ),
  };
}

// #endregion

// #region Create Step

export function buildCreateStepFormData(
  form: EtiquetteStepFormValues,
  file: File | null,
): FormData {
  const formData = new FormData();

  const payload = {
    basic: {
      text: toNullableString(form.text),
      stepOrder: toNullableNumber(form.stepOrder),
    },
    image: mapImageFormToCreate(form.image),
  };

  formData.append("data", JSON.stringify(payload));

  if (file) {
    formData.append("file", file);
  }

  return formData;
}

// #endregion

// #region Update Step

export function buildUpdateStepFormData(
  form: EtiquetteStepFormValues,
  existingStep: EtiquetteStep,
  file: File | null,
): FormData {
  const formData = new FormData();

  const payload = {
    basic: {
      text: toNullableString(form.text),
      stepOrder: toNullableNumber(form.stepOrder),
    },
    image: mapImageFormToChange(form.image, existingStep.image),
  };

  formData.append("data", JSON.stringify(payload));

  if (file) {
    formData.append("file", file);
  }

  return formData;
}

// #endregion

// #region Update Glance

export function buildUpdateGlancePayload(
  form: AtAGlanceFormValues,
): UpdateGlanceRequest {
  return {
    titleShort: toNullableString(form.titleShort),
    iconKey: toNullableString(form.iconKey),
    iconSet: toNullableString(form.iconSet),
    glanceOrder: toNullableNumber(form.glanceOrder),
  };
}

// #endregion
