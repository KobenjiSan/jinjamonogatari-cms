import { apiFetch } from "../../../../../../../api/apiClient";
import type {
  CitationCMSDto,
  CitationCreateChangesRequest,
  CitationListChangesRequest,
} from "../../../../../../shared/citations/helpers/CitationApi.types";
import type {
  ImageCMSDto,
  CreateImageRequest,
  ImageChangeRequest,
} from "../../../../../../shared/images/helpers/ImageApi.types";
import type { EntityAuditDto } from "../status/statusApi";

// GET Folklore by shrine
export type FolkloreCMSDto = {
  folkloreId: number;
  sortOrder: number | null;
  title: string | null;
  information: string | null;
  status: string | null;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  image: ImageCMSDto | null;
  citations: CitationCMSDto[];
  audit: EntityAuditDto;
};

export async function getShrineFolkloreById(id: number): Promise<FolkloreCMSDto[]> {
  return await apiFetch<FolkloreCMSDto[]>(`/api/shrines/cms/${id}/folklore`);
}

// CREATE Folklore
export type CreateFolkloreRequest = {
  sortOrder: number | null;
  title: string | null;
  information: string | null;
  image: CreateImageRequest | null;
  citations: CitationCreateChangesRequest;
};

export async function createFolklore(
  shrineId: number,
  payload: CreateFolkloreRequest,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/folklore`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// UPDATE Folklore
export type UpdateFolkloreRequest = {
  basic: {
    sortOrder: number | null;
    title: string | null;
    information: string | null;
  };
  image: ImageChangeRequest;
  citations: CitationListChangesRequest;
};

export async function updateFolklore(
  folkloreId: number,
  payload: UpdateFolkloreRequest,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/folklore/${folkloreId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// DELETE Folklore
export async function deleteFolklore(folkloreId: number): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/folklore/${folkloreId}`, {
    method: "DELETE",
  });
}