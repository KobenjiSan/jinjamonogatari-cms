import { apiFetch } from "../../api/apiClient";

export type ShrineCounts = {
  total: number;
  imports: number;
  drafts: number;
  review: number;
  published: number;
  rejected: number;
};

// GET /api/shrines/cms/counts
export async function getShrineCounts(): Promise<ShrineCounts> {  
  return await apiFetch<ShrineCounts>(`/api/shrines/cms/counts`);
}