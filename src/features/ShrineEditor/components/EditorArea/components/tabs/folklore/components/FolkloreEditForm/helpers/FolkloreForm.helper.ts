import type { FolkloreCMSDto } from "../../../folkloreApi";
import { mapCitationToForm } from "../../../../../../../../../shared/citations/helpers/CitationSection.helper";
import { emptyImage, mapImageToForm } from "../../../../../../../../../shared/images/helpers/ImageSection.helper";
import type { FolkloreFormValues } from "./FolkloreForm.types";

export const emptyFolkloreForm: FolkloreFormValues = {
  sortOrder: "",
  title: "",
  information: "",
  image: { ...emptyImage },
  citations: [],
};

export function mapFolkloreToForm(
  folklore: FolkloreCMSDto | null,
): FolkloreFormValues {
  if (!folklore) return emptyFolkloreForm;

  return {
    sortOrder: folklore.sortOrder?.toString() ?? "",
    title: folklore.title ?? "",
    information: folklore.information ?? "",
    image: mapImageToForm(folklore.image),
    citations: folklore.citations?.length
      ? folklore.citations.map((citation) => mapCitationToForm(citation))
      : [],
  };
}