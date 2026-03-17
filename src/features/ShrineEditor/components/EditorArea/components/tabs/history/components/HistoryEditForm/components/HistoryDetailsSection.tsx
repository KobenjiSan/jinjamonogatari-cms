import styles from "../HistoryEditForm.module.css";
import type { HistoryFormValues } from "../helpers/HistoryForm.types";

type HistoryDetailsSectionProps = {
  values: Pick<
    HistoryFormValues,
    "eventDate" | "sortOrder" | "title" | "information"
  >;
  onFieldChange: (
    field: keyof Pick<
      HistoryFormValues,
      "eventDate" | "sortOrder" | "title" | "information"
    >,
    value: string,
  ) => void;
};

export default function HistoryDetailsSection({
  values,
  onFieldChange,
}: HistoryDetailsSectionProps) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>History Details</p>

      <div className="form-group">
        <label htmlFor="history-event-date" className="label">
          Event Date
        </label>
        <input
          id="history-event-date"
          className="input"
          type="date"
          value={values.eventDate}
          onChange={(e) => onFieldChange("eventDate", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="history-sort-order" className="label">
          Sort Order
        </label>
        <input
          id="history-sort-order"
          className="input"
          type="number"
          value={values.sortOrder}
          onChange={(e) => onFieldChange("sortOrder", e.target.value)}
          placeholder="Enter sort order"
        />
      </div>

      <div className="form-group">
        <label htmlFor="history-title" className="label">
          Title
        </label>
        <input
          id="history-title"
          className="input"
          type="text"
          value={values.title}
          onChange={(e) => onFieldChange("title", e.target.value)}
          placeholder="Enter history title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="history-information" className="label">
          Information
        </label>
        <textarea
          id="history-information"
          className={`input ${styles.textarea}`}
          rows={6}
          value={values.information}
          onChange={(e) => onFieldChange("information", e.target.value)}
          placeholder="Enter history information"
        />
      </div>
    </div>
  );
}