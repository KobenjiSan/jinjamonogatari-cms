import { apiFetch } from "../../api/apiClient";
import type { ShrineListDto } from "../shrines/shrinesApi";

export type ShrineMapPointsCMSDto = {
    shrineId: number;
    lat: number;
    lon: number;
    status: string;
};

export async function getShrineMapPoints(): Promise<ShrineMapPointsCMSDto[]> {
  return await apiFetch<ShrineMapPointsCMSDto[]>(`/api/shrines/cms/map`);
}

type ShrineMapPopupResponse = {
  shrineMapPopup: ShrineListDto;
};

export async function getShrineMapPopup(shrineId: number): Promise<ShrineMapPopupResponse> {
  return await apiFetch<ShrineMapPopupResponse>(`/api/shrines/cms/map/${shrineId}`);
}