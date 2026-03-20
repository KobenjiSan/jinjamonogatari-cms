import { apiFetch } from "../../../../../../../api/apiClient";
import type {
  ImageCMSDto,
  CreateImageRequest,
  UpdateImageRequest
} from "../../../../../../shared/images/helpers/ImageApi.types";

// GET Gallery by shrine
export async function getShrineGalleryById(id: number): Promise<ImageCMSDto[]> {
    return await apiFetch<ImageCMSDto[]>(`/api/shrines/cms/${id}/gallery`);
}

// CREATE Gallery Image
export async function createGalleryImage(
  shrineId: number,
  payload: CreateImageRequest,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/gallery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// UPDATE Gallery Image
export async function updateGalleryImage(
  imageId: number,
  payload: UpdateImageRequest,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/gallery/${imageId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// DELETE Gallery Image
export async function deleteGalleryImage(
  imageId: number,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/gallery/${imageId}`, {
    method: "DELETE",
  });
}
