import { useEffect, useMemo, useState } from "react";
import type { KamiCMSDto } from "../../kamiApi";
import styles from "./KamiEditForm.module.css";
import { emptyCitation } from "../../../../../../../../shared/citations/helpers/CitationSection.helper";
import type { CitationFormValues } from "../../../../../../../../shared/citations/helpers/CitationSection.types";
import type { ImageFormValues } from "../../../../../../../../shared/images/helpers/ImageSection.types";
import { emptyKamiForm, mapKamiToForm } from "./helpers/KamiForm.helper";
import type { KamiFormValues } from "./helpers/KamiForm.types";
import KamiDetailsSection from "./components/KamiDetailsSection";
import KamiReadOnlySection from "./components/KamiReadOnlySection";
import CitationSection from "../../../../../../../../shared/citations/citationSection/CitationSection";
import ImageSection from "../../../../../../../../shared/images/imageSection/ImageSection";

type KamiEditFormProps = {
  kami: KamiCMSDto | null;
  onChange?: (nextForm: KamiFormValues) => void;
  isReadOnly: boolean;
};

export default function KamiEditForm({
  kami,
  onChange,
  isReadOnly,
}: KamiEditFormProps) {
  const [formValues, setFormValues] = useState<KamiFormValues>(emptyKamiForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Map elements to form
  useEffect(() => {
    const mapped = mapKamiToForm(kami);
    setFormValues(mapped);
    setImageFile(null);
    onChange?.(mapped);
  }, [kami, onChange]);

  // IMAGE PREVIEWING SETUP
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

  // BASIC FIELD HANDLING
  function handleFieldChange(
    field: keyof Pick<KamiFormValues, "nameEn" | "nameJp" | "desc">,
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

  // IMAGE HANDLING
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

  // CITATION HANDLING
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
      <p className={styles.note}>
        Note: Changes here will update this Kami for all shrines it is linked
        with.
      </p>
      <KamiDetailsSection
        values={{
          nameEn: formValues.nameEn,
          nameJp: formValues.nameJp,
          desc: formValues.desc,
        }}
        onFieldChange={handleFieldChange}
        isReadOnly={isReadOnly}
      />

      <div className={styles.divider} />

      <ImageSection
        image={formValues.image}
        previewUrl={previewUrl}
        onImageChange={handleImageChange}
        onFileChange={setImageFile}
        isReadOnly={isReadOnly}
      />

      <div className={styles.divider} />

      <CitationSection
        citations={formValues.citations}
        onCitationChange={handleCitationChange}
        onAddCitation={addCitation}
        onRemoveCitation={removeCitation}
        isReadOnly={isReadOnly}
      />

      <div className={styles.divider} />

      {kami && <KamiReadOnlySection kami={kami} />}
    </div>
  );
}
