import { useEffect, useState } from "react";
import styles from "./ImportForm.module.css";
import { getImportPreview, type ImportPreviewItemDto } from "../../shrinesApi";
import toast from "react-hot-toast";
import ImportMap from "./map/ImportMap";
import { useAuth } from "../../../../auth/AuthProvider";

type ImportFormProps = {
  onHasPreview: (items: ImportPreviewItemDto[]) => void;
};

export default function ImportForm({ onHasPreview }: ImportFormProps) {
  const [centerPoint, setCenterPoint] = useState<{
    lat: number;
    lon: number;
  }>();
  const { user } = useAuth();

  const [searchSize, setSearchSize] = useState("");
  const [maxResults, setMaxResults] = useState("");

  const [previewItems, setPreviewItems] = useState<ImportPreviewItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNoResults, setIsNoResults] = useState(false);

  // BUTTON COOLDOWN
  const COOLDOWN_MS = 15_000;

  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = cooldownUntil - Date.now();
      setSecondsLeft(Math.max(0, Math.ceil(remaining / 1000)));
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [cooldownUntil]);

  async function handleRunQuery() {
    if (Date.now() < cooldownUntil) return;

    setError(null);

    if (!centerPoint) {
      setError("A center marker is required. Click the map to place one.");
      return;
    }

    if (!searchSize) {
      setError("Search area size is required.");
      return;
    }

    if (!maxResults) {
      setError("A max number of shrines to return is required.");
      return;
    }

    const body = {
      center: centerPoint,
      searchSize: mapSearchSizeToNumber(searchSize),
      maxResults: Number(maxResults),
    };

    try {
      setIsNoResults(false);
      setIsLoading(true);

      const result = await getImportPreview(body);
      toast.success("Preview Request Successful.");

      // BLOCK SPAMMING
      setCooldownUntil(Date.now() + COOLDOWN_MS);

      if (result.length == 0) setIsNoResults(true);
      setPreviewItems(result);
      onHasPreview(result);
    } catch (error) {
      // General Error
      console.error("Failed to import preview:", error);

      // Toast
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");

      // Block spamming
      setCooldownUntil(Date.now() + COOLDOWN_MS);

      // UI
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
          {/* <h3 className={styles.sectionTitle}>Search Area</h3> */}
          {/* <div className={styles.note}>
            Search OpenStreetMap for shrines within a selected area, then
            import results. Begin by clicking the map.
          </div> */}
          <div className={styles.note}>
            <div className={styles.searchInstructions}>
              <strong>To find and import shrines:</strong>

              <ol>
                <li>
                  <strong>Click the map</strong> to select a center point.
                </li>
                <li>
                  Choose a <strong>Search Area Size</strong>.
                </li>
                <li>
                  Choose <strong>Max Shrines</strong>: the maximum number of new shrines to return.
                </li>
              </ol>

              <p>
                Click <strong>Search Selected Area</strong> to search
                OpenStreetMap. Review the found shrines, then click
                <strong> Import Found Shrines</strong> to finish.
              </p>
            </div>
          </div>
        </div>

        <ImportMap
          onHasCenterPoint={setCenterPoint}
          searchSize={searchSize}
          previewItems={previewItems}
        />

        <div className={styles.formRow}>
          <div className="form-group">
            <label htmlFor="import-radius" className="label">
              Search Area Size
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
              Max Shrines
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
              {user!.role == "Admin" && <option value="100">100</option>}
            </select>
          </div>
        </div>

        <div className={styles.actionArea}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRunQuery}
            disabled={isLoading || secondsLeft > 0}
          >
            {isLoading
              ? "Loading..."
              : secondsLeft > 0
                ? `Wait ${secondsLeft}s`
                : "Search Selected Area"}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </section>

      <div className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Shrines Found</h3>
        </div>

        {isLoading && <p>Loading preview...</p>}

        {!isLoading && previewItems.length === 0 && !isNoResults && !error && (
          <p>Run a query to preview results.</p>
        )}

        {!isLoading && previewItems.length === 0 && isNoResults && !error && (
          <p className={styles.error}>
            It seems no new shrines could be found. Try increasing the search
            radius or selecting a different location on the map and try again.
          </p>
        )}

        {!isLoading && previewItems.length > 0 && (
          <div className={styles.previewList}>
            {previewItems.map((item) => (
              <div key={item.importId} className={styles.previewCard}>
                <p>
                  <strong>Name:</strong> {item.name ?? "Unnamed result"}
                </p>
                <p>
                  <strong>Import ID:</strong> {item.importId}
                </p>
                <p>
                  <strong>Type:</strong> {item.sourceType}
                </p>
                <p>
                  <strong>OSM ID:</strong> {item.osmId}
                </p>
                <p>
                  <strong>Coordinates:</strong> {item.lat ?? "?"},{" "}
                  {item.lon ?? "?"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
