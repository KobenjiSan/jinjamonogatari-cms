import type { CitationFormValues } from "../../../../../../../../../shared/citations/helpers/CitationSection.types";
import type { ImageFormValues } from "../../../../../../../../../shared/images/helpers/ImageSection.types";

export type FolkloreFormValues = {
  sortOrder: string;
  title: string;
  information: string;
  image: ImageFormValues;
  citations: CitationFormValues[];
};