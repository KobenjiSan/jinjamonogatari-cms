import { apiFetch } from "../../../api/apiClient";
import type { TagsSearchFilters } from "./components/TagsFilters/TagsFilters";
import type { TagsListPagination } from "./components/TagsList/TagsList";

export type TagRequest = {
  titleEn: string;
  titleJp: string | null;
};

// GET all Tags
export type TagsListResult = {
  tags: TagCMSDto[];
  totalCount: number;
};

export type TagCMSDto = {
  tagId: number;
  titleEn: string;
  titleJp: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getAllTagsList(filters: TagsSearchFilters | null, pagination: TagsListPagination): Promise<TagsListResult> {
  const page = pagination?.pageNumber ? `?page=${pagination.pageNumber}` : "?page=1";
  const pageSize = pagination?.pageSize ? `&pageSize=${pagination.pageSize}` : "&pageSize=5";
  const searchQuery = filters?.searchValue ? `&searchQuery=${filters.searchValue}` : "";
  const sort = filters?.sorting ? `&sort=${filters.sorting}` : "";

  return await apiFetch<TagsListResult>(`/api/tags/cms/tags${page}${pageSize}${searchQuery}${sort}`);
}

// GET Tag dropdown
export type TagDto = {
  tagId: number;
  titleEn: string;
  titleJp: string | null;
};

export async function getAllTagsDropdown(): Promise<TagDto[]> {
  return await apiFetch<TagDto[]>("/api/tags/cms/dropdown");
}

// CREATE Tag
export async function createTag(
  payload: TagRequest,
): Promise<void> {
  await apiFetch<void>(`/api/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// UPDATE Tag


export async function updateTag(
  tagId: number,
  payload: TagRequest,
): Promise<void> {
  await apiFetch<void>(`/api/tags/${tagId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// DELETE Tag
export async function deleteTag(tagId: number): Promise<void> {
  await apiFetch<void>(`/api/tags/${tagId}`, {
    method: "DELETE",
  });
}
