import styles from "../SideMeta.module.css";
import type { ShrineMetaDto } from "../../../ShrineEditorApi";

type LocationSectionProps = {
  formData: ShrineMetaDto | null;
  isChanged: <K extends keyof ShrineMetaDto>(field: K) => boolean;
  updateField: <K extends keyof ShrineMetaDto>(
    field: K,
    value: ShrineMetaDto[K]
  ) => void;
};

export default function LocationSection({
  formData,
  isChanged,
  updateField,
}: LocationSectionProps) {
  return (
    <div className={styles.block}>
      <p className={styles.blockTitle}>Location</p>

      <div className="form-row">
        <div className="form-group">
          <label className="label" htmlFor="lat">
            Latitude
          </label>
          <input
            id="lat"
            className={`input ${isChanged("lat") ? styles.changedInput : ""}`}
            type="number"
            step="any"
            placeholder="34.9671"
            value={formData?.lat ?? ""}
            onChange={(e) =>
              updateField(
                "lat",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          />
        </div>

        <div className="form-group">
          <label className="label" htmlFor="lon">
            Longitude
          </label>
          <input
            id="lon"
            className={`input ${isChanged("lon") ? styles.changedInput : ""}`}
            type="number"
            step="any"
            placeholder="135.7727"
            value={formData?.lon ?? ""}
            onChange={(e) =>
              updateField(
                "lon",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          />
        </div>
      </div>
    </div>
  );
}