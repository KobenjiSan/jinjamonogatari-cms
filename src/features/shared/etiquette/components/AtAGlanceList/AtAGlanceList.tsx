import { useEffect, useState } from "react";
import styles from "./AtAGlanceList.module.css";
import toast from "react-hot-toast";
import { getGlanceTopicsList, type AtAGlanceDto } from "../../etiquetteApi";

type AtAGlanceListProps = {
  onEdit: (Topic: AtAGlanceDto) => void;
  onRemove: (TopicId: number) => void;
  onUpdate: number;
  isDeleting: boolean;
};

export default function AtAGlanceList({
  onEdit,
  onRemove,
  onUpdate,
  isDeleting,
}: AtAGlanceListProps) {
  const [topics, setTopics] = useState<AtAGlanceDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      setLoading(true);

      try {
        const result = await getGlanceTopicsList();
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
          gridTemplateColumns: ".25fr 1fr 1fr 1fr .25fr auto",
        }}
      >
        <div className="headerCell">Order</div>
        <div className="headerCell">Icon</div>
        <div className="headerCell">Title Short</div>
        <div className="headerCell">Title Main</div>
        <div className="headerCell">Topic ID</div>
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
                <p className="metaText">{t.glanceOrder}</p>
              </div>

              <div className="bodyCell">
                <div className={styles.iconText}>
                  <p className="primaryText">{t.iconSet}</p>
                  <span className="metaText">-</span>
                  <p className="primaryText">{t.iconKey}</p>
                </div>
              </div>

              <div className="bodyCell">
                <p className="primaryText">{t.titleShort || "-"}</p>
              </div>

              <div className="bodyCell">
                <p className="primaryText">{t.titleLong || "-"}</p>
              </div>

              <div className="bodyCell">
                <p className="metaText">{t.topicId}</p>
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
                    onClick={() => onRemove(t.topicId)}
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
