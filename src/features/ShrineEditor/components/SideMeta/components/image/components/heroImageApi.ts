import { apiFetch } from "../../../../../../../api/apiClient";
import type { ImageFullDto } from "../../../../../ShrineEditorApi";

// CREATE Hero Image
export async function createHeroImage(
  shrineId: number,
  formData: FormData,
): Promise<ImageFullDto> {
  return await apiFetch<ImageFullDto>(`/api/shrines/cms/${shrineId}/hero-image`, {
    method: "POST",
    body: formData,
  });
}

// UPDATE Hero Image
export async function updateHeroImage(
  shrineId: number,
  formData: FormData,
): Promise<ImageFullDto> {
  return await apiFetch<ImageFullDto>(`/api/shrines/cms/${shrineId}/hero-image`, {
    method: "PUT",
    body: formData,
  });
}

// DELETE Hero Image
export async function deleteHeroImage(
  shrineId: number,
  imageId: number,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/hero-image/${imageId}`, {
    method: "DELETE",
  });
}