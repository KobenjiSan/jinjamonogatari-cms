import type { 
    CreateImageRequest,
    UpdateImageRequest,
 } from "../../../../../../../shared/images/helpers/ImageApi.types";
import type { ImageFormValues } from "../../../../../../../shared/images/helpers/ImageSection.types";
import {
  isCitationEmpty,
  mapCitationFormToCreate,
  mapCitationFormToUpdate,
  toNullableString,
} from "../../../../helpers/tab.helpers";

export function buildCreateGalleryImagePayload(
  form: ImageFormValues,
): CreateImageRequest {
  return {
    imgSource: toNullableString(form.imageUrl),
    title: toNullableString(form.title),
    desc: toNullableString(form.desc),
    citation: isCitationEmpty(form.citation)
      ? null
      : mapCitationFormToCreate(form.citation),
  };
}

export function buildUpdateGalleryImagePayload(
  form: ImageFormValues,
): UpdateImageRequest {
  return {
    imgId: form.imgId ?? 0,
    imgUrl: toNullableString(form.imageUrl),
    title: toNullableString(form.title),
    desc: toNullableString(form.desc),
    citation: isCitationEmpty(form.citation)
      ? null
      : form.citation.citeId
        ? mapCitationFormToUpdate(form.citation)
        : mapCitationFormToCreate(form.citation),
  };
}