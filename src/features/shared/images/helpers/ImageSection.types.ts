import type { CitationFormValues } from "../../citations/helpers/CitationSection.types";

export type ImageFormValues = {
  imageUrl: string;
  title: string;
  desc: string;
  citation: CitationFormValues;

  imgId?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ImageSectionProps = {
  title?: string;
  image: ImageFormValues;
  previewUrl?: string | null;
  onImageChange: (nextImage: ImageFormValues) => void;
  onFileChange: (file: File | null) => void;
};