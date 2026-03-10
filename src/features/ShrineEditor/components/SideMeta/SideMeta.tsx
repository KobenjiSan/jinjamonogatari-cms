import styles from "./SideMeta.module.css";
import { useEffect, useState } from "react";
import { getShrineMetaById, type ShrineMetaDto } from "../../ShrineEditorApi";
import { MdModeEdit } from "react-icons/md";

import SystemSection from "./components/system/SystemSection";
import IdentitySection from "./components/identity/IdentitySection";
import LocationSection from "./components/location/LocationSection";
import AddressSection from "./components/address/AddressSection";
import ContactSection from "./components/contact/ContactSection";
import TagsSection from "./components/tags/TagSection";
import PublishingSection from "./components/publishing/PublishingSection";
import TimestampsSection from "./components/timestamps/TimestampsSection";

type SideMetaProps = {
  shrineId: number;
};

export default function SideMeta({ shrineId }: SideMetaProps) {
  const [originalMeta, setOriginalMeta] = useState<ShrineMetaDto | null>(null);
  const [formData, setFormData] = useState<ShrineMetaDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeta() {
      setLoading(true);

      try {
        const result = await getShrineMetaById(shrineId);
        setOriginalMeta(result);
        setFormData(result);
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

  function handleTagsChange(nextTags: ShrineMetaDto["tags"]) {
    setFormData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        tags: nextTags,
      };
    });
  }

  function isChanged<K extends keyof ShrineMetaDto>(field: K) {
    if (!formData || !originalMeta) return false;
    return formData[field] !== originalMeta[field];
  }

  function handleReset() {
    if (!originalMeta) return;
    setFormData(originalMeta);
  }

  function formatAddress(data?: ShrineMetaDto | null) {
    if (!data) return "—";

    const line1Parts = [data.locality, data.ward].filter(Boolean);
    const line2Parts = [data.city, data.prefecture].filter(Boolean);
    const line3 = [data.postalCode, data.country].filter(Boolean).join(", ");

    return (
      [line1Parts.join(", "), line2Parts.join(", "), line3]
        .filter(Boolean)
        .join("\n") || "—"
    );
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
              formatAddress={formatAddress}
            />

            <div className={styles.divider} />

            <ContactSection
              formData={formData}
              isChanged={isChanged}
              updateField={updateField}
            />

            <div className={styles.divider} />

            <div className={styles.block}>
              <p className={styles.blockTitle}>Hero Image</p>

              <div className={styles.imagePreview}>
                {formData?.image?.imageUrl ? (
                  <>
                    <img
                      src={formData.image.imageUrl}
                      alt={formData.image.title ?? "Hero image"}
                      className={styles.heroImage}
                    />

                    <button type="button" className={styles.imageAction}>
                      <MdModeEdit />
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-secondary">
                    No hero image selected
                  </span>
                )}
              </div>

              <button type="button" className="btn btn-outline">
                {formData?.image ? "Replace Hero Image" : "Add Hero Image"}
              </button>
            </div>

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
              <button className="btn btn-primary" type="button">
                Save Meta
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
