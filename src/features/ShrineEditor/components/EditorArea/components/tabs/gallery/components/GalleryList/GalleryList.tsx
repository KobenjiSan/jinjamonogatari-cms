import { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { getShrineGalleryById } from "../../galleryApi";
import type { ImageCMSDto } from "../../../../../../../../shared/images/helpers/ImageApi.types";
import styles from "./GalleryList.module.css";
import toast from "react-hot-toast";

type GalleryListProps = {
  shrineId: number;
  onEdit?: (imageItem: ImageCMSDto) => void;
  onRemove: (imageItem: ImageCMSDto) => void;
  onLoaded?: (imageItems: ImageCMSDto[]) => void;
  reloadKey?: number;
  isReadOnly: boolean;
};

export default function GalleryList({
  shrineId,
  onEdit,
  onRemove,
  onLoaded,
  reloadKey,
  isReadOnly,
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
      } catch (error) {
        console.error("Failed to retrieve gallery list", error);
        const err = error as { message?: string };
        toast.error(err.message ?? "Something went wrong");
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
        <div className="headerCell">ID</div>
        <div className="headerCell">Preview</div>
        <div className="headerCell">Information</div>
        <div className="headerCell">Created / Updated</div>
        <div className="headerCell">Issues</div>
        <div className="headerCell">Actions</div>

        {imageItems.map((item) => {
          const errorCount = item.audit?.errorCount ?? 0;
          const warningCount = item.audit?.warningCount ?? 0;
          const isClean = errorCount === 0 && warningCount === 0;

          return (
            <div key={item.imgId} className="rowGroup">
              <div className="bodyCell">
                <span className="metaText">{item.imgId}</span>
              </div>

              <div className="bodyCell">
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

              <div className="bodyCell">
                <div className={styles.infoBlock}>
                  <p className="primaryText">{item.title ?? "-"}</p>
                  <p className={styles.descText}>{item.desc ?? "-"}</p>
                  <p className={styles.metaLine}>
                    Citation: {item.citation?.title ?? "-"}
                  </p>
                </div>
              </div>

              <div className="bodyCell">
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

              <div className="bodyCell">
                {isClean ? (
                  <div className={styles.auditOk}>
                    <FiCheckCircle className={styles.auditOkIcon} />
                    <span>All good</span>
                  </div>
                ) : (
                  <div className={styles.auditStack}>
                    {errorCount > 0 && (
                      <span className={styles.errorPill}>
                        {errorCount} error{errorCount !== 1 ? "s" : ""}
                      </span>
                    )}

                    {warningCount > 0 && (
                      <span className={styles.warningPill}>
                        {warningCount} warning
                        {warningCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="bodyCell">
                <div className="actionGroup">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => onEdit?.(item)}
                  >
                    {!isReadOnly ? "Edit" : "View"}
                  </button>

                  {!isReadOnly && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => onRemove(item)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
