import type { ImageFormValues } from "../../../../../../../shared/images/helpers/ImageSection.types";
import {
  isCitationEmpty,
  mapCitationFormToCreate,
  mapCitationFormToUpdate,
  toNullableString,
} from "../../../../helpers/tab.helpers";

export function buildCreateGalleryImageFormData(
  form: ImageFormValues,
  file: File | null,
): FormData {
  const formData = new FormData();

  const imageUrl = toNullableString(form.imageUrl);
  const title = toNullableString(form.title);
  const desc = toNullableString(form.desc);
  
  if(imageUrl !== null) formData.append("imageUrl", imageUrl);
  if(title !== null) formData.append("title", title);
  if(desc !== null) formData.append("desc", desc);

  if(file) {
    formData.append("file", file);
  }

  if(!isCitationEmpty(form.citation)){
    const citation = mapCitationFormToCreate(form.citation);
    
    formData.append("citation.title", citation.title ?? "");
    formData.append("citation.author", citation.author ?? "");
    formData.append("citation.url", citation.url ?? "");
    if(citation.year != null){
      formData.append("citation.year", String(citation.year));
    }
  }

  return formData;
}

export function buildUpdateGalleryImageFormData(
  form: ImageFormValues,
  file: File | null,
): FormData {
  const formData = new FormData();

  formData.append("imgId", String(form.imgId ?? 0));

  const imageUrl = toNullableString(form.imageUrl);
  const title = toNullableString(form.title);
  const desc = toNullableString(form.desc);
  
  if(imageUrl !== null) formData.append("imageUrl", imageUrl);
  if(title !== null) formData.append("title", title);
  if(desc !== null) formData.append("desc", desc);

  if(file) {
    formData.append("file", file);
  }

  if(!isCitationEmpty(form.citation)){
    if (form.citation.citeId) {
      // EXISTING citation (update)
      const citation = mapCitationFormToUpdate(form.citation);

      formData.append("citation.citeId", String(citation.citeId));
      formData.append("citation.title", citation.title ?? "");
      formData.append("citation.author", citation.author ?? "");
      formData.append("citation.url", citation.url ?? "");
      if (citation.year != null) {
        formData.append("citation.year", String(citation.year));
      }
    } else {
      // NEW citation (create)
      const citation = mapCitationFormToCreate(form.citation);

      formData.append("citation.title", citation.title ?? "");
      formData.append("citation.author", citation.author ?? "");
      formData.append("citation.url", citation.url ?? "");
      if (citation.year != null) {
        formData.append("citation.year", String(citation.year));
      }
    }
  }

  return formData;
}