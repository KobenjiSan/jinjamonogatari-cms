// Handles api calls for the shrineEditor

import { apiFetch } from "../../api/apiClient";
import type { TagDto } from "../shared/tags/tagApi";

// Helpers 
export type ImageFullDto = {
  imgId: number;
  imageUrl: string | null;
  title: string | null;
  desc: string | null;
  citation: CitationDto | null;
};

export type CitationDto = {
  citeId: number;
  title: string | null;
  author: string | null;
  url: string | null;
  year: number | null;
};

// Shrine Meta
export type ShrineMetaDto = {
  // System
  shrineId: number;
  inputtedId: string;

  // Identity
  slug: string | null;
  nameEn: string | null;
  nameJp: string | null;
  shrineDesc: string | null;

  // Location
  lat: number | null;
  lon: number | null;

  // Address
  prefecture: string | null;
  city: string | null;
  ward: string | null;
  locality: string | null;
  postalCode: string | null;
  country: string | null;

  // Contact
  phoneNumber: string | null;
  email: string | null;
  website: string | null;

  // Hero Image
  image: ImageFullDto | null;

  // Publishing
  status: string;
  publishedAt: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Tags
  tags: TagDto[];
};

export async function getShrineMetaById(id: number): Promise<ShrineMetaDto>{
    return await apiFetch<ShrineMetaDto>(`/api/shrines/cms/${id}/meta`);
}


export type BasicMetaUpdateRequest = {
  slug: string | null;
  nameEn: string | null;
  nameJp: string | null;
  shrineDesc: string | null;
  lat: number | null;
  lon: number | null;
  prefecture: string | null;
  city: string | null;
  ward: string | null;
  locality: string | null;
  postalCode: string | null;
  country: string | null;
  phoneNumber: string | null;
  email: string | null;
  website: string | null;
};

export type TagLinkChangesRequest = {
  link: number[];
  unlink: number[];
};

export type HeroImageCitationRequest = {
  title: string | null;
  author: string | null;
  url: string | null;
  year: number | null;
};

export type HeroImageChangeRequest = {
  action: "none" | "create" | "update" | "delete";
  imageUrl: string | null;
  title: string | null;
  desc: string | null;
  citation: HeroImageCitationRequest | null;
};

export type UpdateShrineMetaRequest = {
  basic: BasicMetaUpdateRequest;
  tags: TagLinkChangesRequest;
  heroImage: HeroImageChangeRequest;
};

export async function updateShrineMeta(
  id: number,
  body: unknown,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${id}/meta`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// GET /api/shrines/cms/{id}/notes
export async function getShrineNotesById(id: number): Promise<string>{
    return await apiFetch<string>(`/api/shrines/cms/${id}/notes`);
}

// PUT /api/shrines/cms/{id}/notes
export async function updateShrineNotes(
  id: number,
  body: unknown,
): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${id}/notes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// GET /api/shrines/cms/{shrineId}/review/history
export type ShrineReviewDto = {
  reviewId: number;
  submittedAt: string;
  submittedBy: number;
  submittedByUsername: string;
  reviewedAt: string;
  reviewedBy: number;
  reviewedByUsername: string;
  reviewerComment: string;
  decision: string;
};

export async function getShrineReviewHistory(shrineId: number): Promise<ShrineReviewDto[]>{
    return await apiFetch<ShrineReviewDto[]>(`/api/shrines/cms/${shrineId}/review/history`);
}
