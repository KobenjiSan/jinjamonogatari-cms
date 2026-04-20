import type { UpdateShrineMetaRequest } from "../../../ShrineEditorApi";
import type { EditableShrineMeta } from "./SideMeta.types";

export function cloneShrineMeta<T>(value: T): T {
  return structuredClone(value);
}

export function buildUpdateShrineMetaPayload(
  formData: EditableShrineMeta,
): UpdateShrineMetaRequest {
  return {
    basic: {
      slug: formData.slug,
      nameEn: formData.nameEn,
      nameJp: formData.nameJp,
      shrineDesc: formData.shrineDesc,
      lat: formData.lat,
      lon: formData.lon,
      prefecture: formData.prefecture,
      city: formData.city,
      ward: formData.ward,
      locality: formData.locality,
      postalCode: formData.postalCode,
      country: formData.country,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      website: formData.website,
    },

    tags: {
      link: formData.tags
        .filter((tag) => tag.isAdded && !tag.isMarkedForRemoval)
        .map((tag) => tag.tagId),

      unlink: formData.tags
        .filter((tag) => tag.isMarkedForRemoval)
        .map((tag) => tag.tagId),
    },
  };
}
