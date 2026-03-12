import CitationForm from "../../../../../../../../../shared/citations/CitationForm";
import styles from "../KamiEditForm.module.css";

import type { CitationFormValues } from "../helpers/KamiForm.types";

type KamiCitationSectionProps = {
  citations: CitationFormValues[];
  onCitationChange: (index: number, nextCitation: CitationFormValues) => void;
  onAddCitation: () => void;
  onRemoveCitation: (index: number) => void;
};

export default function KamiCitationSection({
  citations,
  onCitationChange,
  onAddCitation,
  onRemoveCitation,
}: KamiCitationSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTitle}>Citations</p>

        <button
          type="button"
          className="btn btn-outline"
          onClick={onAddCitation}
        >
          Add Citation
        </button>
      </div>

      {citations.length === 0 ? (
        <p className="text-sm text-secondary">No citations added yet.</p>
      ) : (
        <div className={styles.citationList}>
          {citations.map((citation, index) => (
            <div key={citation.citeId ?? index} className={styles.citationCard}>
              <div className={styles.citationHeader}>
                <p className={styles.citationTitle}>Citation {index + 1}</p>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => onRemoveCitation(index)}
                >
                  Remove
                </button>
              </div>

              <CitationForm
                values={citation}
                onChange={(next) => onCitationChange(index, next)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}