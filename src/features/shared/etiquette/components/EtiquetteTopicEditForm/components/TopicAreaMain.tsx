import type { EtiquetteStep, EtiquetteTopic } from "../../../etiquetteApi";
import TopicMetaForm, { type EtiquetteMetaFormValues } from "./TopicMetaForm";
import TopicStepForm, { type EtiquetteStepFormValues } from "./TopicStepForm";

type TopicAreaMainProps = {
  meta: EtiquetteTopic | null;
  step: EtiquetteStep | null;
  onChangeMeta?: (nextForm: EtiquetteMetaFormValues) => void;
  onChangeStep?: (nextForm: EtiquetteStepFormValues) => void;
  onFileChangeStep: (file: File | null) => void;
};

export default function TopicAreaMain({
  meta,
  step,
  onChangeMeta,
  onChangeStep,
  onFileChangeStep,
}: TopicAreaMainProps) {
  return (
    <>
      {step ? (
        <TopicStepForm
          step={step}
          onChange={onChangeStep}
          onFileChange={onFileChangeStep}
        />
      ) : (
        <TopicMetaForm meta={meta} onChange={onChangeMeta} />
      )}
    </>
  );
}
