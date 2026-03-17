import { emptyCitation, mapCitationToForm } from "../../citations/helpers/CitationSection.helper";
import type { ImageFormValues } from "./ImageSection.types";

export const emptyImage: ImageFormValues = {
  imageUrl: "",
  title: "",
  desc: "",
  citation: { ...emptyCitation },
};

export function mapImageToForm(image?: {
  imgId?: number;
  imageUrl: string | null;
  title: string | null;
  desc: string | null;
  citation: {
    citeId?: number;
    title: string | null;
    author: string | null;
    url: string | null;
    year: number | null;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
} | null): ImageFormValues {
  return {
    imgId: image?.imgId,
    imageUrl: image?.imageUrl ?? "",
    title: image?.title ?? "",
    desc: image?.desc ?? "",
    citation: mapCitationToForm(image?.citation),
    createdAt: image?.createdAt,
    updatedAt: image?.updatedAt,
  };
}