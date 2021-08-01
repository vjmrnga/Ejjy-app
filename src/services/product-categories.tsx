import axios from 'axios';
import { IListRequest } from './interfaces';

interface ICreateProductCategory {
	name: string;
}

interface IEditProductCategory {
	id: number;
	name: string;
}

export const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/product-categories/', { baseURL, params }),

	create: async (body: ICreateProductCategory, baseURL) =>
		axios.post('/product-categories/', body, { baseURL }),

	edit: async (body: IEditProductCategory, baseURL) =>
		axios.patch(`/product-categories/${body.id}/`, body, { baseURL }),

	remove: async (id, baseURL) =>
		axios.delete(`/product-categories/${id}/`, { baseURL }),
};
