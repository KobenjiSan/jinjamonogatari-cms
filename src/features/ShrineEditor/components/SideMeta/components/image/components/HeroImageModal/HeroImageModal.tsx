import { useEffect, useMemo, useState } from "react";
import BaseModal from "../../../../../../../../shared/components/modal/BaseModal";
import styles from "./HeroImageModal.module.css";
import type { ImageFullDto } from "../../../../../../ShrineEditorApi";
import type { ImageFormValues } from "../../../../../../../shared/images/helpers/ImageSection.types";
import {
  emptyImage,
  mapImageToForm,
} from "../../../../../../../shared/images/helpers/ImageSection.helper";
import ConfirmationModal from "../../../../../../../../shared/components/confirmationModal/ConfirmationModal";
import { useConfirmationState } from "../../../../../../../shared/hooks/useConfirmationState";
import toast from "react-hot-toast";
import {
  createHeroImage,
  deleteHeroImage,
  updateHeroImage,
} from "../heroImageApi";
import {
  buildCreateImageFormData,
  buildUpdateImageFormData,
} from "../../../../../../../shared/images/helpers/ImageApi.types";
import ImageForm from "../../../../../../../shared/images/ImageForm";

type HeroImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onChange: (nextImage: ImageFullDto | null) => void;
  isReadOnly: boolean;
  image: ImageFullDto | null;
  shrineId: number;
};

export default function HeroImageModal({
  isOpen,
  onClose,
  onChange,
  isReadOnly,
  image,
  shrineId,
}: HeroImageModalProps) {
  const [hasActiveImage, setHasActiveImage] = useState(!!image);
  const [imageForm, setImageForm] = useState<ImageFormValues>(
    mapImageToForm(image),
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setHasActiveImage(!!image);
    setImageForm(mapImageToForm(image));
    setSelectedFile(null);
  }, [image]);

  const previewUrl = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }

    return imageForm.imageUrl || null;
  }, [selectedFile, imageForm.imageUrl]);

  const saveConfirm = useConfirmationState<string>();
  async function handleSaveImage() {
    if (isReadOnly) return; // block API calls in read-only mode

    try {
      var result: ImageFullDto;
      if (hasActiveImage) {
        // PUT existing image
        const formData = buildUpdateImageFormData(imageForm, selectedFile);
        result = await updateHeroImage(shrineId, formData);
        toast.success("Gallery image updated successfully!");
      } else {
        // POST new image
        const formData = buildCreateImageFormData(imageForm, selectedFile);
        result = await createHeroImage(shrineId, formData);
        toast.success("Gallery image created successfully!");
      }

      onChange(result);
      saveConfirm.close();
      onClose();
    } catch (error) {
      console.error("Failed to save image:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }

  const removeConfirm = useConfirmationState<string>();
  async function handleRemoveImage() {
    if (isReadOnly) return; // block API calls in read-only mode
    if (!imageForm.imgId) return;

    try {
      // DELETE image
      await deleteHeroImage(shrineId, imageForm.imgId);
      toast.success("Gallery image deleted successfully!");

      removeConfirm.close();
      onChange(null);
      setHasActiveImage(false);
      setImageForm(emptyImage);
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to remove image:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Failed to remove image");
    }
  }

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        title={hasActiveImage ? "Edit Hero Image" : "Add Hero Image"}
        onClose={onClose}
        footer={
          isReadOnly ? (
            <>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
            </>
          ) : (
            <div className={styles.modalFooterArea}>
              <div>
                {hasActiveImage ? (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeConfirm.open(imageForm.title)}
                  >
                    Remove Image
                  </button>
                ) : null}
              </div>

              <div className={styles.modalFooterBasic}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => saveConfirm.open(imageForm.title)}
                >
                  {hasActiveImage ? "Save Image" : "Add Image"}
                </button>
              </div>
            </div>
          )
        }
      >
        <ImageForm
          values={imageForm}
          previewUrl={previewUrl}
          onChange={setImageForm}
          onFileChange={setSelectedFile}
          isReadOnly={isReadOnly}
        />
      </BaseModal>

      <ConfirmationModal
        isOpen={removeConfirm.isOpen}
        variant="destructive"
        actionLabel="remove"
        subjectName={removeConfirm.subject ?? "this hero image"}
        confirmLabel="Remove"
        onConfirm={handleRemoveImage}
        onCancel={removeConfirm.close}
      />

      <ConfirmationModal
        isOpen={saveConfirm.isOpen}
        variant="constructive"
        actionLabel={image ? "save" : "create"}
        subjectName={saveConfirm.subject ?? "this hero image"}
        confirmLabel={image ? "Save" : "Create"}
        onConfirm={handleSaveImage}
        onCancel={saveConfirm.close}
      />
    </>
  );
}
