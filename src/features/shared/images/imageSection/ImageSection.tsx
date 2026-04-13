import type { ImageFormValues } from "../helpers/ImageSection.types";
import ImageForm from "../ImageForm";
import styles from "./ImageSection.module.css";

type ImageSectionProps = {
  title?: string;
  image: ImageFormValues;
  previewUrl?: string | null;
  onImageChange: (nextImage: ImageFormValues) => void;
  onFileChange: (file: File | null) => void;
  isReadOnly: boolean;
};

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
