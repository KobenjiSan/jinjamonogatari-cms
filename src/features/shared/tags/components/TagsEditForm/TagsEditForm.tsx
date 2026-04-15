import { useEffect, useState } from "react";
import type { TagCMSDto } from "../../tagApi";
import styles from "./TagsEditForm.module.css";

export type TagFormValues = {
  titleEn: string;
  titleJp: string;
};

export const emptyTagForm: TagFormValues = {
  titleEn: "",
  titleJp: "",
};

export function mapTagToForm(tag: TagCMSDto | null): TagFormValues {
  if (!tag) return emptyTagForm;

  return {
    titleEn: tag.titleEn ?? "",
    titleJp: tag.titleJp ?? "",
  };
}

type TagsEditFormProps = {
  tag: TagCMSDto | null;
  onChange?: (nextForm: TagFormValues) => void;
};

export default function TagsEditForm({ tag, onChange }: TagsEditFormProps) {
  const [formValues, setFormValues] = useState<TagFormValues>(emptyTagForm);

  useEffect(() => {
    const mapped = mapTagToForm(tag);
    setFormValues(mapped);
    onChange?.(mapped);
  }, [tag, onChange]);

  function handleFieldChange(
    field: keyof Pick<TagFormValues, "titleEn" | "titleJp">,
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
    <div className={styles.wrapper}>
      <div className={styles.section}>

        <div className="form-group">
          <label htmlFor="title-en" className="label">
            Title (English)
          </label>
          <input
            id="title-en"
            className="input"
            type="text"
            value={formValues.titleEn}
            onChange={(e) => handleFieldChange("titleEn", e.target.value)}
            placeholder="Inari"
          />
        </div>

        <div className="form-group">
          <label htmlFor="title-jp" className="label">
            Title (Japanese)
          </label>
          <input
            id="title-jp"
            className="input"
            type="text"
            value={formValues.titleJp}
            onChange={(e) => handleFieldChange("titleJp", e.target.value)}
            placeholder="稲荷"
          />
        </div>
      </div>
    </div>
  );
}
