import type { KamiCMSDto } from "../../../kamiApi";
import type {
  CitationFormValues,
  ImageFormValues,
  KamiFormValues,
} from "./KamiForm.types";

export const emptyCitation: CitationFormValues = {
  title: "",
  author: "",
  url: "",
  year: "",
};

export const emptyImage: ImageFormValues = {
  imageUrl: "",
  title: "",
  desc: "",
  citation: { ...emptyCitation },
};

export const emptyKamiForm: KamiFormValues = {
  nameEn: "",
  nameJp: "",
  desc: "",
  image: { ...emptyImage },
  citations: [],
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
  };
}

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

export function mapKamiToForm(kami: KamiCMSDto | null): KamiFormValues {
  if (!kami) return emptyKamiForm;

  return {
    nameEn: kami.nameEn ?? "",
    nameJp: kami.nameJp ?? "",
    desc: kami.desc ?? "",
    image: mapImageToForm(kami.image),
    citations: kami.citations?.length
      ? kami.citations.map((citation) => mapCitationToForm(citation))
      : [],
  };
}