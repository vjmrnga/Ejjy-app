import axios from 'axios';
import { IListRequest } from './interfaces';

interface Modify {
	name: string;
	priority_level: number;
}

const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/product-categories/', { baseURL, params }),

	create: async (body: Modify, baseURL) =>
		axios.post('/product-categories/', body, { baseURL }),

	edit: async (id, body: Modify, baseURL) =>
		axios.patch(`/product-categories/${id}/`, body, { baseURL }),

	delete: async (id, baseURL) =>
		axios.delete(`/product-categories/${id}/`, { baseURL }),
};

export default service;
