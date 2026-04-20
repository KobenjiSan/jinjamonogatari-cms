import { useEffect, useMemo, useState } from "react";
import styles from "./HeroImageSection.module.css";
import HeroImageModal from "./components/HeroImageModal/HeroImageModal";
import type { ImageFullDto } from "../../../../ShrineEditorApi";

export type HeroImageSectionProps = {
  shrineId: number;
  image: ImageFullDto | null;
  onChange: (nextImage: ImageFullDto | null) => void;
  isReadOnly: boolean;
};

export default function HeroImageSection({
  shrineId,
  image,
  onChange,
  isReadOnly,
}: HeroImageSectionProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const hasActiveImage = !!image;

  function openImageModal() {
    setIsImageModalOpen(true);
  }

  function closeImageModal() {
    setIsImageModalOpen(false);
  }
  
  const previewUrl = useMemo(() => {
    return image?.imageUrl || null;
  }, [image?.imageUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      <div className={styles.block}>
        <p className={styles.blockTitle}>Hero Image</p>

        <div
          className={styles.imagePreview}
        >
          {hasActiveImage && image?.imageUrl ? (
            <img
              src={image.imageUrl}
              alt={image.title ?? "Hero image"}
              className={styles.heroImage}
            />
          ) : (
            <span
              className={`text-sm text-secondary`}
            >
              No hero image selected
            </span>
          )}
        </div>

        <button
          type="button"
          className="btn btn-outline"
          onClick={openImageModal}
        >
          {hasActiveImage
            ? `${isReadOnly ? "View Hero Image" : "Edit Hero Image"}`
            : "Add Hero Image"}
        </button>
      </div>

      <HeroImageModal 
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        onChange={onChange}
        isReadOnly={isReadOnly}
        image={image}
        shrineId={shrineId}
      />
    </>
  );
}
