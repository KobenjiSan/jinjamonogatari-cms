export type CitationCMSDto = {
  citeId: number;
  title: string | null;
  author: string | null;
  url: string | null;
  year: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateCitationRequest = {
  title: string | null;
  author: string | null;
  url: string | null;
  year: number | null;
};

export type CitationRequest = {
  citeId: number;
  title: string | null;
  author: string | null;
  url: string | null;
  year: number | null;
};

export type CitationListChangesRequest = {
  create: CreateCitationRequest[];
  update: CitationRequest[];
  delete: number[];
};