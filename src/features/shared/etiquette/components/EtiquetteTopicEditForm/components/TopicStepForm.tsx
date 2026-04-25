import { useEffect, useMemo, useState } from "react";
import {
  emptyImage,
  mapImageToForm,
} from "../../../../images/helpers/ImageSection.helper";
import type { ImageFormValues } from "../../../../images/helpers/ImageSection.types";
import type { EtiquetteStep } from "../../../etiquetteApi";
import { emptyCitation } from "../../../../citations/helpers/CitationSection.helper";
import ImageSection from "../../../../images/imageSection/ImageSection";
import styles from "../EtiquetteTopicEditModal.module.css";

export type EtiquetteStepFormValues = {
  stepOrder: string;
  text: string;
  image: ImageFormValues;
};

export const emptyEtiquetteStepForm: EtiquetteStepFormValues = {
  stepOrder: "",
  text: "",
  image: { ...emptyImage },
};

export function mapEtiquetteStepToForm(
  step: EtiquetteStep | null,
): EtiquetteStepFormValues {
  if (!step) return emptyEtiquetteStepForm;

  return {
    stepOrder: step.stepOrder?.toString() ?? "",
    text: step.text ?? "",
    image: mapImageToForm(step.image),
  };
}

type TopicStepFormProps = {
  step: EtiquetteStep | null;
  onChange?: (nextForm: EtiquetteStepFormValues) => void;
  onFileChange: (file: File | null) => void;
};

export default function TopicStepForm({
  step,
  onChange,
  onFileChange,
}: TopicStepFormProps) {
  const [formValues, setFormValues] = useState<EtiquetteStepFormValues>(
    emptyEtiquetteStepForm,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const mapped = mapEtiquetteStepToForm(step);
    setFormValues(mapped);
    setImageFile(null);
    onChange?.(mapped);
  }, [step, onChange]);

  const previewUrl = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }

    return formValues.image.imageUrl || null;
  }, [imageFile, formValues.image.imageUrl]);

  useEffect(() => {
    return () => {
      if (imageFile && previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [imageFile, previewUrl]);

  function handleFieldChange(
    field: keyof Pick<EtiquetteStepFormValues, "stepOrder" | "text">,
    value: string,
  ) {
    setFormValues((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      onChange?.(next);
      return next;
    });
  }

  function handleImageChange(nextImage: ImageFormValues) {
    setFormValues((prev) => {
      const next = {
        ...prev,
        image: nextImage,
      };

      onChange?.(next);
      return next;
    });
  }

  function handleRemoveImage() {
    setImageFile(null);
    onFileChange(null);

    setFormValues((prev) => {
      const next = {
        ...prev,
        image: {
          ...prev.image,
          imgId: undefined,
          imageUrl: "",
          title: "",
          desc: "",
          citation: { ...emptyCitation },
        },
      };

      onChange?.(next);
      return next;
    });
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <p className={styles.sectionTitle}>
          Step Editor
        </p>

        <div className="form-group">
          <label htmlFor="step-order" className="label">
            Step Order
          </label>
          <input
            id="step-order"
            className="input"
            type="number"
            value={formValues.stepOrder!}
            onChange={(e) => handleFieldChange("stepOrder", e.target.value)}
            placeholder="Enter Step Order"
          />
        </div>

        <div className="form-group">
          <label htmlFor="text" className="label">
            Description
          </label>
          <textarea
            id="text"
            className="input"
            rows={2}
            value={formValues.text!}
            onChange={(e) => handleFieldChange("text", e.target.value)}
            placeholder="Enter details"
          />
        </div>
      </div>

      <div className={styles.divider} />

      <ImageSection
        image={formValues.image}
        previewUrl={previewUrl}
        onImageChange={handleImageChange}
        onFileChange={(f) => {
          setImageFile(f);
          onFileChange(f);

          if (f) {
            setFormValues((prev) => {
              const next = {
                ...prev,
                image: {
                  ...prev.image,
                  imageUrl: prev.image.imageUrl || "pending-upload",
                },
              };

              onChange?.(next);
              return next;
            });
          }
        }}
        onRemoveImage={handleRemoveImage}
        isReadOnly={false}
      />
    </div>
  );
}
