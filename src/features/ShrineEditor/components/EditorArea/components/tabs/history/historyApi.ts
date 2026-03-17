import { apiFetch } from "../../../../../../../api/apiClient";

// HELPERS
// CITATIONS
export type CitationCMSDto = {
  citeId: number;
  title: string | null;
  author: string | null;
  url: string | null;
  year: number | null;
  createdAt: string;
  updatedAt: string;
};
export type CreateCitationRequest = {
  title: string | null;
  author: string | null;
  url: string | null;
  year: number | null;
};
export type CitationRequest = {
  citeId: number;
  title: string | null;
  author: string | null;
  url: string | null;
  year: number | null;
};
export type CitationListChangesRequest = {
  create: CreateCitationRequest[];
  update: CitationRequest[];
  delete: number[];
};

// IMAGES
export type ImageCMSDto = {
  imgId: number;
  imageUrl: string | null;
  title: string | null;
  desc: string | null;
  citation: CitationCMSDto | null;
  createdAt: string;
  updatedAt: string;
};
export type CreateImageRequest = {
  imgSource: string | null;
  title: string | null;
  desc: string | null;
  citation: CreateCitationRequest | null;
};
export type ImageChangeRequest = {
  action: string;
  imgSource: string | null;
  title: string | null;
  desc: string | null;
  citation: CitationRequest | CreateCitationRequest | null;
};

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
};

export async function getShrineHistoryById(id: number): Promise<HistoryCMSDto[]> {
    return await apiFetch<HistoryCMSDto[]>(`/api/shrines/cms/${id}/history`);
}

// CREATE History
export type CreateHistoryRequest = {
  eventDate: string | null;
  sortOrder: number | null;
  title: string | null;
  information: string | null;
  image: CreateImageRequest | null;
  citations: CreateCitationRequest[];
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
export async function deleteHistory(
  historyId: number,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/history/${historyId}`, {
    method: "DELETE",
  });
}