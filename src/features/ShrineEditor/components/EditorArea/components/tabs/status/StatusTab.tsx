import { useEffect, useMemo, useState } from "react";
import mainStyles from "../../../EditorArea.module.css";
import styles from "./StatusTab.module.css";
import {
  getShrineAuditById,
  type ShrineAuditDto,
  type AuditIssueDto,
  submitShrineForReview,
  rejectShrineReview,
  publishShrineReview,
} from "./statusApi";
import StatusHero from "./components/StatusHero/StatusHero";
import StatusSectionCheck from "./components/StatusSectionCheck/StatusSectionCheck";
import StatusSectionCard from "./components/StatusSectionCard/StatusSectionCard";
import ConfirmationModal from "../../../../../../../shared/components/confirmationModal/ConfirmationModal";

type StatusTabProps = {
  shrineId: number;
  isReadOnly: boolean;
  shrineStatus: string;
  onRefreshPage: () => void;
};

export type GroupedIssues = Record<string, AuditIssueDto[]>;
export type GroupedIssuesByItem = Record<
  string,
  Record<string, AuditIssueDto[]>
>;

export type SectionSummaryItem = {
  label: string;
  issues: AuditIssueDto[];
  errorCount: number;
  warningCount: number;
};

const sectionOrder = ["ShrineMeta", "Kami", "History", "Folklore", "Gallery"];

export default function StatusTab({
  shrineId,
  isReadOnly,
  shrineStatus,
  onRefreshPage,
}: StatusTabProps) {
  const [audit, setAudit] = useState<ShrineAuditDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingForReview, setIsSubmittingForReview] = useState(false);
  const [isConfirmSubmitReviewOpen, setIsConfirmSubmitReviewOpen] = useState(false);
  const [isPublishingShrine, setIsPublishingShrine] = useState(false);
  const [isConfirmPublishOpen, setIsConfirmPublishOpen] = useState(false);
  const [isRejectingShrine, setIsRejectingShrine] = useState(false);
  const [isConfirmRejectOpen, setIsConfirmRejectOpen] = useState(false);

  

  useEffect(() => {
    let isMounted = true;

    async function loadAudit() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getShrineAuditById(shrineId);

        if (!isMounted) return;
        setAudit(data);
      } catch {
        if (!isMounted) return;
        setError("Failed to load shrine review status.");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    loadAudit();

    return () => {
      isMounted = false;
    };
  }, [shrineId]);

  // Groups issues by section
  // useMemo helps make sure this doesnt run every rerender if audit didnt change
  const groupedIssues = useMemo<GroupedIssues>(() => {
    if (!audit) return {};

    return audit.issues.reduce<GroupedIssues>((acc, issue) => {
      const sectionKey = issue.section?.trim() || "General";

      if (!acc[sectionKey]) {
        acc[sectionKey] = [];
      }

      acc[sectionKey].push(issue);
      return acc;
    }, {}); // what acc (accumulator) starts at initally
  }, [audit]);

  const groupedIssuesByItem = useMemo<GroupedIssuesByItem>(() => {
    const result: GroupedIssuesByItem = {};

    Object.entries(groupedIssues).forEach(([section, issues]) => {
      result[section] = issues.reduce<Record<string, AuditIssueDto[]>>(
        (acc, issue) => {
          const itemKey =
            issue.itemId !== null ? `ID-${issue.itemId}` : "Section-Level";

          if (!acc[itemKey]) {
            acc[itemKey] = [];
          }

          acc[itemKey].push(issue);
          return acc;
        },
        {},
      );
    });

    return result;
  }, [groupedIssues]);

  const orderedSections = useMemo(() => {
    const existingSections = Object.keys(groupedIssues);

    return [
      ...sectionOrder.filter((section) => existingSections.includes(section)), // Sort by my sectionOrder
      ...existingSections // Sort what is left alphabetically in the back
        .filter((section) => !sectionOrder.includes(section))
        .sort((a, b) => a.localeCompare(b)),
    ];
  }, [groupedIssues]);

  const sectionSummary = useMemo<SectionSummaryItem[]>(() => {
    return sectionOrder.map((section) => {
      const issues = groupedIssues[section] ?? [];

      const errorCount = issues.filter((i) => i.severity === "Error").length;
      const warningCount = issues.filter(
        (i) => i.severity === "Warning",
      ).length;

      return {
        label: section,
        issues,
        errorCount,
        warningCount,
      };
    });
  }, [groupedIssues]);

  // SUBMIT FOR REVIEW
  async function handleSubmitReview(){
    try {
        setIsSubmittingForReview(true);

        await submitShrineForReview(shrineId);

        onRefreshPage();
        setIsConfirmSubmitReviewOpen(false);
      } catch (error) {
        console.error("Failed to submit shrine for review:", error);
      } finally {
        setIsSubmittingForReview(false);
      }
  }

  function openSubmitReview(){
    setIsConfirmSubmitReviewOpen(true);
  }

  function cancelSubmitReview(){
    setIsConfirmSubmitReviewOpen(false);
  }

  // PUBLISH SHRINE
  async function handlePublishShrine(){
    try {
        setIsPublishingShrine(true);

        await publishShrineReview(shrineId);

        onRefreshPage();
        setIsConfirmPublishOpen(false);
      } catch (error) {
        console.error("Failed to publish shrine:", error);
      } finally {
        setIsPublishingShrine(false);
      }
  }

  function openPublishShrine(){
    setIsConfirmPublishOpen(true);
  }

  function cancelPublishShrine(){
    setIsConfirmPublishOpen(false);
  }

  // REJECT SHRINE
  async function handleRejectShrine(rejectMessage: string){
    try {
        setIsRejectingShrine(true);

        await rejectShrineReview(shrineId, {message: rejectMessage});

        onRefreshPage();
        setIsConfirmRejectOpen(false);
      } catch (error) {
        console.error("Failed to Reject shrine:", error);
      } finally {
        setIsRejectingShrine(false);
      }
  }

  function openRejectShrine(){
    setIsConfirmRejectOpen(true);
  }

  function cancelRejectShrine(){
    setIsConfirmRejectOpen(false);
  }

  return (
    <>
    <div className={mainStyles.tabShell}>
      <div className={mainStyles.header}>
        <h2 className={mainStyles.title}>Shrine Review</h2>

        {!isReadOnly && (
          <div className={mainStyles.headerActions}>
            {shrineStatus === "review" ? (
              <>
                <button
                  type="button"
                  className={`${mainStyles.actionButton} btn btn-outline`}
                  aria-label="reject"
                  onClick={openRejectShrine}
                  disabled={isRejectingShrine}
                  title="Submit Rejection"
                >
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  className={`${mainStyles.actionButton} btn btn-outline`}
                  aria-label="Publish"
                  onClick={openPublishShrine}
                  disabled={!audit?.isSubmittable || isPublishingShrine}
                  title={
                    audit?.isSubmittable
                      ? "Shrine is ready for publishing"
                      : "Resolve all errors before publishing"
                  }
                >
                  <span>Publish</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                className={`${mainStyles.actionButton} btn btn-outline`}
                aria-label="Submit for Review"
                onClick={openSubmitReview}
                disabled={!audit?.isSubmittable || isSubmittingForReview}
                title={
                  audit?.isSubmittable
                    ? "Shrine is ready to submit"
                    : "Resolve all errors before submitting"
                }
              >
                <span>Submit for Review</span>
              </button>
            )}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="card">
          <p className="primaryText">Loading shrine review...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="card">
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {!isLoading && !error && audit && (
        <div className={styles.statusContent}>
          <StatusHero
            isSubmittable={audit.isSubmittable}
            errorCount={audit.errorCount}
            warningCount={audit.warningCount}
            totalIssues={audit.issues.length}
            isReadOnly={isReadOnly}
            shrineStatus={shrineStatus}
          />

          <div className="card">
            <StatusSectionCheck sectionSummary={sectionSummary} />
          </div>

          {audit.issues.length === 0 && (
            <div className="card">
              <p className={styles.summaryTitle}>No issues found.</p>
              <p className={styles.summaryText}>
                This shrine currently has a clean review state.
              </p>
            </div>
          )}

          {orderedSections.map((section) => {
            const sectionIssues = groupedIssues[section];
            const sectionGroups = groupedIssuesByItem[section];

            return (
              <StatusSectionCard
                key={section}
                section={section}
                sectionIssues={sectionIssues}
                sectionGroups={sectionGroups}
              />
            );
          })}
        </div>
      )}
    </div>

      {/* Confirm Submit Review Modal */}
      <ConfirmationModal
        isOpen={isConfirmSubmitReviewOpen}
        variant="constructive"
        actionLabel={`Submit Shrine #${String(shrineId)} For Review`}
        confirmLabel="Submit"
        onConfirm={handleSubmitReview}
        onCancel={cancelSubmitReview}
      />

      {/* Confirm Publish Modal */}
      <ConfirmationModal
        isOpen={isConfirmPublishOpen}
        variant="constructive"
        actionLabel={`Publish Shrine #${String(shrineId)}`}
        message={`Are you sure you want to Publish Shrine #${String(shrineId)}. Once published this shrine is viewable on the mobile app.`}
        confirmLabel="Publish"
        onConfirm={handlePublishShrine}
        onCancel={cancelPublishShrine}
      />

      {/* Confirm Reject Modal */}
      <ConfirmationModal
        isOpen={isConfirmRejectOpen}
        variant="destructive"
        actionLabel={`Reject Shrine #${String(shrineId)}`}
        confirmLabel="Reject"
        message={`You must provide a message with reason(s) for rejection.`}
        hasInputOption={true}
        onConfirm={() => {}}
        onCancel={cancelRejectShrine}
        onInputValue={(message) => handleRejectShrine(message)}
      />

    </>
  );
}
