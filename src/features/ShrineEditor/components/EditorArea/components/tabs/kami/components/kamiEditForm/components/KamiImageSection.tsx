import ImageForm from "../../../../../../../../../shared/images/ImageForm";
import styles from "../KamiEditForm.module.css";

import type { ImageFormValues } from "../helpers/KamiForm.types";

type KamiImageSectionProps = {
  image: ImageFormValues;
  previewUrl?: string | null;
  onImageChange: (nextImage: ImageFormValues) => void;
  onFileChange: (file: File | null) => void;
};

export default function KamiImageSection({
  image,
  previewUrl,
  onImageChange,
  onFileChange,
}: KamiImageSectionProps) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Image</p>

      <ImageForm
        values={image}
        previewUrl={previewUrl}
        onChange={onImageChange}
        onFileChange={onFileChange}
      />
    </div>
  );
}