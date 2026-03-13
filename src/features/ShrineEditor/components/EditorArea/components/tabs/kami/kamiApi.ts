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
};

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

export type CreateKamiInShrineRequest = {
  nameEn: string | null;
  nameJp: string | null;
  desc: string | null;
  image: CreateImageRequest | null;
  citations: CreateCitationRequest[];
};

export type UpdateKamiRequest = {
  basic: {
    nameEn: string | null;
    nameJp: string | null;
    desc: string | null;
  };
  image: ImageChangeRequest;
  citations: CitationListChangesRequest;
};

export async function createKamiInShrine(
  shrineId: number,
  payload: CreateKamiInShrineRequest,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/kami`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updateKami(
  kamiId: number,
  payload: UpdateKamiRequest,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/kami/${kamiId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function linkKamiToShrine(
  shrineId: number,
  kamiId: number,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/kami/${kamiId}`, {
    method: "POST",
  });
}

export async function unlinkKamiFromShrine(
  shrineId: number,
  kamiId: number,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/kami/${kamiId}`, {
    method: "DELETE",
  });
}

// GET kami by shrine
export async function getShrineKamiById(id: number): Promise<KamiCMSDto[]> {
  return await apiFetch<KamiCMSDto[]>(`/api/shrines/cms/${id}/kami`);
}

// GET all kami in a list
export async function getAllShrineKamiList(): Promise<KamiCMSDto[]> {
  return await apiFetch<KamiCMSDto[]>("/api/shrines/cms/kami");
}