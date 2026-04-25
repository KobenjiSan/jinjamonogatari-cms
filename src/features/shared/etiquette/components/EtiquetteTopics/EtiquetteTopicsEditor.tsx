// import styles from "./EtiquetteTopicsEditor.module.css";
import { useState } from "react";
import BaseModal from "../../../../../shared/components/modal/BaseModal";
import { createEtiquette, createStep, deleteStep, updateEtiquette, updateStep, type EtiquetteStep, type EtiquetteTopic } from "../../etiquetteApi";
import EtiquetteTopicEditModal from "../EtiquetteTopicEditForm/EtiquetteTopicEditModal";
import ConfirmationModal from "../../../../../shared/components/confirmationModal/ConfirmationModal";
import { useConfirmationState } from "../../../hooks/useConfirmationState";
import { emptyEtiquetteMetaForm, type EtiquetteMetaFormValues } from "../EtiquetteTopicEditForm/components/TopicMetaForm";
import { emptyEtiquetteStepForm, type EtiquetteStepFormValues } from "../EtiquetteTopicEditForm/components/TopicStepForm";
import toast from "react-hot-toast";
import { buildCreateEtiquettePayload, buildCreateStepFormData, buildUpdateEtiquettePayload, buildUpdateStepFormData } from "./topicsEditor.helpers";

type EtiquetteTopicsEditorProps = {
  isOpen: boolean;
  selectedTopic: EtiquetteTopic | null;
  onClose: () => void;
  onReload: () => void;
};

export default function EtiquetteTopicsEditor({
  isOpen,
  selectedTopic,
  onClose,
  onReload,
}: EtiquetteTopicsEditorProps) {
  
  // #region TOPIC META
  const [topicDraft, setTopicDraft] = useState<EtiquetteMetaFormValues>(emptyEtiquetteMetaForm);
  const isTopicDraftEmpty = JSON.stringify(topicDraft) === JSON.stringify(emptyEtiquetteMetaForm);

  const saveConfirmTopic = useConfirmationState<string>();

  // update / add topic (update fields and save to topic)
  async function confirmSaveTopic(){
    try {
      if (selectedTopic) {
        const payload = buildUpdateEtiquettePayload(topicDraft, selectedTopic);
        await updateEtiquette(selectedTopic.topicId, payload);
        toast.success("Topic updated successfully!");
      } else {
        const payload = buildCreateEtiquettePayload(topicDraft);
        await createEtiquette(payload);
        toast.success("Topic created successfully!");
      }

      onReload();
      saveConfirmTopic.close();
      onClose();
    } catch (error) {
      console.error("Failed to save Topic:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }
  // #endregion

  // #region TOPIC STEP
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [selectedStep, setSelectedStep] = useState<EtiquetteStep | null>(null);
  const [closeEdit, setCloseEdit] = useState(0);

  const [stepDraft, setStepDraft] = useState<EtiquetteStepFormValues>(emptyEtiquetteStepForm);
  const isStepDraftEmpty = JSON.stringify(stepDraft) === JSON.stringify(emptyEtiquetteStepForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [stepReloadKey, setStepReloadKey] = useState(0);

  const saveConfirmStep = useConfirmationState<string>();

  // update / add step
  // save step then close the step editor and reload steps.
  async function confirmSaveStep(){
    if (!selectedTopic) return;

    try {
      if (selectedStep && selectedStep.stepId !== -1) {
        const formData = buildUpdateStepFormData(stepDraft, selectedStep, selectedFile);
        await updateStep(selectedStep.stepId, formData);
        toast.success("Step updated successfully!");
      } else {
        const formData = buildCreateStepFormData(stepDraft, selectedFile);
        await createStep(selectedTopic.topicId, formData);
        toast.success("Step created successfully!");
      }

      setStepReloadKey(p => p + 1);
      saveConfirmStep.close();
      setCloseEdit(p => p + 1);
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to save step:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }
  // #endregion

  // #region REMOVE STEP
  const removeConfirm = useConfirmationState<string>();
  const [pendingDeleteStep, setPendingDeleteStep] = useState<EtiquetteStep | null>(
    null,
  );

  async function removeStep() {
    if (!pendingDeleteStep) return;

    try {
      await deleteStep(pendingDeleteStep.stepId);
      toast.success("Step removed successfully!");

      setStepReloadKey(p => p + 1);
      removeConfirm.close();
      setPendingDeleteStep(null);
    } catch (error) {
      console.error("Failed to remove step:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }
  // #endregion

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        title={selectedTopic ? "Edit Topic" : "Create Topic"}
        onClose={onClose}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                isEditingStep ? setCloseEdit((p) => p + 1) : onClose()
              }
            >
              {isEditingStep ? "Back" : "Cancel"}
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                isEditingStep 
                  ? saveConfirmStep.open(selectedStep?.stepOrder ? `Step ${selectedStep?.stepOrder}` : "this step") 
                  : saveConfirmTopic.open(selectedTopic?.titleLong ?? topicDraft.titleLong)
              }}
              disabled={isEditingStep ? isStepDraftEmpty : isTopicDraftEmpty}
            >
              {isEditingStep ? "Save Step" : selectedTopic ? "Save Topic" : "Add Topic"}
            </button>
          </>
        }
      >
        <EtiquetteTopicEditModal
          topic={selectedTopic}
          onEditingStep={setIsEditingStep}
          onSelectedStep={setSelectedStep}
          onCloseStep={closeEdit}
          onChangeMeta={setTopicDraft}
          onChangeStep={setStepDraft}
          onFileChangeStep={setSelectedFile}
          onRemovingStep={(s) => {
            setPendingDeleteStep(s);
            removeConfirm.open(s?.stepOrder ? `Step ${s.stepOrder}` : "This Step");
          }}
          reloadSteps={stepReloadKey}
        />
      </BaseModal>

      <ConfirmationModal
        isOpen={saveConfirmTopic.isOpen}
        variant="constructive"
        actionLabel={selectedTopic ? "save changes to" : "create"}
        subjectName={saveConfirmTopic.subject ?? topicDraft.titleLong}
        confirmLabel={selectedTopic ? "Save" : "Create"}
        onConfirm={confirmSaveTopic}
        onCancel={saveConfirmTopic.close}
      />

      <ConfirmationModal
        isOpen={saveConfirmStep.isOpen}
        variant="constructive"
        actionLabel={selectedStep?.stepId != -1 ? "save changes to" : "create"}
        subjectName={saveConfirmStep.subject ?? "this step"}
        confirmLabel={selectedStep?.stepId != -1 ? "Save" : "Create"}
        onConfirm={confirmSaveStep}
        onCancel={saveConfirmStep.close}
      />

      <ConfirmationModal
        isOpen={removeConfirm.isOpen}
        variant="destructive"
        actionLabel="remove"
        subjectName={removeConfirm.subject ?? "this Step"}
        confirmLabel="Remove"
        onConfirm={removeStep}
        onCancel={removeConfirm.close}
      />
    </>
  );
}
