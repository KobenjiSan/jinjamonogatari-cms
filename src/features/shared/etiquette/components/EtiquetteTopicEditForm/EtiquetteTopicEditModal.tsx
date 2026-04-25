import { useEffect, useState } from "react";
import { type EtiquetteStep, type EtiquetteTopic } from "../../etiquetteApi";
import styles from "./EtiquetteTopicEditModal.module.css";
import TopicAreaSteps from "./components/TopicAreaSteps";
import TopicAreaMain from "./components/TopicAreaMain";
import type { EtiquetteMetaFormValues } from "./components/TopicMetaForm";
import type { EtiquetteStepFormValues } from "./components/TopicStepForm";

type EtiquetteTopicEditFormProps = {
  topic: EtiquetteTopic | null;
  onCloseStep: number;
  reloadSteps: number;
  onEditingStep: (value: boolean) => void;
  onSelectedStep: (step: EtiquetteStep | null) => void;
  onRemovingStep: (step: EtiquetteStep | null) => void;
  onChangeMeta?: (nextForm: EtiquetteMetaFormValues) => void;
  onChangeStep?: (nextForm: EtiquetteStepFormValues) => void;
  onFileChangeStep: (file: File | null) => void;
};

export default function EtiquetteTopicEditForm({
  topic,
  onEditingStep,
  onSelectedStep,
  onRemovingStep,
  onCloseStep,
  reloadSteps,
  onChangeMeta,
  onChangeStep,
  onFileChangeStep,
}: EtiquetteTopicEditFormProps) {

  const [selectedStep, setSelectedStep] = useState<EtiquetteStep | null>(null);

  useEffect(() => {
    if (!topic) return;

    if (selectedStep) {
      onEditingStep(true);
      onSelectedStep(selectedStep);
    } else {
      onEditingStep(false);
      onSelectedStep(null);
    }
  }, [selectedStep]);

  useEffect(() => {
    setSelectedStep(null);
  }, [onCloseStep]);

  const isEditingStep = selectedStep !== null;

  return (
    <div className={`${styles.layout} ${isEditingStep ? styles.editing : ""}`}>
      <div className={styles.sidebar}>
        <TopicAreaSteps 
          topicId={topic?.topicId || null} 
          onEdit={setSelectedStep} 
          onAdd={setSelectedStep} 
          onRemove={onRemovingStep}
          reload={reloadSteps}
        />
      </div>

      <div className={styles.main}>
        <TopicAreaMain
          meta={topic}
          step={selectedStep}
          onChangeMeta={onChangeMeta}
          onChangeStep={onChangeStep}
          onFileChangeStep={onFileChangeStep}
        />
      </div>
    </div>
  );
}
