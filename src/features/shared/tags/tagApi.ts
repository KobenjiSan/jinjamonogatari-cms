import { apiFetch } from "../../../api/apiClient";

export type TagDto = {
  tagId: number;
  titleEn: string;
  titleJp: string | null;
};

// GET all Tags
export async function getAllTagsList(): Promise<TagDto[]> {
  return await apiFetch<TagDto[]>("/api/shrines/cms/tags");
}

