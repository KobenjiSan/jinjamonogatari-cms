import { useEffect, useState } from "react";
import styles from "./EtiquetteList.module.css";
import toast from "react-hot-toast";
import { getTopicsList, type EtiquetteTopic } from "../../etiquetteApi";

function formatDateTime(dateString?: string | null) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type EtiquetteListProps = {
  onEdit: (Etiquette: EtiquetteTopic) => void;
  onRemove: (Etiquette: EtiquetteTopic) => void;
  onUpdate: number;
  isDeleting: boolean;
};

export default function EtiquetteList({
  onEdit,
  onRemove,
  onUpdate,
  isDeleting,
}: EtiquetteListProps) {
  const [topics, setTopics] = useState<EtiquetteTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      setLoading(true);

      try {
        const result = await getTopicsList();
        setTopics(result);
      } catch (error) {
        console.error("Failed to load topics", error);
        const err = error as { message?: string };
        toast.error(err.message ?? "Failed to load topics");
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, [onUpdate]);

  return (
    <div className={styles.wrapper}>
      <div
        className={`listShell ${styles.gridTable}`}
        style={{
          gridTemplateColumns: ".25fr 1fr .5fr .5fr .75fr auto",
        }}
      >
        <div className={`headerCell ${styles.idCol}`}>ID</div>
        <div className={`headerCell ${styles.titleEn}`}>Title</div>
        <div className={`headerCell ${styles.titleJp}`}>Status</div>
        <div className={`headerCell ${styles.createdCol}`}>At a glance</div>
        <div className={`headerCell ${styles.updatedCol}`}>Created / Updated</div>
        <div className={`headerCell ${styles.actionsCol}`}>Actions</div>

        {loading ? (
          <div className="rowGroup">
            <div className="bodyCell" style={{ gridColumn: "1 / -1" }}>
              <p className="text-md text-secondary">Loading...</p>
            </div>
          </div>
        ) : !topics.length ? (
          <div className="rowGroup">
            <div className="bodyCell" style={{ gridColumn: "1 / -1" }}>
              <p className="text-md text-secondary">No topics found.</p>
            </div>
          </div>
        ) : (
          topics.map((t) => (
            <div key={t.topicId} className="rowGroup">
              <div className={`bodyCell ${styles.idCol}`}>
                <div className="listStackSm">
                  <p className="metaText">{t.showAsHighlight ? "!!" : ""}</p>
                  <p className="metaText">{t.topicId}</p>
                </div>
              </div>

              <div className={`bodyCell ${styles.titleEn}`}>
                <div className="listStackSm">
                  <p className="primaryText">{t.titleLong}</p>
                </div>
              </div>

              <div className={`bodyCell ${styles.titleJp}`}>
                <div className="listStackSm">
                  <p className="primaryText">{t.status || "-"}</p>
                </div>
              </div>

              <div className={`bodyCell ${styles.createdCol}`}>
                <div className="listStackSm">
                  <p className="metaText">
                    <span className="primaryText">{t.showInGlance ? "true" : "false"}</span>
                  </p>
                </div>
              </div>

              <div className={`bodyCell ${styles.createdCol}`}>
                <div className="listStackSm">
                  <p className="metaText">
                    {formatDateTime(t.createdAt)}
                    {formatDateTime(t.updatedAt)}
                  </p>
                </div>
              </div>

              <div className={`bodyCell ${styles.actionsCol}`}>
                <div className={styles.actionGroup}>
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => onEdit(t)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    className="btn btn-outline-danger"
                    onClick={() => onRemove(t)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}