import type { EntityAuditCMSDto } from "../../ShrineEditor/components/EditorArea/components/tabs/kami/kamiApi";
import CitationForm from "../citations/CitationForm";
import styles from "./ImageForm.module.css";
import type { ImageFormValues } from "./helpers/ImageSection.types";

type ImageFormProps = {
  values: ImageFormValues;
  previewUrl?: string | null;
  onChange: (next: ImageFormValues) => void;
  onFileChange: (file: File | null) => void;
  isReadOnly: boolean;
  showUpload?: boolean;
  entityAudit?: EntityAuditCMSDto | null | undefined;
};

export default function ImageForm({
  values,
  previewUrl,
  onChange,
  onFileChange,
  isReadOnly,
  showUpload,
  entityAudit,
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

  const titleError = previewUrl
    ? !values.title.trim()
      ? (entityAudit?.issues?.find(
          (issue) =>
            issue.field === "Title" &&
            issue.severity === "Error" &&
            issue.relatedItemType === "Image" &&
            issue.relatedItemId === values.imgId,
        )?.message ?? "Image is missing title.")
      : null
    : null;

  const missingImageCitationError = previewUrl
    ? (entityAudit?.issues?.find(
        (issue) =>
          issue.field === "Citation" &&
          issue.severity === "Error" &&
          issue.relatedItemType === "Image" &&
          issue.relatedItemId === values.imgId,
      )?.message ?? null)
    : null;

  return (
    <div className={styles.wrapper}>
      {!isReadOnly && (values.imgId === undefined || showUpload) && (
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
              className={`input${titleError ? " input-error" : ""}`}
              type="text"
              value={values.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder={isReadOnly ? "null" : "Enter image title"}
              disabled={isReadOnly}
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? "image-title-error" : undefined}
            />
            {titleError && (
              <p id="image-title-error" className="field-error">
                {titleError}
              </p>
            )}
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
        <div className={styles.titleArea}>
          <p className={styles.sectionTitle}>Image Citation</p>
          {missingImageCitationError && (
            <p className="errorPill">{missingImageCitationError}</p>
          )}
        </div>
        <CitationForm
          values={values.citation}
          onChange={handleCitationChange}
          isReadOnly={isReadOnly}
          entityAudit={entityAudit}
          needsAuditDisplay={previewUrl ? true : false}
        />
      </div>
    </div>
  );
}
