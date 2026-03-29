import CitationForm from "../citations/CitationForm";
import styles from "./ImageForm.module.css";
import type { ImageFormValues } from "./helpers/ImageSection.types";

type ImageFormProps = {
  values: ImageFormValues;
  previewUrl?: string | null;
  onChange: (next: ImageFormValues) => void;
  onFileChange: (file: File | null) => void;
  isReadOnly: boolean;
};

export default function ImageForm({
  values,
  previewUrl,
  onChange,
  onFileChange,
  isReadOnly,
}: ImageFormProps) {
  function handleFieldChange(
    field: keyof Omit<
      ImageFormValues,
      "citation" | "imgId" | "createdAt" | "updatedAt"
    >,
    value: string,
  ) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  function handleCitationChange(nextCitation: ImageFormValues["citation"]) {
    onChange({
      ...values,
      citation: nextCitation,
    });
  }

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onFileChange(file);
  }

  return (
    <div className={styles.wrapper}>
      {!isReadOnly && (
        <div className="form-group">
          <label htmlFor="image-upload" className="label">
            Upload Image
          </label>
          <input
            id="image-upload"
            className="input"
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
          />
        </div>
      )}

      <div className={styles.mainRow}>
        <div className={styles.previewSection}>
          <label className="label">Preview</label>

          <div className={styles.previewBox}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={values.title || "Selected preview"}
                className={styles.previewImage}
              />
            ) : (
              <span className="text-sm text-secondary">No image selected</span>
            )}
          </div>

          {values.imgId !== undefined && (
            <div className="text-xs text-secondary">
              Image ID: {values.imgId}
            </div>
          )}

          {values.imageUrl && (
            <div className="text-xs text-secondary">
              Source URL: {values.imageUrl}
            </div>
          )}

          {values.createdAt && values.updatedAt && (
            <div className="text-xs text-secondary">
              Created: {values.createdAt}
              <br />
              Updated: {values.updatedAt}
            </div>
          )}
        </div>

        <div className={styles.detailsSection}>
          <div className="form-group">
            <label htmlFor="image-title" className="label">
              Title
            </label>
            <input
              id="image-title"
              className="input"
              type="text"
              value={values.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder={isReadOnly ? "null" : "Enter image title"}
              disabled={isReadOnly}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image-desc" className="label">
              Description
            </label>
            <textarea
              id="image-desc"
              className={`input ${styles.textarea}`}
              value={values.desc}
              onChange={(e) => handleFieldChange("desc", e.target.value)}
              placeholder={isReadOnly ? "null" : "Enter image description"}
              rows={6}
              disabled={isReadOnly}
            />
          </div>
        </div>
      </div>

      <div className={styles.citationSection}>
        <p className={styles.sectionTitle}>Image Citation</p>
        <CitationForm
          values={values.citation}
          onChange={handleCitationChange}
          isReadOnly={isReadOnly}
        />
      </div>
    </div>
  );
}
