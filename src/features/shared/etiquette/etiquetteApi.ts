import { apiFetch } from "../../../api/apiClient";
import type { CitationCMSDto, CitationCreateChangesRequest, CitationListChangesRequest } from "../citations/helpers/CitationApi.types";
import type { CreateImageRequest, ImageChangeRequest, ImageCMSDto } from "../images/helpers/ImageApi.types";

// #region GET Glance
export type AtAGlanceDto = {
  topicId: number;
  titleLong: string | null;
  titleShort: string | null;
  iconKey: string | null;
  iconSet: string | null;
  glanceOrder: string | null;
};

export async function getGlanceTopicsList(): Promise<AtAGlanceDto[]> {
  return await apiFetch<AtAGlanceDto[]>("/api/etiquette/cms/glance");
}

// #endregion

// GET Topics
export type EtiquetteTopic = {
  topicId: number;
  slug: string | null;
  titleLong: string | null;
  summary: string | null;
  showInGlance: boolean;
  showAsHighlight: boolean;
  guideOrder: number | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  citations: CitationCMSDto[];
}

export async function getTopicsList(): Promise<EtiquetteTopic[]> {
  return await apiFetch<EtiquetteTopic[]>("/api/etiquette/cms/topics");
}

// GET Steps
export type EtiquetteStep = {
  stepId: number;
  text: string | null;
  stepOrder: number | null;
  image: ImageCMSDto | null;
}

export async function getStepsListById(topicId: number): Promise<EtiquetteStep[]> {
  return await apiFetch<EtiquetteStep[]>(`/api/etiquette/cms/steps/${topicId}`);
}

// CREATE Etiquette
export type CreateEtiquetteRequest = {
  basic: BasicEtiquetteRequest;
  citations: CitationCreateChangesRequest;
};

export type BasicEtiquetteRequest = {
  slug: string | null;
  titleLong: string | null;
  summary: string | null;
  showInGlance: boolean;
  showAsHighlight: boolean;
  guideOrder: number | null;
};

export async function createEtiquette(
  payload: CreateEtiquetteRequest,
): Promise<void> {
  await apiFetch<void>("/api/etiquette", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// UPDATE Etiquette
export type UpdateEtiquetteRequest = {
  basic: BasicEtiquetteRequest;
  citations: CitationListChangesRequest;
};

export async function updateEtiquette(
  topicId: number,
  payload: UpdateEtiquetteRequest,
): Promise<void> {
  await apiFetch<void>(`/api/etiquette/${topicId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// DELETE Etiquette
export async function deleteEtiquette(topicId: number): Promise<void> {
  await apiFetch<void>(`/api/etiquette/${topicId}`, {
    method: "DELETE",
  });
}

// CREATE Step
export type CreateStepRequest = {
  basic: BasicStepRequest;
  image: CreateImageRequest | null;
};

export type BasicStepRequest = {
  text: string | null;
  stepOrder: number | null;
};


export async function createStep(
  topicId: number,
  formData: FormData
): Promise<void> {
  await apiFetch<void>(`/api/etiquette/steps/${topicId}`, {
    method: "POST",
    body: formData,
  });
}

// UPDATE Step
export type UpdateStepRequest = {
  basic: BasicStepRequest;
  image: ImageChangeRequest;
};

export async function updateStep(
  stepId: number,
  formData: FormData
): Promise<void> {
  await apiFetch<void>(`/api/etiquette/steps/${stepId}`, {
    method: "PUT",
    body: formData,
  });
}

// DELETE Step
export async function deleteStep(stepId: number): Promise<void> {
  await apiFetch<void>(`/api/etiquette/steps/${stepId}`, {
    method: "DELETE",
  });
}

// UPDATE Glance
export type UpdateGlanceRequest = {
  titleShort: string | null;
  iconKey: string | null;
  iconSet: string | null;
  glanceOrder: number | null;
};

export async function updateGlance(
  topicId: number,
  payload: UpdateGlanceRequest
): Promise<void> {
  await apiFetch<void>(`/api/etiquette/${topicId}/glance`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// DELETE Glance
export async function deleteGlance(topicId: number): Promise<void> {
  await apiFetch<void>(`/api/etiquette/${topicId}/glance`, {
    method: "DELETE",
  });
}
