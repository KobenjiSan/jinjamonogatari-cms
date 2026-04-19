import { useState } from "react";

export function useConfirmationState<T>() {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState<T | null>(null);

  function open(nextSubject: T) {
    setSubject(nextSubject);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setSubject(null);
  }

  return {
    isOpen,
    subject,
    open,
    close,
  };
}