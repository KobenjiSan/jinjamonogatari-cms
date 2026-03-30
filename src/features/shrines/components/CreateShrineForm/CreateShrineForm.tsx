import { useEffect, useState } from "react";
import styles from "./CreateShrineForm.module.css";
import type { CreateShrineRequest } from "../../shrinesApi";

type CreateShrineFormProps = {
  requestPing: number;
  onContentRequest: (content: CreateShrineRequest) => void;
}

export default function CreateShrineForm({requestPing, onContentRequest}: CreateShrineFormProps) {
  const [nameEn, setNameEn] = useState("");
  const [nameJp, setNameJp] = useState("");

  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  useEffect(() => {
    const content = {
      nameEn: nameEn.trim(),
      nameJp: nameJp.trim(),
      address: address.trim(),
      lat: lat.trim() === "" ? null : Number(lat),
      lon: lon.trim() === "" ? null : Number(lon),
    }

    onContentRequest(content);
  }, [requestPing])


  return (
    <form className={styles.wrapper}>
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Shrine Details</p>

        <div className="form-group">
          <label htmlFor="shrine-name-en" className="label">
            English Name
          </label>
          <input
            id="shrine-name-en"
            className="input"
            type="text"
            placeholder="Enter English shrine name"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="shrine-name-jp" className="label">
            Japanese Name
          </label>
          <input
            id="shrine-name-jp"
            className="input"
            type="text"
            placeholder="Enter Japanese shrine name"
            value={nameJp}
            onChange={(e) => setNameJp(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Location</p>
        <p className={styles.note}>
          Provide either a shrine address or exact latitude and longitude.
        </p>

        <div className="form-group">
          <label htmlFor="shrine-address" className="label">
            Address
          </label>
          <input
            id="shrine-address"
            className="input"
            type="text"
            placeholder="Enter shrine address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className={styles.orRow}>
          <div className={styles.orLine} />
          <span className={styles.orText}>OR</span>
          <div className={styles.orLine} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="shrine-lat" className="label">
              Latitude
            </label>
            <input
              id="shrine-lat"
              className="input"
              type="number"
              step="any"
              placeholder="35.6895"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="shrine-lon" className="label">
              Longitude
            </label>
            <input
              id="shrine-lon"
              className="input"
              type="number"
              step="any"
              placeholder="139.6917"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
            />
          </div>
        </div>
      </div>
    </form>
  );
}