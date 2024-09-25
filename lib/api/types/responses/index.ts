export type BaseResponse<T> = {
	data?: T;
	status: "success" | "fail";
	message?: string;
	errors?:
		| {
				field: string;
				message: string;
				tag: string;
				value: any;
		  }[]
		| null;
};
