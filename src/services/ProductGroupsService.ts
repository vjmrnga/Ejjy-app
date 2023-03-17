import axios from 'axios';
import { IListRequest } from './interfaces';

interface Create {
	name: string;
}

type EditProductItems = {
	product_id: number;
};

interface Edit {
	name: string;
	items: EditProductItems[];
}

const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/product-groups/', { baseURL, params }),

	retrieve: async (id: number, baseURL) =>
		axios.get(`/product-groups/${id}/`, { baseURL }),

	create: async (body: Create, baseURL) =>
		axios.post('/product-groups/', body, { baseURL }),

	edit: async (id: number, body: Edit, baseURL) =>
		axios.patch(`/product-groups/${id}/`, body, { baseURL }),

	delete: async (id: number, baseURL) =>
		axios.delete(`/product-groups/${id}/`, { baseURL }),
};

const serviceOffline = {
	listOffline: async (baseURL) =>
		axios.get('/offline-product-groups/', { baseURL }),
};

export default {
	...service,
	...serviceOffline,
};
