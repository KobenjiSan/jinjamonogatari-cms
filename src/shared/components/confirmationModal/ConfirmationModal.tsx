import { useEffect, useState } from "react";
import styles from "./ConfirmationModal.module.css";

type ConfirmationVariant = "destructive" | "constructive";

type ConfirmationModalProps = {
  isOpen: boolean;
  variant?: ConfirmationVariant;
  title?: string;
  actionLabel: string;
  subjectName?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  hasInputOption?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onInputValue?: (inputMessage: string) => void;
};

export default function ConfirmationModal({
  isOpen,
  variant = "constructive",
  title,
  actionLabel,
  subjectName,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  isLoading = false,
  hasInputOption = false,
  onConfirm,
  onCancel,
  onInputValue,
}: ConfirmationModalProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const resolvedTitle =
    title ??
    (variant === "destructive"
      ? `${capitalize(actionLabel)} ${subjectName ? ` "${subjectName}"` : "item"}?`.trim()
      : `${capitalize(actionLabel)} ${subjectName ? ` "${subjectName}"` : "item"}?`);

  const resolvedMessage =
    message ??
    `Are you sure you want to ${actionLabel}${subjectName ? ` "${subjectName}"` : ""}?`;

  const resolvedConfirmLabel =
    confirmLabel ??
    (variant === "destructive"
      ? capitalize(actionLabel)
      : capitalize(actionLabel));

  const confirmButtonClass =
    variant === "destructive" ? "btn btn-danger" : "btn btn-success";

  function handleConfirm() {
    if (hasInputOption) {
      onInputValue!(inputValue);
      setInputValue("");
    } else onConfirm();
  }

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
      >
        <div className={styles.content}>
          <div
            className={`${styles.iconWrapper} ${
              variant === "destructive"
                ? styles.iconDanger
                : styles.iconConstructive
            }`}
            aria-hidden="true"
          >
            <span className={styles.icon}>
              {variant === "destructive" ? "!" : "✓"}
            </span>
          </div>

          <h2 id="confirmation-modal-title" className={styles.title}>
            {resolvedTitle}
          </h2>

          <p className={styles.message}>{resolvedMessage}</p>

          {hasInputOption && (
            <textarea
              className={`textarea ${styles.textArea}`}
              rows={3}
              placeholder="Enter message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          )}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className={confirmButtonClass}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Working..." : resolvedConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
