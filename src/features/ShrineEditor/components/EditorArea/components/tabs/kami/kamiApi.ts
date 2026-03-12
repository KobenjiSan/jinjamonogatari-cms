// Handles api calls for shrine editor kami

import { apiFetch } from "../../../../../../../api/apiClient";

// Helpers
export type CitationCMSDto = {
  citeId: number;
  title: string | null;
  author: string | null;
  url: string | null;
  year: number | null;
  createdAt: string;
  updatedAt: string;
}

export type ImageCMSDto = {
  imgId: number;
  imageUrl: string | null;
  title: string | null;
  desc: string | null;
  citation: CitationCMSDto | null;
  createdAt: string;
  updatedAt: string;
};

export type KamiCMSDto = {
  kamiId: number;
  nameEn: string | null;
  nameJp: string | null;
  desc: string | null;
  status: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  image: ImageCMSDto | null;
  citations: CitationCMSDto[];
};

// GET kami by shrine
export async function getShrineKamiById(id: number): Promise<KamiCMSDto[]>{
    return await apiFetch<KamiCMSDto[]>(`/api/shrines/cms/${id}/kami`);
}

// GET all kami in a list
export async function getAllShrineKamiList(): Promise<KamiCMSDto[]>{
  return await apiFetch<KamiCMSDto[]>("/api/shrines/cms/kami");
}