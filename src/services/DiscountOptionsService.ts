import axios from 'axios';
import { IListRequest } from './interfaces';

interface Modify {
	name: string;
	type: string;
	percentage: number;
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
export default service;
