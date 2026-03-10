import styles from "./SideMeta.module.css";
import { useEffect, useState } from "react";
import {
  getShrineMetaById,
  updateShrineMeta,
  type ShrineMetaDto,
  type UpdateShrineMetaRequest,
} from "../../ShrineEditorApi";

import SystemSection from "./components/system/SystemSection";
import IdentitySection from "./components/identity/IdentitySection";
import LocationSection from "./components/location/LocationSection";
import AddressSection from "./components/address/AddressSection";
import ContactSection from "./components/contact/ContactSection";
import TagsSection from "./components/tags/TagSection";
import PublishingSection from "./components/publishing/PublishingSection";
import TimestampsSection from "./components/timestamps/TimestampsSection";
import HeroImageSection from "./components/image/HeroImageSection";
import type { EditableTag } from "./components/tags/TagSection";
import type { EditableHeroImage } from "./components/image/HeroImageSection";

type EditableShrineMeta = Omit<ShrineMetaDto, "tags" | "image"> & {
  tags: EditableTag[];
  image: EditableHeroImage | null;
};

type SideMetaProps = {
  shrineId: number;
};

export default function SideMeta({ shrineId }: SideMetaProps) {
  const [originalMeta, setOriginalMeta] = useState<EditableShrineMeta | null>(
    null,
  );
  const [formData, setFormData] = useState<EditableShrineMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeta() {
      setLoading(true);

      try {
        const result = await getShrineMetaById(shrineId);
        setOriginalMeta(structuredClone(result));
        setFormData(structuredClone(result));
      } catch (err) {
        console.error("Failed to retreive shrine meta", err);
      } finally {
        setLoading(false);
      }
    }

    loadMeta();
  }, [shrineId]);

  function updateField<K extends keyof ShrineMetaDto>(
    field: K,
    value: ShrineMetaDto[K],
  ) {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  }

  function handleTagsChange(nextTags: EditableTag[]) {
    setFormData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        tags: nextTags,
      };
    });
  }

  function handleImageChange(nextImage: EditableHeroImage | null) {
    setFormData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        image: nextImage,
      };
    });
  }

  function isChanged<K extends keyof ShrineMetaDto>(field: K) {
    if (!formData || !originalMeta) return false;
    return formData[field] !== originalMeta[field];
  }

  function handleReset() {
    if (!originalMeta) return;
    setFormData(structuredClone(originalMeta));
  }

  async function handleSaveMeta() {
    if (!formData) return;

    const payload: UpdateShrineMetaRequest = {
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
          .filter(
            (tag) => !tag.isNew && tag.isEdited && !tag.isMarkedForRemoval,
          )
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

    await updateShrineMeta(shrineId, payload);

    const refreshed = await getShrineMetaById(shrineId);

    setOriginalMeta(structuredClone(refreshed));
    setFormData(structuredClone(refreshed));
  }

  if (loading) {
    return (
      <div className="card">
        <p className="text-md text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <aside className={styles.sideMeta}>
      <div className={styles.panel}>
        <div className={styles.scrollArea}>
          <div className={styles.sectionBody}>
            <SystemSection
              shrineId={shrineId}
              inputtedId={originalMeta?.inputtedId}
            />

            <div className={styles.divider} />

            <IdentitySection
              formData={formData}
              isChanged={isChanged}
              updateField={updateField}
            />

            <div className={styles.divider} />

            <LocationSection
              formData={formData}
              isChanged={isChanged}
              updateField={updateField}
            />

            <div className={styles.divider} />

            <AddressSection
              formData={formData}
              isChanged={isChanged}
              updateField={updateField}
            />

            <div className={styles.divider} />

            <ContactSection
              formData={formData}
              isChanged={isChanged}
              updateField={updateField}
            />

            <div className={styles.divider} />

            <HeroImageSection
              image={formData?.image ?? null}
              onChange={handleImageChange}
            />

            <div className={styles.divider} />

            <TagsSection
              tags={formData?.tags ?? []}
              onChange={handleTagsChange}
            />

            <div className={styles.divider} />

            <PublishingSection
              status={originalMeta?.status}
              publishedAt={originalMeta?.publishedAt}
            />

            <div className={styles.divider} />

            <TimestampsSection
              createdAt={originalMeta?.createdAt}
              updatedAt={originalMeta?.updatedAt}
            />

            <div className={styles.footerActions}>
              <button
                className="btn btn-outline"
                type="button"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleSaveMeta}
              >
                Save Meta
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
