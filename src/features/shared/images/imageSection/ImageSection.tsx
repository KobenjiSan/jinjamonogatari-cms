import ImageForm from "../ImageForm";
import styles from "./ImageSection.module.css";
import type { ImageSectionProps } from "../helpers/ImageSection.types";

export default function ImageSection({
  title = "Image",
  image,
  previewUrl,
  onImageChange,
  onFileChange,
  isReadOnly,
}: ImageSectionProps) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>{title}</p>

      <ImageForm
        values={image}
        previewUrl={previewUrl}
        onChange={onImageChange}
        onFileChange={onFileChange}
        isReadOnly={isReadOnly}
      />
    </div>
  );
}
