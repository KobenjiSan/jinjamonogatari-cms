import toast from "react-hot-toast";
import ConfirmationModal from "../../../../../../../../../shared/components/confirmationModal/ConfirmationModal";
import BaseModal from "../../../../../../../../../shared/components/modal/BaseModal";
import {
  createKami,
  createKamiInShrine,
  publishKamiReview,
  rejectKamiReview,
  submitKamiForReview,
  updateKami,
  type KamiCMSDto,
} from "../../kamiApi";
import KamiEditForm from "../kamiEditForm/KamiEditForm";
import { useEffect, useState } from "react";
import type { KamiFormValues } from "../kamiEditForm/helpers/KamiForm.types";
import {
  emptyKamiForm,
  mapKamiToForm,
} from "../kamiEditForm/helpers/KamiForm.helper";
import { useConfirmationState } from "../../../../../../../../shared/hooks/useConfirmationState";
import {
  buildCreateKamiFormData,
  buildUpdateKamiFormData,
} from "../../helpers/KamiTab.helpers";
import styles from "./KamiEditor.module.css";
import { useAuth } from "../../../../../../../../../auth/AuthProvider";

type KamiEditorProps = {
  isOpen: boolean;
  shrineId?: number;
  selectedKami: KamiCMSDto | null;
  isReadOnly: boolean;
  onClose: () => void;
  onReload: () => void;
  onSave: (kami: KamiCMSDto) => void;
};

export default function KamiEditor({
  isOpen,
  shrineId,
  selectedKami,
  isReadOnly,
  onClose,
  onReload,
  onSave,
}: KamiEditorProps) {
  const [kamiDraft, setKamiDraft] = useState<KamiFormValues>(emptyKamiForm);
  const isDraftEmpty =
    JSON.stringify(kamiDraft) === JSON.stringify(emptyKamiForm);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const saveConfirm = useConfirmationState<string>();
  async function confirmSaveKami() {
    if (isReadOnly) return;

    var updatedKami;

    try {
      if (selectedKami) {
        const formData = buildUpdateKamiFormData(
          kamiDraft,
          selectedKami,
          selectedFile,
        );
        updatedKami = await updateKami(selectedKami.kamiId, formData);
        toast.success("Kami updated successfully!");
      } else {
        if (shrineId) {
          const formData = buildCreateKamiFormData(kamiDraft, selectedFile);
          await createKamiInShrine(shrineId, formData);
          toast.success("Kami created successfully!");
        } else {
          const formData = buildCreateKamiFormData(kamiDraft, selectedFile);
          await createKami(formData);
          toast.success("Kami created successfully!");
        }
      }

      onReload();
      saveConfirm.close();
      if (selectedKami) {
        if (updatedKami) onSave(updatedKami);
        else {
          console.error("Failed to return updatedKami item");
          toast.error("An issue occured reloading kami after save");
          onClose();
        }
      } else {
        onClose();
      }
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to save kami:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }

  function close() {
    setSelectedFile(null);
    onClose();
  }

  const canSubmitForReview =
    selectedKami !== null &&
    JSON.stringify(kamiDraft) === JSON.stringify(mapKamiToForm(selectedKami)) &&
    selectedFile === null &&
    selectedKami.entityAudit?.canSubmit === true;

  const canViewSubmitForReview =
    selectedKami !== null &&
    selectedKami.status !== "Review" &&
    selectedKami.status !== "Published" &&
    !isReadOnly;

  const { user } = useAuth();
  const [isReadOnlyStatus, setIsReadOnlyStatus] = useState(true);

  useEffect(() => {
    const isEditor = user?.role === "Editor";
    const isDemo = user?.role === "Demo";
    const isAdmin = user?.role === "Admin";
    if (isEditor || isDemo) {
      console.log(`current role ${user!.role}`);
      setIsReadOnlyStatus(
        isReadOnly ||
          selectedKami?.status === "Review" ||
          selectedKami?.status === "Published",
      );
    } else if (isAdmin) {
      console.log(`correct role ${user?.role}`);
      setIsReadOnlyStatus(isReadOnly || selectedKami?.status === "Published");
    }
  }, [user, selectedKami?.status, isReadOnly]);

  const [isSubmittingForReview, setIsSubmittingForReview] = useState(false);
  const [isConfirmSubmitReviewOpen, setIsConfirmSubmitReviewOpen] =
    useState(false);

  // SUBMIT FOR REVIEW
  async function handleSubmitReview() {
    try {
      setIsSubmittingForReview(true);

      await submitKamiForReview(selectedKami!.kamiId);
      toast.success("Kami submitted for review successfully!");

      setIsConfirmSubmitReviewOpen(false);
    } catch (error) {
      console.error("Failed to submit Kami for review:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setIsSubmittingForReview(false);
    }

    onReload();
    onClose();
    setSelectedFile(null);
  }

  function openSubmitReview() {
    setIsConfirmSubmitReviewOpen(true);
  }

  function cancelSubmitReview() {
    setIsConfirmSubmitReviewOpen(false);
  }

  // PUBLISH KAMI
  const [isPublishingKami, setIsPublishingKami] = useState(false);
  const [isConfirmPublishOpen, setIsConfirmPublishOpen] = useState(false);

  async function handlePublishKami() {
    try {
      setIsPublishingKami(true);

      await publishKamiReview(selectedKami!.kamiId);
      toast.success("Kami published successfully!");

      setIsConfirmPublishOpen(false);
    } catch (error) {
      console.error("Failed to publish Kami:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setIsPublishingKami(false);
    }

    onReload();
    onClose();
    setSelectedFile(null);
  }

  function openPublishKami() {
    setIsConfirmPublishOpen(true);
  }

  function cancelPublishKami() {
    setIsConfirmPublishOpen(false);
  }

  // REJECT KAMI
  const [isRejectingKami, setIsRejectingKami] = useState(false);
  const [isConfirmRejectOpen, setIsConfirmRejectOpen] = useState(false);

  async function handleRejectKami(rejectMessage: string) {
    try {
      setIsRejectingKami(true);

      await rejectKamiReview(selectedKami!.kamiId, { message: rejectMessage });
      toast.success("Kami rejected successfully!");

      setIsConfirmRejectOpen(false);
    } catch (error) {
      console.error("Failed to Reject Kami:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setIsRejectingKami(false);
    }

    onReload();
    onClose();
    setSelectedFile(null);
  }

  function openRejectKami() {
    setIsConfirmRejectOpen(true);
  }

  function cancelRejectKami() {
    setIsConfirmRejectOpen(false);
  }

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        title={selectedKami ? "Edit Kami" : "Add Kami"}
        onClose={close}
        footer={
          <div className={styles.modalFooter}>
            {selectedKami?.status === "Review" && !isReadOnlyStatus ? (
              <div className={styles.reviewButtons}>
                <p className="text-muted">
                  Review:
                </p>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  aria-label="reject"
                  onClick={openRejectKami}
                  disabled={isRejectingKami}
                  title="Submit Rejection"
                >
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  aria-label="Publish"
                  onClick={openPublishKami}
                  disabled={
                    !selectedKami.entityAudit?.canSubmit || isPublishingKami
                  }
                  title={
                    selectedKami.entityAudit?.canSubmit
                      ? "Kami is ready for publishing"
                      : "Resolve all errors before publishing"
                  }
                >
                  <span>Publish</span>
                </button>
              </div>
            ) : (
              <>
                {canViewSubmitForReview && (
                  <div className={styles.reviewButtons}>
                    <p className="text-muted">
                      Audit: 
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={openSubmitReview}
                      disabled={!canSubmitForReview || isSubmittingForReview}
                      title={
                        selectedKami.entityAudit?.canSubmit
                          ? "Kami is ready to submit"
                          : "Resolve all errors before submitting"
                      }
                    >
                      Submit for Review
                    </button>
                  </div>
                )}
              </>
            )}

            <div className={styles.mainButtons}>
              <button type="button" className="btn btn-ghost" onClick={close}>
                Cancel
              </button>

              {!isReadOnlyStatus && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    saveConfirm.open(selectedKami?.nameEn ?? kamiDraft.nameEn)
                  }
                  disabled={isDraftEmpty}
                >
                  {selectedKami ? "Save Kami" : "Add Kami"}
                </button>
              )}
            </div>
          </div>
        }
      >
        <KamiEditForm
          shrineId={shrineId}
          kami={selectedKami}
          onChange={setKamiDraft}
          onFileChange={setSelectedFile}
          isReadOnly={isReadOnlyStatus}
        />
      </BaseModal>

      <ConfirmationModal
        isOpen={saveConfirm.isOpen}
        variant="constructive"
        actionLabel={selectedKami ? "save changes to" : "create"}
        subjectName={saveConfirm.subject ?? kamiDraft.nameEn}
        confirmLabel={selectedKami ? "Save" : "Create"}
        onConfirm={confirmSaveKami}
        onCancel={saveConfirm.close}
      />

      {/* Confirm Submit Review Modal */}
      <ConfirmationModal
        isOpen={isConfirmSubmitReviewOpen}
        variant="constructive"
        actionLabel={`Submit Kami #${String(selectedKami?.kamiId)} For Review`}
        confirmLabel="Submit"
        onConfirm={handleSubmitReview}
        onCancel={cancelSubmitReview}
      />

      {/* Confirm Publish Modal */}
      <ConfirmationModal
        isOpen={isConfirmPublishOpen}
        variant="constructive"
        actionLabel={`Publish Kami #${String(selectedKami?.kamiId)}`}
        message={`Are you sure you want to Publish Kami #${String(selectedKami?.kamiId)}?`}
        confirmLabel="Publish"
        onConfirm={handlePublishKami}
        onCancel={cancelPublishKami}
      />

      {/* Confirm Reject Modal */}
      <ConfirmationModal
        isOpen={isConfirmRejectOpen}
        variant="destructive"
        actionLabel={`Reject Kami #${String(selectedKami?.kamiId)}`}
        confirmLabel="Reject"
        message={`You must provide a message with reason(s) for rejection.`}
        hasInputOption={true}
        onConfirm={() => {}}
        onCancel={cancelRejectKami}
        onInputValue={(message) => handleRejectKami(message)}
      />
    </>
  );
}
