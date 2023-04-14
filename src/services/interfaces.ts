export interface IListRequest {
	ordering?: string;
	page?: number;
	page_size?: number;
	fields?: string;
	search?: string;
}

export interface IListReponse {
	results: any[];
	count: number;
}
