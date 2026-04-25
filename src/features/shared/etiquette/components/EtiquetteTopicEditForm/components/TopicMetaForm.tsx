import { useEffect, useState } from "react";
import {
  emptyCitation,
  mapCitationToForm,
} from "../../../../citations/helpers/CitationSection.helper";
import type { CitationFormValues } from "../../../../citations/helpers/CitationSection.types";
import type { EtiquetteTopic } from "../../../etiquetteApi";
import styles from "../EtiquetteTopicEditModal.module.css";
import CitationSection from "../../../../citations/citationSection/CitationSection";

export type EtiquetteMetaFormValues = {
  slug: string;
  titleLong: string;
  summary: string;
  showInGlance: boolean;
  showAsHighlight: boolean;
  guideOrder: string;
  citations: CitationFormValues[];
};

export const emptyEtiquetteMetaForm: EtiquetteMetaFormValues = {
  slug: "",
  titleLong: "",
  summary: "",
  showInGlance: false,
  showAsHighlight: false,
  guideOrder: "",
  citations: [],
};

export function mapEtiquetteMetaToForm(
  meta: EtiquetteTopic | null,
): EtiquetteMetaFormValues {
  if (!meta) return emptyEtiquetteMetaForm;

  return {
    slug: meta.slug ?? "",
    titleLong: meta.titleLong ?? "",
    summary: meta.summary ?? "",
    showInGlance: meta.showInGlance ?? false,
    showAsHighlight: meta.showAsHighlight ?? false,
    guideOrder: meta.guideOrder?.toString() ?? "",
    citations: meta.citations?.length
      ? meta.citations.map((citation) => mapCitationToForm(citation))
      : [],
  };
}

type TopicMetaFormProps = {
  meta: EtiquetteTopic | null;
  onChange?: (nextForm: EtiquetteMetaFormValues) => void;
};

export default function TopicMetaForm({ meta, onChange }: TopicMetaFormProps) {
  const [formValues, setFormValues] = useState<EtiquetteMetaFormValues>(
    emptyEtiquetteMetaForm,
  );

  useEffect(() => {
    const mapped = mapEtiquetteMetaToForm(meta);
    setFormValues(mapped);
    onChange?.(mapped);
  }, [meta, onChange]);

  function handleFieldChange<
    K extends keyof Pick<
      EtiquetteMetaFormValues,
      | "slug"
      | "titleLong"
      | "summary"
      | "showInGlance"
      | "showAsHighlight"
      | "guideOrder"
    >,
  >(field: K, value: EtiquetteMetaFormValues[K]) {
    setFormValues((prev) => {
      const next = {
        ...prev,
        [field]: value,
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
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Topic Editor</p>

        <div className="form-group">
          <label htmlFor="guide-order" className="label">
            Guide Order
          </label>
          <input
            id="guide-order"
            className="input"
            type="number"
            value={formValues.guideOrder!}
            onChange={(e) => handleFieldChange("guideOrder", e.target.value)}
            placeholder="Enter Glance Order"
          />
        </div>

        <div className="form-group">
          <label htmlFor="slug" className="label">
            Slug
          </label>
          <input
            id="slug"
            className="input"
            type="text"
            value={formValues.slug!}
            onChange={(e) => handleFieldChange("slug", e.target.value)}
            placeholder="Enter Slug"
          />
        </div>

        <div className="form-group">
          <label htmlFor="title" className="label">
            Title
          </label>
          <input
            id="title"
            className="input"
            type="text"
            value={formValues.titleLong}
            onChange={(e) => handleFieldChange("titleLong", e.target.value)}
            placeholder="Enter Title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="summary" className="label">
            Summary
          </label>
          <textarea
            id="summary"
            className="input"
            rows={4}
            value={formValues.summary}
            onChange={(e) => handleFieldChange("summary", e.target.value)}
            placeholder="Enter Summary"
          />
        </div>

        <div className={styles.inputArea}>
          <div className="form-group">
            <div className={styles.checkboxRow}>
              <label className="label">Show As Highlight?</label>

              <input
                type="checkbox"
                checked={formValues.showAsHighlight}
                onChange={(e) =>
                  handleFieldChange("showAsHighlight", e.target.checked)
                }
              />
            </div>
          </div>

          <div className="form-group">
            <div className={styles.checkboxRow}>
              <label className="label">Show In A Glance?</label>

              <input
                type="checkbox"
                checked={formValues.showInGlance}
                onChange={(e) =>
                  handleFieldChange("showInGlance", e.target.checked)
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <CitationSection
        citations={formValues.citations}
        onCitationChange={handleCitationChange}
        onAddCitation={addCitation}
        onReuseCitation={reuseCitation}
        onRemoveCitation={removeCitation}
        isReadOnly={false}
      />
    </div>
  );
}
