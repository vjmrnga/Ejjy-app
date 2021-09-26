// NOTE: This is a standard service file
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
		axios.get('/return-item-slips/', { baseURL, params }),

	retrieve: async (id: number, baseURL) =>
		axios.get(`/return-item-slips/${id}/`, { baseURL }),

	create: async (body: Create, baseURL) =>
		axios.post('/return-item-slips/', body, { baseURL }),

	edit: async (id: number, body: Edit, baseURL) =>
		axios.patch(`/return-item-slips/${id}/`, body, { baseURL }),

	receive: async (id: number, body: Receive, baseURL) =>
		axios.post(`/return-item-slips/${id}/receive/`, body, { baseURL }),
};
