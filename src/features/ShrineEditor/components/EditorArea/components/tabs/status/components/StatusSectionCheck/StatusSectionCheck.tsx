import { FaCheckCircle } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { BiSolidErrorAlt } from "react-icons/bi";
import styles from "./StatusSectionCheck.module.css";
import type { SectionSummaryItem } from "../../StatusTab";

type StatusSectionCheckProps = {
  sectionSummary: SectionSummaryItem[];
};

export default function StatusSectionCheck({
  sectionSummary,
}: StatusSectionCheckProps) {
  return (
    <>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionTitle}>Section Check</p>
          <p className={styles.sectionMeta}>
            Quick scan of the main editor sections.
          </p>
        </div>
      </div>

      <div className={styles.checklist}>
        {sectionSummary.map((item) => {
          const hasError = item.errorCount > 0;
          const hasWarning = item.warningCount > 0;

          let status: "ok" | "warning" | "error" = "ok";
          if (hasError) status = "error";
          else if (hasWarning) status = "warning";

          return (
            <div key={item.label} className={styles.checklistRow}>
              <div className={styles.checklistLeft}>
                {status === "ok" && (
                  <FaCheckCircle className={styles.checkOkIcon} />
                )}

                {status === "warning" && (
                  <IoWarning className={styles.checkWarningIcon} />
                )}

                {status === "error" && (
                  <BiSolidErrorAlt className={styles.checkErrorIcon} />
                )}

                <span
                  className={`${styles.checklistLabel} ${
                    status === "error"
                      ? styles.textError
                      : status === "warning"
                      ? styles.textWarning
                      : ""
                  }`}
                >
                  {item.label}
                </span>
              </div>

              <span className={styles.checklistMeta}>
                {status === "ok" && "All good"}
                {status === "warning" &&
                  `${item.warningCount} warning${
                    item.warningCount !== 1 ? "s" : ""
                  }`}
                {status === "error" &&
                  `${item.errorCount} error${item.errorCount !== 1 ? "s" : ""}`}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}