import { apiFetch } from "../../../../../../../api/apiClient";
import type { CitationCMSDto } from "../../../../../../shared/citations/helpers/CitationApi.types";

// GET Citations by shrine
export type ShrineCitationCMSDto = {
  citation: CitationCMSDto;
  usageCount: number;
  linkedTo: CitationLinkedItemDto[];
};

export type CitationLinkedItemDto = {
  type: string;
  id: number;
  name: string;
};

export async function getShrineCitationsById(id: number): Promise<ShrineCitationCMSDto[]> {
    return await apiFetch<ShrineCitationCMSDto[]>(`/api/shrines/cms/${id}/citations`);
}

// GET /api/shrines/cms/{id}/citations-dropdown
export async function getShrineCitationsDropdownById(id: number): Promise<CitationCMSDto[]> {
    return await apiFetch<CitationCMSDto[]>(`/api/shrines/cms/${id}/citations-dropdown`);
}