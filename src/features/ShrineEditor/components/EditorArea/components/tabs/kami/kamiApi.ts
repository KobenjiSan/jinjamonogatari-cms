// Handles api calls for shrine editor kami
import { apiFetch } from "../../../../../../../api/apiClient";
import type { 
  CitationCMSDto,
  CreateCitationRequest,
  CitationListChangesRequest,
  LinkExistingCitationRequest
 } from "../../../../../../shared/citations/helpers/CitationApi.types";
import type {
  ImageCMSDto,
  CreateImageRequest,
  ImageChangeRequest
} from "../../../../../../shared/images/helpers/ImageApi.types"
import type { EntityAuditDto } from "../status/statusApi";

// GET Kami by shrine
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
  audit: EntityAuditDto;
};


// GET Kami by shrine
export async function getShrineKamiById(id: number): Promise<KamiCMSDto[]> {
  return await apiFetch<KamiCMSDto[]>(`/api/shrines/cms/${id}/kami`);
}

// GET all Kami
export async function getAllShrineKamiList(): Promise<KamiCMSDto[]> {
  return await apiFetch<KamiCMSDto[]>("/api/shrines/cms/kami");
}

// CREATE Kami
export type CreateKamiInShrineRequest = {
  nameEn: string | null;
  nameJp: string | null;
  desc: string | null;
  image: CreateImageRequest | null;
  citations: {
    create: CreateCitationRequest[];
    linkExisting: LinkExistingCitationRequest[];
  };
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

// UPDATE Kami
export type UpdateKamiRequest = {
  basic: {
    nameEn: string | null;
    nameJp: string | null;
    desc: string | null;
  };
  image: ImageChangeRequest;
  citations: CitationListChangesRequest;
};

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


// LINK Kami
export async function linkKamiToShrine(
  shrineId: number,
  kamiId: number,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/kami/${kamiId}`, {
    method: "POST",
  });
}

// UNLINK Kami
export async function unlinkKamiFromShrine(
  shrineId: number,
  kamiId: number,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/kami/${kamiId}`, {
    method: "DELETE",
  });
}