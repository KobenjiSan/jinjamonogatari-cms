import { useEffect, useMemo, useState } from "react";
import { MdModeEdit } from "react-icons/md";

import BaseModal from "../../../../../../shared/components/modal/BaseModal";
import ImageForm from "../../../../../shared/images/ImageForm";
import styles from "./HeroImageSection.module.css";

import type { ImageFullDto } from "../../../../ShrineEditorApi";

type CitationFormValues = {
  title: string;
  author: string;
  url: string;
  year: string;
};

type ImageFormValues = {
  imageUrl: string;
  title: string;
  desc: string;
  citation: CitationFormValues;
};

export type EditableHeroImage = ImageFullDto & {
  file?: File | null;
  isNew?: boolean;
  isEdited?: boolean;
  isRemoved?: boolean;
};

type HeroImageSectionProps = {
  image: EditableHeroImage | null;
  onChange: (nextImage: EditableHeroImage | null) => void;
};

const emptyImageForm: ImageFormValues = {
  imageUrl: "",
  title: "",
  desc: "",
  citation: {
    title: "",
    author: "",
    url: "",
    year: "",
  },
};

function mapImageToForm(image: ImageFullDto | null): ImageFormValues {
  return {
    imageUrl: image?.imageUrl ?? "",
    title: image?.title ?? "",
    desc: image?.desc ?? "",
    citation: {
      title: image?.citation?.title ?? "",
      author: image?.citation?.author ?? "",
      url: image?.citation?.url ?? "",
      year: image?.citation?.year?.toString() ?? "",
    },
  };
}

export default function HeroImageSection({
  image,
  onChange,
}: HeroImageSectionProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageForm, setImageForm] = useState<ImageFormValues>(emptyImageForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function openAddImageModal() {
    setImageForm(emptyImageForm);
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
    setImageForm(emptyImageForm);
    setSelectedFile(null);
  }

  const previewUrl = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }

    return imageForm.imageUrl || null;
  }, [selectedFile, imageForm.imageUrl]);

  function getImagePreviewClassName() {
    if (image?.isNew || image?.isEdited || image?.isRemoved) {
      return `${styles.imagePreview} ${styles.changedInput}`;
    }

    return styles.imagePreview;
  }

  useEffect(() => {
    return () => {
      if (selectedFile && previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [selectedFile, previewUrl]);

  function handleSaveImage() {
    const trimmedTitle = imageForm.title.trim();
    const trimmedDesc = imageForm.desc.trim();

    const hasCitationChanges =
      (image?.citation?.title ?? "") !==
        (imageForm.citation.title.trim() || "") ||
      (image?.citation?.author ?? "") !==
        (imageForm.citation.author.trim() || "") ||
      (image?.citation?.url ?? "") !== (imageForm.citation.url.trim() || "") ||
      (image?.citation?.year?.toString() ?? "") !==
        (imageForm.citation.year.trim() || "");

    const hasImageChanges =
      !!selectedFile ||
      (image?.title ?? "") !== (trimmedTitle || "") ||
      (image?.desc ?? "") !== (trimmedDesc || "") ||
      hasCitationChanges;

    const nextImage: EditableHeroImage = {
      imgId: image?.imgId ?? Date.now(),
      imageUrl: image?.imageUrl ?? null,
      title: trimmedTitle || null,
      desc: trimmedDesc || null,
      citation:
        imageForm.citation.title.trim() ||
        imageForm.citation.author.trim() ||
        imageForm.citation.url.trim() ||
        imageForm.citation.year.trim()
          ? {
              citeId: image?.citation?.citeId ?? Date.now() + 1,
              title: imageForm.citation.title.trim() || null,
              author: imageForm.citation.author.trim() || null,
              url: imageForm.citation.url.trim() || null,
              year: imageForm.citation.year.trim()
                ? Number(imageForm.citation.year)
                : null,
            }
          : null,
      file: selectedFile,
      isNew: !image,
      isEdited: !!image && hasImageChanges,
    };

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

        <div className={getImagePreviewClassName()}>
          {image?.imageUrl && !image.isRemoved ? (
            <>
              <img
                src={image.imageUrl}
                alt={image.title ?? "Hero image"}
                className={styles.heroImage}
              />

              <button
                type="button"
                className={styles.imageAction}
                onClick={openEditImageModal}
                aria-label="Edit hero image"
              >
                <MdModeEdit />
              </button>
            </>
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
          onClick={openAddImageModal}
        >
          {image && !image.isRemoved ? "Replace Hero Image" : "Add Hero Image"}
        </button>
      </div>

      <BaseModal
        isOpen={isImageModalOpen}
        title={image ? "Edit Hero Image" : "Add Hero Image"}
        onClose={closeImageModal}
        footer={
          <>
            {image ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleRemoveImage}
              >
                Remove Image
              </button>
            ) : null}

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
              {image ? "Save Image" : "Add Image"}
            </button>
          </>
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
