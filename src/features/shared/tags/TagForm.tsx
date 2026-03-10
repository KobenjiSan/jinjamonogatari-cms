type TagFormValues = {
  titleEn: string;
  titleJp: string;
};

type TagFormProps = {
  values: TagFormValues;
  onChange: (next: TagFormValues) => void;
};

export default function TagForm({ values, onChange }: TagFormProps) {
  function handleFieldChange(field: keyof TagFormValues, value: string) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  return(
    <div className="column gap-lg">
      <div className="form-group">
        <label htmlFor="tag-title-en" className="label">
          Title (English)
        </label>
        <input
          id="tag-title-en"
          className="input"
          type="text"
          value={values.titleEn}
          onChange={(e) => handleFieldChange("titleEn", e.target.value)}
          placeholder="Enter English title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="tag-title-jp" className="label">
          Title (Japanese)
        </label>
        <input
          id="tag-title-jp"
          className="input"
          type="text"
          value={values.titleJp}
          onChange={(e) => handleFieldChange("titleJp", e.target.value)}
          placeholder="Enter Japanese title"
        />
      </div>
    </div>
  );
}
