import type { EntityAuditCMSDto } from "../../../kamiApi";
import styles from "../KamiEditForm.module.css";
import type { KamiFormValues } from "../helpers/KamiForm.types";

type KamiDetailsSectionProps = {
  values: Pick<KamiFormValues, "nameEn" | "nameJp" | "desc">;
  onFieldChange: (
    field: keyof Pick<KamiFormValues, "nameEn" | "nameJp" | "desc">,
    value: string,
  ) => void;
  isReadOnly: boolean;
  entityAudit: EntityAuditCMSDto | null | undefined;
};

export default function KamiDetailsSection({
  values,
  onFieldChange,
  isReadOnly,
  entityAudit,
}: KamiDetailsSectionProps) {
  const nameEnError = !values.nameEn.trim()
    ? entityAudit?.issues?.find(
        (issue) => issue.field === "NameEn" && issue.severity === "Error"
      )?.message ?? "English name is required."
    : null;

  const nameJpError = !values.nameJp.trim()
    ? entityAudit?.issues?.find(
        (issue) => issue.field === "NameJp" && issue.severity === "Error"
      )?.message ?? "Japanese name is required."
    : null;

  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Kami Details</p>

      <div className="form-group">
        <label htmlFor="kami-name-en" className="label">
          English Name
        </label>
        <input
          id="kami-name-en"
          className={`input${nameEnError ? " input-error" : ""}`}
          type="text"
          value={values.nameEn}
          onChange={(e) => onFieldChange("nameEn", e.target.value)}
          placeholder="Enter English name"
          disabled={isReadOnly}
          aria-invalid={Boolean(nameEnError)}
          aria-describedby={nameEnError ? "kami-name-en-error" : undefined}
        />
        {nameEnError && (
          <p id="kami-name-en-error" className="field-error">
            {nameEnError}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="kami-name-jp" className="label">
          Japanese Name
        </label>
        <input
          id="kami-name-jp"
          className={`input${nameJpError ? " input-error" : ""}`}
          type="text"
          value={values.nameJp}
          onChange={(e) => onFieldChange("nameJp", e.target.value)}
          placeholder="Enter Japanese name"
          disabled={isReadOnly}
          aria-invalid={Boolean(nameJpError)}
          aria-describedby={nameJpError ? "kami-name-jp-error" : undefined}
        />
        {nameJpError && (
          <p id="kami-name-jp-error" className="field-error">
            {nameJpError}
          </p>
        )}
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
          disabled={isReadOnly}
        />
      </div>
    </div>
  );
}
