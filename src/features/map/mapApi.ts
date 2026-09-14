import { apiFetch } from "../../api/apiClient";

export type ShrineMapPointsCMSDto = {
    shrineId: number;
    lat: number;
    lon: number;
    status: string;
};

export async function getShrineMapPoints(): Promise<ShrineMapPointsCMSDto[]> {
  return await apiFetch<ShrineMapPointsCMSDto[]>(`/api/shrines/cms/map`);
}