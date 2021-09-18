import axios from 'axios';
import { IListRequest } from './interfaces';

// Interfaces
interface List extends IListRequest {
	sender_branch_id?: number;
	receiver_id?: number;
}

interface Create {
	sender_id: number;
	is_online: boolean;
	products: Product[];
}

interface Edit {
	receiver_id: number;
}

interface Receive {
	is_online: boolean;
	products: Product[];
}

// Types
type Product = {
	product_id: number;
	quantity_returned: number | string;
};

// Service
export const service = {
	list: async (params: List, baseURL) =>
		axios.get('/back-orders/', { baseURL, params }),

	retrieve: async (id: number, baseURL) =>
		axios.get(`/back-orders/${id}/`, { baseURL }),

	create: async (body: Create, baseURL) =>
		axios.post('/back-orders/', body, { baseURL }),

	edit: async (id: number, body: Edit, baseURL) =>
		axios.patch(`/back-orders/${id}/`, body, { baseURL }),

	receive: async (id: number, body: Receive, baseURL) =>
		axios.post(`/back-orders/${id}/receive/`, body, { baseURL }),
};
