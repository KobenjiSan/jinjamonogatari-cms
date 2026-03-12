import CitationForm from "../citations/CitationForm";
import styles from "./ImageForm.module.css";

type CitationFormValues = {
  title: string;
  author: string;
  url: string;
  year: string;

  // readonly cms fields
  citeId?: number;
  createdAt?: string;
  updatedAt?: string;
};

type ImageFormValues = {
  imageUrl: string;
  title: string;
  desc: string;
  citation: CitationFormValues;

  // readonly cms fields
  imgId?: number;
  createdAt?: string;
  updatedAt?: string;
};

type ImageFormProps = {
  values: ImageFormValues;
  previewUrl?: string | null;
  onChange: (next: ImageFormValues) => void;
  onFileChange: (file: File | null) => void;
};

export default function ImageForm({
  values,
  previewUrl,
  onChange,
  onFileChange,
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

  function handleCitationChange(nextCitation: CitationFormValues) {
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
              placeholder="Enter image title"
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
              placeholder="Enter image description"
              rows={6}
            />
          </div>
        </div>
      </div>

      <div className={styles.citationSection}>
        <p className={styles.sectionTitle}>Citation</p>
        <CitationForm
          values={values.citation}
          onChange={handleCitationChange}
        />
      </div>
    </div>
  );
}