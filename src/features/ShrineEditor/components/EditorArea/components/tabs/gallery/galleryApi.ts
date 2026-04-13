import { apiFetch } from "../../../../../../../api/apiClient";
import type {
  ImageCMSDto,
} from "../../../../../../shared/images/helpers/ImageApi.types";

// GET Gallery by shrine
export async function getShrineGalleryById(id: number): Promise<ImageCMSDto[]> {
    return await apiFetch<ImageCMSDto[]>(`/api/shrines/cms/${id}/gallery`);
}

// CREATE Gallery Image
export async function createGalleryImage(
  shrineId: number,
  formData: FormData,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/gallery`, {
    method: "POST",
    body: formData,
  });
}

// UPDATE Gallery Image
export async function updateGalleryImage(
  imageId: number,
  formData: FormData,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/gallery/${imageId}`, {
    method: "PUT",
    body: formData,
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
