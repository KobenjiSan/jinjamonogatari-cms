import type { CitationFormValues } from "./CitationSection.types";

export const emptyCitation: CitationFormValues = {
  title: "",
  author: "",
  url: "",
  year: "",
};

export function mapCitationToForm(citation?: {
  citeId?: number;
  title: string | null;
  author: string | null;
  url: string | null;
  year: number | null;
  createdAt?: string;
  updatedAt?: string;
} | null): CitationFormValues {
  return {
    citeId: citation?.citeId,
    title: citation?.title ?? "",
    author: citation?.author ?? "",
    url: citation?.url ?? "",
    year: citation?.year?.toString() ?? "",
    createdAt: citation?.createdAt,
    updatedAt: citation?.updatedAt,
    isReused: false,
  };
}