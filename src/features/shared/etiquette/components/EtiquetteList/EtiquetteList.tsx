import { useEffect, useState } from "react";
import styles from "./EtiquetteList.module.css";
import toast from "react-hot-toast";
import { getTopicsList, type EtiquetteTopic } from "../../etiquetteApi";
import { FaStar } from "react-icons/fa6";

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
        <div className="headerCell">ID</div>
        <div className="headerCell">Title</div>
        <div className="headerCell">Status</div>
        <div className="headerCell">At a glance</div>
        <div className="headerCell">Created / Updated</div>
        <div className="headerCell">Actions</div>

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
              <div className="bodyCell">
                <div className={styles.idStack}>
                  <p className="metaText">{t.topicId}</p>
                  {t.showAsHighlight && (
                    <span className={styles.highlightPill} title="Shown as Highlight"><FaStar /></span>
                  )}
                </div>
              </div>

              <div className="bodyCell">
                <p className="primaryText">{t.titleLong}</p>
              </div>

              <div className="bodyCell">
                <span className="pill">{t.status || "-"}</span>
              </div>

              <div className="bodyCell">
                <span
                  className={
                    t.showInGlance ? styles.validPill : styles.errorPill
                  }
                >
                  {t.showInGlance ? "True" : "False"}
                </span>
              </div>

              <div className="bodyCell">
                <div className="listStackSm">
                  <p className="metaText">
                    Created:{" "}
                    {t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"}
                  </p>
                  <p className="metaText">
                    Updated:{" "}
                    {t.updatedAt ? new Date(t.updatedAt).toLocaleString() : "-"}
                  </p>
                </div>
              </div>

              <div className="bodyCell">
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
