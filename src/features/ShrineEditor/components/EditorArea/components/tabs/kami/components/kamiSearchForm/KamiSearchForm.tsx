import { useEffect, useMemo, useState } from "react";
import type { KamiCMSDto } from "../../kamiApi";
import KamiList from "../kamiList/KamiList";
import styles from "./KamiSearchForm.module.css";

type KamiSearchFormProps = {
  existingKamiIds?: number[];
  onSelectionChange?: (selectedKami: KamiCMSDto[]) => void;
};

export default function KamiSearchForm({
  existingKamiIds = [],
  onSelectionChange,
}: KamiSearchFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKami, setSelectedKami] = useState<KamiCMSDto[]>([]);

  const existingKamiIdSet = useMemo(
    () => new Set(existingKamiIds),
    [existingKamiIds],
  );

  const disabledKamiIds = useMemo(
    () => [
      ...existingKamiIds,
      ...selectedKami.map((k) => k.kamiId),
    ],
    [existingKamiIds, selectedKami],
  );

  useEffect(() => {
    setSelectedKami((prev) => {
      const next = prev.filter((k) => !existingKamiIdSet.has(k.kamiId));

      if (next.length !== prev.length) {
        onSelectionChange?.(next);
      }

      return next;
    });
  }, [existingKamiIdSet, onSelectionChange]);

  function handleSelectKami(kami: KamiCMSDto) {
    if (existingKamiIdSet.has(kami.kamiId)) {
      return;
    }

    setSelectedKami((prev) => {
      const alreadySelected = prev.some((x) => x.kamiId === kami.kamiId);
      if (alreadySelected) return prev;

      const next = [...prev, kami];
      onSelectionChange?.(next);
      return next;
    });
  }

  function removeSelectedKami(kamiId: number) {
    setSelectedKami((prev) => {
      const next = prev.filter((k) => k.kamiId !== kamiId);
      onSelectionChange?.(next);
      return next;
    });
  }

  return (
    <div className={styles.wrapper}>
      <div className="form-group">
        <label htmlFor="kami-search" className="label">
          Search Kami
        </label>
        <input
          id="kami-search"
          className="input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by English name, Japanese name, or description"
        />
      </div>

      <div className={styles.listWrapper}>
        <KamiList
          disabledIds={disabledKamiIds}
          onSelect={handleSelectKami}
          searchTerm={searchTerm}
        />
      </div>

      <div className={styles.selectedBlock}>
        <p className={styles.selectedLabel}>Selected Kami</p>

        {selectedKami.length === 0 ? (
          <p className={styles.emptyText}>No kami selected yet.</p>
        ) : (
          <div className={styles.selectedList}>
            {selectedKami.map((kami) => (
              <div key={kami.kamiId} className={styles.selectedItem}>
                <div className={styles.selectedInfo}>
                  <p className={styles.selectedValue}>{kami.nameEn ?? "-"}</p>
                  <p className={styles.selectedSubValue}>{kami.nameJp ?? "-"}</p>
                </div>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => removeSelectedKami(kami.kamiId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}