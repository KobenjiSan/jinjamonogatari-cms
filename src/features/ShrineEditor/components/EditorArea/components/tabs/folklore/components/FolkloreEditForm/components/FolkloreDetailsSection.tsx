import styles from "../FolkloreEditForm.module.css";
import type { FolkloreFormValues } from "../helpers/FolkloreForm.types";

type FolkloreDetailsSectionProps = {
  values: Pick<FolkloreFormValues, "sortOrder" | "title" | "information">;
  onFieldChange: (
    field: keyof Pick<
      FolkloreFormValues,
      "sortOrder" | "title" | "information"
    >,
    value: string,
  ) => void;
  isReadOnly: boolean;
};

export default function FolkloreDetailsSection({
  values,
  onFieldChange,
  isReadOnly,
}: FolkloreDetailsSectionProps) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Folklore Details</p>

      <div className="form-group">
        <label htmlFor="folklore-sort-order" className="label">
          Sort Order
        </label>
        <input
          id="folklore-sort-order"
          className="input"
          type="number"
          value={values.sortOrder}
          onChange={(e) => onFieldChange("sortOrder", e.target.value)}
          placeholder={isReadOnly ? "null" : "Enter sort order"}
          disabled={isReadOnly}
        />
      </div>

      <div className="form-group">
        <label htmlFor="folklore-title" className="label">
          Title
        </label>
        <input
          id="folklore-title"
          className="input"
          type="text"
          value={values.title}
          onChange={(e) => onFieldChange("title", e.target.value)}
          placeholder="Enter folklore title"
          disabled={isReadOnly}
        />
      </div>

      <div className="form-group">
        <label htmlFor="folklore-information" className="label">
          Information
        </label>
        <textarea
          id="folklore-information"
          className={`input ${styles.textarea}`}
          rows={6}
          value={values.information}
          onChange={(e) => onFieldChange("information", e.target.value)}
          placeholder="Enter folklore information"
          disabled={isReadOnly}
        />
      </div>
    </div>
  );
}
