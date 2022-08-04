import axios from 'axios';
import { IListRequest } from './interfaces';

interface Modify {
	name: string;
	code: string;
	type: string;
	percentage: number;
	is_special_discount: boolean;
	is_vat_inclusive: boolean;
	additional_fields?: string;
}

const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/discount-options/', { baseURL, params }),

	create: async (body: Modify, baseURL) =>
		axios.post('/discount-options/', body, { baseURL }),

	edit: async (id: number, body: Modify, baseURL) =>
		axios.patch(`/discount-options/${id}/`, body, { baseURL }),

	delete: async (id: number, baseURL) =>
		axios.delete(`/discount-options/${id}/`, { baseURL }),
};

const serviceOffline = {
	listOffline: async (params: IListRequest, baseURL) =>
		axios.get('/offline-discount-options/', { baseURL, params }),
};

export default {
	...service,
	...serviceOffline,
};
