import styles from "../../SideMeta.module.css";
import type { ShrineMetaDto } from "../../../../ShrineEditorApi";

type AddressSectionProps = {
  formData: ShrineMetaDto | null;
  isChanged: <K extends keyof ShrineMetaDto>(field: K) => boolean;
  updateField: <K extends keyof ShrineMetaDto>(
    field: K,
    value: ShrineMetaDto[K]
  ) => void;
  formatAddress: (data?: ShrineMetaDto | null) => string;
};

export default function AddressSection({
  formData,
  isChanged,
  updateField,
  formatAddress,
}: AddressSectionProps) {
  return (
    <div className={styles.block}>
      <p className={styles.blockTitle}>Address</p>

      <div className="form-group">
        <label className="label">Address Preview</label>
        <div>
          <pre className={styles.addressText}>{formatAddress(formData)}</pre>
        </div>
      </div>

      <div className="form-group">
        <label className="label" htmlFor="prefecture">
          Prefecture
        </label>
        <input
          id="prefecture"
          className={`input ${isChanged("prefecture") ? styles.changedInput : ""}`}
          type="text"
          placeholder="Kyoto"
          value={formData?.prefecture ?? ""}
          onChange={(e) => updateField("prefecture", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="label" htmlFor="city">
          City
        </label>
        <input
          id="city"
          className={`input ${isChanged("city") ? styles.changedInput : ""}`}
          type="text"
          placeholder="Kyoto"
          value={formData?.city ?? ""}
          onChange={(e) => updateField("city", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="label" htmlFor="ward">
          Ward
        </label>
        <input
          id="ward"
          className={`input ${isChanged("ward") ? styles.changedInput : ""}`}
          type="text"
          placeholder="Fushimi-ku"
          value={formData?.ward ?? ""}
          onChange={(e) => updateField("ward", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="label" htmlFor="locality">
          Locality
        </label>
        <input
          id="locality"
          className={`input ${isChanged("locality") ? styles.changedInput : ""}`}
          type="text"
          placeholder="Fukakusa Yabunouchicho"
          value={formData?.locality ?? ""}
          onChange={(e) => updateField("locality", e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="label" htmlFor="postalCode">
            Postal Code
          </label>
          <input
            id="postalCode"
            className={`input ${isChanged("postalCode") ? styles.changedInput : ""}`}
            type="text"
            placeholder="612-0882"
            value={formData?.postalCode ?? ""}
            onChange={(e) => updateField("postalCode", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="label" htmlFor="country">
            Country
          </label>
          <input
            id="country"
            className={`input ${isChanged("country") ? styles.changedInput : ""}`}
            type="text"
            placeholder="Japan"
            value={formData?.country ?? ""}
            onChange={(e) => updateField("country", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}