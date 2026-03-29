import styles from "./SideMeta.module.css";
import { useEffect, useState } from "react";
import {
  getShrineMetaById,
  updateShrineMeta,
  type ShrineMetaDto,
} from "../../ShrineEditorApi";

import SystemSection from "./components/SystemSection";
import IdentitySection from "./components/IdentitySection";
import LocationSection from "./components/LocationSection";
import AddressSection from "./components/AddressSection";
import ContactSection from "./components/ContactSection";
import TagsSection from "./components/tags/TagSection";
import PublishingSection from "./components/PublishingSection";
import TimestampsSection from "./components/TimestampsSection";
import HeroImageSection from "./components/image/HeroImageSection";
import type { EditableTag } from "./components/tags/helpers/TagSection.types";
import type { EditableHeroImage } from "./components/image/helpers/HeroImageSection.types";

import type { EditableShrineMeta } from "./helpers/SideMeta.types";
import {
  buildUpdateShrineMetaPayload,
  cloneShrineMeta,
} from "./helpers/SideMeta.helpers";

type SideMetaProps = {
  shrineId: number;
  onStatusChange?: (status: string) => void;
  onShrineNameChange?: (shrineName: string) => void;
  isReadOnly: boolean;
};

export default function SideMeta({
  shrineId,
  onStatusChange,
  onShrineNameChange,
  isReadOnly,
}: SideMetaProps) {
  const [originalMeta, setOriginalMeta] = useState<EditableShrineMeta | null>(null);
  const [formData, setFormData] = useState<EditableShrineMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeta() {
      setLoading(true);

      try {
        const result = await getShrineMetaById(shrineId);
        // cloning stops possible mutations from shared nested references (array or objects)
        setOriginalMeta(cloneShrineMeta(result));
        setFormData(cloneShrineMeta(result));

        if (result.status) {
          onStatusChange?.(result.status);
        }
        if (result.nameEn) {
          onShrineNameChange?.(result.nameEn);
        }
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
    setFormData(cloneShrineMeta(originalMeta));
  }

  async function handleSaveMeta() {
    if (isReadOnly) return; // block API calls in read-only mode
    if (!formData) return;
    const payload = buildUpdateShrineMetaPayload(formData);
    await updateShrineMeta(shrineId, payload);
    const refreshed = await getShrineMetaById(shrineId);
    setOriginalMeta(cloneShrineMeta(refreshed));
    setFormData(cloneShrineMeta(refreshed));

    if (refreshed.nameEn) {
      onShrineNameChange?.(refreshed.nameEn);
    }
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
              isReadOnly={isReadOnly}
            />

            <div className={styles.divider} />

            <LocationSection
              formData={formData}
              isChanged={isChanged}
              updateField={updateField}
              isReadOnly={isReadOnly}
            />

            <div className={styles.divider} />

            <AddressSection
              formData={formData}
              isChanged={isChanged}
              updateField={updateField}
              isReadOnly={isReadOnly}
            />

            <div className={styles.divider} />

            <ContactSection
              formData={formData}
              isChanged={isChanged}
              updateField={updateField}
              isReadOnly={isReadOnly}
            />

            <div className={styles.divider} />

            <HeroImageSection
              image={formData?.image ?? null}
              onChange={handleImageChange}
              isReadOnly={isReadOnly}
            />

            <div className={styles.divider} />

            <TagsSection
              tags={formData?.tags ?? []}
              onChange={handleTagsChange}
              isReadOnly={isReadOnly}
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

            {!isReadOnly && (
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
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
