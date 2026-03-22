import { useEffect, useMemo, useState } from "react";

import BaseModal from "../../../../../../shared/components/modal/BaseModal";
import ImageForm from "../../../../../shared/images/ImageForm";
import { emptyImage, mapImageToForm } from "../../../../../shared/images/helpers/ImageSection.helper";
import type { ImageFormValues } from "../../../../../shared/images/helpers/ImageSection.types";
import styles from "./HeroImageSection.module.css";

import {
  buildHeroImagePayload,
  getImagePreviewClassName,
} from "./helpers/HeroImageSection.helpers";
import type {
  HeroImageSectionProps,
} from "./helpers/HeroImageSection.types";

export default function HeroImageSection({
  image,
  onChange,
}: HeroImageSectionProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageForm, setImageForm] = useState<ImageFormValues>(emptyImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const hasActiveImage = !!image && !image.isRemoved;

  function openAddImageModal() {
    setImageForm(emptyImage);
    setSelectedFile(null);
    setIsImageModalOpen(true);
  }

  function openEditImageModal() {
    setImageForm(mapImageToForm(image));
    setSelectedFile(null);
    setIsImageModalOpen(true);
  }

  function closeImageModal() {
    setIsImageModalOpen(false);
    setImageForm(emptyImage);
    setSelectedFile(null);
  }

  const previewUrl = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }

    return imageForm.imageUrl || null;
  }, [selectedFile, imageForm.imageUrl]);

  useEffect(() => {
    return () => {
      if (selectedFile && previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [selectedFile, previewUrl]);

  function handleSaveImage() {
    const nextImage = buildHeroImagePayload(image, imageForm, selectedFile);
    onChange(nextImage);
    closeImageModal();
  }

  function handleRemoveImage() {
    if (!image) {
      onChange(null);
      closeImageModal();
      return;
    }

    if (image.isNew) {
      onChange(null);
      closeImageModal();
      return;
    }

    onChange({
      ...image,
      isRemoved: true,
      isEdited: true,
    });

    closeImageModal();
  }

  return (
    <>
      <div className={styles.block}>
        <p className={styles.blockTitle}>Hero Image</p>

        <div className={getImagePreviewClassName(
            image,
            styles.imagePreview,
            styles.changedInput
          )}
        >
          {hasActiveImage && image?.imageUrl ?  (
            <img
              src={image.imageUrl}
              alt={image.title ?? "Hero image"}
              className={styles.heroImage}
            />
          ) : (
            <span
              className={`text-sm text-secondary ${
                image?.isNew || image?.isEdited || image?.isRemoved
                  ? styles.changedInputText
                  : ""
              }`}
            >
              No hero image selected
            </span>
          )}
        </div>

        <button
          type="button"
          className="btn btn-outline"
          onClick={hasActiveImage ? openEditImageModal : openAddImageModal}
        >
          {hasActiveImage ? "Edit Hero Image" : "Add Hero Image"}
        </button>
      </div>

      <BaseModal
        isOpen={isImageModalOpen}
        title={hasActiveImage ? "Edit Hero Image" : "Add Hero Image"}
        onClose={closeImageModal}
        footer={
          <div className={styles.modalFooterArea}>
            <div>
              {hasActiveImage ? (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </button>
              ) : null}
            </div>

            <div className={styles.modalFooterBasic}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeImageModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveImage}
              >
                {hasActiveImage ? "Save Image" : "Add Image"}
              </button>
            </div>
          </div>
        }
      >
        <ImageForm
          values={imageForm}
          previewUrl={previewUrl}
          onChange={setImageForm}
          onFileChange={setSelectedFile}
        />
      </BaseModal>
    </>
  );
}
