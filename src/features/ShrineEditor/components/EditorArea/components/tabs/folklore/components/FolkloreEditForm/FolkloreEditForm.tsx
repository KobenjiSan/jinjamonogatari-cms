import { useEffect, useMemo, useState } from "react";
import type { FolkloreCMSDto } from "../../folkloreApi";
import styles from "./FolkloreEditForm.module.css";
import { emptyCitation } from "../../../../../../../../shared/citations/helpers/CitationSection.helper";
import type { CitationFormValues } from "../../../../../../../../shared/citations/helpers/CitationSection.types";
import type { ImageFormValues } from "../../../../../../../../shared/images/helpers/ImageSection.types";
import {
  emptyFolkloreForm,
  mapFolkloreToForm,
} from "./helpers/FolkloreForm.helper";
import type { FolkloreFormValues } from "./helpers/FolkloreForm.types";
import FolkloreDetailsSection from "./components/FolkloreDetailsSection";
import FolkloreReadOnlySection from "./components/FolkloreReadOnlySection";
import CitationSection from "../../../../../../../../shared/citations/citationSection/CitationSection";
import ImageSection from "../../../../../../../../shared/images/imageSection/ImageSection";

type FolkloreEditFormProps = {
  folklore: FolkloreCMSDto | null;
  onChange?: (nextForm: FolkloreFormValues) => void;
};

export default function FolkloreEditForm({
  folklore,
  onChange,
}: FolkloreEditFormProps) {
  const [formValues, setFormValues] =
    useState<FolkloreFormValues>(emptyFolkloreForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const mapped = mapFolkloreToForm(folklore);
    setFormValues(mapped);
    setImageFile(null);
    onChange?.(mapped);
  }, [folklore, onChange]);

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
    field: keyof Pick<
      FolkloreFormValues,
      "sortOrder" | "title" | "information"
    >,
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

  function handleCitationChange(
    index: number,
    nextCitation: CitationFormValues,
  ) {
    setFormValues((prev) => {
      const nextCitations = [...prev.citations];
      nextCitations[index] = nextCitation;

      const next = {
        ...prev,
        citations: nextCitations,
      };

      onChange?.(next);
      return next;
    });
  }

  function addCitation() {
    setFormValues((prev) => {
      const next = {
        ...prev,
        citations: [...prev.citations, { ...emptyCitation }],
      };

      onChange?.(next);
      return next;
    });
  }

  function removeCitation(index: number) {
    setFormValues((prev) => {
      const next = {
        ...prev,
        citations: prev.citations.filter((_, i) => i !== index),
      };

      onChange?.(next);
      return next;
    });
  }

  return (
    <div className={styles.wrapper}>
      <FolkloreDetailsSection
        values={{
          sortOrder: formValues.sortOrder,
          title: formValues.title,
          information: formValues.information,
        }}
        onFieldChange={handleFieldChange}
      />

      <div className={styles.divider} />

      <ImageSection
        image={formValues.image}
        previewUrl={previewUrl}
        onImageChange={handleImageChange}
        onFileChange={setImageFile}
      />

      <div className={styles.divider} />

      <CitationSection
        citations={formValues.citations}
        onCitationChange={handleCitationChange}
        onAddCitation={addCitation}
        onRemoveCitation={removeCitation}
      />

      <div className={styles.divider} />

      {folklore && <FolkloreReadOnlySection folklore={folklore} />}
    </div>
  );
}
