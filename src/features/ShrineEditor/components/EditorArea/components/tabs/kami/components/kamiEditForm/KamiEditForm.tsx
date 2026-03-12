import { useEffect, useMemo, useState } from "react";
import type { KamiCMSDto } from "../../kamiApi";
import styles from "./KamiEditForm.module.css";
import {
  emptyCitation,
  emptyKamiForm,
  mapKamiToForm,
} from "./helpers/KamiForm.helper";
import type {
  CitationFormValues,
  ImageFormValues,
  KamiFormValues,
} from "./helpers/KamiForm.types";
import KamiCitationSection from "./components/KamiCitationSection";
import KamiDetailsSection from "./components/KamiDetailsSection";
import KamiImageSection from "./components/KamiImageSection";
import KamiReadOnlySection from "./components/KamiReadOnlySection";

type KamiEditFormProps = {
  kami: KamiCMSDto | null;
  onChange?: (nextForm: KamiFormValues) => void;
};

export default function KamiEditForm({ kami, onChange }: KamiEditFormProps) {
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
      <KamiDetailsSection
        values={{
          nameEn: formValues.nameEn,
          nameJp: formValues.nameJp,
          desc: formValues.desc,
        }}
        onFieldChange={handleFieldChange}
      />

      <div className={styles.divider} />

      <KamiImageSection
        image={formValues.image}
        previewUrl={previewUrl}
        onImageChange={handleImageChange}
        onFileChange={setImageFile}
      />

      <div className={styles.divider} />

      <KamiCitationSection
        citations={formValues.citations}
        onCitationChange={handleCitationChange}
        onAddCitation={addCitation}
        onRemoveCitation={removeCitation}
      />

      <div className={styles.divider} />

      {kami && <KamiReadOnlySection kami={kami} />}
    </div>
  );
}
