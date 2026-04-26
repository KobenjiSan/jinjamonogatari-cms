import { apiFetch } from "../../api/apiClient";
import type { AuditSearchFilters } from "./components/AuditFilters/AuditFilters";
import type { AuditListPagination } from "./components/AuditList/AuditList";

// GET Audit Log
export type AuditLogResult = {
  audits: AuditDto[];
  totalCount: number;
};

export type AuditDto = {
  auditId: number;
    userId: number;
  username: string;
  action: string;
  target: string;
  isSuccessful: boolean;
  message: string | null;
  createdAt: string;
};

export async function getAuditLog(filters: AuditSearchFilters | null, pagination: AuditListPagination): Promise<AuditLogResult> {
  const page = pagination?.pageNumber ? `?page=${pagination.pageNumber}` : "?page=1";
  const pageSize = pagination?.pageSize ? `&pageSize=${pagination.pageSize}` : "&pageSize=10";
  const searchQuery = filters?.searchValue ? `&searchQuery=${filters.searchValue}` : "";
  const sort = filters?.sorting ? `&sort=${filters.sorting}` : "";

  return await apiFetch<AuditLogResult>(`/api/audits${page}${pageSize}${searchQuery}${sort}`);
}