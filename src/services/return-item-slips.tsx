// NOTE: This is a standard service file
import axios from 'axios';
import { IListRequest } from './interfaces';

// Interfaces
interface IListReturnItemSlips extends IListRequest {
	sender_branch_id?: number;
	receiver_id?: number;
}

interface ICreateReturnItemSlip {
	sender_id: number;
	is_online: boolean;
	products: Product[];
}

interface IEditReturnItemSlip {
	receiver_id: number;
}

interface IReceiveReturnItemSlip {
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
	list: async (params: IListReturnItemSlips, baseURL) =>
		axios.get('/return-item-slips/', { baseURL, params }),

	create: async (body: ICreateReturnItemSlip, baseURL) =>
		axios.post('/return-item-slips/', body, { baseURL }),

	edit: async (id: number, body: IEditReturnItemSlip, baseURL) =>
		axios.patch(`/return-item-slips/${id}/`, body, { baseURL }),

	receive: async (id: number, body: IReceiveReturnItemSlip, baseURL) =>
		axios.post(`/return-item-slips/${id}/receive/`, body, { baseURL }),
};
