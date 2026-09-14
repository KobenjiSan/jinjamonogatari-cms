import styles from "../SideMeta.module.css";
import type { ShrineMetaDto } from "../../../ShrineEditorApi";
import MetaMap from "./map/MetaMap";

type LocationSectionProps = {
  formData: ShrineMetaDto | null;
  isChanged: <K extends keyof ShrineMetaDto>(field: K) => boolean;
  updateField: <K extends keyof ShrineMetaDto>(
    field: K,
    value: ShrineMetaDto[K],
  ) => void;
  isReadOnly: boolean;
};

export default function LocationSection({
  formData,
  isChanged,
  updateField,
  isReadOnly,
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
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
            disabled={isReadOnly}
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
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
            disabled={isReadOnly}
          />
        </div>
      </div>
      <MetaMap
        location={{lat: Number(formData?.lat) ?? 0, lon: Number(formData?.lon) ?? 0}}
      />
    </div>
  );
}
