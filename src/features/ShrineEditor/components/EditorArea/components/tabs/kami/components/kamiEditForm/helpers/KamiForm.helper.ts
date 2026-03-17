import type { KamiCMSDto } from "../../../kamiApi";
import { mapCitationToForm } from "../../../../../../../../../shared/citations/helpers/CitationSection.helper";
import { emptyImage, mapImageToForm } from "../../../../../../../../../shared/images/helpers/ImageSection.helper";
import type { KamiFormValues } from "./KamiForm.types";

export const emptyKamiForm: KamiFormValues = {
  nameEn: "",
  nameJp: "",
  desc: "",
  image: { ...emptyImage },
  citations: [],
};

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