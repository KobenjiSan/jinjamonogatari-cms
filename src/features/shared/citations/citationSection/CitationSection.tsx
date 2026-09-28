import { useEffect, useState } from "react";
import CitationForm, { type CitationCMSDto } from "../CitationForm";
import type { CitationFormValues } from "../helpers/CitationSection.types";
import styles from "./CitationSection.module.css";
import { getShrineCitationsDropdownById } from "../../../ShrineEditor/components/EditorArea/components/tabs/citations/citationTabApi";
import toast from "react-hot-toast";
import type { EntityAuditCMSDto } from "../../../ShrineEditor/components/EditorArea/components/tabs/kami/kamiApi";

export type CitationSectionProps = {
  shrineId?: number;
  emptyMessage?: string;
  citations: CitationFormValues[];
  onCitationChange: (index: number, nextCitation: CitationFormValues) => void;
  onAddCitation: () => void;
  onReuseCitation: (citation: CitationFormValues) => void;
  onRemoveCitation: (index: number) => void;
  isReadOnly: boolean;
  entityAudit?: EntityAuditCMSDto | null | undefined;
};

export default function CitationSection({
  shrineId,
  emptyMessage = "No citations added yet.",
  citations,
  onCitationChange,
  onAddCitation,
  onReuseCitation,
  onRemoveCitation,
  isReadOnly,
  entityAudit,
}: CitationSectionProps) {
  const [selectedCitationId, setSelectedCitationId] = useState("");
  const [availableReusableCitations, setAvailableReusableCitations] = useState<
    CitationCMSDto[]
  >([]);

  useEffect(() => {
    if (!shrineId) {
      setAvailableReusableCitations([]);
      setSelectedCitationId("");
      return;
    }

    async function getDropdownItems() {
      try {
        const result = await getShrineCitationsDropdownById(shrineId!);
        setAvailableReusableCitations(result);
      } catch (error) {
        console.error("Failed to get citations:", error);
        const err = error as { message?: string };
        toast.error(err.message ?? "Something went wrong");
      }
    }

    getDropdownItems();
  }, [shrineId]);

  function truncate(text: string | undefined, max = 45) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max) + "…" : text;
  }

  function mapCitationDtoToForm(citation: CitationCMSDto): CitationFormValues {
    return {
      title: citation.title ?? "",
      author: citation.author ?? "",
      url: citation.url ?? "",
      year: citation.year?.toString() ?? "",
      citeId: citation.citeId,
      createdAt: citation.createdAt,
      updatedAt: citation.updatedAt,
      isReused: true,
    };
  }

  function handleReuseCitation() {
    if (!selectedCitationId) return;

    const selected = availableReusableCitations.find(
      (c) => c.citeId === Number(selectedCitationId),
    );

    if (!selected) return;

    onReuseCitation(mapCitationDtoToForm(selected));
    setSelectedCitationId("");
  }

  const showReuseControls = !isReadOnly && !!shrineId;

  const missingCitationsError =
    entityAudit?.issues?.find(
      (issue) =>
        issue.field === "Citations" &&
        issue.severity === "Error" &&
        issue.relatedItemType == null &&
        issue.relatedItemId == null,
    )?.message ?? null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleArea}>
          <p className={styles.sectionTitle}>Citations</p>
          {missingCitationsError && (
            <p className="errorPill">{missingCitationsError}</p>
          )}
        </div>
        {!isReadOnly && (
          <div className={styles.citationActions}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onAddCitation}
            >
              New Citation
            </button>

            {showReuseControls && (
              <div className={styles.reuseRow}>
                <select
                  className={`select ${styles.citationSelect}`}
                  value={selectedCitationId}
                  onChange={(e) => setSelectedCitationId(e.target.value)}
                >
                  <option value="">Select existing citation</option>
                  {availableReusableCitations.map((c) => (
                    <option key={c.citeId} value={c.citeId}>
                      {truncate(c.title!)}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className={`btn btn-outline ${styles.reuseButton}`}
                  disabled={!selectedCitationId}
                  onClick={handleReuseCitation}
                >
                  Reuse Citation
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {citations.length === 0 ? (
        <p className="text-sm text-secondary">{emptyMessage}</p>
      ) : (
        <div className={styles.citationList}>
          {citations.map((citation, index) => (
            <div key={citation.citeId ?? index} className={styles.citationCard}>
              <div className={styles.citationHeader}>
                <p className={styles.citationTitle}>Citation {index + 1}</p>

                {!isReadOnly && (
                  <button
                    type="button"
                    className="btn btn-ghost-danger"
                    onClick={() => onRemoveCitation(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <CitationForm
                values={citation}
                onChange={(next) => onCitationChange(index, next)}
                isReadOnly={isReadOnly}
                entityAudit={entityAudit}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
