import CitationForm from "../CitationForm";
import styles from "./CitationSection.module.css";
import type { CitationSectionProps } from "../helpers/CitationSection.types";

export default function CitationSection({
  title = "Citations",
  addLabel = "Add Citation",
  emptyMessage = "No citations added yet.",
  citations,
  onCitationChange,
  onAddCitation,
  onRemoveCitation,
}: CitationSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTitle}>{title}</p>

        <button
          type="button"
          className="btn btn-outline"
          onClick={onAddCitation}
        >
          {addLabel}
        </button>
      </div>

      {citations.length === 0 ? (
        <p className="text-sm text-secondary">{emptyMessage}</p>
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