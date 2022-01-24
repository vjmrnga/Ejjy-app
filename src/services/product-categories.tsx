import axios from 'axios';
import { IListRequest } from './interfaces';

interface ICreateProductCategory {
	name: string;
}

interface IEditProductCategory {
	id: number;
	name: string;
	priority_level: number;
}

export const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/online-product-categories/', { baseURL, params }),

	create: async (body: ICreateProductCategory, baseURL) =>
		axios.post('/online-product-categories/', body, { baseURL }),

	edit: async (body: IEditProductCategory, baseURL) =>
		axios.patch(`/online-product-categories/${body.id}/`, body, { baseURL }),

	remove: async (id, baseURL) =>
		axios.delete(`/online-product-categories/${id}/`, { baseURL }),
};
