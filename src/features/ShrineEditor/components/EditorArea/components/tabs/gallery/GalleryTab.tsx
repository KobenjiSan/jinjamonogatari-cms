import { FiPlus } from "react-icons/fi";
import { useMemo, useState } from "react";
import mainStyles from "../../../EditorArea.module.css";
import GalleryList from "./components/GalleryList/GalleryList";
import BaseModal from "../../../../../../../shared/components/modal/BaseModal";
import ImageForm from "../../../../../../shared/images/ImageForm";
import ConfirmationModal from "../../../../../../../shared/components/confirmationModal/ConfirmationModal";
import type { ImageCMSDto } from "../../../../../../shared/images/helpers/ImageApi.types";
import type { ImageFormValues } from "../../../../../../shared/images/helpers/ImageSection.types";
import {
  emptyImage,
  mapImageToForm,
} from "../../../../../../shared/images/helpers/ImageSection.helper";
import { createGalleryImage, deleteGalleryImage, updateGalleryImage } from "./galleryApi";
import { buildCreateGalleryImagePayload, buildUpdateGalleryImagePayload } from "./helpers/GalleryTab.helpers";

type GalleryTabProps = {
  shrineId: number;
};

export default function GalleryTab({ shrineId }: GalleryTabProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageCMSDto | null>(null);

  const [imageListReloadKey, setImageListReloadKey] = useState(0);
  const [imageDraft, setImageDraft] = useState<ImageFormValues>(emptyImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [pendingDeleteImage, setPendingDeleteImage] =
    useState<ImageCMSDto | null>(null);

  const isDraftEmpty =
    JSON.stringify(imageDraft) === JSON.stringify(emptyImage);

  const previewUrl = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }

    return imageDraft.imageUrl || null;
  }, [selectedFile, imageDraft.imageUrl]);

  function reloadImageList() {
    setImageListReloadKey((prev) => prev + 1);
  }

  function openAddImageModal() {
    setSelectedImage(null);
    setSelectedFile(null);
    setImageDraft(emptyImage);
    setIsImageModalOpen(true);
  }

  function openEditImageModal(imageItem: ImageCMSDto) {
    setSelectedImage(imageItem);
    setSelectedFile(null);
    setImageDraft(mapImageToForm(imageItem));
    setIsImageModalOpen(true);
  }

  function closeImageModal() {
    setIsImageModalOpen(false);
    setSelectedImage(null);
    setSelectedFile(null);
    setImageDraft(emptyImage);
  }

  function handleRemoveImage(image: ImageCMSDto) {
    setPendingDeleteImage(image);
    setIsConfirmDeleteOpen(true);
  }

  async function confirmRemoveImage() {
    if (!pendingDeleteImage) return;

    try {
      // DELETE image API here
      await deleteGalleryImage(pendingDeleteImage.imgId);

      reloadImageList();
      setIsConfirmDeleteOpen(false);
      setPendingDeleteImage(null);
    } catch (error) {
      console.error("Failed to remove image:", error);
    }
  }

  function cancelRemoveImage() {
    setIsConfirmDeleteOpen(false);
    setPendingDeleteImage(null);
  }

  function handleSaveImage() {
    setIsConfirmSaveOpen(true);
  }

  async function confirmSaveImage() {
    try {
      if (selectedImage) {
        // PUT existing image API here
        const payload = buildUpdateGalleryImagePayload(imageDraft);
        await updateGalleryImage(selectedImage.imgId, payload);
      } else {
        // POST/PUT new image API here
        const payload = buildCreateGalleryImagePayload(imageDraft);
        await createGalleryImage(shrineId, payload);
      }

      reloadImageList();
      setIsConfirmSaveOpen(false);
      closeImageModal();
    } catch (error) {
      console.error("Failed to save image:", error);
    }
  }

  function cancelSaveImage() {
    setIsConfirmSaveOpen(false);
  }

  function handleFileChange(file: File | null) {
    setSelectedFile(file);
  }

  const saveSubjectName =
    selectedImage?.title || imageDraft.title || "this image entry";

  const deleteSubjectName =
    pendingDeleteImage?.title || "this image entry";

  return (
    <>
      <div className={mainStyles.tabShell}>
        <div className={mainStyles.header}>
          <h2 className={mainStyles.title}>Gallery</h2>

          <div className={mainStyles.headerActions}>
            <button
              type="button"
              className={`${mainStyles.actionButton} btn btn-outline`}
              aria-label="New Image"
              onClick={openAddImageModal}
            >
              <FiPlus size={18} />
              <span>New Image</span>
            </button>
          </div>
        </div>

        <GalleryList
          shrineId={shrineId}
          reloadKey={imageListReloadKey}
          onEdit={openEditImageModal}
          onRemove={handleRemoveImage}
        />
      </div>

      <BaseModal
        isOpen={isImageModalOpen}
        title={selectedImage ? "Edit Image" : "Add Image"}
        onClose={closeImageModal}
        footer={
          <>
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
              disabled={!selectedImage && isDraftEmpty && !selectedFile}
            >
              {selectedImage ? "Save Image" : "Add Image"}
            </button>
          </>
        }
      >
        <ImageForm
          values={imageDraft}
          previewUrl={previewUrl}
          onChange={setImageDraft}
          onFileChange={handleFileChange}
        />
      </BaseModal>

      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        variant="destructive"
        actionLabel="remove"
        subjectName={deleteSubjectName}
        confirmLabel="Remove"
        onConfirm={confirmRemoveImage}
        onCancel={cancelRemoveImage}
      />

      <ConfirmationModal
        isOpen={isConfirmSaveOpen}
        variant="constructive"
        actionLabel={selectedImage ? "save changes to" : "create"}
        subjectName={saveSubjectName}
        confirmLabel={selectedImage ? "Save" : "Create"}
        onConfirm={confirmSaveImage}
        onCancel={cancelSaveImage}
      />
    </>
  );
}