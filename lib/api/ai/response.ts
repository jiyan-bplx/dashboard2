import { InputTypeWithoutIcon } from "../../../types";
import { FormItem } from "../forms/responses";
import { BaseResponse } from "../types/responses";

export interface GenerateAiFormResponse extends BaseResponse<AiFormItem> {}
export interface AiFormItem {
	name: string;
	body: InputTypeWithoutIcon[] | undefined | null;
}
