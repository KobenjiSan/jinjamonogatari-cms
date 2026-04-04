// Handles api calls for shrine editor status
import { apiFetch } from "../../../../../../../api/apiClient";

export type AuditSeverity = "Error" | "Warning";

export type EntityAuditDto = {
  itemId: number | null;
  errorCount: number;
  warningCount: number;
  hasErrors: boolean;
  hasWarnings: boolean;
  issues: AuditIssueDto[];
};

export type AuditIssueDto = {
  severity: AuditSeverity;
  section: string;
  itemId: number | null;
  field: string | null;
  message: string;
};

export type ShrineAuditDto = {
  shrineId: number;
  isSubmittable: boolean;
  errorCount: number;
  warningCount: number;
  issues: AuditIssueDto[];
};

// GET shrine audit / status
export async function getShrineAuditById(id: number): Promise<ShrineAuditDto> {
  return await apiFetch<ShrineAuditDto>(`/api/shrines/cms/${id}/audit`);
}

// POST /api/shrines/cms/{shrineId}/review/submit
export async function submitShrineForReview(shrineId: number): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/review/submit`, {
    method: "POST"
  });
}

// POST /api/shrines/cms/{shrineId}/review/reject
export type RejectShrineRequest = {
  message: string;
};

export async function rejectShrineReview(shrineId: number, body: RejectShrineRequest): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/review/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// POST /api/shrines/cms/{shrineId}/review/publish
export async function publishShrineReview(shrineId: number): Promise<void> {
  await apiFetch<void>(`/api/shrines/cms/${shrineId}/review/publish`, {
    method: "POST"
  });
}