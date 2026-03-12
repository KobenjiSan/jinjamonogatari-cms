import styles from "../KamiEditForm.module.css";
import type { KamiFormValues } from "../helpers/KamiForm.types";

type KamiDetailsSectionProps = {
  values: Pick<KamiFormValues, "nameEn" | "nameJp" | "desc">;
  onFieldChange: (
    field: keyof Pick<KamiFormValues, "nameEn" | "nameJp" | "desc">,
    value: string,
  ) => void;
};

export default function KamiDetailsSection({
  values,
  onFieldChange,
}: KamiDetailsSectionProps) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Kami Details</p>

      <div className="form-group">
        <label htmlFor="kami-name-en" className="label">
          English Name
        </label>
        <input
          id="kami-name-en"
          className="input"
          type="text"
          value={values.nameEn}
          onChange={(e) => onFieldChange("nameEn", e.target.value)}
          placeholder="Enter English name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="kami-name-jp" className="label">
          Japanese Name
        </label>
        <input
          id="kami-name-jp"
          className="input"
          type="text"
          value={values.nameJp}
          onChange={(e) => onFieldChange("nameJp", e.target.value)}
          placeholder="Enter Japanese name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="kami-desc" className="label">
          Description
        </label>
        <textarea
          id="kami-desc"
          className={`input ${styles.textarea}`}
          rows={6}
          value={values.desc}
          onChange={(e) => onFieldChange("desc", e.target.value)}
          placeholder="Enter kami description"
        />
      </div>
    </div>
  );
}