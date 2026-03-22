import { useEffect, useMemo, useState } from "react";
import mainStyles from "../../../EditorArea.module.css";
import styles from "./StatusTab.module.css";
import {
  getShrineAuditById,
  type ShrineAuditDto,
  type AuditIssueDto,
} from "./statusApi";
import StatusHero from "./components/StatusHero/StatusHero";
import StatusSectionCheck from "./components/StatusSectionCheck/StatusSectionCheck";
import StatusSectionCard from "./components/StatusSectionCard/StatusSectionCard";

type StatusTabProps = {
  shrineId: number;
};

export type GroupedIssues = Record<string, AuditIssueDto[]>;
export type GroupedIssuesByItem = Record<string, Record<string, AuditIssueDto[]>>;

export type SectionSummaryItem = {
  label: string;
  issues: AuditIssueDto[];
  errorCount: number;
  warningCount: number;
};

const sectionOrder = [
  "ShrineMeta",
  "Kami",
  "History",
  "Folklore",
  "Gallery",
];

export default function StatusTab({ shrineId }: StatusTabProps) {
  const [audit, setAudit] = useState<ShrineAuditDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const groupedIssues = useMemo<GroupedIssues>(() => {
    if (!audit) return {};

    return audit.issues.reduce<GroupedIssues>((acc, issue) => {
      const sectionKey = issue.section?.trim() || "General";

      if (!acc[sectionKey]) {
        acc[sectionKey] = [];
      }

      acc[sectionKey].push(issue);
      return acc;
    }, {});
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
      ...sectionOrder.filter((section) => existingSections.includes(section)),
      ...existingSections
        .filter((section) => !sectionOrder.includes(section))
        .sort((a, b) => a.localeCompare(b)),
    ];
  }, [groupedIssues]);

  const sectionSummary = useMemo<SectionSummaryItem[]>(() => {
    return sectionOrder.map((section) => {
      const issues = groupedIssues[section] ?? [];

      const errorCount = issues.filter((i) => i.severity === "Error").length;
      const warningCount = issues.filter((i) => i.severity === "Warning").length;

      return {
        label: section,
        issues,
        errorCount,
        warningCount,
      };
    });
  }, [groupedIssues]);

  return (
    <div className={mainStyles.tabShell}>
      <div className={mainStyles.header}>
        <h2 className={mainStyles.title}>Shrine Review</h2>

        <div className={mainStyles.headerActions}>
          <button
            type="button"
            className={`${mainStyles.actionButton} btn btn-outline`}
            aria-label="Submit for Review"
            onClick={() => {}}
            disabled={!audit?.isSubmittable}
            title={
              audit?.isSubmittable
                ? "Shrine is ready to submit"
                : "Resolve all errors before submitting"
            }
          >
            <span>Submit for Review</span>
          </button>
        </div>
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
  );
}