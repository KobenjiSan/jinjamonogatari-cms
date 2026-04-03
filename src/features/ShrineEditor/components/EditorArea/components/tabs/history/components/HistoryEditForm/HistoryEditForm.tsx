import { useEffect, useMemo, useState } from "react";
import type { HistoryCMSDto } from "../../historyApi";
import styles from "./HistoryEditForm.module.css";
import { emptyCitation } from "../../../../../../../../shared/citations/helpers/CitationSection.helper";
import type { CitationFormValues } from "../../../../../../../../shared/citations/helpers/CitationSection.types";
import type { ImageFormValues } from "../../../../../../../../shared/images/helpers/ImageSection.types";
import {
  emptyHistoryForm,
  mapHistoryToForm,
} from "./helpers/HistoryForm.helper";
import type { HistoryFormValues } from "./helpers/HistoryForm.types";
import HistoryDetailsSection from "./components/HistoryDetailsSection";
import HistoryReadOnlySection from "./components/HistoryReadOnlySection";
import CitationSection from "../../../../../../../../shared/citations/citationSection/CitationSection";
import ImageSection from "../../../../../../../../shared/images/imageSection/ImageSection";

type HistoryEditFormProps = {
  shrineId?: number;
  history: HistoryCMSDto | null;
  onChange?: (nextForm: HistoryFormValues) => void;
  isReadOnly: boolean;
};

export default function HistoryEditForm({
  shrineId,
  history,
  onChange,
  isReadOnly,
}: HistoryEditFormProps) {
  const [formValues, setFormValues] =
    useState<HistoryFormValues>(emptyHistoryForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const mapped = mapHistoryToForm(history);
    setFormValues(mapped);
    setImageFile(null);
    onChange?.(mapped);
  }, [history, onChange]);

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
      HistoryFormValues,
      "eventDate" | "sortOrder" | "title" | "information"
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

  function reuseCitation(citation: CitationFormValues) {
    setFormValues((prev) => {
      const alreadyExists = prev.citations.some(
        (c) => c.citeId && c.citeId === citation.citeId,
      );

      if (alreadyExists) {
        return prev;
      }

      const next = {
        ...prev,
        citations: [...prev.citations, citation],
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
      <HistoryDetailsSection
        values={{
          eventDate: formValues.eventDate,
          sortOrder: formValues.sortOrder,
          title: formValues.title,
          information: formValues.information,
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
        shrineId={shrineId}
        citations={formValues.citations}
        onCitationChange={handleCitationChange}
        onAddCitation={addCitation}
        onReuseCitation={reuseCitation}
        onRemoveCitation={removeCitation}
        isReadOnly={isReadOnly}
      />

      <div className={styles.divider} />

      {history && <HistoryReadOnlySection history={history} />}
    </div>
  );
}
