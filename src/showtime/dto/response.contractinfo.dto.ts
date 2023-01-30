import { ResponseSplitStructureDto } from "./response.splitstructure.dto";

export class ResponseContractInfoDto {

  releaseDate: string;

  address: string;

  tokenId: string;

  tokenStandard: string;

  blockchain: string;

  splitStructure: ResponseSplitStructureDto[];
}
