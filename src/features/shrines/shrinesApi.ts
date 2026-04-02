// Handles api calls for shrines

import { apiFetch } from "../../api/apiClient";
import type { ShrineSearchFilters } from "./components/Filters/Filters";
import type { ShrineListPagination } from "./components/shrineList/ShrineList";

export type ShrineListResult = {
  shrines: ShrineListDto[];
  totalCount: number;
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
  errorCount: number;
};

// GET / api/shrines/cms/list?status=...
export async function getShrineList(status: string, filters: ShrineSearchFilters | null, pagination: ShrineListPagination): Promise<ShrineListResult> {
  const statusQuery = status ? `?status=${status}` : "";
  const prefecture = filters?.prefecture ? `&prefecture=${filters.prefecture}` : "";
  const searchQuery = filters?.searchValue ? `&searchQuery=${filters.searchValue}` : "";
  const sort = filters?.sorting ? `&sort=${filters.sorting}` : "";
  const page = pagination?.pageNumber ? `&page=${pagination.pageNumber}` : "&page=1";
  const pageSize = pagination?.pageSize ? `&pageSize=${pagination.pageSize}` : "&pageSize=5";
  
  return await apiFetch<ShrineListResult>(`/api/shrines/cms/list${statusQuery}${prefecture}${searchQuery}${sort}${page}${pageSize}`);
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

// DELETE /api/shrines/cms/delete/{shrineId}
export async function deleteShrine(shrineId: number): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/delete/${shrineId}`, {
    method: "DELETE",
  });
}