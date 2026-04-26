import { PiClipboardText, PiExport } from "react-icons/pi";
import styles from "./QuickActions.module.css";
import { FaChevronRight } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider";

export default function QuickActions() {
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleImport() {
    navigate("/shrines", {
      state: { openImportModal: true },
    });
  }

  function handleDraft() {
    navigate("/shrines", {
      state: { activeTab: "draft" },
    });
  }

  function handleReview() {
    navigate("/shrines", {
      state: { activeTab: "review" },
    });
  }

  function handleEtiquette() {
    navigate("/etiquette");
  }

  return (
    <div className="card">
      <p className="text-primary font-bold text-lg">Quick Actions</p>
      <div className={styles.frame}>
        <div className={`card ${styles.section}`} onClick={handleImport}>
          <div className={styles.content}>
            <div className="center">
              <div className={`${styles.iconContainer} ${styles.import}`}>
                <PiExport size={36} />
              </div>
            </div>
            <div className="column gap-xs">
              <span className="text-large font-bold">Import Shrines</span>
              <span className="">
                Import a new shrine from external sources.
              </span>
            </div>
          </div>

          <div className="center">
            <FaChevronRight />
          </div>
        </div>

        {user?.role == "Admin" ? (
          <div className={`card ${styles.section}`} onClick={handleReview}>
            <div className={styles.content}>
              <div className="center">
                <div className={`${styles.iconContainer} ${styles.drafts}`}>
                  <PiClipboardText size={36} />
                </div>
              </div>
              <div className="column gap-xs">
                <span className="text-large font-bold">Open Review Queue</span>
                <span className="">Review and moderate submitted shrines.</span>
              </div>
            </div>

            <div className="center">
              <FaChevronRight />
            </div>
          </div>
        ) : (
          <div className={`card ${styles.section}`} onClick={handleDraft}>
            <div className={styles.content}>
              <div className="center">
                <div className={`${styles.iconContainer} ${styles.drafts}`}>
                  <PiClipboardText size={36} />
                </div>
              </div>
              <div className="column gap-xs">
                <span className="text-large font-bold">Open Drafts</span>
                <span className="">
                  View and edit shrines currently needing work.
                </span>
              </div>
            </div>

            <div className="center">
              <FaChevronRight />
            </div>
          </div>
        )}

        <div className={`card ${styles.section}`} onClick={handleEtiquette}>
          <div className={styles.content}>
            <div className="center">
              <div className={`${styles.iconContainer} ${styles.etiquette}`}>
                <IoBookOutline size={36} />
              </div>
            </div>
            <div className="column gap-xs">
              <span className="text-large font-bold">Open Etiquette Page</span>
              <span className="">View and manage etiquette guidelines.</span>
            </div>
          </div>

          <div className="center">
            <FaChevronRight />
          </div>
        </div>
      </div>
    </div>
  );
}
