import { BaseResponse } from "../types/responses";
import { SetObjectMetaDataRequest } from "./requests";

export interface GenerateS3SignedURLResponse extends BaseResponse<string> {}

export interface GetAccountUsedSpaceResponse extends BaseResponse<number> {}

export interface SetObjectMetaDataResponse
	extends BaseResponse<
		SetObjectMetaDataRequest & {
			ID: number;
		}
	> {}
