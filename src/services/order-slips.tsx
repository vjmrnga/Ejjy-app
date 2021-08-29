import axios from 'axios';
import { IListRequest } from './interfaces';

type Product = {
	product_id: number;
	quantity_piece?: number;
	quantity_bulk?: number;
	assigned_person_id: number;
};

type EditProduct = {
	order_slip_product_id: number;
	product_id: number;
	quantity_piece?: number;
	quantity_bulk?: number;
	assigned_person_id: number;
};

interface ICreateOrderSlip {
	requesting_user_id: number;
	assigned_store_id: number;
	requisition_slip_id: number;
	products: Product[];
	is_online: boolean;
}

interface IEditOrderSlip {
	id: number;
	assigned_store_id: number;
	products: EditProduct[];
	is_online: boolean;
}

interface IListOrderSlipsRequest extends IListRequest {
	requisition_slip_id?: number;
	assigned_store_id?: number;
	is_out_of_stock?: boolean;
}

export const service = {
	list: async (params: IListOrderSlipsRequest, baseURL) =>
		axios.get('/order-slips/', { baseURL, params }),

	listExtended: async (params: IListOrderSlipsRequest, baseURL) =>
		axios.get('/order-slips/extended/', { baseURL, params }),

	getPendingCount: async (params, baseURL) =>
		axios.get('/order-slips/pending-count/', { baseURL, params }),

	create: async (body: ICreateOrderSlip, baseURL) =>
		axios.post('/order-slips/', body, { baseURL }),

	edit: async (body: IEditOrderSlip, baseURL) =>
		axios.patch(`/order-slips/${body.id}/`, body, { baseURL }),

	remove: async (id: number, baseURL) =>
		axios.delete(`/order-slips/${id}/`, { baseURL }),
};
