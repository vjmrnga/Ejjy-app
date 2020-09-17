import axios from 'axios';
import { IGetRequest } from './interfaces';

type Product = {
	product_id: number;
	quantity_piece?: number;
	quantity_bulk?: number;
	assigned_person_id: number;
};

type UpdateProduct = {
	order_slip_product_id: number;
	product_id: number;
	quantity_piece?: number;
	quantity_bulk?: number;
	assigned_person_id: number;
};

interface ICreateOrderSlip {
	requesting_user_id: number;
	assigned_store_id: number;
	purchase_request_id: number;
	products: Product[];
}

interface IUpdateOrderSlip {
	id: number;
	assigned_store_id: number;
	products: UpdateProduct[];
}

interface IGetOrderSlipsRequest extends IGetRequest {
	purchase_request_id: number;
}

export const service = {
	list: async (params: IGetOrderSlipsRequest) => axios.get('/order-slips/', { params }),
	listExtended: async (params: IGetOrderSlipsRequest) =>
		axios.get('/order-slips/extended/', { params }),
	createOrderSlip: async (body: ICreateOrderSlip) => axios.post('/order-slips/', body),
	updateOrderSlip: async (body: IUpdateOrderSlip) => axios.patch(`/order-slips/${body.id}/`, body),
	removeOrderSlip: async (id: number) => axios.delete(`/order-slips/${id}/`),
};
