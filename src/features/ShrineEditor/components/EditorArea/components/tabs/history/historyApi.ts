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

// GET History by shrine
export type HistoryCMSDto = {
  historyId: number;
  eventDate: string | null;
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

export async function getShrineHistoryById(
  id: number,
): Promise<HistoryCMSDto[]> {
  return await apiFetch<HistoryCMSDto[]>(`/api/shrines/cms/${id}/history`);
}

// CREATE History
export type CreateHistoryRequest = {
  eventDate: string | null;
  sortOrder: number | null;
  title: string | null;
  information: string | null;
  image: CreateImageRequest | null;
  citations: CitationCreateChangesRequest;
};

export async function createHistory(
  shrineId: number,
  payload: CreateHistoryRequest,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// UPDATE History
export type UpdateHistoryRequest = {
  basic: {
    eventDate: string | null;
    sortOrder: number | null;
    title: string | null;
    information: string | null;
  };
  image: ImageChangeRequest;
  citations: CitationListChangesRequest;
};

export async function updateHistory(
  historyId: number,
  payload: UpdateHistoryRequest,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/history/${historyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// DELETE History
export async function deleteHistory(historyId: number): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/history/${historyId}`, {
    method: "DELETE",
  });
}