import styles from "../SideMeta.module.css";
import type { ShrineMetaDto } from "../../../ShrineEditorApi";

type IdentitySectionProps = {
  formData: ShrineMetaDto | null;
  isChanged: <K extends keyof ShrineMetaDto>(field: K) => boolean;
  updateField: <K extends keyof ShrineMetaDto>(
    field: K,
    value: ShrineMetaDto[K],
  ) => void;
  isReadOnly: boolean;
};

export default function IdentitySection({
  formData,
  isChanged,
  updateField,
  isReadOnly,
}: IdentitySectionProps) {
  return (
    <div className={styles.block}>
      <p className={styles.blockTitle}>Identity</p>

      <div className="form-group">
        <label className="label" htmlFor="slug">
          Slug
        </label>
        <input
          id="slug"
          className={`input ${isChanged("slug") ? styles.changedInput : ""}`}
          type="text"
          placeholder="fushimi-inari-taisha"
          value={formData?.slug ?? ""}
          onChange={(e) => updateField("slug", e.target.value)}
          disabled={isReadOnly}
        />
      </div>

      <div className="form-group">
        <label className="label" htmlFor="nameEn">
          Name (English)
        </label>
        <input
          id="nameEn"
          className={`input ${isChanged("nameEn") ? styles.changedInput : ""}`}
          type="text"
          placeholder="Fushimi Inari Taisha"
          value={formData?.nameEn ?? ""}
          onChange={(e) => updateField("nameEn", e.target.value)}
          disabled={isReadOnly}
        />
      </div>

      <div className="form-group">
        <label className="label" htmlFor="nameJp">
          Name (Japanese)
        </label>
        <input
          id="nameJp"
          className={`input ${isChanged("nameJp") ? styles.changedInput : ""}`}
          type="text"
          placeholder="伏見稲荷大社"
          value={formData?.nameJp ?? ""}
          onChange={(e) => updateField("nameJp", e.target.value)}
          disabled={isReadOnly}
        />
      </div>

      <div className="form-group">
        <label className="label" htmlFor="shrineDesc">
          Description
        </label>
        <textarea
          id="shrineDesc"
          className={`textarea ${styles.textareaSlim} ${isChanged("shrineDesc") ? styles.changedInput : ""}`}
          rows={5}
          placeholder="Short shrine description..."
          value={formData?.shrineDesc ?? ""}
          onChange={(e) => updateField("shrineDesc", e.target.value)}
          disabled={isReadOnly}
        />
      </div>
    </div>
  );
}
