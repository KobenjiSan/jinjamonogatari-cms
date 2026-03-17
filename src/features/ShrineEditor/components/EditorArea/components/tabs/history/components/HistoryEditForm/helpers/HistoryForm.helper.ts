import type { HistoryCMSDto } from "../../../historyApi";
import { mapCitationToForm } from "../../../../../../../../../shared/citations/helpers/CitationSection.helper";
import { emptyImage, mapImageToForm } from "../../../../../../../../../shared/images/helpers/ImageSection.helper";
import type { HistoryFormValues } from "./HistoryForm.types";

export const emptyHistoryForm: HistoryFormValues = {
  eventDate: "",
  sortOrder: "",
  title: "",
  information: "",
  image: { ...emptyImage },
  citations: [],
};

export function mapHistoryToForm(
  history: HistoryCMSDto | null,
): HistoryFormValues {
  if (!history) return emptyHistoryForm;

  return {
    eventDate: history.eventDate ?? "",
    sortOrder: history.sortOrder?.toString() ?? "",
    title: history.title ?? "",
    information: history.information ?? "",
    image: mapImageToForm(history.image),
    citations: history.citations?.length
      ? history.citations.map((citation) => mapCitationToForm(citation))
      : [],
  };
}