import styles from "../SideMeta.module.css";
import type { ShrineMetaDto } from "../../../ShrineEditorApi";

type ContactSectionProps = {
  formData: ShrineMetaDto | null;
  isChanged: <K extends keyof ShrineMetaDto>(field: K) => boolean;
  updateField: <K extends keyof ShrineMetaDto>(
    field: K,
    value: ShrineMetaDto[K],
  ) => void;
  isReadOnly: boolean;
};

export default function ContactSection({
  formData,
  isChanged,
  updateField,
  isReadOnly,
}: ContactSectionProps) {
  return (
    <div className={styles.block}>
      <p className={styles.blockTitle}>Contact</p>

      <div className="form-group">
        <label className="label" htmlFor="phoneNumber">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          className={`input ${isChanged("phoneNumber") ? styles.changedInput : ""}`}
          type="text"
          placeholder={isReadOnly ? "null" : "+81 ..."}
          value={formData?.phoneNumber ?? ""}
          onChange={(e) => updateField("phoneNumber", e.target.value)}
          disabled={isReadOnly}
        />
      </div>

      <div className="form-group">
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className={`input ${isChanged("email") ? styles.changedInput : ""}`}
          type="email"
          placeholder={isReadOnly ? "null" : "contact@example.jp"}
          value={formData?.email ?? ""}
          onChange={(e) => updateField("email", e.target.value)}
          disabled={isReadOnly}
        />
      </div>

      <div className="form-group">
        <label className="label" htmlFor="website">
          Website
        </label>
        <input
          id="website"
          className={`input ${isChanged("website") ? styles.changedInput : ""}`}
          type="url"
          placeholder={isReadOnly ? "null" : "https://..."}
          value={formData?.website ?? ""}
          onChange={(e) => updateField("website", e.target.value)}
          disabled={isReadOnly}
        />
      </div>
    </div>
  );
}
