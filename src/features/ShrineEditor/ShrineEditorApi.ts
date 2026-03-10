// Handles api calls for the shrineEditor

import { apiFetch } from "../../api/apiClient";

// Helpers 
export type TagDto = {
  tagId: number;
  titleEn: string;
  titleJp: string | null;
};

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

export type CreateTagRequest = {
  titleEn: string;
  titleJp: string | null;
};

export type UpdateTagRequest = {
  tagId: number;
  titleEn: string;
  titleJp: string | null;
};

export type TagChangesRequest = {
  create: CreateTagRequest[];
  update: UpdateTagRequest[];
  delete: number[];
};

export type HeroImageCitationRequest = {
  title: string | null;
  author: string | null;
  url: string | null;
  year: number | null;
};

export type HeroImageChangeRequest = {
  action: "none" | "create" | "update" | "delete";
  imgSource: string | null;
  title: string | null;
  desc: string | null;
  citation: HeroImageCitationRequest | null;
};

export type UpdateShrineMetaRequest = {
  basic: BasicMetaUpdateRequest;
  tags: TagChangesRequest;
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
