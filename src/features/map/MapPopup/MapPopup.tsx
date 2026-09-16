import { useNavigate } from "react-router-dom";
import styles from "./MapPopup.module.css";
import type { ShrineListDto } from "../../shrines/shrinesApi";
import { FiCheckCircle } from "react-icons/fi";
import { FaCircleInfo } from "react-icons/fa6";

function formatUpdatedAt(dateString?: string | null) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type MapPopupProps = {
  shrine: ShrineListDto;
};

export default function MapPopup({ shrine }: MapPopupProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.shrinePopup}>
      <div className={styles.idHeader}>
        <p className="text-muted text-xs">
          Updated {formatUpdatedAt(shrine.updatedAt)}
        </p>
        <p className="text-muted text-xs">ID: {shrine.shrineId}</p>
      </div>

      <div>
        <p className="primaryText">{shrine.nameEn ?? "Unnamed Shrine"}</p>
        <p className="metaText">{shrine.nameJp ?? "-"}</p>
      </div>

      <div className={styles.statusAuditArea}>
        <div className={styles.statusArea}>
          <span
            className={`pill status-wrapper ${styles.fillArea} ${
              shrine.recentlyRejected ? styles.rejectionPill : ""
            }`}
            title={shrine.recentlyRejected ? "Recently Rejected" : ""}
          >
            {shrine.recentlyRejected && <FaCircleInfo />}
            {shrine.status ?? "-"}
          </span>
        </div>

        <div>
          {(shrine.errorCount ?? 0) === 0 ? (
            <span className={styles.auditOk}>
              <FiCheckCircle className={styles.auditOkIcon} />
              <span>No Blockers</span>
            </span>
          ) : (
            <div className={styles.auditStack}>
              {shrine.errorCount > 0 && (
                <span className={styles.errorPill}>
                  {shrine.errorCount} Blocker
                  {shrine.errorCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="btn btn-outline"
        onClick={() => navigate(`/shrines/${shrine.shrineId}`)}
      >
        View shrine
      </button>
    </div>
  );
}
