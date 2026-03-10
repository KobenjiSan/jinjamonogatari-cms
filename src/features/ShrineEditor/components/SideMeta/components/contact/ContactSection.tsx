import styles from "../../SideMeta.module.css";
import type { ShrineMetaDto } from "../../../../ShrineEditorApi";

type ContactSectionProps = {
  formData: ShrineMetaDto | null;
  isChanged: <K extends keyof ShrineMetaDto>(field: K) => boolean;
  updateField: <K extends keyof ShrineMetaDto>(
    field: K,
    value: ShrineMetaDto[K]
  ) => void;
};

export default function ContactSection({
  formData,
  isChanged,
  updateField,
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
          placeholder="+81 ..."
          value={formData?.phoneNumber ?? ""}
          onChange={(e) => updateField("phoneNumber", e.target.value)}
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
          placeholder="contact@example.jp"
          value={formData?.email ?? ""}
          onChange={(e) => updateField("email", e.target.value)}
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
          placeholder="https://..."
          value={formData?.website ?? ""}
          onChange={(e) => updateField("website", e.target.value)}
        />
      </div>
    </div>
  );
}