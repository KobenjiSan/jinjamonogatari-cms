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

