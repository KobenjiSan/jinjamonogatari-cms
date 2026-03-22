import type { EntityAuditDto } from "../../../ShrineEditor/components/EditorArea/components/tabs/status/statusApi";
import type { 
  CitationCMSDto,
  CreateCitationRequest,
  CitationRequest,
 } from "../../citations/helpers/CitationApi.types";


export type ImageCMSDto = {
  imgId: number;
  imageUrl: string | null;
  title: string | null;
  desc: string | null;
  citation: CitationCMSDto | null;
  createdAt: string;
  updatedAt: string;
  audit: EntityAuditDto | null;
};

export type CreateImageRequest = {
  imgSource: string | null;
  title: string | null;
  desc: string | null;
  citation: CreateCitationRequest | null;
};

export type ImageChangeRequest = {
  action: string;
  imgSource: string | null;
  title: string | null;
  desc: string | null;
  citation: CitationRequest | CreateCitationRequest | null;
};

export type UpdateImageRequest = {
  imgId: number;
  imgUrl: string | null;
  title: string | null;
  desc: string | null;
  citation: CitationRequest | CreateCitationRequest | null;
};