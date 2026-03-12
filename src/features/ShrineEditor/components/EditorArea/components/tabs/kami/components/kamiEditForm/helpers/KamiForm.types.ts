export type CitationFormValues = {
  title: string;
  author: string;
  url: string;
  year: string;

  citeId?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ImageFormValues = {
  imageUrl: string;
  title: string;
  desc: string;
  citation: CitationFormValues;

  imgId?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type KamiFormValues = {
  nameEn: string;
  nameJp: string;
  desc: string;
  image: ImageFormValues;
  citations: CitationFormValues[];
};