// Handles api calls for shrines

import { apiFetch } from "../../api/apiClient";

export type ShrineListResult = {
  shrines: ShrineListDto[];
};

export type ShrineListDto = {
  shrineId: number;
  nameEn: string | null;
  nameJp: string | null;
  status: string | null;
  city: string | null;
  lat: number | null;
  lon: number | null;
  updatedAt: string;
};

// GET / api/shrines/cms/list?status=...
export async function getShrineList(status: string): Promise<ShrineListResult> {
  const query = status ? `?status=${status}` : "";
  return await apiFetch<ShrineListResult>(`/api/shrines/cms/list${query}`);
}

// POST /api/shrines/cms/import-preview
export type ImportPreviewItemDto = {
  importId: string;
  name: string | null;
  lat: number | null;
  lon: number | null;
  sourceType: string;
  osmId: number;
  reasonIncluded: string | null;
};

export async function getImportPreview(body: unknown,): Promise<ImportPreviewItemDto[]> {
  return await apiFetch<ImportPreviewItemDto[]>("/api/shrines/cms/import-preview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}


// POST /api/shrines/cms/import
export type ImportShrinesRequest = {
  previews: ImportPreviewItemRequest[];
};

export type ImportPreviewItemRequest = {
  importId: string;
  name: string | null;
  lat: number;
  lon: number;
};

export async function importShrines(body: ImportShrinesRequest,): Promise<void> {
  await apiFetch<void>("/api/shrines/cms/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// POST /api/shrines/cms/create
export type CreateShrineRequest = {
  nameEn: string | null;
  nameJp: string | null;
  address: string | null;
  lat: number | null;
  lon: number | null;
};

export async function createShrine(body: CreateShrineRequest): Promise<void> {
  await apiFetch<void>("/api/shrines/cms/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
