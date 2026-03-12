import type {
  UpdateShrineMetaRequest,
} from "../../../ShrineEditorApi";
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
      create: formData.tags
        .filter((tag) => tag.isNew && !tag.isMarkedForRemoval)
        .map((tag) => ({
          titleEn: tag.titleEn,
          titleJp: tag.titleJp,
        })),

      update: formData.tags
        .filter((tag) => !tag.isNew && tag.isEdited && !tag.isMarkedForRemoval)
        .map((tag) => ({
          tagId: tag.tagId,
          titleEn: tag.titleEn,
          titleJp: tag.titleJp,
        })),

      delete: formData.tags
        .filter((tag) => !tag.isNew && tag.isMarkedForRemoval)
        .map((tag) => tag.tagId),
    },

    heroImage: formData.image
      ? formData.image.isRemoved
        ? {
            action: "delete",
            imgSource: null,
            title: null,
            desc: null,
            citation: null,
          }
        : formData.image.isNew
          ? {
              action: "create",
              imgSource: formData.image.imageUrl,
              title: formData.image.title,
              desc: formData.image.desc,
              citation: formData.image.citation
                ? {
                    title: formData.image.citation.title,
                    author: formData.image.citation.author,
                    url: formData.image.citation.url,
                    year: formData.image.citation.year,
                  }
                : null,
            }
          : formData.image.isEdited
            ? {
                action: "update",
                imgSource: formData.image.imageUrl,
                title: formData.image.title,
                desc: formData.image.desc,
                citation: formData.image.citation
                  ? {
                      title: formData.image.citation.title,
                      author: formData.image.citation.author,
                      url: formData.image.citation.url,
                      year: formData.image.citation.year,
                    }
                  : null,
              }
            : {
                action: "none",
                imgSource: null,
                title: null,
                desc: null,
                citation: null,
              }
      : {
          action: "none",
          imgSource: null,
          title: null,
          desc: null,
          citation: null,
        },
  };
}