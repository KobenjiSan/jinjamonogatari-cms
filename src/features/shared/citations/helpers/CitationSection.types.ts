export type CitationFormValues = {
  title: string;
  author: string;
  url: string;
  year: string;

  citeId?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CitationSectionProps = {
  title?: string;
  addLabel?: string;
  emptyMessage?: string;
  citations: CitationFormValues[];
  onCitationChange: (index: number, nextCitation: CitationFormValues) => void;
  onAddCitation: () => void;
  onRemoveCitation: (index: number) => void;
};