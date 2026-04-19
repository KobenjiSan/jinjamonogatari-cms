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
};

export default function ImageSection({
  title = "Image",
  image,
  previewUrl,
  onImageChange,
  onFileChange,
  onRemoveImage,
  isReadOnly,
}: ImageSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTitle}>{title}</p>

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
      />
    </div>
  );
}
