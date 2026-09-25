import type { EntityAuditCMSDto } from "../../../ShrineEditor/components/EditorArea/components/tabs/kami/kamiApi";
import type { ImageFormValues } from "../helpers/ImageSection.types";
import ImageForm from "../ImageForm";
import styles from "./ImageSection.module.css";

type ImageSectionProps = {
  title?: string;
  image: ImageFormValues;
  previewUrl?: string | null;
  onImageChange: (nextImage: ImageFormValues) => void;
  onFileChange: (file: File | null) => void;
  onRemoveImage: () => void;
  isReadOnly: boolean;
  entityAudit?: EntityAuditCMSDto | null | undefined;
};

export default function ImageSection({
  title = "Image",
  image,
  previewUrl,
  onImageChange,
  onFileChange,
  onRemoveImage,
  isReadOnly,
  entityAudit,
}: ImageSectionProps) {
  const missingImageIssue = !previewUrl
    ? (entityAudit?.issues?.find(
        (issue) =>
          issue.field === "Image" &&
          issue.severity === "Warning" &&
          issue.relatedItemType == null &&
          issue.relatedItemId == null,
      )?.message ?? null)
    : null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleArea}>
          <p className={styles.sectionTitle}>{title}</p>
          {missingImageIssue && (
            <p className="warningPill">{missingImageIssue}</p>
          )}
        </div>

        {previewUrl && !isReadOnly && (
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={onRemoveImage}
          >
            Remove
          </button>
        )}
      </div>

      <ImageForm
        values={image}
        previewUrl={previewUrl}
        onChange={onImageChange}
        onFileChange={onFileChange}
        isReadOnly={isReadOnly}
        showUpload={true}
        entityAudit={entityAudit}
      />
    </div>
  );
}
