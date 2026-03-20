import { useEffect, useState } from "react";
import { getShrineGalleryById } from "../../galleryApi";
import type { ImageCMSDto } from "../../../../../../../../shared/images/helpers/ImageApi.types";
import styles from "./GalleryList.module.css";

type GalleryListProps = {
  shrineId: number;
  onEdit?: (imageItem: ImageCMSDto) => void;
  onRemove: (imageItem: ImageCMSDto) => void;
  onLoaded?: (imageItems: ImageCMSDto[]) => void;
  reloadKey?: number;
};

export default function GalleryList({
  shrineId,
  onEdit,
  onRemove,
  onLoaded,
  reloadKey,
}: GalleryListProps) {
  const [imageItems, setImageItems] = useState<ImageCMSDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);

      try {
        const result = await getShrineGalleryById(shrineId);
        setImageItems(result);
        onLoaded?.(result);
      } catch (err) {
        console.error("Failed to retrieve gallery list", err);
        setImageItems([]);
        onLoaded?.([]);
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, [shrineId, reloadKey, onLoaded]);

  if (loading) {
    return (
      <div className="card">
        <p className="text-md text-secondary">Loading...</p>
      </div>
    );
  }

  if (imageItems.length === 0) {
    return (
      <div className="card">
        <p className="text-md text-secondary">No gallery images found.</p>
      </div>
    );
  }

  return (
    <div className="listShell">
      <div className={styles.listGrid}>
        <div className={`headerCell ${styles.previewCol}`}>Preview</div>
        <div className={`headerCell ${styles.infoCol}`}>Information</div>
        <div className={`headerCell ${styles.timestampsCol}`}>
          Created / Updated
        </div>
        <div className={`headerCell ${styles.actionsCol}`}>Actions</div>

        {imageItems.map((item) => (
          <div key={item.imgId} className="rowGroup">
            <div className={`bodyCell ${styles.previewCol}`}>
              <div className={styles.previewWrap}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title ?? "Gallery image"}
                    className={styles.previewImage}
                  />
                ) : (
                  <div className={styles.previewPlaceholder}>No Image</div>
                )}
              </div>
            </div>

            <div className={`bodyCell ${styles.infoCol}`}>
              <div className={styles.infoBlock}>
                <p className="primaryText">{item.title ?? "-"}</p>
                <p className={styles.descText}>{item.desc ?? "-"}</p>
              </div>
            </div>

            <div className={`bodyCell ${styles.timestampsCol}`}>
              <div className="listStackSm">
                <p className="metaText">
                  Created:{" "}
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "-"}
                </p>
                <p className="metaText">
                  Updated:{" "}
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>

            <div className={`bodyCell ${styles.actionsCol}`}>
              <div className={styles.actionStack}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => onEdit?.(item)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => onRemove(item)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
