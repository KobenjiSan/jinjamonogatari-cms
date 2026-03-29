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
