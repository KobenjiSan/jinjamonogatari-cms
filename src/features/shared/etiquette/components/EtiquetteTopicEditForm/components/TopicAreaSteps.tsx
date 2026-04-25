import { FiPlus } from "react-icons/fi";
import { getStepsListById, type EtiquetteStep } from "../../../etiquetteApi";
import styles from "../EtiquetteTopicEditModal.module.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type TopicAreaStepsProps = {
  topicId: number | null;
  onEdit: (step: EtiquetteStep) => void;
  onAdd: (step: EtiquetteStep) => void;
  onRemove: (step: EtiquetteStep) => void;
  reload: number;
};

export default function TopicAreaSteps({
  topicId,
  onEdit,
  onAdd,
  onRemove,
  reload,
}: TopicAreaStepsProps) {
  // LOAD STEP
  const [steps, setSteps] = useState<EtiquetteStep[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTopics() {
      setLoading(true);

      try {
        const result = await getStepsListById(topicId!);
        setSteps(result);
      } catch (error) {
        console.error("Failed to load steps", error);
        const err = error as { message?: string };
        toast.error(err.message ?? "Failed to load steps");
      } finally {
        setLoading(false);
      }
    }

    if (!topicId) return;
    loadTopics();
  }, [topicId, reload]);


  // ADD STEP
  function addNewStep() {
    if (!topicId) {
      toast.error("Create and save the topic before adding steps");
      return;
    }

    const newStep: EtiquetteStep = {
      stepId: -1,
      text: "",
      stepOrder: steps.length + 1,
      image: {
        imgId: 0,
        imageUrl: "",
        title: "",
        desc: "",
        citation: null,
        createdAt: "",
        updatedAt: "",
        audit: null,
      },
    };

    onAdd(newStep);
  }

  return (
    <>
      <div>
        <div className={styles.actionArea}>
          <button
            type="button"
            className={`${styles.actionButton} btn btn-outline`}
            onClick={addNewStep}
            disabled={loading}
          >
            <FiPlus size={18} />
            <span>Add Step</span>
          </button>
        </div>

        {loading ? (
          <div className="rowGroup">
            <p className="text-md text-secondary">Loading...</p>
          </div>
        ) : !steps.length ? (
          <div className="rowGroup">
            <p className="text-md text-secondary">No steps found.</p>
          </div>
        ) : (
          <div className={styles.stepWrapper}>
            {steps.map((s) => (
              <div key={s.stepId} className={styles.stepCard}>
                <p>step {s.stepOrder}</p>

                <div className={styles.actionButtonArea}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => onEdit(s)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => onRemove(s)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
