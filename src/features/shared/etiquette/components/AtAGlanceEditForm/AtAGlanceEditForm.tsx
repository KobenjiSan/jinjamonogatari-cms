import { useEffect, useState } from "react";
import type { AtAGlanceDto } from "../../etiquetteApi";
import styles from "./AtAGlanceEditForm.module.css";

export type AtAGlanceFormValues = {
  titleShort: string;
  iconKey: string;
  iconSet: string;
  glanceOrder: string;
};

export const emptyAtAGlanceForm: AtAGlanceFormValues = {
  titleShort: "",
  iconKey: "",
  iconSet: "",
  glanceOrder: "",
};

export function mapAtAGlanceToForm(
  item: AtAGlanceDto | null,
): AtAGlanceFormValues {
  if (!item) return emptyAtAGlanceForm;

  return {
    titleShort: item.titleShort ?? "",
    iconKey: item.iconKey ?? "",
    iconSet: item.iconSet ?? "",
    glanceOrder: item.glanceOrder?.toString() ?? "",
  };
}

type AtAGlanceEditFormProps = {
  topic: AtAGlanceDto | null;
  onChange?: (nextForm: AtAGlanceFormValues) => void;
};

export function AtAGlanceEditForm({ topic, onChange }: AtAGlanceEditFormProps) {
  const [formValues, setFormValues] =
    useState<AtAGlanceFormValues>(emptyAtAGlanceForm);

  useEffect(() => {
    const mapped = mapAtAGlanceToForm(topic);
    setFormValues(mapped);
    onChange?.(mapped);
  }, [topic, onChange]);

  function handleFieldChange(
    field: keyof Pick<
      AtAGlanceFormValues,
      "titleShort" | "iconKey" | "iconSet" | "glanceOrder"
    >,
    value: string,
  ) {
    setFormValues((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      onChange?.(next);
      return next;
    });
  }

  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>
        Editing "{topic?.titleLong}"
      </p>

      <div className="form-group">
        <label htmlFor="sort-order" className="label">
          Sort Order
        </label>
        <input
          id="sort-order"
          className="input"
          type="number"
          value={formValues.glanceOrder!}
          onChange={(e) => handleFieldChange("glanceOrder", e.target.value)}
          placeholder="Enter Glance Order"
        />
      </div>

      <div className="form-group">
        <label htmlFor="short-title" className="label">
          Short Title
        </label>
        <input
          id="short-title"
          className="input"
          type="text"
          value={formValues.titleShort!}
          onChange={(e) => handleFieldChange("titleShort", e.target.value)}
          placeholder="Enter short title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="icon-key" className="label">
          Icon Key
        </label>
        <input
          id="icon-key"
          className="input"
          type="text"
          value={formValues.iconKey!}
          onChange={(e) => handleFieldChange("iconKey", e.target.value)}
          placeholder="Enter Icon Key"
        />
      </div>

      <div className="form-group">
        <label htmlFor="icon-set" className="label">
          Icon Set
        </label>
        <input
          id="icon-set"
          className="input"
          type="text"
          value={formValues.iconSet!}
          onChange={(e) => handleFieldChange("iconSet", e.target.value)}
          placeholder="Enter Icon Set"
        />
      </div>
    </div>
  );
}
