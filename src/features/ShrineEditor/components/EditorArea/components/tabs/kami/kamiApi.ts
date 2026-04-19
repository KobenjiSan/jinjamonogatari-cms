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
import type { KamiSearchFilters } from "../../../../../../shared/kami/components/KamiFilters/KamiFilters";
import type { KamiListPagination } from "../../../../../../shared/kami/components/KamiList/KamiList";
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
  audit: EntityAuditDto | null;
};


// GET Kami by shrine
export async function getShrineKamiById(id: number): Promise<KamiCMSDto[]> {
  return await apiFetch<KamiCMSDto[]>(`/api/shrines/cms/${id}/kami`);
}

// GET all Kami
export async function getAllShrineKamiList(): Promise<KamiCMSDto[]> {
  return await apiFetch<KamiCMSDto[]>("/api/shrines/cms/kami");
}

// GET all Kami
export type KamiListResult = {
  kami: KamiCMSDto[];
  totalCount: number;
};

export async function getAllKami(filters: KamiSearchFilters | null, pagination: KamiListPagination): Promise<KamiListResult> {
  const page = pagination?.pageNumber ? `?page=${pagination.pageNumber}` : "?page=1";
  const pageSize = pagination?.pageSize ? `&pageSize=${pagination.pageSize}` : "&pageSize=5";
  const searchQuery = filters?.searchValue ? `&searchQuery=${filters.searchValue}` : "";
  const sort = filters?.sorting ? `&sort=${filters.sorting}` : "";

  return await apiFetch<KamiListResult>(`/api/kami/cms/kami${page}${pageSize}${searchQuery}${sort}`);
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
  formData: FormData
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/kami`, {
    method: "POST",
    body: formData,
  });
}

export async function createKami(
  formData: FormData
): Promise<void> {
  await apiFetch<void>("/api/kami", {
    method: "POST",
    body: formData,
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
  formData: FormData
): Promise<void> {
  await apiFetch<void>(`/api/kami/${kamiId}`, {
    method: "PUT",
    body: formData,
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

// DELETE Kami
export async function deleteKami(kamiId: number): Promise<void> {
  await apiFetch<void>(`/api/kami/${kamiId}`, {
    method: "DELETE",
  });
}