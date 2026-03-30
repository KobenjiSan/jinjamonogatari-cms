import { useState } from "react";
import styles from "./ImportForm.module.css";
import { getImportPreview, type ImportPreviewItemDto } from "../../shrinesApi";

type ImportFormProps = {
  onHasPreview: (items: ImportPreviewItemDto[]) => void;
}

export default function ImportForm({onHasPreview}: ImportFormProps) {
  const [location, setLocation] = useState("");
  const [searchSize, setSearchSize] = useState("");
  const [maxResults, setMaxResults] = useState("");

  const [previewItems, setPreviewItems] = useState<ImportPreviewItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRunQuery() {
    setError(null);

    if (!location.trim()) {
      setError("Location is required.");
      return;
    }

    if (!searchSize) {
      setError("Search size is required.");
      return;
    }

    if (!maxResults) {
      setError("Max results is required.");
      return;
    }

    const body = {
      location: location.trim(),
      searchSize: mapSearchSizeToNumber(searchSize),
      maxResults: Number(maxResults),
    };

    try {
      setIsLoading(true);

      const result = await getImportPreview(body);

      setPreviewItems(result);
      onHasPreview(result);
    } catch (err) {
      console.error("Failed to load import preview.", err);
      setPreviewItems([]);
      setError("Failed to load import preview.");
    } finally {
      setIsLoading(false);
    }
  }

  function mapSearchSizeToNumber(size: string): number {
    switch (size) {
      case "small":
        return 1;
      case "medium":
        return 2;
      case "large":
        return 3;
      default:
        throw new Error("Invalid search size");
    }
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Search Area</h3>
          <p className={styles.note}>
            Note: Only unique shrine records will be imported. Existing imported
            records and non-shrine results will be skipped automatically.
          </p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="import-location" className="label">
            Location
          </label>
          <input
            id="import-location"
            type="text"
            className="input"
            placeholder="Enter city, address, or landmark"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className={styles.formRow}>
          <div className="form-group">
            <label htmlFor="import-radius" className="label">
              Search Size
            </label>
            <select 
              id="import-radius" 
              className="select"
              value={searchSize}
              onChange={(e) => setSearchSize(e.target.value)}
            >
              <option value="" disabled>
                Select search size
              </option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="import-limit" className="label">
              Max Results
            </label>
            <select 
              id="import-limit" 
              className="select"
              value={maxResults}
              onChange={(e) => setMaxResults(e.target.value)}
            >
              <option value="" disabled>
                Select amount
              </option>
              <option value="3">3</option>
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
            </select>
          </div>
        </div>

        <div className={styles.actionArea}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRunQuery}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Run Query"}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </section>

      <div className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Preview</h3>
        </div>

        {isLoading && <p>Loading preview...</p>}

        {!isLoading && previewItems.length === 0 && !error && (
          <p>Run a query to see preview results.</p>
        )}

        {!isLoading && previewItems.length > 0 && (
          <div className={styles.previewList}>
            {previewItems.map((item) => (
              <div key={item.importId} className={styles.previewCard}>
                <p><strong>Name:</strong> {item.name ?? "Unnamed result"}</p>
                <p><strong>Import ID:</strong> {item.importId}</p>
                <p><strong>Type:</strong> {item.sourceType}</p>
                <p><strong>OSM ID:</strong> {item.osmId}</p>
                <p>
                  <strong>Coordinates:</strong> {item.lat ?? "?"}, {item.lon ?? "?"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
