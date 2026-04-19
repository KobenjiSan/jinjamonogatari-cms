import toast from "react-hot-toast";
import ConfirmationModal from "../../../../../../../../../shared/components/confirmationModal/ConfirmationModal";
import BaseModal from "../../../../../../../../../shared/components/modal/BaseModal";
import { createKami, createKamiInShrine, updateKami, type KamiCMSDto } from "../../kamiApi";
import KamiEditForm from "../kamiEditForm/KamiEditForm";
import { useState } from "react";
import type { KamiFormValues } from "../kamiEditForm/helpers/KamiForm.types";
import { emptyKamiForm } from "../kamiEditForm/helpers/KamiForm.helper";
import { useConfirmationState } from "../../../../../../../../shared/hooks/useConfirmationState";
import {
  buildCreateKamiFormData,
  buildUpdateKamiFormData,
} from "../../helpers/KamiTab.helpers";

type KamiEditorProps = {
  isOpen: boolean;
  shrineId?: number;
  selectedKami: KamiCMSDto | null;
  isReadOnly: boolean;
  onClose: () => void;
  onReload: () => void;
};

export default function KamiEditor({
  isOpen,
  shrineId,
  selectedKami,
  isReadOnly,
  onClose,
  onReload,
}: KamiEditorProps) {
  const [kamiDraft, setKamiDraft] = useState<KamiFormValues>(emptyKamiForm);
  const isDraftEmpty =
    JSON.stringify(kamiDraft) === JSON.stringify(emptyKamiForm);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const saveConfirm = useConfirmationState<string>();
  async function confirmSaveKami() {
    if (isReadOnly) return;

    try {
      if (selectedKami) {
        const formData = buildUpdateKamiFormData(kamiDraft, selectedKami, selectedFile);
        await updateKami(selectedKami.kamiId, formData);
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
      onClose();
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to save kami:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    }
  }

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        title={selectedKami ? "Edit Kami" : "Add Kami"}
        onClose={onClose}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>

            {!isReadOnly && (
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
          </>
        }
      >
        <KamiEditForm
          shrineId={shrineId}
          kami={selectedKami}
          onChange={setKamiDraft}
          onFileChange={setSelectedFile}
          isReadOnly={isReadOnly}
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
    </>
  );
}
